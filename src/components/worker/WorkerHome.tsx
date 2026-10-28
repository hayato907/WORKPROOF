import React from 'react';
import { Job, Language } from '../../types';
import { translations } from '../../translations';
import { triggerHaptic } from '../../utils/storage';
import {
  Play,
  PlusCircle,
  FileText,
  HardHat,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface WorkerHomeProps {
  currentLang: Language;
  workerName: string;
  joinedJobs: Job[];
  onOpenJoinModal: () => void;
  onOpenProofs: () => void;
  onStartWork: () => void;
}

export const WorkerHome: React.FC<WorkerHomeProps> = ({
  currentLang,
  workerName,
  joinedJobs,
  onOpenJoinModal,
  onOpenProofs,
  onStartWork,
}) => {
  const t = translations[currentLang];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-md mx-auto p-4 select-none">
      {/* Top Greeting & Action Buttons */}
      <div className="space-y-4">
        {/* Quick Top Bar Buttons: Join Job & My Proofs */}
        <div className="grid grid-cols-2 gap-3">
          {/* Join Job Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(30);
              onOpenJoinModal();
            }}
            className="min-h-[75px] rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 text-white font-black text-xl flex items-center justify-center gap-2 active:scale-95 hover:border-emerald-500/40 transition-all shadow-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span>{t.joinJobBtn}</span>
          </button>

          {/* My Proofs Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(30);
              onOpenProofs();
            }}
            className="min-h-[75px] rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 text-white font-black text-xl flex items-center justify-center gap-2 active:scale-95 hover:border-amber-500/40 transition-all shadow-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span>{t.myProofsBtn}</span>
          </button>
        </div>

        {/* Joined Jobs Section */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-black tracking-wider text-zinc-400 uppercase">
              {t.myJobsTitle} ({joinedJobs.length})
            </span>
            {joinedJobs.length === 0 && (
              <span className="text-xs text-emerald-400 font-bold">
                {t.noJobDirectStart}
              </span>
            )}
          </div>

          {joinedJobs.length === 0 ? (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center space-y-2 backdrop-blur-sm">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-500">
                <HardHat className="w-7 h-7" />
              </div>
              <div className="text-lg font-bold text-zinc-300">{t.noJobsYet}</div>
              <p className="text-xs text-zinc-400 font-medium">
                Tap &ldquo;{t.joinJobBtn}&rdquo; with code 12345 or press START below to begin general work.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[36vh] overflow-y-auto pr-1">
              {joinedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4.5 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 hover:border-white/20 shadow-xl space-y-2.5 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-zinc-950 border border-white/10 text-emerald-400 shadow-inner">
                      #{job.code}
                    </span>
                    <span className="text-xs text-zinc-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active Job
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white leading-tight">
                    {job.name}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 font-bold pt-2 border-t border-white/[0.06]">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      👷‍♂️ {job.contractorName}
                    </span>
                    {job.siteLocation && (
                      <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        150m GPS
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GIANT PULSING GREEN START WORK BUTTON */}
      <div className="pt-6 pb-2">
        <div className="relative">
          {/* Modern ambient green aura */}
          <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-emerald-500 to-green-600 opacity-60 blur-xl animate-pulse" />

          <button
            type="button"
            onClick={() => {
              triggerHaptic(50);
              onStartWork();
            }}
            className="relative w-full min-h-[110px] rounded-[30px] bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 text-white font-black text-3xl sm:text-4xl flex items-center justify-center gap-4 shadow-[0_15px_45px_rgba(22,163,74,0.5)] active:scale-[0.98] transition-all cursor-pointer border-2 border-white/25 hover:brightness-105"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <Play className="w-9 h-9 fill-white text-white translate-x-0.5" />
            </div>
            <span className="tracking-wide uppercase drop-shadow-md">
              {t.startWorkBtn}
            </span>
          </button>
        </div>

        <div className="text-center text-xs font-bold text-zinc-400 mt-3 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>One tap punch-in • Records GPS & Time</span>
        </div>
      </div>
    </div>
  );
};
