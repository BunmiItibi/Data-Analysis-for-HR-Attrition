import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  CommunicationReply,
  Consent,
  Enrollment,
  ExperienceProfile,
  Profile,
  Submission,
} from "@/lib/domain/types";

export interface DbShape {
  users: Record<string, Profile & { passwordHash: string }>;
  sessions: Record<string, { userId: string; expiresAt: string }>;
  experienceProfiles: Record<string, ExperienceProfile>;
  enrollments: Record<string, Enrollment>;
  communicationReplies: Record<string, CommunicationReply[]>;
  submissions: Record<string, Record<string, Submission>>;
  consents: Record<string, Consent[]>;
}

function emptyDb(): DbShape {
  return {
    users: {},
    sessions: {},
    experienceProfiles: {},
    enrollments: {},
    communicationReplies: {},
    submissions: {},
    consents: {},
  };
}

const DB_DIR = path.join(process.cwd(), ".demo-data");
const DB_PATH = path.join(DB_DIR, "db.json");

let writeQueue: Promise<unknown> = Promise.resolve();

async function readDbFromDisk(): Promise<DbShape> {
  try {
    const raw = await readFile(DB_PATH, "utf-8");
    return { ...emptyDb(), ...JSON.parse(raw) };
  } catch {
    return emptyDb();
  }
}

async function writeDbToDisk(db: DbShape): Promise<void> {
  await mkdir(DB_DIR, { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

/**
 * Serialises every read-modify-write against the demo JSON store so
 * concurrent requests in the same dev process can't clobber each other's
 * writes. Good enough for a single-instance local demo; a real deployment
 * uses the Supabase-backed repo instead (see lib/data/supabase/).
 */
export async function withDb<T>(fn: (db: DbShape) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await readDbFromDisk();
    const result = await fn(db);
    await writeDbToDisk(db);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

export async function readDb(): Promise<DbShape> {
  return readDbFromDisk();
}
