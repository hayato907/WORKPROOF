import React, { useRef, useState } from 'react';
import { WorkProofRecord, Language } from '../../types';
import { translations } from '../../translations';
import { shareWorkProof } from '../../utils/share';
import { getGoogleMapsUrl } from '../../utils/geo';
import { triggerHaptic } from '../../utils/storage';
import {
  Share2,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Check,
  Award,
} from 'lucide-react';

interface ProofCardProps {
  currentLang: Language;
  proof: WorkProofRecord;
  onBackHome: () => void;
}

export const ProofCard: React.FC<ProofCardProps> = ({
  currentLang,
  proof,
  onBackHome,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const t = translations[currentLang];

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const mapsUrl = getGoogleMapsUrl(proof.endLatitude || proof.startLatitude, proof.endLongitude || proof.startLongitude);

  const siteStatusText =
    proof.endWithinSite === true || proof.startWithinSite === true
      ? '✓ At Work Site'
      : proof.endWithinSite === false || proof.startWithinSite === false
      ? '✗ Outside Work Site'
      : '✓ Location Recorded';

  const handleShare = async () => {
    triggerHaptic(40);
    setIsSharing(true);
    const summaryText = t.whatsappProofText(
      proof.workerName,
      proof.jobName,
      proof.dateISO,
      formatTime(proof.startTimeISO),
      formatTime(proof.endTimeISO),
      proof.formattedHours,
      siteStatusText,
      mapsUrl || 'GPS Recorded'
    );

    try {
      await shareWorkProof(cardRef.current, summaryText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-md mx-auto p-4 select-none">
      <div>
        {/* Saved confirmation toast */}
        <div className="mb-3 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 text-center shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.proofSavedLocal}</span>
        </div>

        {/* PROOF CARD (Target of html-to-image and printable share) */}
        <div
          ref={cardRef}
          className="rounded-[28px] bg-white text-zinc-950 border-3 border-zinc-900 p-6 shadow-2xl space-y-4 relative overflow-hidden"
        >
          {/* Subtle decorative top accent line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500" />

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-zinc-950 uppercase block leading-none">
                  {t.proofTitle}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Verified Digital Punch-In
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-300">
              #{proof.id.slice(-6)}
            </span>
          </div>

          {/* Worker & Job Name */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              {t.workerLabel}
            </div>
            <div className="text-3xl font-black text-zinc-950 tracking-tight">
              {proof.workerName}
            </div>
            <div className="text-base font-bold text-zinc-700 flex items-center gap-1.5">
              <span>🏗️ {proof.jobName}</span>
            </div>
          </div>

          {/* TOTAL HOURS (HUGE & BOLD) */}
          <div className="p-4.5 rounded-2xl bg-zinc-50 border-2 border-zinc-900 text-center shadow-sm">
            <div className="text-xs uppercase font-extrabold tracking-widest text-zinc-500 mb-0.5">
              {t.totalHoursLabel}
            </div>
            <div className="text-5xl font-black tracking-tight text-[#16A34A]">
              {proof.formattedHours}
            </div>
            <div className="text-xs font-bold text-zinc-500 mt-1">
              ({proof.decimalHours} hrs decimal duration)
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-3 gap-2 text-center bg-zinc-100/80 p-3 rounded-2xl border border-zinc-200">
            <div>
              <div className="text-[10px] font-extrabold text-zinc-500 uppercase">{t.dateLabel}</div>
              <div className="text-sm font-black text-zinc-900 mt-0.5">{proof.dateISO}</div>
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-zinc-500 uppercase">{t.startTimeLabel}</div>
              <div className="text-sm font-black text-zinc-900 mt-0.5">{formatTime(proof.startTimeISO)}</div>
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-zinc-500 uppercase">{t.endTimeLabel}</div>
              <div className="text-sm font-black text-zinc-900 mt-0.5">{formatTime(proof.endTimeISO)}</div>
            </div>
          </div>

          {/* Site Status: Tick or Cross */}
          <div className="flex items-center justify-between p-3 rounded-2xl border-2 font-bold text-sm bg-zinc-50">
            <span className="text-zinc-600 font-extrabold">{t.siteStatusLabel}:</span>
            {proof.endWithinSite === true || proof.startWithinSite === true ? (
              <span className="text-[#16A34A] flex items-center gap-1.5 font-black">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                {t.verifiedOnSite}
              </span>
            ) : proof.endWithinSite === false || proof.startWithinSite === false ? (
              <span className="text-[#DC2626] flex items-center gap-1.5 font-black">
                <XCircle className="w-5 h-5 text-[#DC2626]" />
                {t.outsideSite}
              </span>
            ) : (
              <span className="text-zinc-700 flex items-center gap-1.5 font-black">
                <Check className="w-5 h-5 text-zinc-700" />
                {t.generalLocation}
              </span>
            )}
          </div>

          {/* Location text + Map */}
          {(proof.endAddress || proof.startAddress) && (
            <div className="text-xs text-zinc-600 flex items-start gap-1.5 pt-0.5">
              <MapPin className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
              <span className="leading-tight font-medium">
                {proof.endAddress || proof.startAddress}
              </span>
            </div>
          )}

          {/* Attached Site Photo */}
          {proof.photoBase64 && (
            <div className="rounded-2xl overflow-hidden border border-zinc-300 shadow-sm">
              <img
                src={proof.photoBase64}
                alt="Work Site"
                className="w-full h-44 object-cover"
              />
            </div>
          )}

          {/* Google Maps link preview */}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline pt-0.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.viewOnMaps}</span>
            </a>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-5">
        {/* GIANT GREEN WHATSAPP SHARE BUTTON */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-[30px] bg-emerald-500/40 blur-lg" />
          <button
            type="button"
            onClick={handleShare}
            disabled={isSharing}
            className="relative w-full min-h-[90px] rounded-[28px] bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 text-white font-black text-2xl flex items-center justify-center gap-3 shadow-[0_15px_45px_rgba(22,163,74,0.45)] active:scale-[0.98] transition cursor-pointer border-2 border-white/25"
          >
            <Share2 className="w-8 h-8 stroke-[2.5]" />
            <span>{isSharing ? 'Sharing...' : t.shareOnWhatsApp}</span>
          </button>
        </div>

        {/* Back to Home Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20);
            onBackHome();
          }}
          className="w-full min-h-[65px] rounded-2xl bg-zinc-900 border border-white/10 text-white font-bold text-xl flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-zinc-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>{t.backToHome}</span>
        </button>
      </div>
    </div>
  );
};
