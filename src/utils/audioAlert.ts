/**
 * Audio notification utility using the Web Audio API.
 * Does not require external audio files and works in all modern browsers.
 */

export function isAudioEnabled(): boolean {
  try {
    const val = localStorage.getItem('aseovia_sound_notifications');
    return val !== 'false'; // Enabled by default
  } catch {
    return true;
  }
}

export function setAudioEnabled(enabled: boolean): void {
  try {
    localStorage.setItem('aseovia_sound_notifications', enabled ? 'true' : 'false');
  } catch {}
}

export function playNotificationChime(): void {
  if (!isAudioEnabled()) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Note 1: Clean high bell
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Note 2: Higher harmonized chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12); // B5
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch (err) {
    // Gracefully handle browser policy or audio driver block
    console.debug('No se pudo reproducir el sonido de notificación:', err);
  }
}
