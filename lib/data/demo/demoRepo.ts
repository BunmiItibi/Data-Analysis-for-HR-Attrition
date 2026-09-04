import { randomUUID } from "node:crypto";
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
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { COMMUNICATIONS, EXPERIENCE_ID, STAGE_ORDER, getCommunication } from "@/lib/scenario";
import { aiProvider } from "@/lib/ai";
import {
  AuthError,
  ConflictError,
  NotFoundError,
  type AuthResult,
  type FlaggedAssessmentSummary,
  type PortfolioData,
  type Repo,
} from "../repo";
import { withDb, type DbShape } from "./jsonDb";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function newEnrollment(userId: string): Enrollment {
  return {
    id: randomUUID(),
    userId,
    experienceId: EXPERIENCE_ID,
    state: "invited",
    stage: "induction",
    appliedAt: null,
    offeredAt: null,
    acceptedAt: null,
    completedAt: null,
    inductionCompletedItemIds: [],
    scenarioFlags: {},
  };
}

function stageIndex(stage: Stage): number {
  return STAGE_ORDER.indexOf(stage);
}

function toProfile(user: DbShape["users"][string]): Profile {
  return { id: user.id, email: user.email, fullName: user.fullName, appRole: user.appRole, createdAt: user.createdAt };
}

function latestVersion(submission: Submission): SubmissionVersion {
  return submission.versions[submission.versions.length - 1];
}

export class DemoRepo implements Repo {
  readonly mode = "demo" as const;

