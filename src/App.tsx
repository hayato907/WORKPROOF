/**
 * WorkProof - Front End Only Mobile-First Daily Wage Work Proof App
 */
import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Language,
  Job,
  ActiveSession,
  WorkProofRecord,
  ContractorWorkerItem,
} from './types';
import { translations } from './translations';
import {
  getSavedLanguage,
  saveLanguage,
  getSavedProfile,
  saveProfile,
  clearProfile,
  getAllJobs,
  saveJob,
  getActiveSession,
  saveActiveSession,
  getSavedProofs,
  saveWorkProof,
  getContractorWorkers,
  removeContractorWorker,
  resetAllStorageToDefault,
  triggerHaptic,
} from './utils/storage';
import { Header } from './components/Header';
import { AuthFlow } from './components/auth/AuthFlow';
import { WorkerHome } from './components/worker/WorkerHome';
import { JoinJobModal } from './components/worker/JoinJobModal';
import { StartWorkFlow } from './components/worker/StartWorkFlow';
import { WorkingSession } from './components/worker/WorkingSession';
import { ProofCard } from './components/worker/ProofCard';
import { MyProofs } from './components/worker/MyProofs';
import { ContractorHome } from './components/contractor/ContractorHome';
import { WifiOff, RotateCcw } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(getSavedLanguage());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(getSavedProfile());
  const [jobs, setJobs] = useState<Job[]>(getAllJobs());
  const [activeSession, setActiveSessionState] = useState<ActiveSession | null>(getActiveSession());
  const [proofs, setProofs] = useState<WorkProofRecord[]>(getSavedProofs());
  const [contractorWorkers, setContractorWorkers] = useState<ContractorWorkerItem[]>(
    getContractorWorkers()
  );

  // Worker view navigation states
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [isStartingWork, setIsStartingWork] = useState<boolean>(false);
  const [isViewingProofs, setIsViewingProofs] = useState<boolean>(false);
  const [selectedProof, setSelectedProof] = useState<WorkProofRecord | null>(null);

  // Reset confirmation modal state
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Online / Offline tracking
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  const handleAuthComplete = (profile: UserProfile) => {
    saveProfile(profile);
    setUserProfile(profile);
    // Reload jobs
    setJobs(getAllJobs());
  };

  const handleJobJoined = (job: Job) => {
    if (!userProfile) return;
    const currentJoined = userProfile.joinedJobIds || [];
    if (!currentJoined.includes(job.id)) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        joinedJobIds: [job.id, ...currentJoined],
      };
      saveProfile(updatedProfile);
      setUserProfile(updatedProfile);
    }
  };

  const handleStartWorkSession = (session: ActiveSession) => {
    saveActiveSession(session);
    setActiveSessionState(session);
    setIsStartingWork(false);

    // Also update contractor demo workers to reflect working status on this device
    if (userProfile) {
      const currentWorkers = getContractorWorkers();
      const existingIdx = currentWorkers.findIndex((w) => w.name === userProfile.name);
      let updated: ContractorWorkerItem[];
      if (existingIdx >= 0) {
        updated = [...currentWorkers];
        updated[existingIdx] = {
          ...updated[existingIdx],
          isWorking: true,
          lastActiveSessionId: session.id,
        };
      } else {
        updated = [
          {
            id: `w-${Date.now()}`,
            name: userProfile.name,
            phone: userProfile.phone,
            isWorking: true,
            todayHours: '0h 01m',
            lastActiveSessionId: session.id,
          },
          ...currentWorkers,
        ];
      }
      localStorage.setItem('workproof_contractor_workers', JSON.stringify(updated));
      setContractorWorkers(updated);
    }
  };

  const handleUpdateActiveSession = (updated: ActiveSession) => {
    saveActiveSession(updated);
    setActiveSessionState(updated);
  };

  const handleSessionEnded = (proofRecord: WorkProofRecord) => {
    saveActiveSession(null);
    setActiveSessionState(null);
    const updatedProofs = saveWorkProof(proofRecord);
    setProofs(updatedProofs);
    setSelectedProof(proofRecord);

    // Update contractor worker item
    if (userProfile) {
      const currentWorkers = getContractorWorkers();
      const updated = currentWorkers.map((w) =>
        w.name === userProfile.name
          ? { ...w, isWorking: false, todayHours: proofRecord.formattedHours }
          : w
      );
      localStorage.setItem('workproof_contractor_workers', JSON.stringify(updated));
      setContractorWorkers(updated);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    const updated = saveJob(newJob);
    setJobs(updated);
  };

  const handleRemoveWorker = (workerId: string) => {
    const updated = removeContractorWorker(workerId);
    setContractorWorkers(updated);
  };

  const handleResetOrSwitchRole = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    triggerHaptic(40);
    clearProfile();
    setUserProfile(null);
    setActiveSessionState(null);
    setSelectedProof(null);
    setIsStartingWork(false);
    setIsViewingProofs(false);
    setIsJoinModalOpen(false);
    setShowResetConfirm(false);
  };

  const confirmResetEverything = () => {
    triggerHaptic(50);
    resetAllStorageToDefault();
    setUserProfile(null);
    setActiveSessionState(null);
    setSelectedProof(null);
    setJobs(getAllJobs());
    setProofs([]);
    setContractorWorkers(getContractorWorkers());
    setIsStartingWork(false);
    setIsViewingProofs(false);
    setIsJoinModalOpen(false);
    setShowResetConfirm(false);
  };

  // If user is not logged in, show 5-step Fake Login flow
  if (!userProfile) {
    return (
      <div className="bg-[#090a0f] min-h-screen text-white font-sans antialiased">
        <AuthFlow
          currentLang={lang}
          onLanguageChange={handleLanguageChange}
          onComplete={handleAuthComplete}
        />
      </div>
    );
  }

  // Filter joined jobs for worker
  const joinedJobs = jobs.filter((j) => (userProfile.joinedJobIds || []).includes(j.id));

  // Determine active job details if in session
  const activeJobDetails = activeSession?.jobId
    ? jobs.find((j) => j.id === activeSession.jobId)
    : undefined;

  return (
    <div className="bg-[#090a0f] min-h-screen text-white flex flex-col font-sans select-none antialiased">
      {/* Top Header */}
      <Header
        currentLang={lang}
        onLanguageChange={handleLanguageChange}
        userProfile={userProfile}
        onResetOrSwitch={handleResetOrSwitchRole}
      />

      {/* Offline Toast Banner if device loses internet */}
      {!isOnline && (
        <div className="bg-amber-600 text-black px-4 py-1.5 text-xs font-black flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode • Stored safely on this phone</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto pb-6">
        {/* WORKER VIEW */}
        {userProfile.role === 'worker' && (
          <>
            {/* If there is an active session, show the WORKING SCREEN */}
            {activeSession ? (
              <WorkingSession
                currentLang={lang}
                session={activeSession}
                workerName={userProfile.name}
                workerPhone={userProfile.phone}
                jobDetails={activeJobDetails}
                onUpdateSession={handleUpdateActiveSession}
                onSessionEnded={handleSessionEnded}
              />
            ) : selectedProof ? (
              /* PROOF SCREEN */
              <ProofCard
                currentLang={lang}
                proof={selectedProof}
                onBackHome={() => setSelectedProof(null)}
              />
            ) : isViewingProofs ? (
              /* MY PROOFS LIST */
              <MyProofs
                currentLang={lang}
                proofs={proofs}
                onSelectProof={(p) => setSelectedProof(p)}
                onBack={() => setIsViewingProofs(false)}
              />
            ) : (
              /* WORKER HOME */
              <WorkerHome
                currentLang={lang}
                workerName={userProfile.name}
                joinedJobs={joinedJobs}
                onOpenJoinModal={() => setIsJoinModalOpen(true)}
                onOpenProofs={() => setIsViewingProofs(true)}
                onStartWork={() => setIsStartingWork(true)}
              />
            )}

            {/* Join Job Modal */}
            <JoinJobModal
              currentLang={lang}
              isOpen={isJoinModalOpen}
              onClose={() => setIsJoinModalOpen(false)}
              onJobJoined={handleJobJoined}
            />

            {/* Start Work GPS & Photo Flow */}
            {isStartingWork && (
              <StartWorkFlow
                currentLang={lang}
                joinedJobs={joinedJobs}
                onCancel={() => setIsStartingWork(false)}
                onStarted={handleStartWorkSession}
              />
            )}
          </>
        )}

        {/* CONTRACTOR VIEW */}
        {userProfile.role === 'contractor' && (
          <ContractorHome
            currentLang={lang}
            contractorName={userProfile.name}
            jobs={jobs}
            workers={contractorWorkers}
            onJobCreated={handleJobCreated}
            onRemoveWorker={handleRemoveWorker}
          />
        )}
      </main>

      {/* Switch Role / Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-5">
          <div className="w-full max-w-sm rounded-[32px] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 p-6 text-white text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-300 shadow-md">
              <RotateCcw className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black">Switch Role or Reset</h3>
              <p className="text-sm text-zinc-400 mt-2">
                Currently logged in as <strong className="text-white">{userProfile.name}</strong> ({userProfile.role}).
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={confirmReset}
                className="w-full h-16 rounded-2xl bg-zinc-800 border border-white/10 text-white font-bold text-lg flex items-center justify-center active:scale-[0.98] hover:bg-zinc-700 cursor-pointer transition shadow-md"
              >
                Log Out / Switch Role
              </button>

              <button
                type="button"
                onClick={confirmResetEverything}
                className="w-full h-14 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 font-bold text-sm flex items-center justify-center active:scale-[0.98] hover:bg-red-900 cursor-pointer transition"
              >
                Reset All Demo Data (Fresh Start)
              </button>

              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="w-full h-12 rounded-xl text-zinc-400 font-bold text-base hover:text-white cursor-pointer active:scale-95 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
