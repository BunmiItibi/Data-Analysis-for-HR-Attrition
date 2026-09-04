/**
 * `Database` is currently a loose placeholder (see lib/supabase/database.types.ts)
 * until a real Supabase project's types are generated, so row shapes here
 * are necessarily untyped. Replace this file's `any` usages incrementally
 * once `supabase gen types` output is wired in.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  INDUCTION_ITEM_IDS,
  type Assessment,
  type CompetencyAssessment,
  type CompetencyScoreSummary,
  type Consent,
  type Enrollment,
  type Profile,
  type Stage,
  type Submission,
  type SubmissionContent,
  type SubmissionVersion,
  type TaskCode,
} from "@/lib/domain/types";
import { EXPERIENCE_ID, STAGE_ORDER, getCommunication } from "@/lib/scenario";
import { aiProvider } from "@/lib/ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  AuthError,
  NotFoundError,
  type AuthResult,
  type FlaggedAssessmentSummary,
  type PortfolioData,
  type Repo,
} from "../repo";

function stageIndex(stage: Stage): number {
  return STAGE_ORDER.indexOf(stage);
}

function rowToEnrollment(row: any): Enrollment {
  return {
    id: row.id,
    userId: row.user_id,
    experienceId: row.experience_id,
    state: row.state,
    stage: row.stage,
    appliedAt: row.applied_at,
    offeredAt: row.offered_at,
    acceptedAt: row.accepted_at,
    completedAt: row.completed_at,
    inductionCompletedItemIds: row.induction_completed_item_ids ?? [],
    scenarioFlags: row.scenario_flags ?? {},
  };
}

function rowToProfile(row: any): Profile {
  return { id: row.id, email: row.email, fullName: row.full_name, appRole: row.app_role, createdAt: row.created_at };
}

function rowToCompetencyAssessment(row: any): CompetencyAssessment {
  return {
    competency: row.competency,
    criterion: row.criterion,
    score: row.score,
    evidence: row.evidence,
    strength: row.strength,
    gap: row.gap,
    improvement: row.improvement,
    confidence: row.confidence,
    humanReviewFlag: row.human_review_flag,
    safetyFlag: row.safety_flag,
  };
}

/**
 * Supabase-backed implementation of the Repo interface, used whenever
 * NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are configured.
 * `sessionToken` parameters are accepted for interface compatibility with
 * the demo repo but ignored here — Supabase Auth manages its own
 * cookie-bound session via the server client (see lib/auth/session.ts).
 */
export class SupabaseRepo implements Repo {
  readonly mode = "supabase" as const;

  private async client(): Promise<SupabaseClient> {
    return createSupabaseServerClient() as unknown as SupabaseClient;
  }