  async registerUser(input: { fullName: string; email: string; password: string }): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    return withDb((db) => {
      const existing = Object.values(db.users).find((u) => u.email.toLowerCase() === email);
      if (existing) {
        throw new ConflictError("An account with that email already exists.");
      }
      const id = randomUUID();
      const user = {
        id,
        email,
        fullName: input.fullName.trim(),
        appRole: "learner" as const,
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword(input.password),
      };
      db.users[id] = user;
      const sessionToken = randomUUID();
      db.sessions[sessionToken] = { userId: id, expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString() };
      return { user: toProfile(user), sessionToken };
    });
  }

  async loginUser(input: { email: string; password: string }): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    return withDb((db) => {
      const user = Object.values(db.users).find((u) => u.email.toLowerCase() === email);
      if (!user || !verifyPassword(input.password, user.passwordHash)) {
        throw new AuthError("Incorrect email or password.");
      }
      const sessionToken = randomUUID();
      db.sessions[sessionToken] = { userId: user.id, expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString() };
      return { user: toProfile(user), sessionToken };
    });
  }

  async logout(sessionToken: string): Promise<void> {
    await withDb((db) => {
      delete db.sessions[sessionToken];
    });
  }

  async getUserBySession(sessionToken: string): Promise<Profile | null> {
    const db = await withDb((d) => d);
    const session = db.sessions[sessionToken];
    if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null;
    const user = db.users[session.userId];
    return user ? toProfile(user) : null;
  }

  async saveExperienceProfile(
    userId: string,
    data: { careerGoal: string; currentSituation: string; developmentPriorities: string[] },
  ) {
    return withDb((db) => {
      const profile = { userId, ...data, updatedAt: new Date().toISOString() };
      db.experienceProfiles[userId] = profile;
      return profile;
    });
  }

  async getExperienceProfile(userId: string) {
    const db = await withDb((d) => d);
    return db.experienceProfiles[userId] ?? null;
  }

  async getOrCreateEnrollment(userId: string): Promise<Enrollment> {
    return withDb((db) => {
      if (!db.enrollments[userId]) {
        db.enrollments[userId] = newEnrollment(userId);
      }
      return db.enrollments[userId];
    });
  }

  private async mutateEnrollment(userId: string, fn: (e: Enrollment) => void): Promise<Enrollment> {
    return withDb((db) => {
      if (!db.enrollments[userId]) db.enrollments[userId] = newEnrollment(userId);
      fn(db.enrollments[userId]);
      return db.enrollments[userId];
    });
  }

  async applyToPlacement(userId: string): Promise<Enrollment> {
    return this.mutateEnrollment(userId, (e) => {
      if (e.state === "invited" || e.state === "applied") {
        e.state = "offered";
        e.appliedAt = e.appliedAt ?? new Date().toISOString();
        e.offeredAt = new Date().toISOString();
      }
    });
  }

  async acceptPlacement(userId: string): Promise<Enrollment> {
    return this.mutateEnrollment(userId, (e) => {
      if (e.state === "offered") {
        e.state = "accepted";
        e.acceptedAt = new Date().toISOString();
      }
    });
  }

  async completeInductionItem(userId: string, itemId: string): Promise<Enrollment> {
    return this.mutateEnrollment(userId, (e) => {
      if (!e.inductionCompletedItemIds.includes(itemId)) {
        e.inductionCompletedItemIds.push(itemId);
      }
    });
  }

  async finishInduction(userId: string): Promise<Enrollment> {
    return this.mutateEnrollment(userId, (e) => {
      const allDone = INDUCTION_ITEM_IDS.every((id) => e.inductionCompletedItemIds.includes(id));
      if (allDone && (e.state === "accepted" || e.state === "active")) {
        e.state = "active";
        if (e.stage === "induction") e.stage = "briefing";
      }
    });
  }

  async advanceStage(userId: string, toStage: Stage): Promise<Enrollment> {
    return this.mutateEnrollment(userId, (e) => {
      if (stageIndex(toStage) >= stageIndex(e.stage)) {
        e.stage = toStage;
        if (toStage === "completed") {
          e.state = "completed";
          e.completedAt = new Date().toISOString();
        }
      }
    });
  }

  async setScenarioFlag(userId: string, key: string, value: boolean): Promise<Enrollment> {
    return this.mutateEnrollment(userId, (e) => {
      e.scenarioFlags[key] = value;
    });
  }

  async listCommunications(userId: string) {
    const db = await withDb((d) => d);
    const enrollment = db.enrollments[userId];
    const currentIndex = enrollment ? stageIndex(enrollment.stage) : -1;
    const replies = db.communicationReplies[userId] ?? [];
    return COMMUNICATIONS.filter((c) => stageIndex(c.sentAtStageStart) <= currentIndex).map((communication) => ({
      communication,
      reply: replies.find((r) => r.communicationId === communication.id) ?? null,
    }));
  }

  async replyToCommunication(userId: string, communicationId: string, bodyMarkdown: string) {
    const communication = getCommunication(communicationId);
    const experienceProfile = await this.getExperienceProfile(userId);
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
    return withDb((db) => {
      const enrollment = db.enrollments[userId];
      const reply = {
        id: randomUUID(),
        communicationId,
        enrollmentId: enrollment?.id ?? userId,
        bodyMarkdown,
        createdAt: new Date().toISOString(),
        characterFollowUp,
      };
      db.communicationReplies[userId] = [...(db.communicationReplies[userId] ?? []), reply];
      return reply;
    });
  }

  async getSubmission(userId: string, taskCode: TaskCode): Promise<Submission | null> {
    const db = await withDb((d) => d);
    return db.submissions[userId]?.[taskCode] ?? null;
  }

  async listSubmissions(userId: string): Promise<Submission[]> {
    const db = await withDb((d) => d);
    return Object.values(db.submissions[userId] ?? {});
  }

  async saveDraft(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission> {
    return withDb((db) => {
      const enrollment = db.enrollments[userId];
      db.submissions[userId] = db.submissions[userId] ?? {};
      const now = new Date().toISOString();
      let submission = db.submissions[userId][taskCode];
      if (!submission) {
        submission = {
          id: randomUUID(),
          enrollmentId: enrollment?.id ?? userId,
          taskCode,
          status: "draft",
          versions: [{ id: randomUUID(), submissionId: "", versionNumber: 1, kind: "original", content, createdAt: now }],
          createdAt: now,
          updatedAt: now,
        };
        submission.versions[0].submissionId = submission.id;
      } else if (submission.status === "draft") {
        const v = submission.versions[0];
        v.content = content;
        v.createdAt = now;
        submission.updatedAt = now;
      }
      db.submissions[userId][taskCode] = submission;
      return submission;
    });
  }

  private async assessAndAttach(
    userId: string,
    taskCode: TaskCode,
    content: SubmissionContent,
    isRevision: boolean,
    priorManagerNote?: string,
  ): Promise<{ assessment: Assessment; competencyAssessments: CompetencyAssessment[]; managerNote: string; source: "ai" | "demo" }> {
    const result = await aiProvider.assessSubmission({ content, isRevision, priorManagerNote });
    const anyHumanReview = result.competencyAssessments.some((c) => c.humanReviewFlag);
    const assessment: Assessment = {
      id: randomUUID(),
      submissionVersionId: "",
      taskCode,
      competencyAssessments: result.competencyAssessments,
      managerNote: result.managerNote,
      source: (result as { source?: "ai" | "demo" }).source ?? "demo",
      createdAt: new Date().toISOString(),
      humanReviewStatus: anyHumanReview ? "pending" : "not_required",
    };
    return { assessment, competencyAssessments: result.competencyAssessments, managerNote: result.managerNote, source: assessment.source as "ai" | "demo" };
  }

  async submitSubmission(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission> {
    await this.saveDraft(userId, taskCode, content);
    const { assessment } = await this.assessAndAttach(userId, taskCode, content, false);
    return withDb((db) => {
      const submission = db.submissions[userId][taskCode];
      const version = submission.versions[0];
      assessment.submissionVersionId = version.id;
      version.assessment = assessment;
      submission.status = "feedback_available";
      submission.updatedAt = new Date().toISOString();
      return submission;
    });
  }

  async reviseSubmission(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission> {
    const existing = await this.getSubmission(userId, taskCode);
    if (!existing) throw new NotFoundError("No submission to revise.");
    const priorManagerNote = latestVersion(existing).assessment?.managerNote;
    const { assessment } = await this.assessAndAttach(userId, taskCode, content, true, priorManagerNote);
    return withDb((db) => {
      const submission = db.submissions[userId][taskCode];
      const now = new Date().toISOString();
      const newVersion: SubmissionVersion = {
        id: randomUUID(),
        submissionId: submission.id,
        versionNumber: submission.versions.length + 1,
        kind: "revision",
        content,
        createdAt: now,
      };
      assessment.submissionVersionId = newVersion.id;
      newVersion.assessment = assessment;
      submission.versions.push(newVersion);
      submission.status = "resubmitted";
      submission.updatedAt = now;
      return submission;
    });
  }

  async getCompetencyScores(userId: string): Promise<CompetencyScoreSummary[]> {
    const submissions = await this.listSubmissions(userId);
    const byCompetency = new Map<string, { scores: number[]; refs: { taskCode: TaskCode; excerpt: string }[]; deltas: number[] }>();

    for (const submission of submissions) {
      const original = submission.versions[0];
      const latest = latestVersion(submission);
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

    return [...byCompetency.entries()].map(([competency, entry]) => {
      const level = Math.round(entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length) as 1 | 2 | 3 | 4 | 5;
      const delta = entry.deltas.length > 0 ? entry.deltas.reduce((a, b) => a + b, 0) / entry.deltas.length : null;
      return {
        competency: competency as CompetencyScoreSummary["competency"],
        level,
        rationale: `Based on ${entry.scores.length} assessed work product${entry.scores.length === 1 ? "" : "s"}.`,
        evidenceRefs: entry.refs,
        revisionDelta: delta,
      };
    });
  }

  async getPortfolio(userId: string): Promise<PortfolioData | null> {
    const db = await withDb((d) => d);
    const user = db.users[userId];
    const enrollment = db.enrollments[userId];
    if (!user || !enrollment) return null;
    const submissions = Object.values(db.submissions[userId] ?? {});
    const completedSubmissions = submissions.filter((s) => s.status === "feedback_available" || s.status === "resubmitted");
    return {
      enrollment,
      profile: toProfile(user),
      experienceProfile: db.experienceProfiles[userId] ?? null,
      completedSubmissions,
      competencyScores: await this.getCompetencyScores(userId),
      consents: db.consents[userId] ?? [],
    };
  }

  async setConsent(userId: string, purpose: Consent["purpose"], granted: boolean): Promise<Consent> {
    return withDb((db) => {
      const consent: Consent = {
        id: randomUUID(),
        userId,
        purpose,
        version: "1.0",
        granted,
        respondedAt: new Date().toISOString(),
        withdrawnAt: null,
      };
      db.consents[userId] = [...(db.consents[userId] ?? []), consent];
      return consent;
    });
  }

  async listConsents(userId: string): Promise<Consent[]> {
    const db = await withDb((d) => d);
    return db.consents[userId] ?? [];
  }

  async listFlaggedAssessments(): Promise<FlaggedAssessmentSummary[]> {
    const db = await withDb((d) => d);
    const out: FlaggedAssessmentSummary[] = [];
    for (const [userId, byTask] of Object.entries(db.submissions)) {
      const user = db.users[userId];
      for (const submission of Object.values(byTask)) {
        const version = latestVersion(submission);
        if (version.assessment && version.assessment.humanReviewStatus === "pending") {
          out.push({
            assessment: version.assessment,
            userId,
            userFullName: user?.fullName ?? "Unknown learner",
            taskCode: submission.taskCode,
          });
        }
      }
    }
    return out;
  }

  async markAssessmentReviewed(assessmentId: string): Promise<void> {
    await withDb((db) => {
      for (const byTask of Object.values(db.submissions)) {
        for (const submission of Object.values(byTask)) {
          for (const version of submission.versions) {
            if (version.assessment?.id === assessmentId) {
              version.assessment.humanReviewStatus = "reviewed";
            }
          }
        }
      }
    });
  }
}
