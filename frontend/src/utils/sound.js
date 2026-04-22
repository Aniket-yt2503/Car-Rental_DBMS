// Web Audio API synthesized sounds — no audio files needed
let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

/**
 * Play a satisfying "booking confirmed" sound using Web Audio API.
 * Plays a rising chord: C5 → E5 → G5 → C6
 */
export function playBookingConfirmedSound() {
  try {
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    const now = ctx.currentTime

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.12)

      gain.gain.setValueAtTime(0, now + i * 0.12)
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5)

      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.6)
    })

    // Add a subtle "whoosh" noise layer
    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let j = 0; j < bufferSize; j++) {
      data[j] = (Math.random() * 2 - 1) * 0.03
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseGain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2000, now)
    filter.frequency.linearRampToValueAtTime(4000, now + 0.3)
    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noiseGain.gain.setValueAtTime(0.08, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    noise.start(now)
    noise.stop(now + 0.3)
  } catch (e) {
    // Silently fail if audio is blocked
    console.warn('Audio playback failed:', e)
  }
}

/**
 * Play a subtle "click" UI sound for interactions.
 */
export function playClickSound() {
  try {
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  } catch (e) {
    // Silently fail
  }
}

/**
 * Play an "upgrade" fanfare sound.
 */
export function playUpgradeSound() {
  try {
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const notes = [392, 523.25, 659.25, 783.99, 1046.50]
    const now = ctx.currentTime

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = i === notes.length - 1 ? 'triangle' : 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.08)
      gain.gain.setValueAtTime(0, now + i * 0.08)
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.08 + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4)
      osc.start(now + i * 0.08)
      osc.stop(now + i * 0.08 + 0.5)
    })
  } catch (e) {
    // Silently fail
  }
}

/**
 * Play a futuristic "3D viewer open" sound — a sci-fi power-up sweep.
 */
export function play3DOpenSound() {
  try {
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime

    // Sweeping sine — low to high
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1); gain1.connect(ctx.destination)
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(80, now)
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.5)
    gain1.gain.setValueAtTime(0.12, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55)
    osc1.start(now); osc1.stop(now + 0.6)

    // Harmonic layer
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2); gain2.connect(ctx.destination)
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(160, now + 0.1)
    osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.5)
    gain2.gain.setValueAtTime(0.06, now + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55)
    osc2.start(now + 0.1); osc2.stop(now + 0.6)

    // Short metallic ping at the end
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.connect(gain3); gain3.connect(ctx.destination)
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(1800, now + 0.45)
    gain3.gain.setValueAtTime(0.15, now + 0.45)
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
    osc3.start(now + 0.45); osc3.stop(now + 0.95)
  } catch (e) { /* silent fail */ }
}

/**
 * Drift intro sound — plays when the site first loads/reveals.
 * Sequence: tire squeal → engine rev → turbo whoosh → bass drop → phantom chord
 */