  async registerUser(input: { fullName: string; email: string; password: string }): Promise<AuthResult> {
    const supabase = await this.client();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { full_name: input.fullName } },
    });
    if (error || !data.user) throw new AuthError(error?.message ?? "Registration failed.");
    return {
      user: { id: data.user.id, email: input.email, fullName: input.fullName, appRole: "learner", createdAt: data.user.created_at },
      sessionToken: data.session?.access_token ?? "",
    };
  }

  async loginUser(input: { email: string; password: string }): Promise<AuthResult> {
    const supabase = await this.client();
    const { data, error } = await supabase.auth.signInWithPassword({ email: input.email, password: input.password });
    if (error || !data.user) throw new AuthError(error?.message ?? "Incorrect email or password.");
    const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    return {
      user: profileRow ? rowToProfile(profileRow) : { id: data.user.id, email: input.email, fullName: "", appRole: "learner", createdAt: data.user.created_at },
      sessionToken: data.session?.access_token ?? "",
    };
  }

  async logout(): Promise<void> {
    const supabase = await this.client();
    await supabase.auth.signOut();
  }

  async getUserBySession(): Promise<Profile | null> {
    const supabase = await this.client();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    return profileRow ? rowToProfile(profileRow) : null;
  }

  async saveExperienceProfile(userId: string, data: { careerGoal: string; currentSituation: string; developmentPriorities: string[] }) {
    const supabase = await this.client();
    const { data: row, error } = await supabase
      .from("experience_profiles")
      .upsert({
        user_id: userId,
        career_goal: data.careerGoal,
        current_situation: data.currentSituation,
        development_priorities: data.developmentPriorities,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return {
      userId: row.user_id,
      careerGoal: row.career_goal,
      currentSituation: row.current_situation,
      developmentPriorities: row.development_priorities,
      updatedAt: row.updated_at,
    };
  }

  async getExperienceProfile(userId: string) {
    const supabase = await this.client();
    const { data: row } = await supabase.from("experience_profiles").select("*").eq("user_id", userId).maybeSingle();
    if (!row) return null;
    return {
      userId: row.user_id,
      careerGoal: row.career_goal,
      currentSituation: row.current_situation,
      developmentPriorities: row.development_priorities,
      updatedAt: row.updated_at,
    };
  }

  async getOrCreateEnrollment(userId: string): Promise<Enrollment> {
    const supabase = await this.client();
    const { data: existing } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("experience_id", EXPERIENCE_ID)
      .maybeSingle();
    if (existing) return rowToEnrollment(existing);
    const { data: created, error } = await supabase
      .from("enrollments")
      .insert({ user_id: userId, experience_id: EXPERIENCE_ID, state: "invited", stage: "induction" })
      .select()
      .single();
    if (error) throw error;
    return rowToEnrollment(created);
  }

  private async patchEnrollment(userId: string, patch: Record<string, unknown>): Promise<Enrollment> {
    const supabase = await this.client();
    await this.getOrCreateEnrollment(userId);
    const { data, error } = await supabase
      .from("enrollments")
      .update(patch)
      .eq("user_id", userId)
      .eq("experience_id", EXPERIENCE_ID)
      .select()
      .single();
    if (error) throw error;
    return rowToEnrollment(data);
  }

  async applyToPlacement(userId: string): Promise<Enrollment> {
    const enrollment = await this.getOrCreateEnrollment(userId);
    if (enrollment.state !== "invited" && enrollment.state !== "applied") return enrollment;
    const now = new Date().toISOString();
    return this.patchEnrollment(userId, { state: "offered", applied_at: enrollment.appliedAt ?? now, offered_at: now });
  }

  async acceptPlacement(userId: string): Promise<Enrollment> {
    const enrollment = await this.getOrCreateEnrollment(userId);
    if (enrollment.state !== "offered") return enrollment;
    return this.patchEnrollment(userId, { state: "accepted", accepted_at: new Date().toISOString() });
  }

  async completeInductionItem(userId: string, itemId: string): Promise<Enrollment> {
    const enrollment = await this.getOrCreateEnrollment(userId);
    if (enrollment.inductionCompletedItemIds.includes(itemId)) return enrollment;
    return this.patchEnrollment(userId, {
      induction_completed_item_ids: [...enrollment.inductionCompletedItemIds, itemId],
    });
  }

  async finishInduction(userId: string): Promise<Enrollment> {
    const enrollment = await this.getOrCreateEnrollment(userId);
    const allDone = INDUCTION_ITEM_IDS.every((id) => enrollment.inductionCompletedItemIds.includes(id));
    if (!allDone || (enrollment.state !== "accepted" && enrollment.state !== "active")) return enrollment;
    return this.patchEnrollment(userId, {
      state: "active",
      stage: enrollment.stage === "induction" ? "briefing" : enrollment.stage,
    });
  }

  async advanceStage(userId: string, toStage: Stage): Promise<Enrollment> {
    const enrollment = await this.getOrCreateEnrollment(userId);
    if (stageIndex(toStage) < stageIndex(enrollment.stage)) return enrollment;
    const patch: Record<string, unknown> = { stage: toStage };
    if (toStage === "completed") {
      patch.state = "completed";
      patch.completed_at = new Date().toISOString();
    }
    return this.patchEnrollment(userId, patch);
  }

  async setScenarioFlag(userId: string, key: string, value: boolean): Promise<Enrollment> {
    const enrollment = await this.getOrCreateEnrollment(userId);
    return this.patchEnrollment(userId, { scenario_flags: { ...enrollment.scenarioFlags, [key]: value } });
  }

  async listCommunications(userId: string) {
    const supabase = await this.client();
    const enrollment = await this.getOrCreateEnrollment(userId);
    const currentIndex = stageIndex(enrollment.stage);
    const { data: comms } = await supabase.from("communications").select("*").eq("experience_id", EXPERIENCE_ID);
    const { data: replies } = await supabase.from("communication_replies").select("*").eq("user_id", userId);
    const visible = (comms ?? []).filter((c: any) => stageIndex(c.sent_at_stage_start) <= currentIndex);
    return visible.map((row: any) => ({
      communication: {
        id: row.id,
        kind: row.kind,
        fromCharacterId: row.from_character_id,
        subject: row.subject,
        bodyMarkdown: row.body_markdown,
        sentAtStageStart: row.sent_at_stage_start,
        requiresReply: row.requires_reply,
        threadId: row.thread_id ?? undefined,
      },
      reply:
        (replies ?? [])
          .filter((r: any) => r.communication_id === row.id)
          .map((r: any) => ({
            id: r.id,
            communicationId: r.communication_id,
            enrollmentId: r.enrollment_id,
            bodyMarkdown: r.body_markdown,
            createdAt: r.created_at,
            characterFollowUp: r.character_follow_up ?? undefined,
          }))[0] ?? null,
    }));
  }

  async replyToCommunication(userId: string, communicationId: string, bodyMarkdown: string) {
    const supabase = await this.client();
    const communication = getCommunication(communicationId);
    const experienceProfile = await this.getExperienceProfile(userId);
    const enrollment = await this.getOrCreateEnrollment(userId);
    let characterFollowUp: string | undefined;
    try {
      characterFollowUp = await aiProvider.generateCharacterFollowUp({
        characterId: communication.fromCharacterId,
        originalSubject: communication.subject,
        learnerMessage: bodyMarkdown,
        learnerCareerGoal: experienceProfile?.careerGoal,
      });
    } catch (err) {
      console.error("generateCharacterFollowUp failed:", err);
    }
    const { data, error } = await supabase
      .from("communication_replies")
      .insert({
        communication_id: communicationId,
        enrollment_id: enrollment.id,
        user_id: userId,
        body_markdown: bodyMarkdown,
        character_follow_up: characterFollowUp,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      communicationId: data.communication_id,
      enrollmentId: data.enrollment_id,
      bodyMarkdown: data.body_markdown,
      createdAt: data.created_at,
      characterFollowUp: data.character_follow_up ?? undefined,
    };
  }

  private async loadSubmission(userId: string, taskCode: TaskCode): Promise<Submission | null> {
    const supabase = await this.client();
    const { data: submissionRow } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", userId)
      .eq("task_code", taskCode)
      .maybeSingle();
    if (!submissionRow) return null;
    const { data: versionRows } = await supabase
      .from("submission_versions")
      .select("*")
      .eq("submission_id", submissionRow.id)
      .order("version_number", { ascending: true });
    const versions: SubmissionVersion[] = [];
    for (const v of versionRows ?? []) {
      const { data: assessmentRow } = await supabase
        .from("assessments")
        .select("*")
        .eq("submission_version_id", v.id)
        .maybeSingle();
      let assessment: Assessment | undefined;
      if (assessmentRow) {
        const { data: caRows } = await supabase
          .from("competency_assessments")
          .select("*")
          .eq("assessment_id", assessmentRow.id);
        assessment = {
          id: assessmentRow.id,
          submissionVersionId: assessmentRow.submission_version_id,
          taskCode: assessmentRow.task_code,
          managerNote: assessmentRow.manager_note,
          source: assessmentRow.source,
          humanReviewStatus: assessmentRow.human_review_status,
          createdAt: assessmentRow.created_at,
          competencyAssessments: (caRows ?? []).map(rowToCompetencyAssessment),
        };
      }
      versions.push({
        id: v.id,
        submissionId: v.submission_id,
        versionNumber: v.version_number,
        kind: v.kind,
        content: v.content,
        createdAt: v.created_at,
        assessment,
      });
    }
    return {
      id: submissionRow.id,
      enrollmentId: submissionRow.enrollment_id,
      taskCode: submissionRow.task_code,
      status: submissionRow.status,
      versions,
      createdAt: submissionRow.created_at,
      updatedAt: submissionRow.updated_at,
    };
  }

  async getSubmission(userId: string, taskCode: TaskCode): Promise<Submission | null> {
    return this.loadSubmission(userId, taskCode);
  }

  async listSubmissions(userId: string): Promise<Submission[]> {
    const supabase = await this.client();
    const { data: rows } = await supabase.from("submissions").select("task_code").eq("user_id", userId);
    const submissions = await Promise.all((rows ?? []).map((r: any) => this.loadSubmission(userId, r.task_code)));
    return submissions.filter((s): s is Submission => s !== null);
  }

  async saveDraft(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission> {
    const supabase = await this.client();
    const enrollment = await this.getOrCreateEnrollment(userId);
    let submission = await this.loadSubmission(userId, taskCode);
    if (!submission) {
      const { data: submissionRow, error } = await supabase
        .from("submissions")
        .insert({ enrollment_id: enrollment.id, user_id: userId, task_code: taskCode, status: "draft" })
        .select()
        .single();
      if (error) throw error;
      await supabase
        .from("submission_versions")
        .insert({ submission_id: submissionRow.id, version_number: 1, kind: "original", content });
      submission = (await this.loadSubmission(userId, taskCode))!;
    } else if (submission.status === "draft") {
      const firstVersion = submission.versions[0];
      await supabase.from("submission_versions").update({ content }).eq("id", firstVersion.id);
      submission = (await this.loadSubmission(userId, taskCode))!;
    }
    return submission;
  }

  private async assess(content: SubmissionContent, isRevision: boolean, priorManagerNote?: string) {
    const result = await aiProvider.assessSubmission({ content, isRevision, priorManagerNote });
    const source = (result as { source?: "ai" | "demo" }).source ?? "demo";
    return { competencyAssessments: result.competencyAssessments, managerNote: result.managerNote, source };
  }

  private async persistAssessment(
    submissionVersionId: string,
    taskCode: TaskCode,
    managerNote: string,
    source: "ai" | "demo" | "human",
    competencyAssessments: CompetencyAssessment[],
  ) {
    const supabase = await this.client();
    const humanReviewStatus = competencyAssessments.some((c) => c.humanReviewFlag) ? "pending" : "not_required";
    const { data: assessmentRow, error } = await supabase
      .from("assessments")
      .insert({
        submission_version_id: submissionVersionId,
        task_code: taskCode,
        manager_note: managerNote,
        source,
        human_review_status: humanReviewStatus,
      })
      .select()
      .single();
    if (error) throw error;
    await supabase.from("competency_assessments").insert(
      competencyAssessments.map((ca) => ({
        assessment_id: assessmentRow.id,
        competency: ca.competency,
        criterion: ca.criterion,
        score: ca.score,
        evidence: ca.evidence,
        strength: ca.strength,
        gap: ca.gap,
        improvement: ca.improvement,
        confidence: ca.confidence,
        human_review_flag: ca.humanReviewFlag,
        safety_flag: ca.safetyFlag,
      })),
    );
  }

  async submitSubmission(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission> {
    const supabase = await this.client();
    const draft = await this.saveDraft(userId, taskCode, content);
    const { competencyAssessments, managerNote, source } = await this.assess(content, false);
    await this.persistAssessment(draft.versions[0].id, taskCode, managerNote, source, competencyAssessments);
    await supabase.from("submissions").update({ status: "feedback_available" }).eq("id", draft.id);
    return (await this.loadSubmission(userId, taskCode))!;
  }

  async reviseSubmission(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission> {
    const supabase = await this.client();
    const existing = await this.loadSubmission(userId, taskCode);
    if (!existing) throw new NotFoundError("No submission to revise.");
    const latest = existing.versions[existing.versions.length - 1];
    const { competencyAssessments, managerNote, source } = await this.assess(content, true, latest.assessment?.managerNote);
    const { data: newVersion, error } = await supabase
      .from("submission_versions")
      .insert({ submission_id: existing.id, version_number: existing.versions.length + 1, kind: "revision", content })
      .select()
      .single();
    if (error) throw error;
    await this.persistAssessment(newVersion.id, taskCode, managerNote, source, competencyAssessments);
    await supabase.from("submissions").update({ status: "resubmitted" }).eq("id", existing.id);
    return (await this.loadSubmission(userId, taskCode))!;
  }

  async getCompetencyScores(userId: string): Promise<CompetencyScoreSummary[]> {
    const submissions = await this.listSubmissions(userId);
    const byCompetency = new Map<string, { scores: number[]; refs: { taskCode: TaskCode; excerpt: string }[]; deltas: number[] }>();
    for (const submission of submissions) {
      const original = submission.versions[0];
      const latest = submission.versions[submission.versions.length - 1];
      if (!latest.assessment) continue;
      for (const ca of latest.assessment.competencyAssessments) {
        const entry = byCompetency.get(ca.competency) ?? { scores: [], refs: [], deltas: [] };
        entry.scores.push(ca.score);
        entry.refs.push({ taskCode: submission.taskCode, excerpt: ca.evidence.slice(0, 160) });
        if (original !== latest && original.assessment) {
          const originalCa = original.assessment.competencyAssessments.find((c) => c.competency === ca.competency);
          if (originalCa) entry.deltas.push(ca.score - originalCa.score);
        }
        byCompetency.set(ca.competency, entry);
      }
    }
    return [...byCompetency.entries()].map(([competency, entry]) => ({
      competency: competency as CompetencyScoreSummary["competency"],
      level: Math.round(entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length) as 1 | 2 | 3 | 4 | 5,
      rationale: `Based on ${entry.scores.length} assessed work product${entry.scores.length === 1 ? "" : "s"}.`,
      evidenceRefs: entry.refs,
      revisionDelta: entry.deltas.length > 0 ? entry.deltas.reduce((a, b) => a + b, 0) / entry.deltas.length : null,
    }));
  }

  async getPortfolio(userId: string): Promise<PortfolioData | null> {
    const supabase = await this.client();
    const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (!profileRow) return null;
    const enrollment = await this.getOrCreateEnrollment(userId);
    const submissions = await this.listSubmissions(userId);
    const completedSubmissions = submissions.filter((s) => s.status === "feedback_available" || s.status === "resubmitted");
    return {
      enrollment,
      profile: rowToProfile(profileRow),
      experienceProfile: await this.getExperienceProfile(userId),
      completedSubmissions,
      competencyScores: await this.getCompetencyScores(userId),
      consents: await this.listConsents(userId),
    };
  }

  async setConsent(userId: string, purpose: Consent["purpose"], granted: boolean): Promise<Consent> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("consents")
      .insert({ user_id: userId, purpose, granted, version: "1.0" })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      userId: data.user_id,
      purpose: data.purpose,
      version: data.version,
      granted: data.granted,
      respondedAt: data.responded_at,
      withdrawnAt: data.withdrawn_at,
    };
  }

  async listConsents(userId: string): Promise<Consent[]> {
    const supabase = await this.client();
    const { data } = await supabase.from("consents").select("*").eq("user_id", userId);
    return (data ?? []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      purpose: row.purpose,
      version: row.version,
      granted: row.granted,
      respondedAt: row.responded_at,
      withdrawnAt: row.withdrawn_at,
    }));
  }

  async listFlaggedAssessments(): Promise<FlaggedAssessmentSummary[]> {
    const supabase = await this.client();
    const { data: assessmentRows } = await supabase
      .from("assessments")
      .select("*, submission_versions(submission_id)")
      .eq("human_review_status", "pending");
    const out: FlaggedAssessmentSummary[] = [];
    for (const row of assessmentRows ?? []) {
      const { data: caRows } = await supabase.from("competency_assessments").select("*").eq("assessment_id", row.id);
      const submissionId = (row as any).submission_versions?.submission_id;
      const { data: submissionRow } = await supabase.from("submissions").select("user_id").eq("id", submissionId).maybeSingle();
      const { data: profileRow } = submissionRow
        ? await supabase.from("profiles").select("full_name").eq("id", submissionRow.user_id).maybeSingle()
        : { data: null };
      out.push({
        assessment: {
          id: row.id,
          submissionVersionId: row.submission_version_id,
          taskCode: row.task_code,
          managerNote: row.manager_note,
          source: row.source,
          humanReviewStatus: row.human_review_status,
          createdAt: row.created_at,
          competencyAssessments: (caRows ?? []).map(rowToCompetencyAssessment),
        },
        userId: submissionRow?.user_id ?? "",
        userFullName: profileRow?.full_name ?? "Unknown learner",
        taskCode: row.task_code,
      });
    }
    return out;
  }

  async markAssessmentReviewed(assessmentId: string): Promise<void> {
    const supabase = await this.client();
    await supabase.from("assessments").update({ human_review_status: "reviewed" }).eq("id", assessmentId);
  }
}
