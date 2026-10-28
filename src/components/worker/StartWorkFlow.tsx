import React, { useState, useEffect, useRef } from 'react';
import { Job, Language, ActiveSession } from '../../types';
import { translations } from '../../translations';
import {
  getCurrentDevicePosition,
  calculateHaversineDistance,
  reverseGeocodeCoords,
  getGoogleMapsUrl,
  DevicePosition,
} from '../../utils/geo';
import { compressImageFile } from '../../utils/image';
import { triggerHaptic } from '../../utils/storage';
import {
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  HardHat,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface StartWorkFlowProps {
  currentLang: Language;
  joinedJobs: Job[];
  onCancel: () => void;
  onStarted: (session: ActiveSession) => void;
}

type Step = 'choose-job' | 'locating' | 'geofence-alert' | 'photo-prompt';

export const StartWorkFlow: React.FC<StartWorkFlowProps> = ({
  currentLang,
  joinedJobs,
  onCancel,
  onStarted,
}) => {
  const [step, setStep] = useState<Step>(
    joinedJobs.length >= 2 ? 'choose-job' : 'locating'
  );

  const [selectedJob, setSelectedJob] = useState<Job | null>(
    joinedJobs.length === 1 ? joinedJobs[0] : null
  );

  const [position, setPosition] = useState<DevicePosition | null>(null);
  const [addressText, setAddressText] = useState<string>('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Geofence states
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [startWithinSite, setStartWithinSite] = useState<boolean | null>(null);

  // Photo states
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[currentLang];

  useEffect(() => {
    if (step === 'locating') {
      fetchLocation();
    }
  }, [step]);

  const fetchLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const pos = await getCurrentDevicePosition();
      setPosition(pos);

      const addr = await reverseGeocodeCoords(pos.latitude, pos.longitude);
      setAddressText(addr);

      if (selectedJob?.siteLocation) {
        const dist = calculateHaversineDistance(
          pos.latitude,
          pos.longitude,
          selectedJob.siteLocation.latitude,
          selectedJob.siteLocation.longitude
        );
        setDistanceMeters(dist);

        const radius = selectedJob.siteLocation.radiusMeters || 150;
        if (dist > radius) {
          setStartWithinSite(false);
          setStep('geofence-alert');
          setIsLocating(false);
          return;
        } else {
          setStartWithinSite(true);
        }
      } else {
        setStartWithinSite(null);
      }

      setStep('photo-prompt');
    } catch (err: unknown) {
      console.error(err);
      setLocationError(t.locationDeniedDesc);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectJob = (job: Job | null) => {
    triggerHaptic(30);
    setSelectedJob(job);
    setStep('locating');
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingPhoto(true);
      triggerHaptic(30);
      const compressed = await compressImageFile(file, 800, 0.7);
      setPhotoBase64(compressed);
    } catch (err) {
      console.error('Failed to compress photo', err);
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  const finalizeSession = (photo?: string) => {
    triggerHaptic(50);
    const session: ActiveSession = {
      id: `session-${Date.now()}`,
      jobId: selectedJob ? selectedJob.id : null,
      jobName: selectedJob ? selectedJob.name : t.noJobOption,
      contractorName: selectedJob ? selectedJob.contractorName : 'Self / General',
      startTimeISO: new Date().toISOString(),
      startLatitude: position ? position.latitude : null,
      startLongitude: position ? position.longitude : null,
      startAddress: addressText || (position ? `GPS: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}` : ''),
      startWithinSite: startWithinSite,
      photoBase64: photo || photoBase64,
    };
    onStarted(session);
  };

  // STEP 1: If 2+ jobs, user picks the job or "No Job"
  if (step === 'choose-job') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
        <div className="w-full max-w-md my-auto space-y-4">
          <div className="text-center pb-2">
            <h2 className="text-3xl font-black text-white">{t.chooseJobToStart}</h2>
            <p className="text-sm text-zinc-400 mt-1">Tap one job card to start work</p>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {joinedJobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => handleSelectJob(job)}
                className="w-full min-h-[95px] p-5 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 text-left active:border-emerald-500 active:scale-[0.98] transition-all shadow-xl cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-white leading-tight">
                    {job.name}
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 bg-zinc-950 rounded-lg text-emerald-400 border border-white/10">
                    #{job.code}
                  </span>
                </div>
                <div className="text-base font-bold text-zinc-400 mt-1">
                  👷‍♂️ {job.contractorName}
                </div>
              </button>
            ))}

            {/* No Job card option */}
            <button
              type="button"
              onClick={() => handleSelectJob(null)}
              className="w-full min-h-[90px] p-5 rounded-3xl bg-zinc-900/60 border border-white/10 text-left active:border-zinc-500 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
            >
              <div className="text-2xl font-black text-zinc-300">
                {t.noJobOption}
              </div>
              <div className="text-xs text-zinc-500 mt-1 font-bold">
                Direct punch-in without job site
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onCancel();
            }}
            className="w-full h-16 rounded-2xl bg-zinc-900 border border-white/10 text-white font-black text-xl flex items-center justify-center cursor-pointer shadow-lg active:scale-[0.98] hover:bg-zinc-800 transition"
          >
            <span>{t.cancel}</span>
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Locating & Location Denied Handling
  if (step === 'locating') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-5">
        <div className="w-full max-w-md my-auto text-center space-y-6">
          {locationError ? (
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-red-950/80 border-2 border-red-500/60 flex items-center justify-center text-red-500 shadow-xl">
                <XCircle className="w-14 h-14" />
              </div>

              <div>
                <h3 className="text-3xl font-black text-white">{t.locationDenied}</h3>
                <p className="text-lg text-zinc-300 mt-2 px-2">{locationError}</p>
              </div>

              <div className="space-y-3.5 pt-4">
                <button
                  type="button"
                  onClick={fetchLocation}
                  className="w-full min-h-[90px] rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-2xl flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer shadow-[0_10px_35px_rgba(22,163,74,0.4)]"
                >
                  <RefreshCw className="w-8 h-8" />
                  <span>{t.retry}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    onCancel();
                  }}
                  className="w-full h-16 rounded-2xl bg-zinc-900 border border-white/10 text-white font-black text-xl flex items-center justify-center cursor-pointer hover:bg-zinc-800"
                >
                  <span>{t.cancel}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(22,163,74,0.35)] relative z-10">
                  <MapPin className="w-12 h-12" />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white">{t.findingLocation}</h3>
                <p className="text-sm text-zinc-400 mt-2">Checking GPS coordinates</p>
              </div>

              <div className="w-full max-w-xs mx-auto bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-full w-2/3 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP 3: Outside Geofence Warning Screen (High Contrast Red Warning)
  if (step === 'geofence-alert') {
    const mapsLink = position ? getGoogleMapsUrl(position.latitude, position.longitude) : '';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-5 overflow-y-auto">
        <div className="w-full max-w-md my-auto space-y-6 text-center">
          {/* Red Alert Card */}
          <div className="p-6 rounded-[32px] bg-gradient-to-b from-red-950/90 to-zinc-950 border-2 border-red-500 shadow-2xl space-y-4 text-white">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 shadow-lg">
              <AlertTriangle className="w-11 h-11 stroke-[2.5]" />
            </div>

            <h2 className="text-3xl font-black leading-tight text-white">
              {t.outsideSiteWarning}
            </h2>

            <div className="bg-black/60 p-4.5 rounded-2xl border border-red-500/30 text-left space-y-2">
              <div className="text-sm text-zinc-300 font-bold">
                🏗️ Job: <span className="text-white">{selectedJob?.name}</span>
              </div>
              {distanceMeters != null && (
                <div className="text-base text-amber-300 font-black">
                  📏 {t.distanceAway}: ~{distanceMeters} meters away (Allowed: 150m)
                </div>
              )}
              {position && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-bold underline pt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View current GPS on Map
                </a>
              )}
            </div>
          </div>

          {/* Action buttons: Green Start Anyway, Red Cancel */}
          <div className="space-y-3.5 pt-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(30);
                setStartWithinSite(false);
                setStep('photo-prompt');
              }}
              className="w-full min-h-[90px] rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-2xl flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(22,163,74,0.4)] active:scale-[0.98] cursor-pointer"
            >
              <span>{t.startAnyway}</span>
              <CheckCircle2 className="w-8 h-8" />
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(20);
                onCancel();
              }}
              className="w-full min-h-[75px] rounded-3xl bg-red-600/90 text-white font-black text-2xl flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer shadow-lg"
            >
              <span>{t.cancel}</span>
              <XCircle className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 4: Optional Site Photo Prompt
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-5 overflow-y-auto">
      <div className="w-full max-w-md my-auto space-y-6 text-center">
        <div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-bold text-zinc-300 mb-3 shadow-md">
            {startWithinSite === true && <span className="text-emerald-400">✓ At site</span>}
            {startWithinSite === false && <span className="text-red-400">✗ Outside site</span>}
            {startWithinSite === null && <span className="text-zinc-400">✓ GPS recorded</span>}
          </div>

          <h2 className="text-3xl font-black text-white">{t.takeSitePhoto}</h2>
          <p className="text-sm text-zinc-400 mt-1 font-medium">
            Prove your physical presence with a quick snap
          </p>
        </div>

        {/* Hidden Camera Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
        />

        {/* Photo Preview or Camera Trigger */}
        {photoBase64 ? (
          <div className="space-y-3">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500 shadow-2xl max-h-72 bg-zinc-900">
              <img
                src={photoBase64}
                alt="Site capture"
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.photoAttached}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-bold text-zinc-400 hover:text-white underline py-1 cursor-pointer"
            >
              Retake Photo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              triggerHaptic(30);
              fileInputRef.current?.click();
            }}
            disabled={isCompressingPhoto}
            className="w-full min-h-[140px] rounded-3xl bg-zinc-900/80 border-2 border-dashed border-emerald-500/60 text-white font-black text-2xl flex flex-col items-center justify-center gap-3 p-6 active:scale-[0.98] transition-all cursor-pointer shadow-xl hover:border-emerald-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg text-white">
              <Camera className="w-9 h-9 stroke-[2.5]" />
            </div>
            <span>{isCompressingPhoto ? 'Processing...' : t.snapPhotoBtn}</span>
          </button>
        )}

        {/* Action Buttons: Green Start / Skip */}
        <div className="space-y-3.5 pt-2">
          {photoBase64 ? (
            <button
              type="button"
              onClick={() => finalizeSession(photoBase64)}
              className="w-full min-h-[90px] rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-3xl flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(22,163,74,0.45)] active:scale-[0.98] cursor-pointer"
            >
              <span>{t.confirm}</span>
              <CheckCircle2 className="w-8 h-8 stroke-[3]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => finalizeSession()}
              className="w-full min-h-[85px] rounded-3xl bg-zinc-900 border border-white/10 text-white font-black text-2xl flex items-center justify-center gap-3 active:scale-[0.98] hover:bg-zinc-800 cursor-pointer shadow-xl transition"
            >
              <span>{t.skip}</span>
              <ArrowRight className="w-7 h-7" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onCancel();
            }}
            className="w-full h-14 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white font-bold text-lg flex items-center justify-center cursor-pointer active:scale-[0.98]"
          >
            <span>{t.cancel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