export function playDriftIntroSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0, now)
    master.gain.linearRampToValueAtTime(1.0, now + 0.05)
    master.connect(ctx.destination)

    // ── 1. Tire squeal (0.0s) ──────────────────────────────────────────────
    const squealOsc = ctx.createOscillator()
    const squealGain = ctx.createGain()
    const squealFilter = ctx.createBiquadFilter()
    squealFilter.type = 'bandpass'
    squealFilter.frequency.setValueAtTime(3200, now)
    squealFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.7)
    squealFilter.Q.value = 8
    squealOsc.type = 'sawtooth'
    squealOsc.frequency.setValueAtTime(2800, now)
    squealOsc.frequency.exponentialRampToValueAtTime(900, now + 0.7)
    squealOsc.connect(squealFilter)
    squealFilter.connect(squealGain)
    squealGain.connect(master)
    squealGain.gain.setValueAtTime(0.18, now)
    squealGain.gain.linearRampToValueAtTime(0.22, now + 0.15)
    squealGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75)
    squealOsc.start(now)
    squealOsc.stop(now + 0.8)

    // Squeal noise layer
    const squealBufSize = Math.floor(ctx.sampleRate * 0.7)
    const squealBuf = ctx.createBuffer(1, squealBufSize, ctx.sampleRate)
    const squealData = squealBuf.getChannelData(0)
    for (let i = 0; i < squealBufSize; i++) squealData[i] = (Math.random() * 2 - 1)
    const squealNoise = ctx.createBufferSource()
    squealNoise.buffer = squealBuf
    const squealNoiseFilter = ctx.createBiquadFilter()
    squealNoiseFilter.type = 'bandpass'
    squealNoiseFilter.frequency.setValueAtTime(4000, now)
    squealNoiseFilter.frequency.exponentialRampToValueAtTime(1800, now + 0.7)
    squealNoiseFilter.Q.value = 4
    const squealNoiseGain = ctx.createGain()
    squealNoise.connect(squealNoiseFilter)
    squealNoiseFilter.connect(squealNoiseGain)
    squealNoiseGain.connect(master)
    squealNoiseGain.gain.setValueAtTime(0.12, now)
    squealNoiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
    squealNoise.start(now)
    squealNoise.stop(now + 0.75)

    // ── 2. Engine rev (0.1s → 1.1s) ───────────────────────────────────────
    const revOsc = ctx.createOscillator()
    const revOsc2 = ctx.createOscillator()
    const revDist = ctx.createWaveShaper()
    const revGain = ctx.createGain()
    const revCurve = new Float32Array(512)
    for (let i = 0; i < 512; i++) {
      const x = (i * 2) / 512 - 1
      revCurve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x))
    }
    revDist.curve = revCurve
    revOsc.type = 'sawtooth'
    revOsc2.type = 'square'
    revOsc.frequency.setValueAtTime(55, now + 0.1)
    revOsc.frequency.exponentialRampToValueAtTime(220, now + 0.7)
    revOsc.frequency.exponentialRampToValueAtTime(140, now + 1.1)
    revOsc2.frequency.setValueAtTime(110, now + 0.1)
    revOsc2.frequency.exponentialRampToValueAtTime(440, now + 0.7)
    revOsc2.frequency.exponentialRampToValueAtTime(280, now + 1.1)
    revOsc.connect(revDist)
    revOsc2.connect(revDist)
    revDist.connect(revGain)
    revGain.connect(master)
    revGain.gain.setValueAtTime(0.0, now + 0.1)
    revGain.gain.linearRampToValueAtTime(0.14, now + 0.25)
    revGain.gain.linearRampToValueAtTime(0.18, now + 0.7)
    revGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
    revOsc.start(now + 0.1); revOsc.stop(now + 1.25)
    revOsc2.start(now + 0.1); revOsc2.stop(now + 1.25)

    // ── 3. Turbo whoosh / blow-off (0.65s) ────────────────────────────────
    const whooshBufSize = Math.floor(ctx.sampleRate * 0.5)
    const whooshBuf = ctx.createBuffer(1, whooshBufSize, ctx.sampleRate)
    const whooshData = whooshBuf.getChannelData(0)
    for (let i = 0; i < whooshBufSize; i++) whooshData[i] = (Math.random() * 2 - 1)
    const whoosh = ctx.createBufferSource()
    whoosh.buffer = whooshBuf
    const whooshFilter = ctx.createBiquadFilter()
    whooshFilter.type = 'bandpass'
    whooshFilter.frequency.setValueAtTime(800, now + 0.65)
    whooshFilter.frequency.exponentialRampToValueAtTime(3500, now + 0.95)
    whooshFilter.Q.value = 2
    const whooshGain = ctx.createGain()
    whoosh.connect(whooshFilter)
    whooshFilter.connect(whooshGain)
    whooshGain.connect(master)
    whooshGain.gain.setValueAtTime(0.0, now + 0.65)
    whooshGain.gain.linearRampToValueAtTime(0.2, now + 0.72)
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1)
    whoosh.start(now + 0.65)
    whoosh.stop(now + 1.15)

    // ── 4. Deep 808 bass drop (0.8s) ──────────────────────────────────────
    const bassOsc = ctx.createOscillator()
    const bassGain = ctx.createGain()
    bassOsc.type = 'sine'
    bassOsc.frequency.setValueAtTime(80, now + 0.8)
    bassOsc.frequency.exponentialRampToValueAtTime(38, now + 1.3)
    bassOsc.connect(bassGain)
    bassGain.connect(master)
    bassGain.gain.setValueAtTime(0.0, now + 0.8)
    bassGain.gain.linearRampToValueAtTime(0.55, now + 0.85)
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
    bassOsc.start(now + 0.8)
    bassOsc.stop(now + 1.55)

    // ── 5. Phantom chord reveal (1.0s) ────────────────────────────────────
    // Minor chord: A3, C4, E4, A4 — eerie and cool
    const chordFreqs = [220, 261.63, 329.63, 440, 523.25]
    chordFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const reverb = ctx.createConvolver()

      // Simple reverb impulse
      const irLen = Math.floor(ctx.sampleRate * 1.5)
      const irBuf = ctx.createBuffer(2, irLen, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const d = irBuf.getChannelData(ch)
        for (let j = 0; j < irLen; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / irLen, 2)
      }
      reverb.buffer = irBuf

      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, now + 1.0 + i * 0.06)
      osc.connect(gain)
      gain.connect(reverb)
      reverb.connect(master)
      gain.gain.setValueAtTime(0.0, now + 1.0 + i * 0.06)
      gain.gain.linearRampToValueAtTime(0.09, now + 1.05 + i * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2 + i * 0.1)
      osc.start(now + 1.0 + i * 0.06)
      osc.stop(now + 2.4)
    })

    // ── 6. Final metallic ping (1.35s) ────────────────────────────────────
    const pingOsc = ctx.createOscillator()
    const pingGain = ctx.createGain()
    pingOsc.type = 'sine'
    pingOsc.frequency.setValueAtTime(1760, now + 1.35)
    pingOsc.frequency.exponentialRampToValueAtTime(880, now + 1.8)
    pingOsc.connect(pingGain)
    pingGain.connect(master)
    pingGain.gain.setValueAtTime(0.0, now + 1.35)
    pingGain.gain.linearRampToValueAtTime(0.18, now + 1.37)
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9)
    pingOsc.start(now + 1.35)
    pingOsc.stop(now + 1.95)

  } catch (e) { /* silent fail */ }
}

