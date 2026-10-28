import { UserProfile, Job, ActiveSession, WorkProofRecord, ContractorWorkerItem, Language } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'workproof_user_profile',
  LANGUAGE: 'workproof_language',
  JOBS: 'workproof_jobs',
  ACTIVE_SESSION: 'workproof_active_session',
  PROOFS: 'workproof_proofs',
  CONTRACTOR_WORKERS: 'workproof_contractor_workers',
  LOCKOUT: 'workproof_join_lockout',
};

export const INITIAL_DEMO_JOBS: Job[] = [
  {
    id: 'job-12345',
    code: '12345',
    name: 'Metro Line 3 Pillar Work',
    contractorName: 'Rajesh Sharma',
    contractorPhone: '9820112345',
    siteLocation: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Bandra Kurla Complex, Mumbai',
      radiusMeters: 150,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'job-67890',
    code: '67890',
    name: 'Bandra Heights Civil Site',
    contractorName: 'Amit Patil',
    contractorPhone: '9833456789',
    siteLocation: {
      latitude: 19.0596,
      longitude: 72.8295,
      address: 'Hill Road, Bandra West',
      radiusMeters: 150,
    },
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DEMO_WORKERS: ContractorWorkerItem[] = [
  {
    id: 'w-1',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    isWorking: true,
    todayHours: '5h 30m',
  },
  {
    id: 'w-2',
    name: 'Sunita Bai',
    phone: '9822334455',
    isWorking: false,
    todayHours: '8h 00m',
  },
  {
    id: 'w-3',
    name: 'Santosh Shinde',
    phone: '9890123456',
    isWorking: true,
    todayHours: '3h 45m',
  },
];

export function triggerHaptic(durationMs = 35) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // ignore
    }
  }
}

// Language
export function getSavedLanguage(): Language {
  const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
  return lang === 'hi' || lang === 'mr' || lang === 'en' ? lang : 'en';
}

export function saveLanguage(lang: Language) {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

// User Profile
export function getSavedProfile(): UserProfile | null {
  const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
}

// Jobs
export function getAllJobs(): Job[] {
  const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_DEMO_JOBS));
    return INITIAL_DEMO_JOBS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_JOBS;
  } catch {
    return INITIAL_DEMO_JOBS;
  }
}

export function saveJob(job: Job) {
  const jobs = getAllJobs();
  const existingIndex = jobs.findIndex((j) => j.id === job.id || j.code === job.code);
  let updated: Job[];
  if (existingIndex >= 0) {
    updated = [...jobs];
    updated[existingIndex] = job;
  } else {
    updated = [job, ...jobs];
  }
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
  return updated;
}

export function findJobByCode(code: string): Job | undefined {
  const jobs = getAllJobs();
  return jobs.find((j) => j.code.trim() === code.trim());
}

export function findJobById(id: string): Job | undefined {
  const jobs = getAllJobs();
  return jobs.find((j) => j.id === id);
}

// Active Working Session
export function getActiveSession(): ActiveSession | null {
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveActiveSession(session: ActiveSession | null) {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }
}

// Work Proofs Log
export function getSavedProofs(): WorkProofRecord[] {
  const raw = localStorage.getItem(STORAGE_KEYS.PROOFS);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveWorkProof(proof: WorkProofRecord): WorkProofRecord[] {
  const list = getSavedProofs();
  const updated = [proof, ...list.filter((p) => p.id !== proof.id)];
  localStorage.setItem(STORAGE_KEYS.PROOFS, JSON.stringify(updated));
  return updated;
}

// Contractor Workers (demo data per job)
export function getContractorWorkers(): ContractorWorkerItem[] {
  const raw = localStorage.getItem(STORAGE_KEYS.CONTRACTOR_WORKERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.CONTRACTOR_WORKERS, JSON.stringify(INITIAL_DEMO_WORKERS));
    return INITIAL_DEMO_WORKERS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_WORKERS;
  } catch {
    return INITIAL_DEMO_WORKERS;
  }
}

export function removeContractorWorker(workerId: string): ContractorWorkerItem[] {
  const current = getContractorWorkers();
  const updated = current.filter((w) => w.id !== workerId);
  localStorage.setItem(STORAGE_KEYS.CONTRACTOR_WORKERS, JSON.stringify(updated));
  return updated;
}

// Join Lockout (after 5 failed attempts, locked for 5 minutes)
export interface LockoutState {
  failedAttempts: number;
  lockedUntilMs: number | null;
}

export function getLockoutState(): LockoutState {
  const raw = localStorage.getItem(STORAGE_KEYS.LOCKOUT);
  if (!raw) return { failedAttempts: 0, lockedUntilMs: null };
  try {
    const parsed: LockoutState = JSON.parse(raw);
    if (parsed.lockedUntilMs && Date.now() > parsed.lockedUntilMs) {
      // Lock expired
      return { failedAttempts: 0, lockedUntilMs: null };
    }
    return parsed;
  } catch {
    return { failedAttempts: 0, lockedUntilMs: null };
  }
}

export function recordFailedJoinAttempt(): LockoutState {
  const current = getLockoutState();
  const newAttempts = current.failedAttempts + 1;
  let lockedUntilMs: number | null = null;
  if (newAttempts >= 5) {
    lockedUntilMs = Date.now() + 5 * 60 * 1000; // 5 minutes
  }
  const newState: LockoutState = {
    failedAttempts: newAttempts,
    lockedUntilMs,
  };
  localStorage.setItem(STORAGE_KEYS.LOCKOUT, JSON.stringify(newState));
  return newState;
}

export function resetJoinLockout() {
  localStorage.removeItem(STORAGE_KEYS.LOCKOUT);
}

export function resetAllStorageToDefault() {
  localStorage.clear();
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_DEMO_JOBS));
  localStorage.setItem(STORAGE_KEYS.CONTRACTOR_WORKERS, JSON.stringify(INITIAL_DEMO_WORKERS));
}
