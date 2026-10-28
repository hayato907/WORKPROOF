import React from 'react';
import { WorkProofRecord, Language } from '../../types';
import { translations } from '../../translations';
import { triggerHaptic } from '../../utils/storage';
import { FileText, ArrowLeft, Clock, Calendar, CheckCircle2, XCircle, Share2, ChevronRight } from 'lucide-react';

interface MyProofsProps {
  currentLang: Language;
  proofs: WorkProofRecord[];
  onSelectProof: (proof: WorkProofRecord) => void;
  onBack: () => void;
}

export const MyProofs: React.FC<MyProofsProps> = ({
  currentLang,
  proofs,
  onSelectProof,
  onBack,
}) => {
  const t = translations[currentLang];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-md mx-auto p-4 select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-4">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onBack();
            }}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xl cursor-pointer transition"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t.back}</span>
          </button>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>{t.pastProofsTitle}</span>
          </h2>
        </div>

        {/* Proof List */}
        {proofs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600 shadow-xl">
              <FileText className="w-10 h-10" />
            </div>
            <div className="text-2xl font-bold text-zinc-300">{t.noPastProofs}</div>
            <p className="text-sm text-zinc-500">
              When you complete a work session, verified proofs will show here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {proofs.map((proof) => (
              <button
                key={proof.id}
                type="button"
                onClick={() => {
                  triggerHaptic(30);
                  onSelectProof(proof);
                }}
                className="w-full p-4.5 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 text-left active:scale-[0.98] hover:border-emerald-500/40 transition-all shadow-xl cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-zinc-950 border border-white/10 text-zinc-300">
                      {proof.dateISO}
                    </span>
                    {proof.startWithinSite === true ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Site Verified
                      </span>
                    ) : proof.startWithinSite === false ? (
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Outside Site
                      </span>
                    ) : null}
                  </div>

                  <div className="text-xl font-black text-white truncate">
                    {proof.jobName}
                  </div>

                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                    <span className="text-emerald-400 text-lg font-black tracking-tight">
                      ⏱️ {proof.formattedHours}
                    </span>
                    <span>•</span>
                    <span className="truncate">👷‍♂️ {proof.contractorName}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-zinc-400">
                  <span className="text-xs font-bold text-emerald-400 hidden sm:inline">View</span>
                  <ChevronRight className="w-6 h-6 text-zinc-500" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20);
            onBack();
          }}
          className="w-full h-16 rounded-2xl bg-zinc-900 border border-white/10 text-white font-bold text-xl flex items-center justify-center cursor-pointer active:scale-[0.98] hover:bg-zinc-800 transition"
        >
          <span>{t.backToHome}</span>
        </button>
      </div>
    </div>
  );
};
