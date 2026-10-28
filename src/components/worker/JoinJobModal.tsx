import React, { useState, useEffect } from 'react';
import { Job, Language } from '../../types';
import { translations } from '../../translations';
import { Keypad } from '../Keypad';
import {
  findJobByCode,
  getLockoutState,
  recordFailedJoinAttempt,
  resetJoinLockout,
  triggerHaptic,
} from '../../utils/storage';
import { X, Lock, Check, ShieldCheck, MapPin, HardHat } from 'lucide-react';

interface JoinJobModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  onJobJoined: (job: Job) => void;
}

export const JoinJobModal: React.FC<JoinJobModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  onJobJoined,
}) => {
  const [code, setCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [candidateJob, setCandidateJob] = useState<Job | null>(null);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  const t = translations[currentLang];

  // Check lockout
  useEffect(() => {
    if (!isOpen) return;

    const checkLock = () => {
      const state = getLockoutState();
      if (state.lockedUntilMs && state.lockedUntilMs > Date.now()) {
        const remaining = Math.ceil((state.lockedUntilMs - Date.now()) / 1000);
        setLockoutRemainingSeconds(remaining);
      } else {
        setLockoutRemainingSeconds(0);
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isLocked = lockoutRemainingSeconds > 0;

  const handleVerifyCode = () => {
    if (code.length !== 5 || isLocked) return;
    triggerHaptic(30);

    const job = findJobByCode(code);
    if (job) {
      setErrorMsg('');
      setCandidateJob(job);
      resetJoinLockout();
    } else {
      const newState = recordFailedJoinAttempt();
      if (newState.lockedUntilMs) {
        const rem = Math.ceil((newState.lockedUntilMs - Date.now()) / 1000);
        setLockoutRemainingSeconds(rem);
        setErrorMsg(`${t.lockoutWarning} ${Math.ceil(rem / 60)} ${t.minutesSuffix}`);
      } else {
        const remainingTries = 5 - newState.failedAttempts;
        setErrorMsg(`${t.jobNotFound} (${remainingTries} tries left)`);
      }
      triggerHaptic(70);
    }
  };

  const handleConfirmJoin = () => {
    if (!candidateJob) return;
    triggerHaptic(40);
    onJobJoined(candidateJob);
    onClose();
    setCandidateJob(null);
    setCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-[32px] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 p-5 text-white shadow-2xl my-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardHat className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black">{t.joinJobTitle}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onClose();
            }}
            className="p-2 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white cursor-pointer transition active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* If a candidate job was found, show confirmation card */}
        {candidateJob ? (
          <div className="py-5 space-y-5">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-emerald-500 shadow-[0_10px_35px_rgba(22,163,74,0.25)] space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Found Job • Code {candidateJob.code}</span>
              </div>

              <h3 className="text-3xl font-black text-white leading-tight">
                {candidateJob.name}
              </h3>

              <div className="text-lg text-zinc-300 font-bold">
                👷‍♂️ {t.contractorLabel}: <span className="text-white">{candidateJob.contractorName}</span>
              </div>

              {candidateJob.siteLocation && (
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold pt-1 border-t border-white/[0.06]">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{candidateJob.siteLocation.address || 'Geo-verified Site (150m)'}</span>
                </div>
              )}
            </div>

            {/* Action buttons: Green Join, Red Cancel */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleConfirmJoin}
                className="w-full min-h-[85px] rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-2xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(22,163,74,0.4)] active:scale-[0.98] cursor-pointer"
              >
                <span>{t.confirm}</span>
                <Check className="w-8 h-8 stroke-[3]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  setCandidateJob(null);
                  setCode('');
                }}
                className="w-full min-h-[65px] rounded-2xl bg-red-600/90 text-white font-black text-xl flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg"
              >
                <span>{t.cancel}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="text-center">
              <div className="text-lg font-bold text-zinc-300">{t.enter5DigitCode}</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">
                {t.demoCodesHint}
              </div>
            </div>

            {/* 5-digit Display */}
            <div className="p-4 rounded-3xl bg-zinc-950 border border-white/10 text-center shadow-inner">
              <div className="text-4xl font-mono font-black tracking-widest text-white">
                {code ? code.padEnd(5, '–') : '– – – – –'}
              </div>
            </div>

            {/* Error or lockout message */}
            {isLocked ? (
              <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-center font-bold text-sm flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-red-400 shrink-0" />
                <span>
                  {t.lockoutWarning} {Math.floor(lockoutRemainingSeconds / 60)}:
                  {(lockoutRemainingSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ) : (
              errorMsg && (
                <div className="text-center font-bold text-red-400 text-sm">
                  {errorMsg}
                </div>
              )
            )}

            {/* Big Keypad */}
            <div className="pt-2">
              <Keypad
                value={code}
                maxLength={5}
                onChange={(val) => {
                  if (isLocked) return;
                  setCode(val);
                  if (errorMsg) setErrorMsg('');
                  if (val.length === 5) {
                    const job = findJobByCode(val);
                    if (job) {
                      triggerHaptic(35);
                      setCandidateJob(job);
                      setErrorMsg('');
                    }
                  }
                }}
                onSubmit={handleVerifyCode}
                submitDisabled={code.length !== 5 || isLocked}
                submitLabel={t.confirm}
                submitColor="green"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
