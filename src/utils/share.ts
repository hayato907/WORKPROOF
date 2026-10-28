import { toBlob } from 'html-to-image';

export async function shareWorkProof(
  cardElement: HTMLElement | null,
  textSummary: string
): Promise<{ sharedAsImage: boolean; success: boolean }> {
  // Try Web Share API with image
  if (cardElement && typeof navigator !== 'undefined' && navigator.canShare) {
    try {
      const blob = await toBlob(cardElement, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#FFFFFF',
      });

      if (blob) {
        const file = new File([blob], `workproof-${Date.now()}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'WorkProof',
            text: textSummary,
            files: [file],
          });
          return { sharedAsImage: true, success: true };
        }
      }
    } catch (err: unknown) {
      // AbortError is user cancellation, don't trigger fallback in that case
      if (err instanceof Error && err.name === 'AbortError') {
        return { sharedAsImage: false, success: false };
      }
      console.warn('Image share not available or failed, falling back to WhatsApp text', err);
    }
  }

  // Fallback: WhatsApp text URL
  const waUrl = `https://wa.me/?text=${encodeURIComponent(textSummary)}`;
  window.open(waUrl, '_blank');
  return { sharedAsImage: false, success: true };
}

export function shareJobCodeOnWhatsApp(jobName: string, contractorName: string, code: string, messageTemplate: (j: string, c: string, code: string) => string) {
  const text = messageTemplate(jobName, contractorName, code);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}
