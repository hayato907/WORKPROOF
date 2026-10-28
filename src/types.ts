export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'worker' | 'contractor';

export interface UserProfile {
  phone: string;
  role: UserRole;
  name: string;
  joinedJobIds: string[];
}

export interface JobSiteLocation {
  latitude: number;
  longitude: number;
  address?: string;
  radiusMeters: number; // default 150
}

export interface Job {
  id: string; // e.g. "job-12345"
  code: string; // 5-digit code, e.g. "12345"
  name: string;
  contractorName: string;
  contractorPhone?: string;
  siteLocation?: JobSiteLocation;
  createdAt: string;
}

export interface ActiveSession {
  id: string;
  jobId: string | null; // null if General / No Job
  jobName: string;
  contractorName: string;
  startTimeISO: string;
  startLatitude: number | null;
  startLongitude: number | null;
  startAddress?: string;
  startWithinSite: boolean | null; // null if no site defined
  photoBase64?: string;
}

export interface WorkProofRecord {
  id: string;
  workerName: string;
  workerPhone: string;
  jobId: string | null;
  jobName: string;
  contractorName: string;
  dateISO: string; // YYYY-MM-DD
  startTimeISO: string;
  endTimeISO: string;
  totalDurationSeconds: number;
  formattedHours: string; // e.g. "8 hrs 15 mins"
  decimalHours: number; // e.g. 8.25
  startLatitude: number | null;
  startLongitude: number | null;
  startAddress?: string;
  startWithinSite: boolean | null;
  endLatitude: number | null;
  endLongitude: number | null;
  endAddress?: string;
  endWithinSite: boolean | null;
  photoBase64?: string;
}

export interface ContractorWorkerItem {
  id: string;
  name: string;
  phone: string;
  isWorking: boolean;
  todayHours: string;
  lastActiveSessionId?: string;
}
