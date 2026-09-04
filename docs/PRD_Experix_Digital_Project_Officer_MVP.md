PRODUCT REQUIREMENTS DOCUMENT
Experix Digital Project Officer MVP
A realistic software-project work experience for graduates without prior project experience
Product: Experix
Experience: Digital Software Project Officer Virtual Work Placement
Scenario: Northstar Patient Access Portal
Version: 1.0
Status: Build-ready MVP specification
Date: 4 September 2026
Audience: Founder, product designer, developer, AI engineer and Project Management SME
| PRODUCT NORTH STAR Experix exists to give graduates credible, demonstrable project work experience that improves their ability to secure employment. |
This document defines the minimum product required to deliver and validate that outcome. PRINCE2 and Agile may shape the work environment, but they are supporting methods rather than the product itself.
# 1. Executive Summary
Experix is an AI-powered workplace experience and employability platform. Its first product is a structured virtual work placement in which a graduate joins a fictional organisation as a Digital Project Officer and supports the delivery of a software product from induction through testing and closure.
The learner does not watch lessons and then answer a quiz. The learner works. They receive emails, attend meetings, maintain project records, coordinate stakeholders, respond to changes, submit professional artefacts, receive manager-style feedback, revise their work and leave with verifiable evidence.
| MVP OUTCOME A learner can complete a coherent software-project placement and produce evidence that an employer can inspect, understand and verify. |
## 1.1 Product decision
- Build one complete Project Officer experience before adding other careers, industries or large administrative modules.
- Use a fictional healthcare software project to provide realistic delivery, stakeholder, testing and data-protection situations.
- Assess observable work and decisions rather than knowledge recall.
- Describe the outcome accurately as structured simulated work experience, not employment, accreditation or guaranteed employment.
## 1.2 Recommended implementation route
| Component | Recommended use |
| Lovable | Fast first build for a non-technical founder, including responsive interface and iteration. |
| Supabase | Authentication, relational data, saved progress, file storage and access control. |
| GitHub | Source control, code ownership, developer handover and recovery. |
| Claude | Product content, scenario drafting, meeting and email content, rubrics and structured feedback instructions. |
| Claude Code | Custom application logic, testing, technical hardening and later development with capable review. |
# 2. Problem and Product Purpose
## 2.1 The problem
Graduates and career changers are frequently asked to demonstrate workplace and project experience before employers will offer them an opportunity. Qualifications may show knowledge, but they do not show how a candidate behaves inside a project, communicates with colleagues, manages information, responds to pressure or improves work after feedback.
## 2.2 The product response
Experix creates a realistic, structured environment where learners can practise the work of a Project Officer and create an evidence trail. The platform gives the learner an organisation, role, manager, colleagues, project, responsibilities, workplace communications, evolving conditions and professional outputs.
## 2.3 Jobs to be done
| User | Job to be done | Successful result |
| Learner | Gain credible project practice without first needing a job. | Can show and explain completed project work. |
| Learner | Translate qualifications into workplace capability. | Demonstrates communication, coordination and judgement. |
| Employer | Assess an early-career candidate beyond CV claims. | Can inspect verified tasks, work products and development. |
| Training provider | Add practical experience to taught knowledge. | Learners complete structured workplace assignments. |
## 2.4 Product success test
| PERMANENT PRODUCT RULE Every feature must create realistic work, develop an employable capability, produce credible evidence, improve interview readiness or reduce employer uncertainty. Features that do none of these should not be built. |
# 3. Users and Roles
## 3.1 Primary user
A UK graduate or career changer seeking an entry-level Project Officer, Project Coordinator or junior digital-project role. The learner may understand project terminology but lacks practical project evidence.
## 3.2 Reference persona
| Attribute | Definition |
| Name | Bunmi Adebayo |
| Goal | Secure an entry-level digital Project Officer role |
| Current position | Qualified but unable to demonstrate project work experience |
| Need | A safe place to practise realistic work and create evidence |
| Concern | Employers may dismiss simulated experience as superficial |
| Success | Can confidently explain work, decisions, setbacks and learning in interviews |
## 3.3 Platform roles
| Role | MVP permissions |
| Learner | Enrolls, completes tasks, communicates, submits work, reviews feedback, revises and controls portfolio sharing. |
| Facilitator / reviewer | Monitors progress, reviews flagged submissions, adds feedback and resolves assessment disputes. |
| Content administrator | Manages scenario content, tasks, files, characters, rubrics and episode release. |
| Employer verifier | Views only evidence deliberately shared by the learner through a controlled verification link. |
# 4. MVP Scope
## 4.1 In scope
- One Digital Software Project Officer placement.
- One fictional organisation and one patient-access software project.
- Registration, login, enrollment, placement offer and induction.
- A workplace dashboard with inbox, meetings, tasks, documents and progress.
- Ten structured work episodes delivered across four simulated weeks.
- AI-supported manager and colleague interactions grounded in approved scenario content.
- Professional artefact creation, submission, feedback, revision and version history.
- Competency assessment, Experience Score, completion summary and portfolio evidence.
- Controlled employer verification with learner consent.
- A minimum administrator interface for content and participant oversight.
## 4.2 Out of scope for the first MVP
- Additional industries, role families or Project Manager pathway.
- Marketplace, university-wide administration, advanced employer recruitment tools and complex analytics.
- Live integrations with real employers, NHS systems or patient data.
- Accreditation, formal certification or claims of guaranteed employment.
- Fully autonomous high-stakes assessment without human oversight.
- Multi-language delivery, native mobile applications and open-ended user-created simulations.
## 4.3 Release sequence
| Release | Target | Contents | Evidence gate |
| 0.1 Vertical slice | Day 30 | Registration, induction, project brief, RAID task, testing incident, feedback, revision and portfolio preview. | Eight users attempt; five complete; three show payment, referral or continuation intent. |
| 0.2 Pilot MVP | Day 60 | All ten work episodes, manager interactions, core artefacts, scoring and human review. | At least 60% completion, five paying users and three professional reviews. |
| 1.0 Founding launch | Day 90 | Improved experience, payment, verified portfolio, employer link and next-cohort operations. | Ten paying users and one organisational pilot or two formal commitments. |
# 5. Experience Definition
| Field | Specification |
| Experience title | Digital Software Project Officer Virtual Work Placement |
| Organisation | Northstar Health Digital |
| Project | Northstar Patient Access Portal |
| Learner role | Project Officer |
| Manager | Sarah Mitchell, Senior Project Manager |
| Simulated duration | Four working weeks |
| Expected learner effort | Six to eight hours |
| Delivery mode | Self-paced with staged release and optional facilitated sessions |
| Primary outcome | Verified project work portfolio and interview-ready evidence |
## 5.1 Software project
Northstar Health Digital is developing a secure patient-access web portal. The portal will allow patients to view appointments, request changes, cancel appointments, receive confirmations and reminders, and update basic contact information.
The project exposes the learner to common digital-delivery realities: competing stakeholder needs, unclear requirements, scheduling dependencies, integration delays, feature requests, accessibility, user testing, data protection, launch readiness and handover.
## 5.2 Workplace team
| Character | Role | Function in the experience |
| Sarah Mitchell | Senior Project Manager | Assigns work, challenges assumptions, reviews performance and escalates major decisions. |
| Lucy Thompson | Clinical Product Owner | Represents users and operational requirements; may request changes. |
| Daniel Reed | Technical Lead | Reports development progress, integration constraints and technical risks. |
| Maya Patel | UX Designer | Provides research and raises accessibility and usability concerns. |
| Rachel Adams | Test Lead | Coordinates testing, defects and readiness evidence. |
| James Wilson | Information Governance Lead | Reviews privacy, information security and data-handling concerns. |
| Sophie Clark | Project Support Officer | Shares records and models appropriate administrative practice. |
| Dr Amelia Grant | Project Executive | Makes major investment and launch decisions. |
## 5.3 Authority boundary
| ROLE REALISM The learner supports, coordinates, records, challenges and recommends. The learner does not approve funding, authorise major scope changes or make the final go-live decision. Those actions belong to the Project Manager or Project Board. |
# 6. End-to-End User Journey
| Stage | Learner experience | Key action | Outcome |
| Discover | Understands the opportunity and its simulated nature. | View placement, outcomes and sample evidence. | Trust and relevance established. |
| Apply | Creates a professional profile without being screened out for inexperience. | Register, set goal, complete readiness questions. | Account and baseline created. |
| Accept | Receives a meaningful placement offer. | Review responsibilities and accept terms. | Enrollment activated. |
| Induct | Joins the workplace and meets the team. | Review company, role, project and conduct. | Workplace context understood. |
| Work | Handles meetings, emails, tasks and documents. | Coordinate, analyse, write and follow up. | Evidence captured continuously. |
| Adapt | Responds to delays, disagreement, change and defects. | Gather facts, update records and escalate. | Judgement and consequences observed. |
| Improve | Receives specific feedback and revises work. | Review, challenge or apply feedback. | Growth evidenced through versions. |
| Complete | Closes the assignment and reflects. | Present results, record lessons and handover. | Placement completion established. |
| Translate | Turns activity into employability evidence. | Build portfolio, STAR examples and CV language. | Interview readiness improves. |
| Verify | Controls employer access to evidence. | Create and revoke verification links. | Employer can inspect trusted evidence. |
# 7. Episode Content Specification
| # | Episode | Work challenge | Evidence | Competencies |
| 1 | First day and induction | Introduce self, review role and learn workplace expectations. | Professional introduction; induction record | Communication; professionalism |
| 2 | Project briefing | Understand the patient-access problem, benefits, users and constraints. | One-page Project Overview | Comprehension; written communication |
| 3 | Requirements meeting | Capture decisions, actions, owners and unresolved questions. | Minutes; action log; follow-up email | Accuracy; organisation; follow-up |
| 4 | Stakeholder coordination | Identify influence, needs and engagement approach. | Stakeholder map; communication plan | Stakeholder awareness; empathy |
| 5 | Planning and dependencies | Organise activities, milestones and scheduling conflicts. | Delivery plan; milestone tracker; agenda | Planning; coordination |
| 6 | Risks and issues | Classify and manage project threats, issues, assumptions and dependencies. | RAID log; escalation email | Risk awareness; judgement |
| 7 | Development progress | Interpret team updates and communicate delivery status. | Status report; updated plan and actions | Monitoring; concise reporting |
| 8 | Feature request | Gather evidence for a requested video-consultation feature. | Change Impact Summary | Change control; boundaries |
| 9 | Testing and privacy incident | Prioritise defects and escalate a privacy concern. | Defect log; readiness summary | Quality; data protection; prioritisation |
| 10 | Review and handover | Summarise delivery, present recommendations and record learning. | Project summary; lessons; handover; presentation | Reflection; presentation; closure |
# 8. Core Screen Inventory
| ID | Screen | Purpose | Primary action |
| S01 | Landing page | Explain the experience, outcome, time, price and simulation status. | Start experience |
| S02 | Registration / login | Create and access a secure account. | Create account / Sign in |
| S03 | Experience Identity | Capture career goal, readiness and development priorities. | Generate profile |
| S04 | Placement listing | Show role, company, responsibilities and expected evidence. | Apply |
| S05 | Placement offer | Present terms, dates, responsibilities and conduct. | Accept placement |
| S06 | Induction | Introduce workplace, team, project and expected behaviour. | Complete induction |
| S07 | Workplace dashboard | Show current episode, priorities, deadlines and progress. | Continue work |
| S08 | Inbox | Deliver scenario emails and capture learner replies. | Reply / Flag / Add note |
| S09 | Meetings | Provide scheduled meetings, transcripts and decision context. | Attend / Review transcript |
| S10 | Task detail | Explain assignment, resources, due date and quality expectations. | Start task |
| S11 | Document workspace | Create, upload, autosave and revise artefacts. | Save / Submit |
| S12 | Project records | Maintain actions, risks, issues, decisions and milestones. | Add / Update record |
| S13 | Dynamic event | Present project changes and consequences. | Investigate / Recommend / Escalate |
| S14 | Feedback | Display evidence-linked manager and assessment feedback. | Revise / Query / Accept |
| S15 | Experience Score | Explain competency scores and supporting evidence. | Review evidence |
| S16 | Portfolio | Organise artefacts, reflection and performance evidence. | Publish / Download |
| S17 | Verification | Create controlled employer access and revoke links. | Create link / Revoke |
| S18 | Admin console | Manage learners, content, flags, rubrics and review queue. | Review / Publish |
# 9. Functional Requirements
| ID | Priority | Area | Requirement |
| FR-01 | Must | Accounts | Users can register, verify email, sign in, reset password and sign out. |
| FR-02 | Must | Profile | Users can create and edit an Experience Identity with career goal and baseline. |
| FR-03 | Must | Enrollment | Users can view, apply for and accept the Project Officer placement. |
| FR-04 | Must | Induction | The system records completion of required workplace induction items. |
| FR-05 | Must | Dashboard | The dashboard shows one clear next action, deadlines, messages and progress. |
| FR-06 | Must | Progression | Episodes unlock by completion rules and approved scenario sequence. |
| FR-07 | Must | Inbox | Users receive contextual email and can draft, send and revisit replies. |
| FR-08 | Must | Meetings | Users can access meeting briefs, participants, media/transcripts and outcomes. |
| FR-09 | Must | Tasks | Each task shows purpose, instructions, evidence, due date and quality criteria. |
| FR-10 | Must | Workspace | Users can create or upload work; drafts autosave and remain recoverable. |
| FR-11 | Must | Versioning | The system retains original and revised submissions with timestamps. |
| FR-12 | Must | Dynamic events | Scenario events are triggered by episode state and selected learner actions. |
| FR-13 | Must | AI colleagues | AI responses follow character roles, known facts and authority boundaries. |
| FR-14 | Must | Feedback | Feedback links strengths and gaps to the learner’s submitted evidence. |
| FR-15 | Must | Review | Low-confidence, disputed or consequential assessments enter a human-review queue. |
| FR-16 | Must | Scoring | Users can see competency scores, rationale, evidence and improvement route. |
| FR-17 | Must | Portfolio | The system compiles approved artefacts, decisions, feedback and reflection. |
| FR-18 | Must | Verification | The learner can create time-limited, revocable evidence links. |
| FR-19 | Must | Consent | Portfolio sharing and case-study use require explicit, separate consent. |
| FR-20 | Must | Admin | Authorised staff can manage content, enrollment, review flags and completion. |
| FR-21 | Should | Notifications | Users receive reminders for new messages, deadlines and returned feedback. |
| FR-22 | Should | Reflection | Users create evidence-based STAR and CV drafts that remain editable. |
| FR-23 | Later | Payments | Support cohort purchase, receipts, discounts and limited scholarship places. |
| FR-24 | Later | Organisations | Support organisational cohorts, reporting and branded invitations. |
# 10. Workplace Interaction Requirements
## 10.1 Interaction types
| Channel | Required behaviour |
| Email | Messages have sender, recipients, subject, time, attachments and context. Replies become evidence. |
| Meeting | Each meeting has purpose, participants, agenda, transcript or media, decisions and actions. |
| Chat | Short colleague exchanges support clarification without replacing formal records. |
| Task | Assignments contain business context, expected output, available resources and quality criteria. |
| Notification | Urgent changes interrupt the normal sequence when the scenario requires action. |
| Manager review | Sarah responds to the quality, timing and judgement shown in the learner’s actual work. |
## 10.2 Consequence model
- Missed actions may become overdue and generate follow-up from colleagues.
- Unclear meeting records may produce disagreement over decisions.
- Weak stakeholder engagement may create resistance during testing.
- Unauthorised commitments may trigger challenge from the Project Manager or Technical Lead.
- Failure to escalate a privacy issue must materially affect feedback and scenario response.
- Strong communication, prioritisation and escalation should increase stakeholder confidence.
## 10.3 Experience tone
The experience should feel professional, supportive and demanding without humiliating the learner. Colleagues may challenge the learner, but feedback must remain specific, respectful and development-focused. The workplace must include uncertainty and competing demands without becoming chaotic or theatrical.
# 11. AI Behaviour and Guardrails
## 11.1 AI roles
- Generate role-consistent responses from approved scenario facts.
- Assess submissions against transparent rubrics and cite the learner’s evidence.
- Provide hints and questions without completing the assignment for the learner.
- Adapt follow-up questions and consequences to the learner’s decisions.
- Generate editable CV and interview drafts from completed evidence only.
## 11.2 Guardrails
| Risk | Required control |
| Invented scenario facts | AI must use retrieved approved content and identify when information is unavailable. |
| Doing the work for the learner | Use coaching prompts and limited examples unrelated to the live assignment. |
| Opaque scoring | Show rubric criterion, evidence excerpt, rationale and confidence for each score. |
| Bias | Test equivalent submissions across names and demographic signals; remove irrelevant profile data from scoring. |
| Unsafe high-stakes assessment | Human review for disputes, low confidence, privacy concerns and completion certification samples. |
| Misleading claims | Never call the simulation employment, employer endorsement, accreditation or guaranteed job experience. |
| Sensitive data | Prohibit real patient, NHS, employer or confidential project information in tasks and uploads. |
## 11.3 AI response structure
Assessment responses should return structured fields so the application can display and audit them consistently: criterion ID, result, supporting evidence, strength, gap, recommended improvement, confidence, human-review flag and safety flag.
# 12. Assessment and Experience Score
## 12.1 Assessment philosophy
Experix assesses demonstrated capability, not course completion. Scores must arise from observable work, communication, decisions, revisions and project consequences. Time spent or screens viewed must not be treated as competence.
## 12.2 Competency framework
| Competency | Observable evidence |
| Professional communication | Clear, appropriate emails, notes, summaries and follow-up. |
| Project organisation | Accurate records, actions, deadlines and document control. |
| Planning and coordination | Logical sequencing, milestones, dependencies and follow-through. |
| Stakeholder management | Recognises interests, communicates appropriately and handles disagreement. |
| Risk and issue management | Identifies, classifies, owns, responds and escalates appropriately. |
| Change support | Gathers facts, assesses effects and respects decision authority. |
| Quality and testing awareness | Uses evidence, understands severity and supports readiness decisions. |
| Data protection awareness | Recognises and escalates privacy and information risks. |
| Professional judgement | Prioritises proportionately and explains recommendations. |
| Adaptability and learning | Responds to feedback and improves subsequent work. |
## 12.3 Scoring scale
| Level | Label | Meaning |
| 1 | Needs substantial support | Work is incomplete, inaccurate or requires close direction. |
| 2 | Developing | Shows partial capability but misses important details or judgement. |
| 3 | Workplace ready with support | Produces acceptable work with normal early-career guidance. |
| 4 | Strong early-career capability | Produces clear, reliable work and responds well to changing conditions. |
| 5 | Advanced for the role | Shows consistent judgement, initiative and high-quality evidence. |
## 12.4 Score rules
- Display competency-level scores before any overall score.
- Do not certify readiness from one artefact; use evidence across episodes.
- Preserve the original score and revised score to show development.
- Allow the learner to request a review and see the outcome.
- Label the Experience Score as developmental and non-accredited.
# 13. Evidence Portfolio and Employer Verification
## 13.1 Portfolio contents
- Experience title, fictional organisation, role, dates and simulated duration.
- Project description and the learner’s responsibilities.
- Approved work products, including original and selected final versions.
- Key decisions, recommendations and relevant consequences.
- Competencies demonstrated and supporting evidence.
- Manager-style feedback, human-review status and improvement history.
- Learner reflection, CV description and interview talking points.
- Unique verification reference and clear simulation disclosure.
## 13.2 Verification view
The verification view must answer four employer questions: What was the candidate asked to do? What did they produce? How was it assessed? How did they respond to feedback?
| Employer can see | Employer cannot see without separate consent |
| Shared final artefacts, scenario, tasks, assessment criteria, completion and selected development evidence. | Private reflections, unrelated profile information, private support conversations and unshared drafts. |
| Verification status, issue date, expiry date and whether evidence has been changed since publication. | Sensitive personal data, protected characteristics or information not relevant to capability. |
## 13.3 Mandatory disclosure
| VERIFICATION STATEMENT This candidate completed a structured simulated software-project work placement through Experix. This does not represent employment by Northstar Health Digital. |
# 14. Content Requirements
| Content set | Required contents |
| Organisation pack | Company profile, structure, values, policies, glossary and visual identity. |
| Project pack | Business problem, objectives, scope, benefits, timeline, budget assumptions and constraints. |
| People pack | Character biographies, responsibilities, communication styles and knowledge boundaries. |
| Episode scripts | Opening condition, events, triggers, messages, meeting content, decisions and consequences. |
| Workplace documents | Briefs, agendas, minutes, action logs, plans, RAID logs, reports, change and testing records. |
| Assessment pack | Task-specific rubrics, exemplars, common errors, feedback rules and review thresholds. |
| Career pack | Portfolio template, CV phrasing, STAR prompts, verification disclosure and sharing guidance. |
## 14.1 Content realism rules
- Information must be distributed across emails, meetings, attachments and project records.
- Stakeholders should have legitimate but sometimes competing priorities.
- Not every message should be relevant; the learner must identify what matters.
- Changes must arise from plausible software delivery, not artificial quiz prompts.
- The scenario must never use real patient records or reproduce confidential NHS materials.
- Templates should resemble workplace documents while remaining concise enough for an entry-level learner.
# 15. Data Model
| Entity | Purpose |
| User | Identity, authentication state and account settings. |
| ExperienceProfile | Career goal, baseline, preferences and readiness. |
| Experience | Role, company, project, duration, version and publication status. |
| Enrollment | User, experience, cohort, start, state and completion. |
| Episode | Sequence, objectives, unlock rule, expected work and scenario state. |
| Character | Role, authority, style, knowledge base and response constraints. |
| Communication | Email, chat, meeting, notification, sender, recipients and attachments. |
| Task | Instructions, resources, quality criteria, deadline and competency mapping. |
| Submission | Task, user, version, content/file, timestamps and status. |
| Interaction | Learner action, AI response, scenario context and audit information. |
| Assessment | Rubric results, evidence, confidence, flags and reviewer status. |
| CompetencyScore | Competency, source evidence, level, rationale and revision delta. |
| PortfolioItem | Selected evidence, disclosure, visibility and publication status. |
| VerificationLink | Token, permissions, issue, expiry, revocation and access log. |
| Consent | Purpose, version, response, timestamp and withdrawal. |
## 15.1 State model
Enrollment states: invited, applied, offered, accepted, active, paused, awaiting review, completed or withdrawn. Task states: locked, available, in progress, submitted, feedback available, revision requested, resubmitted or completed.
# 16. Non-Functional Requirements
| ID | Area | Requirement |
| NFR-01 | Accessibility | Meet WCAG 2.2 AA for the learner and verification experiences. |
| NFR-02 | Responsive design | Support modern mobile, tablet and desktop layouts; primary document work optimised for desktop. |
| NFR-03 | Autosave | Save active work frequently and show last-saved state; recover interrupted sessions. |
| NFR-04 | Performance | Primary pages load quickly on ordinary UK consumer connections; avoid unnecessary animation. |
| NFR-05 | Security | Enforce server-side authorisation, secure secrets, encrypted transport and least privilege. |
| NFR-06 | Privacy | Minimise personal data, provide retention and deletion rules, and separate consent purposes. |
| NFR-07 | Auditability | Record submissions, versions, assessments, reviewer actions and verification access. |
| NFR-08 | Reliability | Prevent data loss and provide monitored backup and restoration appropriate to the pilot. |
| NFR-09 | Explainability | Every material score and scenario consequence must have a visible rationale. |
| NFR-10 | Content safety | Block or flag real sensitive data and provide reporting and support routes. |
# 17. Analytics and Validation
## 17.1 Primary metric
| NORTH-STAR MVP METRIC Number of target learners who complete the core simulation and produce employer-viewable evidence each week. |
## 17.2 Supporting measures
| Measure | Definition |
| Activation | Accepted placement and completed induction. |
| Time to first work | Time from account creation to first meaningful project action. |
| Episode completion | Percentage completing each episode and time spent. |
| Full completion | Percentage producing the required final evidence. |
| Revision behaviour | Percentage applying feedback and measurable improvement. |
| Evidence publication | Percentage creating a portfolio and verification link. |
| Payment signal | Paid enrollment, deposit or contracted organisational pilot. |
| Referral | Learners who recommend or invite another target user. |
| Employer usefulness | Employer/recruiter rating of credibility and decision value. |
| Founder effort | Support and review time required per learner. |
## 17.3 Pilot targets
| Checkpoint | Target |
| Day 30 | Eight users attempt; five complete the vertical slice; at least three pay, refer or ask to continue. |
| Day 60 | At least 15 starters, 70% activation, 60% completion, five paying users and three professional reviews. |
| Day 90 | At least ten paying users, five credible case studies and one paid organisational pilot or two formal commitments. |
# 18. Acceptance Criteria
| ID | Acceptance criterion |
| AC-01 | A new user can register, accept the placement and complete induction without founder intervention. |
| AC-02 | The dashboard always shows a clear current priority and allows continuation from the last saved state. |
| AC-03 | The learner can receive and reply to workplace communications that affect scenario evidence. |
| AC-04 | The learner can create, submit, receive feedback on and revise at least three professional artefacts. |
| AC-05 | A software-project change or problem produces a consequence tied to the learner’s action. |
| AC-06 | AI feedback cites specific evidence and cannot award unexplained scores. |
| AC-07 | Flagged or disputed assessments can be reviewed and resolved by an authorised human. |
| AC-08 | Original and revised work remain distinguishable and time-stamped. |
| AC-09 | The learner can complete the placement and publish selected evidence to a portfolio. |
| AC-10 | An employer can access a valid verification link without seeing unshared personal information. |
| AC-11 | Every public evidence view displays the required simulated-experience disclosure. |
| AC-12 | The learner can revoke access and the old link no longer reveals evidence. |
| AC-13 | No real patient or NHS data is required anywhere in the experience. |
| AC-14 | The experience can be completed using keyboard navigation and assistive technology at the required level. |
# 19. Build Backlog
| Order | Workstream | Deliverable | Priority |
| 1 | Foundation | Repository, environments, design system, authentication, database and permissions. | Must |
| 2 | Core learner flow | Profile, placement, offer, induction, dashboard and progression. | Must |
| 3 | Workplace engine | Inbox, meetings, tasks, project records and scenario state. | Must |
| 4 | Evidence workflow | Workspace, upload, autosave, submission, versioning and revision. | Must |
| 5 | AI interaction | Character grounding, assessment schema, feedback and review flags. | Must |
| 6 | Portfolio | Evidence selection, completion summary and mandatory disclosure. | Must |
| 7 | Verification | Controlled links, permissions, expiry, revocation and access log. | Must |
| 8 | Admin | Content controls, participant overview, review queue and completion controls. | Must |
| 9 | Validation analytics | Funnel, completion, drop-off, assessment, payment and support measures. | Should |
| 10 | Payment and cohort operations | Founding price, scholarship codes, receipts and enrollment limit. | Should |
# 20. Governance and Product Integrity
- A Project Management practitioner reviews project content, task expectations and rubrics before pilot release.
- A technical reviewer checks authentication, authorisation, secrets, data access and deployment configuration.
- A privacy review defines retention, deletion, consent and verification access before real users upload work.
- AI outputs are evaluated against approved submissions, common errors and equivalent-user bias tests.
- Marketing claims are reviewed to ensure that simulated experience is never presented as employment.
- PRINCE2 names and concepts may be used accurately, but Experix must not imply official accreditation or endorsement.
# 21. Open Decisions Before Build
| Decision | Question | Owner | Due |
| Pricing | Confirm founding learner price and scholarship limit. | Founder | Before pilot recruitment |
| Build route | Confirm Lovable-led build or developer-led Claude Code build. | Founder / technical adviser | Before repository setup |
| Assessment review | Appoint a qualified Project Management reviewer. | Founder | Before rubric approval |
| Portfolio format | Choose web-only evidence for MVP or add downloadable PDF. | Product | Before Release 0.2 |
| AI provider | Select model, cost limit, data terms and fallback behaviour. | Technical adviser | Before AI integration |
| Data retention | Set draft, inactive account and verification retention periods. | Founder / privacy adviser | Before pilot |
| Experience completion | Confirm minimum required artefacts and competency threshold. | Product / PM reviewer | Before pilot |
# 22. Definition of Done for the MVP
| MVP DONE A graduate can enter Experix with no previous project experience, complete realistic Project Officer work on a software project, respond to changing conditions, improve after feedback and share credible evidence with an employer. |
- The complete learner journey works from account creation to verification.
- At least three professional artefacts are created and assessed.
- At least one dynamic project problem changes in response to learner action.
- Feedback is transparent, evidence-linked and reviewable.
- The portfolio accurately presents what the learner did and did not do.
- Real target users complete the experience and a meaningful number pay, refer or request more.
End of Product Requirements Document