/**
 * Loading screen ambient sound — plays when the loader appears.
 * A deep, cinematic engine idle hum with a rising synth swell.
 */
export function playLoaderSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(0.7, now + 0.3)
    master.connect(ctx.destination)

    // Deep engine idle — low sine hum
    const hum = ctx.createOscillator()
    const humGain = ctx.createGain()
    hum.type = 'sine'
    hum.frequency.setValueAtTime(48, now)
    hum.frequency.linearRampToValueAtTime(52, now + 2.0)
    humGain.gain.setValueAtTime(0.35, now)
    humGain.gain.linearRampToValueAtTime(0.0, now + 2.2)
    hum.connect(humGain); humGain.connect(master)
    hum.start(now); hum.stop(now + 2.3)

    // Sub harmonic
    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(24, now)
    subGain.gain.setValueAtTime(0.4, now)
    subGain.gain.linearRampToValueAtTime(0.0, now + 2.0)
    sub.connect(subGain); subGain.connect(master)
    sub.start(now); sub.stop(now + 2.1)

    // Rising synth swell — eerie phantom tone
    const swell = ctx.createOscillator()
    const swellGain = ctx.createGain()
    const swellFilter = ctx.createBiquadFilter()
    swellFilter.type = 'lowpass'
    swellFilter.frequency.setValueAtTime(300, now + 0.2)
    swellFilter.frequency.exponentialRampToValueAtTime(2400, now + 1.8)
    swell.type = 'triangle'
    swell.frequency.setValueAtTime(110, now + 0.2)
    swell.frequency.exponentialRampToValueAtTime(440, now + 1.8)
    swellGain.gain.setValueAtTime(0.0, now + 0.2)
    swellGain.gain.linearRampToValueAtTime(0.12, now + 0.6)
    swellGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0)
    swell.connect(swellFilter); swellFilter.connect(swellGain); swellGain.connect(master)
    swell.start(now + 0.2); swell.stop(now + 2.1)

    // Metallic shimmer — high freq noise burst
    const shimBufSize = Math.floor(ctx.sampleRate * 0.4)
    const shimBuf = ctx.createBuffer(1, shimBufSize, ctx.sampleRate)
    const shimData = shimBuf.getChannelData(0)
    for (let i = 0; i < shimBufSize; i++) shimData[i] = (Math.random() * 2 - 1)
    const shim = ctx.createBufferSource()
    shim.buffer = shimBuf
    const shimFilter = ctx.createBiquadFilter()
    shimFilter.type = 'highpass'
    shimFilter.frequency.value = 6000
    const shimGain = ctx.createGain()
    shimGain.gain.setValueAtTime(0.0, now + 0.1)
    shimGain.gain.linearRampToValueAtTime(0.08, now + 0.25)
    shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    shim.connect(shimFilter); shimFilter.connect(shimGain); shimGain.connect(master)
    shim.start(now + 0.1); shim.stop(now + 0.55)

  } catch (e) { /* silent */ }
}

/**
 * Page switch sound — calm, smooth whoosh with a soft chime.
 * Plays on every route navigation.
 */
export function playPageSwitchSound() {
  try {
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime

    // Soft whoosh — filtered noise sweep
    const bufSize = Math.floor(ctx.sampleRate * 0.35)
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1)
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(600, now)
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.25)
    filter.Q.value = 1.5
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.0, now)
    noiseGain.gain.linearRampToValueAtTime(0.07, now + 0.04)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(ctx.destination)
    noise.start(now); noise.stop(now + 0.35)

    // Soft chime — two sine tones, gentle
    [[660, 0.08], [880, 0.14]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + delay)
      gain.gain.setValueAtTime(0.0, now + delay)
      gain.gain.linearRampToValueAtTime(0.06, now + delay + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(now + delay); osc.stop(now + delay + 0.45)
    })

  } catch (e) { /* silent */ }
}
