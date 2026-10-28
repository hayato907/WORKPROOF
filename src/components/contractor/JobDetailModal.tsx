import React, { useState } from 'react';
import { Job, ContractorWorkerItem, Language } from '../../types';
import { translations } from '../../translations';
import { shareJobCodeOnWhatsApp } from '../../utils/share';
import { triggerHaptic } from '../../utils/storage';
import {
  X,
  Share2,
  Trash2,
  CheckCircle2,
  Clock,
  HardHat,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

interface JobDetailModalProps {
  currentLang: Language;
  isOpen: boolean;
  job: Job | null;
  workers: ContractorWorkerItem[];
  contractorName: string;
  onClose: () => void;
  onRemoveWorker: (workerId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  currentLang,
  isOpen,
  job,
  workers,
  contractorName,
  onClose,
  onRemoveWorker,
}) => {
  const [workerToRemove, setWorkerToRemove] = useState<ContractorWorkerItem | null>(null);

  const t = translations[currentLang];

  if (!isOpen || !job) return null;

  const handleShare = () => {
    triggerHaptic(30);
    shareJobCodeOnWhatsApp(job.name, contractorName, job.code, t.whatsappJobCodeText);
  };

  const handleConfirmRemove = () => {
    if (!workerToRemove) return;
    triggerHaptic(40);
    onRemoveWorker(workerToRemove.id);
    setWorkerToRemove(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-[32px] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 p-5 text-white shadow-2xl my-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardHat className="w-5 h-5" />
            </div>
            <span>{t.jobDetailTitle}</span>
          </h2>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onClose();
            }}
            className="p-2 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white cursor-pointer active:scale-95 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Job Info Banner with HUGE 5-Digit Code */}
        <div className="p-5 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              {t.codeLabel}
            </span>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold active:scale-95 cursor-pointer hover:bg-emerald-500/20 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Code</span>
            </button>
          </div>

          <div className="text-5xl font-mono font-black text-white tracking-widest">
            {job.code}
          </div>

          <div className="text-2xl font-black text-white leading-tight">
            {job.name}
          </div>

          {job.siteLocation && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-1.5 border-t border-white/[0.06]">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{job.siteLocation.address || 'Geo-site 150m'}</span>
            </div>
          )}
        </div>

        {/* Worker List Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
              {t.workersOnJob} ({workers.length})
            </span>
          </div>

          {workers.length === 0 ? (
            <div className="p-6 rounded-2xl bg-zinc-950 text-center text-zinc-500 font-bold text-sm">
              No workers active on this job right now.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
              {workers.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-zinc-950 to-zinc-900 border border-white/10 flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white truncate">
                        {w.name}
                      </span>

                      {/* Status Badge */}
                      {w.isWorking ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[11px] font-black shrink-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          {t.statusWorking}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[11px] font-bold shrink-0">
                          {t.statusNotWorking}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {t.todayHoursLabel}: <strong className="text-white">{w.todayHours}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Red Remove Button */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(25);
                      setWorkerToRemove(w);
                    }}
                    className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 hover:text-white hover:bg-red-900 active:scale-95 transition cursor-pointer shrink-0"
                    title="Remove Worker"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onClose();
            }}
            className="w-full h-14 rounded-2xl bg-zinc-900 border border-white/10 text-white font-bold text-lg active:scale-[0.98] hover:bg-zinc-800 transition cursor-pointer"
          >
            <span>{t.close}</span>
          </button>
        </div>

        {/* Confirmation Modal for Removing Worker */}
        {workerToRemove && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="w-full max-w-xs rounded-3xl bg-zinc-900 border-2 border-red-500 p-5 text-white text-center space-y-4 shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h4 className="text-xl font-black">{t.removeWorkerPrompt}</h4>
                <p className="text-base text-zinc-300 font-bold mt-1">
                  {workerToRemove.name}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmRemove}
                  className="w-full h-14 rounded-xl bg-red-600 text-white font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg"
                >
                  <span>{t.delete}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkerToRemove(null)}
                  className="w-full h-12 rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 font-bold text-base active:scale-[0.98] cursor-pointer"
                >
                  <span>{t.cancel}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
