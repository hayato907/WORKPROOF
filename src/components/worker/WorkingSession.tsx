import React, { useState, useEffect, useRef } from 'react';
import { ActiveSession, WorkProofRecord, Language, Job } from '../../types';
import { translations } from '../../translations';
import {
  getCurrentDevicePosition,
  calculateHaversineDistance,
  reverseGeocodeCoords,
} from '../../utils/geo';
import { compressImageFile } from '../../utils/image';
import { triggerHaptic } from '../../utils/storage';
import {
  Clock,
  Camera,
  AlertTriangle,
  StopCircle,
  MapPin,
  CheckCircle2,
  HardHat,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface WorkingSessionProps {
  currentLang: Language;
  session: ActiveSession;
  workerName: string;
  workerPhone: string;
  jobDetails?: Job;
  onUpdateSession: (updated: ActiveSession) => void;
  onSessionEnded: (proof: WorkProofRecord) => void;
}

export const WorkingSession: React.FC<WorkingSessionProps> = ({
  currentLang,
  session,
  workerName,
  workerPhone,
  jobDetails,
  onUpdateSession,
  onSessionEnded,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showConfirmEnd, setShowConfirmEnd] = useState<boolean>(false);
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[currentLang];

  // Timer interval recomputed accurately from session.startTimeISO
  useEffect(() => {
    const updateTimer = () => {
      const startMs = new Date(session.startTimeISO).getTime();
      const nowMs = Date.now();
      const diffSecs = Math.max(0, Math.floor((nowMs - startMs) / 1000));
      setElapsedSeconds(diffSecs);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session.startTimeISO]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatStartTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const isTwelveHoursPlus = elapsedSeconds >= 12 * 3600;

  // Photo capture in active session
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      triggerHaptic(30);
      const compressed = await compressImageFile(file, 800, 0.7);
      const updated = { ...session, photoBase64: compressed };
      onUpdateSession(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndWork = async () => {
    triggerHaptic(50);
    setIsEnding(true);

    let endLat: number | null = null;
    let endLng: number | null = null;
    let endAddr = '';
    let endWithinSite: boolean | null = null;

    try {
      const pos = await getCurrentDevicePosition();
      endLat = pos.latitude;
      endLng = pos.longitude;
      endAddr = await reverseGeocodeCoords(pos.latitude, pos.longitude);

      if (jobDetails?.siteLocation) {
        const dist = calculateHaversineDistance(
          pos.latitude,
          pos.longitude,
          jobDetails.siteLocation.latitude,
          jobDetails.siteLocation.longitude
        );
        const radius = jobDetails.siteLocation.radiusMeters || 150;
        endWithinSite = dist <= radius;
      }
    } catch {
      // Fallback
    }

    const startMs = new Date(session.startTimeISO).getTime();
    const nowMs = Date.now();
    const totalDurationSeconds = Math.max(1, Math.floor((nowMs - startMs) / 1000));

    const totalHoursFloat = Number((totalDurationSeconds / 3600).toFixed(2));
    const h = Math.floor(totalDurationSeconds / 3600);
    const m = Math.floor((totalDurationSeconds % 3600) / 60);
    const formattedHours = h > 0 ? `${h} hrs ${m} mins` : `${m} mins`;

    const now = new Date();
    const dateISO = now.toISOString().split('T')[0];

    const proof: WorkProofRecord = {
      id: `proof-${Date.now()}`,
      workerName,
      workerPhone,
      jobId: session.jobId,
      jobName: session.jobName,
      contractorName: session.contractorName,
      dateISO,
      startTimeISO: session.startTimeISO,
      endTimeISO: now.toISOString(),
      totalDurationSeconds,
      formattedHours,
      decimalHours: totalHoursFloat,
      startLatitude: session.startLatitude,
      startLongitude: session.startLongitude,
      startAddress: session.startAddress,
      startWithinSite: session.startWithinSite,
      endLatitude: endLat,
      endLongitude: endLng,
      endAddress: endAddr,
      endWithinSite,
      photoBase64: session.photoBase64,
    };

    setIsEnding(false);
    onSessionEnded(proof);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-md mx-auto p-4 select-none relative">
      {/* Hidden camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Top Status Header */}
      <div className="space-y-3.5">
        {/* Pulsing Live Banner */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-white shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="font-black text-base tracking-wide uppercase text-emerald-400">
              {t.workInProgress}
            </span>
          </div>
          <span className="text-xs font-bold text-zinc-300">
            {t.startedAt} {formatStartTime(session.startTimeISO)}
          </span>
        </div>

        {/* 12+ Hour Warning Alert */}
        {isTwelveHoursPlus && (
          <div className="p-4 rounded-3xl bg-amber-950/80 border-2 border-amber-500 text-amber-200 shadow-xl flex items-start gap-3 animate-pulse">
            <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-base font-black leading-tight">
              {t.alert12Hours}
            </div>
          </div>
        )}

        {/* Job info card */}
        <div className="p-4.5 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 shadow-xl space-y-1.5">
          <div className="text-[11px] uppercase font-black tracking-wider text-emerald-400">
            Active Job Session
          </div>
          <div className="text-2xl font-black text-white leading-tight">
            {session.jobName}
          </div>
          <div className="text-sm font-bold text-zinc-400">
            👷‍♂️ {t.contractorLabel}: <span className="text-white">{session.contractorName}</span>
          </div>
          {session.startAddress && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-1 border-t border-white/[0.06]">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{session.startAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* GIANT RUNNING DIGITAL STOPWATCH */}
      <div className="my-auto py-5 text-center space-y-4">
        <div className="text-xs uppercase font-black tracking-widest text-zinc-400">
          HOURS : MINUTES : SECONDS
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-950 to-black border-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle ambient green glow behind timer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-20 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)] relative z-10 tabular-nums">
            {formatTimer(elapsedSeconds)}
          </div>
        </div>

        {/* Photo Thumbnail or Add Photo Button */}
        <div className="pt-2">
          {session.photoBase64 ? (
            <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-2xl bg-zinc-900/80 border border-white/10 shadow-md">
              <img
                src={session.photoBase64}
                alt="Site"
                className="w-14 h-14 rounded-xl object-cover border border-emerald-500"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-emerald-400 block">Photo Attached ✓</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-zinc-400 hover:text-white underline font-semibold cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(20);
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900/90 border border-white/10 text-white font-bold text-base hover:bg-zinc-800 active:scale-95 transition cursor-pointer shadow-lg"
            >
              <Camera className="w-5 h-5 text-amber-400" />
              <span>{t.addPhoto}</span>
            </button>
          )}
        </div>
      </div>

      {/* GIANT RED END WORK BUTTON */}
      <div className="pt-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-[30px] bg-red-600/40 blur-lg" />
          <button
            type="button"
            onClick={() => {
              triggerHaptic(40);
              setShowConfirmEnd(true);
            }}
            className="relative w-full min-h-[95px] rounded-[28px] bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-black text-3xl flex items-center justify-center gap-4 shadow-[0_15px_45px_rgba(220,38,38,0.45)] active:scale-[0.98] transition cursor-pointer border-2 border-white/20"
          >
            <StopCircle className="w-10 h-10 stroke-[2.5]" />
            <span>{t.endWorkBtn}</span>
          </button>
        </div>
      </div>

      {/* Confirm End Modal */}
      {showConfirmEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-5">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border-2 border-red-500/60 p-6 text-white text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-lg">
              <StopCircle className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-3xl font-black">{t.confirmEndTitle}</h3>
              <p className="text-base text-zinc-400 mt-2">
                Total time: <span className="text-white font-bold">{formatTimer(elapsedSeconds)}</span>
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleEndWork}
                disabled={isEnding}
                className="w-full min-h-[85px] rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-2xl flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer shadow-[0_10px_30px_rgba(220,38,38,0.4)]"
              >
                {isEnding ? (
                  <span>Recording GPS...</span>
                ) : (
                  <>
                    <span>{t.yesEnd}</span>
                    <XCircle className="w-7 h-7" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  setShowConfirmEnd(false);
                }}
                disabled={isEnding}
                className="w-full min-h-[70px] rounded-2xl bg-zinc-800 border border-white/10 text-white font-black text-xl flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <span>{t.noKeep}</span>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
