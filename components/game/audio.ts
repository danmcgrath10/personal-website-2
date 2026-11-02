export type EqBand = 0 | 1 | 2;

export type GameAudio = {
  setEnabled: (enabled: boolean) => void;
  setEq: (band: EqBand, gain: number) => void;
  step: () => void;
  click: () => void;
  chime: () => void;
  destroy: () => void;
};

const CHORDS = [
  [220, 261.63, 329.63],
  [174.61, 220, 261.63],
  [130.81, 196, 246.94],
  [196, 246.94, 293.66],
];
const BEAT = 0.5;

// All sound is synthesized here, so the game needs no audio files.
export function createAudio(): GameAudio {
  let context: AudioContext | null = null;
  let filters: BiquadFilterNode[] = [];
  let music: GainNode | null = null;
  let effects: GainNode | null = null;
  let timer: number | undefined;
  let beat = 0;
  let enabled = false;
  const gains = [0, 0, 0];

  function ensureContext() {
    if (context) return context;
    context = new AudioContext();
    filters = (
      [
        ["lowshelf", 220],
        ["peaking", 1000],
        ["highshelf", 3500],
      ] as const
    ).map(([type, frequency], index) => {
      const filter = context!.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = frequency;
      filter.gain.value = gains[index];
      return filter;
    });
    music = context.createGain();
    music.gain.value = 0.14;
    effects = context.createGain();
    effects.gain.value = 0.2;
    music.connect(filters[0]);
    filters[0].connect(filters[1]);
    filters[1].connect(filters[2]);
    filters[2].connect(context.destination);
    effects.connect(context.destination);
    return context;
  }

  function tone(
    output: GainNode,
    type: OscillatorType,
    frequency: number,
    start: number,
    duration: number,
    volume: number
  ) {
    const ctx = context!;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  function scheduleBeat() {
    const ctx = context!;
    const start = ctx.currentTime + 0.05;
    const chord = CHORDS[Math.floor(beat / 8) % CHORDS.length];
    if (beat % 8 === 0) {
      chord.forEach((note) => tone(music!, "triangle", note, start, BEAT * 8, 0.5));
    }
    if (beat % 4 === 0) tone(music!, "sine", chord[0] / 2, start, BEAT * 3, 0.9);
    if (beat % 2 === 1) tone(music!, "sine", chord[beat % 3] * 2, start, BEAT * 1.5, 0.3);
    if (beat % 2 === 0) tone(music!, "square", 6000, start, 0.03, 0.03);
    beat += 1;
  }

  return {
    setEnabled(next) {
      enabled = next;
      window.clearInterval(timer);
      timer = undefined;
      if (next) {
        const ctx = ensureContext();
        void ctx.resume();
        scheduleBeat();
        timer = window.setInterval(scheduleBeat, BEAT * 1000);
      } else {
        void context?.suspend();
      }
    },
    setEq(band, gain) {
      gains[band] = gain;
      if (filters[band]) filters[band].gain.value = gain;
    },
    step() {
      if (enabled) tone(effects!, "triangle", 95, context!.currentTime, 0.07, 0.35);
    },
    click() {
      if (enabled) tone(effects!, "square", 520, context!.currentTime, 0.06, 0.12);
    },
    chime() {
      if (!enabled) return;
      [659.25, 783.99, 1046.5].forEach((note, index) =>
        tone(effects!, "sine", note, context!.currentTime + index * 0.09, 0.4, 0.4)
      );
    },
    destroy() {
      window.clearInterval(timer);
      void context?.close();
      context = null;
    },
  };
}
