import React, { useState } from 'react';
import { Job, Language } from '../../types';
import { translations } from '../../translations';
import { getCurrentDevicePosition, reverseGeocodeCoords, DevicePosition } from '../../utils/geo';
import { shareJobCodeOnWhatsApp } from '../../utils/share';
import { triggerHaptic } from '../../utils/storage';
import {
  X,
  MapPin,
  Share2,
  CheckCircle2,
  PlusCircle,
  Copy,
  Check,
  Navigation,
} from 'lucide-react';

interface CreateJobModalProps {
  currentLang: Language;
  isOpen: boolean;
  contractorName: string;
  onClose: () => void;
  onJobCreated: (job: Job) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  currentLang,
  isOpen,
  contractorName,
  onClose,
  onJobCreated,
}) => {
  const [jobName, setJobName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [sitePosition, setSitePosition] = useState<DevicePosition | null>(null);
  const [siteAddress, setSiteAddress] = useState<string>('');
  const [isGettingGps, setIsGettingGps] = useState<boolean>(false);
  const [createdJob, setCreatedJob] = useState<Job | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const t = translations[currentLang];

  if (!isOpen) return null;

  const handleCaptureGps = async () => {
    triggerHaptic(25);
    setIsGettingGps(true);
    try {
      const pos = await getCurrentDevicePosition();
      setSitePosition(pos);
      const addr = await reverseGeocodeCoords(pos.latitude, pos.longitude);
      setSiteAddress(addr);
      triggerHaptic(40);
    } catch (err) {
      console.error(err);
      alert('Could not get GPS. Please enable location permissions.');
    } finally {
      setIsGettingGps(false);
    }
  };

  const handleCreate = () => {
    triggerHaptic(40);
    const trimmed = jobName.trim();
    if (!trimmed) {
      setNameError('Please enter a job name');
      return;
    }

    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();

    const newJob: Job = {
      id: `job-${randomCode}`,
      code: randomCode,
      name: trimmed,
      contractorName: contractorName || 'Contractor',
      siteLocation: sitePosition
        ? {
            latitude: sitePosition.latitude,
            longitude: sitePosition.longitude,
            address: siteAddress || `GPS: ${sitePosition.latitude.toFixed(5)}, ${sitePosition.longitude.toFixed(5)}`,
            radiusMeters: 150,
          }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    onJobCreated(newJob);
    setCreatedJob(newJob);
  };

  const handleShareOnWhatsApp = () => {
    if (!createdJob) return;
    triggerHaptic(30);
    shareJobCodeOnWhatsApp(
      createdJob.name,
      contractorName,
      createdJob.code,
      t.whatsappJobCodeText
    );
  };

  const handleCopyCode = () => {
    if (!createdJob) return;
    triggerHaptic(20);
    navigator.clipboard?.writeText(createdJob.code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-[32px] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 p-5 text-white shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span>{t.createJobTitle}</span>
          </h2>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onClose();
              setCreatedJob(null);
              setJobName('');
            }}
            className="p-2 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white cursor-pointer active:scale-95 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* If Job was created, show HUGE code and WhatsApp button */}
        {createdJob ? (
          <div className="py-5 space-y-5 text-center">
            <div className="p-6 rounded-3xl bg-zinc-950 border-2 border-emerald-500 shadow-[0_10px_35px_rgba(22,163,74,0.3)] space-y-3 relative overflow-hidden">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                {t.generatedCodeTitle}
              </div>

              {/* HUGE 5 DIGITS */}
              <div className="text-6xl font-mono font-black tracking-widest text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)]">
                {createdJob.code}
              </div>

              <div className="text-xl font-black text-zinc-200 pt-1">
                {createdJob.name}
              </div>

              {createdJob.siteLocation && (
                <div className="text-xs text-zinc-400 flex items-center justify-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Site GPS set (150m)</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {/* Copy Code Button */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full py-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-300 font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer hover:bg-zinc-800 transition"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Copied Code: {createdJob.code}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy 5-Digit Code</span>
                  </>
                )}
              </button>

              {/* Giant Green Share Code on WhatsApp */}
              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="w-full min-h-[90px] rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-2xl flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(22,163,74,0.4)] active:scale-[0.98] transition cursor-pointer border border-white/20"
              >
                <Share2 className="w-8 h-8 stroke-[2.5]" />
                <span>{t.shareCodeOnWhatsApp}</span>
              </button>

              {/* Done button */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  onClose();
                  setCreatedJob(null);
                  setJobName('');
                }}
                className="w-full h-14 rounded-2xl bg-zinc-900 border border-white/10 text-white font-bold text-lg active:scale-[0.98] cursor-pointer hover:bg-zinc-800"
              >
                <span>{t.done}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-5">
            {/* Job Name Input */}
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">
                {t.jobNameLabel}
              </label>
              <input
                type="text"
                value={jobName}
                onChange={(e) => {
                  setJobName(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder={t.jobNamePlaceholder}
                className="w-full h-16 px-5 rounded-2xl bg-zinc-950 border border-white/10 text-2xl font-bold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 shadow-inner transition"
              />
              {nameError && (
                <p className="text-red-400 text-sm font-bold mt-1.5">{nameError}</p>
              )}
            </div>

            {/* Set Site Here (GPS) Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
                <span>{t.siteRadiusInfo}</span>
                {sitePosition && <span className="text-emerald-400 font-bold">✓ Location Set</span>}
              </div>

              <button
                type="button"
                onClick={handleCaptureGps}
                disabled={isGettingGps}
                className={`w-full min-h-[70px] rounded-2xl border font-bold text-lg flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98] ${
                  sitePosition
                    ? 'bg-zinc-900/90 border-emerald-500 text-emerald-400 shadow-md'
                    : 'bg-zinc-900 border-white/10 text-white hover:bg-zinc-800'
                }`}
              >
                {isGettingGps ? (
                  <span>Fetching GPS...</span>
                ) : (
                  <>
                    <Navigation className="w-5 h-5 text-emerald-400" />
                    <span>{sitePosition ? t.siteLocationSaved : t.setSiteLocationBtn}</span>
                  </>
                )}
              </button>

              {siteAddress && (
                <div className="text-xs text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{siteAddress}</span>
                </div>
              )}
            </div>

            {/* Giant Green Create Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleCreate}
                className="w-full min-h-[90px] rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-3xl flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(22,163,74,0.45)] active:scale-[0.98] transition cursor-pointer border border-white/20"
              >
                <span>{t.confirm}</span>
                <Check className="w-8 h-8 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
