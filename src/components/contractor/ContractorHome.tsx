import React, { useState } from 'react';
import { Job, Language, ContractorWorkerItem } from '../../types';
import { translations } from '../../translations';
import { CreateJobModal } from './CreateJobModal';
import { JobDetailModal } from './JobDetailModal';
import { triggerHaptic } from '../../utils/storage';
import {
  Plus,
  Briefcase,
  Users,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Share2,
} from 'lucide-react';

interface ContractorHomeProps {
  currentLang: Language;
  contractorName: string;
  jobs: Job[];
  workers: ContractorWorkerItem[];
  onJobCreated: (job: Job) => void;
  onRemoveWorker: (workerId: string) => void;
}

export const ContractorHome: React.FC<ContractorHomeProps> = ({
  currentLang,
  contractorName,
  jobs,
  workers,
  onJobCreated,
  onRemoveWorker,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const t = translations[currentLang];

  const workingCount = workers.filter((w) => w.isWorking).length;

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-md mx-auto p-4 select-none">
      <div className="space-y-4">
        {/* Contractor Summary Header */}
        <div className="p-5 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
              Contractor Dashboard
            </span>
            <h2 className="text-2xl font-black text-white mt-0.5">{contractorName}</h2>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-2xl shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-black text-emerald-400">
              {workingCount} {t.statusWorking}
            </span>
          </div>
        </div>

        {/* Jobs List Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
              {t.activeJobsList} ({jobs.length})
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center space-y-2 backdrop-blur-sm">
              <Briefcase className="w-12 h-12 mx-auto text-zinc-600" />
              <div className="text-lg font-bold text-zinc-300">{t.noContractorJobs}</div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(30);
                    setSelectedJob(job);
                  }}
                  className="w-full p-5 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 text-left active:scale-[0.98] hover:border-emerald-500/40 transition-all shadow-xl cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-black tracking-widest text-emerald-400 bg-zinc-950 px-3.5 py-1 rounded-xl border border-white/10 shadow-inner">
                      #{job.code}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      {workers.length} {t.workersCount}
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white leading-tight">
                    {job.name}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 font-bold pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{job.siteLocation?.address || 'Site 150m'}</span>
                    </div>
                    <span className="text-emerald-400 font-extrabold flex items-center gap-0.5 shrink-0">
                      View Workers <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GIANT GREEN CREATE JOB BUTTON */}
      <div className="pt-6 pb-2">
        <div className="relative">
          <div className="absolute -inset-1 rounded-[30px] bg-emerald-500/40 blur-lg" />
          <button
            type="button"
            onClick={() => {
              triggerHaptic(40);
              setIsCreateOpen(true);
            }}
            className="relative w-full min-h-[95px] rounded-[28px] bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 text-white font-black text-3xl flex items-center justify-center gap-3 shadow-[0_15px_45px_rgba(22,163,74,0.45)] active:scale-[0.98] transition cursor-pointer border-2 border-white/20"
          >
            <Plus className="w-9 h-9 stroke-[3]" />
            <span>{t.createJobBtn}</span>
          </button>
        </div>
      </div>

      {/* Create Job Modal */}
      <CreateJobModal
        currentLang={currentLang}
        isOpen={isCreateOpen}
        contractorName={contractorName}
        onClose={() => setIsCreateOpen(false)}
        onJobCreated={(job) => {
          onJobCreated(job);
        }}
      />

      {/* Job Detail Modal */}
      <JobDetailModal
        currentLang={currentLang}
        isOpen={!!selectedJob}
        job={selectedJob}
        workers={workers}
        contractorName={contractorName}
        onClose={() => setSelectedJob(null)}
        onRemoveWorker={onRemoveWorker}
      />
    </div>
  );
};
