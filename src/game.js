const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const ui = {
  wave: document.querySelector("#wave"),
  timer: document.querySelector("#timer"),
  remaining: document.querySelector("#remaining"),
  heroName: document.querySelector("#hero-name"),
  hudAvatar: document.querySelector("#hud-avatar"),
  hp: document.querySelector("#hp"),
  xp: document.querySelector("#xp"),
  hpFill: document.querySelector("#hp-fill"),
  xpFill: document.querySelector("#xp-fill"),
  coins: document.querySelector("#coins"),
  gems: document.querySelector("#gems"),
  build: document.querySelector("#build"),
  pause: document.querySelector("#pause"),
  overlay: document.querySelector("#overlay"),
  start: document.querySelector("#start"),
  profileSummary: document.querySelector("#profile-summary"),
  toast: document.querySelector("#toast"),
  joystick: document.querySelector("#joystick"),
  joystickKnob: document.querySelector("#joystick-knob"),
  shop: document.querySelector("#shop"),
  shopKicker: document.querySelector("#shop-kicker"),
  shopTitle: document.querySelector("#shop-title"),
  shopCopy: document.querySelector("#shop-copy"),
  shopItems: document.querySelector("#shop-items"),
  shopGold: document.querySelector("#shop-gold"),
  shopMessage: document.querySelector("#shop-message"),
  refreshShop: document.querySelector("#refresh-shop"),
  continueRun: document.querySelector("#continue-run"),
  buyDialog: document.querySelector("#buy-dialog"),
  buyIcon: document.querySelector("#buy-icon"),
  buyTitle: document.querySelector("#buy-title"),
  buyText: document.querySelector("#buy-text"),
  buyPrice: document.querySelector("#buy-price"),
  buyCancel: document.querySelector("#buy-cancel"),
  buyConfirm: document.querySelector("#buy-confirm"),
  heroConfirm: document.querySelector("#hero-confirm"),
  heroConfirmAvatar: document.querySelector("#hero-confirm-avatar"),
  heroConfirmTitle: document.querySelector("#hero-confirm-title"),
  heroConfirmText: document.querySelector("#hero-confirm-text"),
  heroConfirmCancel: document.querySelector("#hero-confirm-cancel"),
  heroConfirmOk: document.querySelector("#hero-confirm-ok"),
  heroSelect: document.querySelector("#hero-select"),
  heroCards: [...document.querySelectorAll("[data-weapon]")],
  tutorialDialog: document.querySelector("#tutorial-dialog"),
  tutorialKicker: document.querySelector("#tutorial-kicker"),
  tutorialPortrait: document.querySelector("#tutorial-portrait"),
  tutorialSpeaker: document.querySelector("#tutorial-speaker"),
  tutorialLine: document.querySelector("#tutorial-line"),
  tutorialNext: document.querySelector("#tutorial-next"),
  statsPanel: document.querySelector("#hero-stats"),
  statsTitle: document.querySelector("#stats-title"),
  statsBody: document.querySelector("#stats-body"),
  statsClose: document.querySelector("#stats-close"),
  settings: document.querySelector("#settings"),
  settingsTitle: document.querySelector("#settings-title"),
  settingsClose: document.querySelector("#settings-close"),
  settingsMenu: document.querySelector("#settings-menu"),
  settingsContent: document.querySelector("#settings-content"),
  resumeRun: document.querySelector("#resume-run"),
  restartRun: document.querySelector("#restart-run"),
  returnLobby: document.querySelector("#return-lobby"),
  openHelp: document.querySelector("#open-help"),
  openAudio: document.querySelector("#open-audio"),
  levelUp: document.querySelector("#level-up"),
  upgradeTitle: document.querySelector("#level-up h2"),
  upgradeNote: document.querySelector("#upgrade-note"),
  refreshUpgrades: document.querySelector("#refresh-upgrades"),
  upgradeItems: document.querySelector("#upgrade-items"),
  stageSummary: document.querySelector("#stage-summary"),
  stageTitle: document.querySelector("#stage-title"),
  stageBody: document.querySelector("#stage-body"),
  stageSettle: document.querySelector("#stage-settle"),
  stageContinue: document.querySelector("#stage-continue"),
  resultModal: document.querySelector("#result-modal"),
  resultTitle: document.querySelector("#result-title"),
  resultBody: document.querySelector("#result-body"),
  retryRun: document.querySelector("#retry-run"),
  changeWeapon: document.querySelector("#change-weapon"),
  resultLobby: document.querySelector("#result-lobby"),
  bossCue: document.querySelector("#boss-cue"),
  bossCueKicker: document.querySelector("#boss-cue-kicker"),
  bossCueTitle: document.querySelector("#boss-cue-title"),
  bossCueText: document.querySelector("#boss-cue-text"),
  bossCueContinue: document.querySelector("#boss-cue-continue"),
  debug: document.querySelector("#debug"),
};

const VIEW = {
  width: 360,
  height: 640,
};

const WORLD = {
  width: 980,
  height: 1320,
  minX: 48,
  maxX: 932,
  minY: 72,
  maxY: 1260,
};

const COLORS = {
  bgTop: "#111827",
  bgBottom: "#18243a",
  grid: "rgba(255,255,255,0.07)",
  text: "#eef4ff",
  hp: "#4ee2a0",
  danger: "#ff5570",
  gold: "#ffd166",
  xp: "#53d8fb",
  warrior: "#ffe66d",
  mage: "#bdb2ff",
  archer: "#7ae582",
  frost: "#9bf6ff",
  fire: "#ff9f1c",
  playerSkin: "#f5c7a9",
  playerHair: "#2a1a19",
  playerCloth: "#4ee2a0",
};

const RARITIES = {
  common: { label: "普通", color: "#4ee2a0", weight: 62 },
  elite: { label: "精英", color: "#53d8fb", weight: 25 },
  epic: { label: "史诗", color: "#bdb2ff", weight: 10 },
  legendary: { label: "传说", color: "#ffd166", weight: 3 },
};

const AUDIO_FILES = {
  tap: "assets/audio/tap.wav",
  start: "assets/audio/start.wav",
  confirm: "assets/audio/confirm.wav",
  buyConfirm: "assets/audio/buyConfirm.wav",
  fail: "assets/audio/fail.wav",
  refresh: "assets/audio/refresh.wav",
  deal: "assets/audio/deal.wav",
  upgradePick: "assets/audio/upgradePick.wav",
  level: "assets/audio/level.wav",
  hit: "assets/audio/hit.wav",
  hurt: "assets/audio/hurt.wav",
  melee: "assets/audio/melee.wav",
  mage: "assets/audio/mage.wav",
  archer: "assets/audio/archer.wav",
  coin: "assets/audio/coin.wav",
  shopOpen: "assets/audio/shopOpen.wav",
  boss: "assets/audio/boss.wav",
  bgm: "assets/audio/bgm-loop.wav",
};

class Pool {
  constructor(create) {
    this.create = create;
    this.free = [];
  }

  get() {
    return this.free.pop() || this.create();
  }

  release(item) {
    item.active = false;
    this.free.push(item);
  }
}

class Sfx {
  constructor() {
    this.ctx = null;
    this.last = new Map();
    this.output = null;
    this.masterVolume = 0.82;
    this.musicVolume = 0.28;
    this.muted = false;
    this.musicMuted = false;
    this.bgm = null;
    this.samples = new Map();
    this.loadingSamples = false;
    this.failedSamples = new Set();
  }

  unlock() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    if (!this.ctx || this.ctx.state === "closed") this.ctx = new AudioCtor({ latencyHint: "interactive" });
    this.ensureOutput();
    this.loadSamples();
    this.startBgm();
    this.resume();
  }

  ensureOutput() {
    if (!this.ctx) return;
    if (!this.output) {
      this.output = this.ctx.createGain();
      this.output.connect(this.ctx.destination);
    }
    this.output.gain.value = this.muted ? 0 : this.masterVolume;
  }

  async loadSamples() {
    if (!this.ctx || this.loadingSamples) return;
    this.loadingSamples = true;
    await Promise.all(Object.entries(AUDIO_FILES).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status} ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await this.ctx.decodeAudioData(arrayBuffer.slice(0));
        this.samples.set(name, buffer);
      } catch (error) {
        this.failedSamples.add(name);
      }
    }));
    document.body.dataset.audioFiles = String(this.samples.size);
    document.body.dataset.audioMissing = String(this.failedSamples.size);
    this.startBgm();
  }

  playSample(name, now) {
    const buffer = this.samples.get(name);
    if (!buffer || !this.output) return false;
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = this.sampleGain(name);
    source.connect(gain).connect(this.output);
    source.start(now);
    return true;
  }

  sampleGain(name) {
    return {
      tap: 0.72,
      start: 0.78,
      confirm: 0.74,
      buyConfirm: 0.82,
      fail: 0.72,
      refresh: 0.72,
      deal: 0.68,
      burn: 0.7,
      absorb: 0.78,
      upgradePick: 0.9,
      level: 0.8,
      hit: 0.62,
      hurt: 0.76,
      melee: 0.7,
      warrior: 0.78,
      mage: 0.78,
      archer: 0.76,
      coin: 0.64,
      xp: 0.56,
      shop: 0.68,
      shopOpen: 0.78,
      boss: 0.82,
      meteor: 0.82,
      blackhole: 0.8,
      blizzard: 0.72,
    }[name] || 0.72;
  }

  setSfxVolume(value) {
    this.masterVolume = clamp(Number(value) || 0, 0, 1);
    this.ensureOutput();
  }

  setMusicVolume(value) {
    this.musicVolume = clamp(Number(value) || 0, 0, 1);
    this.updateBgmGain();
  }

  setSfxMuted(muted) {
    this.muted = muted;
    this.ensureOutput();
  }

  setMusicMuted(muted) {
    this.musicMuted = muted;
    this.updateBgmGain();
  }

  startBgm() {
    if (!this.ctx) return;
    const bgmBuffer = this.samples.get("bgm");
    if (bgmBuffer) {
      if (this.bgm?.kind === "file") return;
      if (this.bgm?.low) {
        try {
          this.bgm.low.stop();
          this.bgm.high.stop();
        } catch (error) {
          // Oscillator fallback may already be stopped in some browsers.
        }
      }
      const gain = this.ctx.createGain();
      const source = this.ctx.createBufferSource();
      source.buffer = bgmBuffer;
      source.loop = true;
      gain.gain.value = this.musicMuted ? 0 : this.musicVolume * 0.5;
      source.connect(gain).connect(this.ctx.destination);
      source.start();
      this.bgm = { kind: "file", gain, source };
      return;
    }
    if (this.bgm) return;
    const gain = this.ctx.createGain();
    const low = this.ctx.createOscillator();
    const high = this.ctx.createOscillator();
    low.type = "sine";
    high.type = "triangle";
    low.frequency.value = 72;
    high.frequency.value = 144;
    gain.gain.value = this.musicMuted ? 0 : this.musicVolume * 0.035;
    low.connect(gain);
    high.connect(gain);
    gain.connect(this.ctx.destination);
    low.start();
    high.start();
    this.bgm = { kind: "osc", gain, low, high };
  }

  updateBgmGain() {
    if (this.bgm) {
      this.bgm.gain.gain.value = this.musicMuted ? 0 : this.musicVolume * (this.bgm.kind === "file" ? 0.5 : 0.035);
    }
  }

  resume() {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  play(name) {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.resume();
    this.ensureOutput();
    if (this.muted || this.masterVolume <= 0) return;
    const now = this.ctx.currentTime;
    const limit = {
      hit: 0.045,
      melee: 0.16,
      warrior: 0.14,
      mage: 0.15,
      archer: 0.13,
      coin: 0.08,
      xp: 0.06,
      deal: 0.25,
      burn: 0.22,
      absorb: 0.32,
      level: 0.35,
      hurt: 0.2,
      boss: 1,
      shop: 0.16,
      tap: 0.045,
      confirm: 0.12,
      buyConfirm: 0.18,
      fail: 0.18,
      refresh: 0.24,
      shopOpen: 0.5,
      start: 0.45,
      upgradePick: 0.22,
      meteor: 0.5,
      blackhole: 0.6,
      blizzard: 0.6,
    }[name] || 0;
    if (now - (this.last.get(name) || 0) < limit) return;
    this.last.set(name, now);
    if (this.playSample(name, now)) return;
    if (name === "hit") this.hit(now);
    if (name === "melee") this.noiseSweep(now, 420, 1800, 0.1, 0.1);
    if (name === "warrior") this.warriorWave(now);
    if (name === "mage") this.mageBolt(now);
    if (name === "archer") this.arrowShot(now);
    if (name === "coin") this.chime(now, [1046, 1568], 0.055, 0.04);
    if (name === "xp") this.chime(now, [880, 1320], 0.035, 0.035);
    if (name === "deal") this.chime(now, [392, 494, 587], 0.045, 0.045);
    if (name === "burn") this.burn(now);
    if (name === "absorb") this.absorb(now);
    if (name === "level") this.chime(now, [523, 659, 784, 1046], 0.07, 0.05);
    if (name === "hurt") this.drop(now);
    if (name === "boss") this.boss(now);
    if (name === "shop") this.chime(now, [659, 988], 0.05, 0.05);
    if (name === "tap") this.tap(now);
    if (name === "confirm") this.confirm(now);
    if (name === "buyConfirm") this.buyConfirm(now);
    if (name === "fail") this.fail(now);
    if (name === "refresh") this.chime(now, [523, 784, 1046], 0.045, 0.045);
    if (name === "start") this.chime(now, [392, 587, 784, 1175], 0.06, 0.08);
    if (name === "upgradePick") this.chime(now, [1760, 2349, 3136, 4186], 0.05, 0.04);
    if (name === "meteor") {
      this.noiseSweep(now, 1800, 90, 0.14, 0.38);
      this.drop(now + 0.22);
    }
    if (name === "blackhole") this.absorb(now);
    if (name === "blizzard") this.noiseSweep(now, 2600, 760, 0.08, 0.5);
    if (name === "shopOpen") {
      this.noiseSweep(now, 240, 1800, 0.08, 0.24);
      this.chime(now + 0.04, [440, 660, 880], 0.04, 0.055);
    }
  }

  tap(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1280, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.055);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  confirm(now) {
    this.chime(now, [784, 988, 1319], 0.055, 0.045);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  buyConfirm(now) {
    this.chime(now, [659, 880, 1175], 0.06, 0.045);
    this.chime(now + 0.08, [1319, 1760], 0.04, 0.035);
    this.noiseSweep(now, 620, 180, 0.035, 0.12);
  }

  fail(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.13);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  hit(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  noiseSweep(now, startFreq, endFreq, volume, duration) {
    const size = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2.2);
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(startFreq, now);
    filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.75);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(filter).connect(gain).connect(this.output);
    source.start(now);
  }

  warriorWave(now) {
    this.noiseSweep(now, 180, 1450, 0.14, 0.16);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(54, now + 0.18);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  mageBolt(now) {
    this.chime(now, [988, 1319, 1976], 0.048, 0.035);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.18);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  arrowShot(now) {
    this.pluck(now);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.07);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain).connect(this.output);
    osc.start(now + 0.018);
    osc.stop(now + 0.11);
  }

  chime(now, notes, volume, gap) {
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + index * gap;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);
      osc.connect(gain).connect(this.output);
      osc.start(start);
      osc.stop(start + 0.16);
    });
  }

  pluck(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.09);
    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  burn(now) {
    const size = Math.floor(this.ctx.sampleRate * 0.22);
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 1.2);
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    filter.type = "highpass";
    filter.frequency.value = 1200;
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    source.connect(filter).connect(gain).connect(this.output);
    source.start(now);
  }

  absorb(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.28);
    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.34);
  }

  drop(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  boss(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(92, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.55);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.65);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function formatTime(seconds) {
  const value = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(value / 60);
  const s = value % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function drawChaosBlob(context, x, y, radius, color, phase, shape) {
  const points = shape === "box" ? 8 : shape === "diamond" ? 6 : 9;
  context.save();
  context.translate(x, y);
  context.rotate(Math.sin(phase * 0.7) * 0.18);
  context.fillStyle = color;
  context.strokeStyle = rgba(color, 0.55);
  context.lineWidth = 2;
  context.beginPath();
  for (let i = 0; i < points; i += 1) {
    const a = (i / points) * Math.PI * 2;
    const jag = 1 + Math.sin(phase + i * 1.7) * 0.18 + Math.cos(phase * 1.4 + i) * 0.08;
    const boxBias = shape === "box" ? 1 + (i % 2 ? 0.08 : -0.04) : 1;
    const px = Math.cos(a) * radius * jag * boxBias;
    const py = Math.sin(a) * radius * (1 + Math.cos(phase + i * 1.2) * 0.16);
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fill();
  context.stroke();
  context.fillStyle = "rgba(255,255,255,0.42)";
  context.fillRect(-radius * 0.32, -radius * 0.26 + Math.sin(phase) * 2, radius * 0.18, radius * 0.18);
  context.fillRect(radius * 0.18, -radius * 0.22 + Math.cos(phase) * 2, radius * 0.18, radius * 0.18);
  context.restore();
}

function shopIconSvg(icon) {
  const icons = {
    potion: ["#ff5570", "M9 2h6v3l-1.5 1.5V9l4.5 7.8A3 3 0 0 1 15.4 21H8.6A3 3 0 0 1 6 16.8L10.5 9V6.5L9 5V2Zm.2 13h5.6L12 10.2 9.2 15Z"],
    bigPotion: ["#ff8fab", "M8 2h8v3l-2 2v2.4l4.8 7.1A3 3 0 0 1 16.3 21H7.7a3 3 0 0 1-2.5-4.5L10 9.4V7L8 5V2Zm1.4 13.2h5.2L12 11l-2.6 4.2Z"],
    amulet: ["#ffd166", "M12 3 6 8v5c0 4 2.4 6.8 6 8 3.6-1.2 6-4 6-8V8l-6-5Zm0 4 3 2.4V13c0 2.1-1.1 3.7-3 4.7-1.9-1-3-2.6-3-4.7V9.4L12 7Z"],
    shield: ["#9bf6ff", "M12 2 4 5v6c0 5.1 3.1 8.9 8 11 4.9-2.1 8-5.9 8-11V5l-8-3Zm0 4 4 1.5V11c0 2.8-1.5 5-4 6.4V6Z"],
    armor: ["#cbd6e8", "M8 3h8l3 4-2 4v10H7V11L5 7l3-4Zm2 3v12h4V6h-4Z"],
    boot: ["#7ae582", "M8 3h6v8l5 3v4H5v-4l3-2V3Zm2 11-2 1v1h8v-.8L12 13l-2 1Z"],
    feather: ["#e8fbff", "M20 3c-7 1-11 5-13 11l-3 3 2 2 3-3c6-2 10-6 11-13Zm-7 7 4-3-3 4-4 3 3-4Z"],
    magnet: ["#ff70a6", "M5 4h5v8a2 2 0 0 0 4 0V4h5v8a7 7 0 0 1-14 0V4Zm2 0v4h3V4H7Zm7 0v4h3V4h-3Z"],
    crystal: ["#53d8fb", "M12 2 4 8l8 14 8-14-8-6Zm0 4 3 3-3 8-3-8 3-3Z"],
    coin: ["#ffd166", "M12 3c5 0 9 2 9 4.5S17 12 12 12 3 10 3 7.5 7 3 12 3Zm-9 8c1.7 1.8 5 3 9 3s7.3-1.2 9-3v3c0 2.5-4 4.5-9 4.5S3 16.5 3 14v-3Z"],
    crown: ["#ffd166", "M4 18h16v3H4v-3Zm0-11 4 4 4-7 4 7 4-4-2 9H6L4 7Z"],
    anvil: ["#b8c0cc", "M5 6h14v4h-4l-2 3h5v3H6v-3h4L8 10H5V6Zm5 11h4v4h-4v-4Z"],
    sword: ["#ffe66d", "M17.8 2 22 6.2 10.5 17.7 7.8 15 19.3 3.5 17.8 2ZM6.8 15.8 8.2 17.2 5 20.4 3.6 19l3.2-3.2Z"],
    clock: ["#9bf6ff", "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 4h-2v6l5 3 1-1.7-4-2.3V7Z"],
    hourglass: ["#ffd166", "M7 2h10v5l-3 5 3 5v5H7v-5l3-5-3-5V2Zm2 3 3 5 3-5H9Zm3 9-3 5h6l-3-5Z"],
    scope: ["#53d8fb", "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 2v4H7v4h4v4h2v-4h4v-4h-4V6h-2Z"],
    storm: ["#bdb2ff", "M13 2 5 13h6l-1 9 9-13h-6l0-7Z"],
    glove: ["#f5c7a9", "M8 3h2v7h1V2h2v8h1V3h2v8h1V6h2v9a6 6 0 0 1-12 0V8H5V6h3V3Z"],
    ring: ["#ffd166", "M12 7a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-3-8h6l2 3-5 3-5-3 2-3Z"],
    scroll: ["#e7edf5", "M6 4h11a3 3 0 0 1 0 6h-1v10H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm0 12a1 1 0 0 0 0 2h8V6H6v10Zm10-10v2h1a1 1 0 0 0 0-2h-1Z"],
    gem: ["#9bf6ff", "M7 3h10l5 6-10 12L2 9l5-6Zm1.2 2L5.6 8h4.2L11 5H8.2Zm4.8 0 1.2 3h4.2l-2.6-3H13Zm-3 5 2 6 2-6h-4Z"],
  };
  const [color, path] = icons[icon] || icons.crystal;
  return `<svg viewBox="0 0 24 24"><path fill="${color}" d="${path}"/></svg>`;
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function pixelCircle(context, x, y, radius) {
  const step = Math.max(3, Math.round(radius / 2.7));
  for (let py = -radius; py <= radius; py += step) {
    for (let px = -radius; px <= radius; px += step) {
      if (px * px + py * py <= radius * radius) {
        context.fillRect(Math.round(x + px), Math.round(y + py), step, step);
      }
    }
  }
}

function rgba(hex, alpha) {
  const value = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
}

const ROGUE_STORAGE_KEY = "gamefight-rogue-profile-v1";
const ROGUE_TUTORIAL_KEY = "gamefight-rogue-seen-tutorial";
const ROGUE_SPRITES = {
  avatar: "assets/sprites/hero_avatar.png",
  hero: {
    src: "assets/sprites/hero_spritesheet.png",
    frameWidth: 128,
    frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 6, fps: 7 },
      move: { row: 1, frames: 6, fps: 10 },
      attackKnife: { row: 2, frames: 6, fps: 14 },
      attackMagic: { row: 3, frames: 6, fps: 12 },
      attackDart: { row: 4, frames: 6, fps: 13 },
      hurt: { row: 5, frames: 6, fps: 12 },
    },
  },
  effects: {
    slash: { src: "assets/sprites/effect_knife_slash.png", frameWidth: 128, frameHeight: 128, frames: 6, fps: 18 },
    missile: { src: "assets/sprites/effect_magic_missile.png", frameWidth: 128, frameHeight: 128, frames: 7, fps: 20 },
    dart: { src: "assets/sprites/effect_dart_trail.png", frameWidth: 128, frameHeight: 128, frames: 7, fps: 20 },
  },
};

const ROGUE_WEAPONS = {
  knife: {
    id: "knife",
    name: "Knife 刀",
    shortName: "Knife",
    role: "近战 · 收割",
    color: COLORS.warrior,
    icon: "刀",
    description: "近距离扇形自动攻击，适合高风险近身清怪。",
    details: "攻击方式：自动朝最近敌人挥出短弧刀光。\n适合祝福：Wind、Blood。\n组合方向：奥术剑阵、回旋刃舞、三相爆发。",
    damage: 24,
    cooldown: 0.62,
    range: 58,
    level: 1,
  },
  magicMissile: {
    id: "magicMissile",
    name: "MagicMissile 魔法飞弹",
    shortName: "MagicMissile",
    role: "远程 · 追踪",
    color: COLORS.mage,
    icon: "弹",
    description: "自动追踪敌人，适合稳定输出和法术连锁。",
    details: "攻击方式：自动锁定并发射追踪飞弹。\n适合祝福：Arcane、Curse。\n组合方向：奥术剑阵、符文飞镖、三相爆发。",
    damage: 34,
    cooldown: 0.86,
    range: 230,
    level: 1,
  },
  dart: {
    id: "dart",
    name: "Dart 飞镖",
    shortName: "Dart",
    role: "回旋 · 轨迹",
    color: COLORS.archer,
    icon: "镖",
    description: "投出后返回玩家，飞出和返回都能造成伤害。",
    details: "攻击方式：向目标投掷穿透飞镖，随后沿清晰轨迹返回。\n适合祝福：Wind、Curse。\n组合方向：回旋刃舞、符文飞镖、三相爆发。",
    damage: 21,
    cooldown: 0.72,
    range: 238,
    pierce: 2,
    level: 1,
  },
};

const ROGUE_BLESSINGS = {
  wind: { id: "wind", name: "疾风祝福", type: "祝福", rarity: "common", color: COLORS.xp, text: "攻击速度提升，飞镖返回速度提升。" },
  arcane: { id: "arcane", name: "奥术祝福", type: "祝福", rarity: "elite", color: COLORS.mage, text: "魔法飞弹命中后有概率复制一枚小飞弹。" },
  blood: { id: "blood", name: "鲜血祝福", type: "祝福", rarity: "elite", color: COLORS.danger, text: "刀命中敌人时附加流血，流血敌人死亡时爆裂。" },
  curse: { id: "curse", name: "诅咒祝福", type: "祝福", rarity: "elite", color: "#9b5cff", text: "飞镖命中敌人时添加诅咒标记，飞弹优先追踪标记敌人。" },
};

const ROGUE_SYNERGIES = {
  arcaneBlades: { id: "arcaneBlades", name: "奥术剑阵", weapons: ["knife", "magicMissile"], rank: 2, text: "刀命中时有概率生成魔法飞弹，飞弹命中后缩短刀冷却。" },
  returningDance: { id: "returningDance", name: "回旋刃舞", weapons: ["knife", "dart"], rank: 2, text: "飞镖返回路径穿过敌人时触发额外刀光。" },
  runeDart: { id: "runeDart", name: "符文飞镖", weapons: ["magicMissile", "dart"], rank: 2, text: "飞镖标记敌人，飞弹优先追踪标记并造成小爆炸。" },
  triBurst: { id: "triBurst", name: "三相爆发", weapons: ["knife", "magicMissile", "dart"], rank: 3, text: "3 秒内触发三种武器命中后生成三角法阵爆发。" },
};

class RogueGame {
  constructor() {
    this.constructorInit();
  }
}

Object.assign(RogueGame.prototype, {
  constructorInit() {
    this.sfx = new Sfx();
    this.sprites = this.loadSpriteAssets();
    this.profile = this.readProfile();
    this.audioSettings = this.readAudioSettings();
    this.sfx.setSfxVolume(this.audioSettings.sfxVolume);
    this.sfx.setMusicVolume(this.audioSettings.musicVolume);
    this.sfx.setSfxMuted(this.audioSettings.sfxMuted);
    this.sfx.setMusicMuted(this.audioSettings.musicMuted);
    this.keys = new Set();
    this.enemyPool = new Pool(() => ({}));
    this.dropPool = new Pool(() => ({}));
    this.particlePool = new Pool(() => ({}));
    this.textPool = new Pool(() => ({}));
    this.effectPool = new Pool(() => ({}));
    this.last = 0;
    this.rafSeenAt = Date.now();
    this.fps = 60;
    this.resize();
    this.bindEvents();
    this.resetToTitle();
    requestAnimationFrame((time) => this.frame(time));
    setInterval(() => this.fallbackFrame(), 100);
  },

  readProfile() {
    const defaults = {
      lastStartingWeapon: null,
      unlockedAchievements: [],
      highestFloor: 1,
      clearedNormalMode: false,
      unlockedDeepChallenge: false,
      highestKills: 0,
      bestSynergy: "无",
      settings: { seenTutorial: false, sfxEnabled: true, vibrationEnabled: true },
    };
    try {
      const saved = JSON.parse(localStorage.getItem(ROGUE_STORAGE_KEY) || "{}") || {};
      return {
        ...defaults,
        ...saved,
        settings: { ...defaults.settings, ...(saved.settings || {}) },
        unlockedAchievements: Array.isArray(saved.unlockedAchievements) ? saved.unlockedAchievements : [],
      };
    } catch {
      return defaults;
    }
  },

  writeProfile() {
    try {
      localStorage.setItem(ROGUE_STORAGE_KEY, JSON.stringify(this.profile));
    } catch {}
  },

  readAudioSettings() {
    const defaults = { sfxVolume: 0.82, musicVolume: 0.28, sfxMuted: false, musicMuted: false };
    try {
      return { ...defaults, ...(JSON.parse(localStorage.getItem("sword-magic-audio") || "{}") || {}) };
    } catch {
      return defaults;
    }
  },

  writeAudioSettings() {
    try {
      localStorage.setItem("sword-magic-audio", JSON.stringify(this.audioSettings));
    } catch {}
  },

  resetToTitle() {
    this.releaseAll?.(this.active?.enemies || [], this.enemyPool);
    this.releaseAll?.(this.active?.drops || [], this.dropPool);
    this.releaseAll?.(this.active?.particles || [], this.particlePool);
    this.releaseAll?.(this.active?.texts || [], this.textPool);
    this.releaseAll?.(this.active?.effects || [], this.effectPool);
    this.mode = "title";
    this.resumeMode = "combat";
    this.pendingStartingWeapon = null;
    this.runEnded = false;
    this.floor = 1;
    this.level = 1;
    this.xp = 0;
    this.nextXp = 34;
    this.hp = 120;
    this.maxHp = 120;
    this.coins = 0;
    this.gems = 0;
    this.reviveCurrency = 0;
    this.floorTime = 0;
    this.floorTimeLimit = 110;
    this.floorKills = 0;
    this.floorSpawned = 0;
    this.floorSpawnLimit = 18;
    this.floorGoal = 18;
    this.spawnTimer = 0.2;
    this.specialSpawned = false;
    this.specialDefeated = true;
    this.pendingUpgrades = 0;
    this.currentUpgradeChoices = [];
    this.upgradeRefreshPrice = 10;
    this.intermissionRefreshPrice = 12;
    this.shopOffers = [];
    this.shopSelected = null;
    this.shopMessageTimer = 0;
    this.sayTimer = 0;
    this.hitStop = 0;
    this.shake = 0;
    this.joystick = { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0, radius: 48, pointerId: null };
    this.player = {
      x: WORLD.width / 2,
      y: WORLD.height / 2,
      radius: 15,
      inputX: 0,
      inputY: 0,
      speed: 170,
      flash: 0,
      hurtKick: 0,
      step: 0,
      absorb: 0,
      attackLean: 0,
      attackAnim: "idle",
      attackAnimTime: 0,
      faceX: 1,
      shield: 0,
    };
    this.weapons = [];
    this.blessings = [];
    this.items = [];
    this.relics = this.items;
    this.synergies = [];
    this.startingWeapon = null;
    this.highestSynergy = "无";
    this.lastHits = {};
    this.triBurstCooldown = 0;
    this.runStats = {
      startTime: performance.now(),
      kills: 0,
      coinsEarned: 0,
      floorsReached: 1,
      completedNormal: false,
      enteredDeep: false,
      rewardMultiplier: 1,
      blessingsFound: 0,
    };
    this.camera = { x: 0, y: 0, scale: window.innerWidth <= 430 ? 0.78 : 0.84 };
    this.active = { enemies: [], drops: [], particles: [], texts: [], effects: [] };
    this.clearAllModals();
    ui.overlay.classList.remove("hidden");
    ui.overlay.querySelector("h1").textContent = "Gamefight";
    ui.start.textContent = "开始冒险";
    if (ui.profileSummary) {
      const deep = this.profile.unlockedDeepChallenge ? "深层挑战已解锁" : "普通局第 9 层完成后可继续深入";
      ui.profileSummary.textContent = `最高第 ${this.profile.highestFloor || 1} 层 · 最高击杀 ${this.profile.highestKills || 0} · ${deep}`;
    }
    this.updateUi();
    this.draw();
  },

  clearAllModals() {
    [ui.shop, ui.levelUp, ui.heroSelect, ui.heroConfirm, ui.buyDialog, ui.tutorialDialog, ui.statsPanel, ui.settings, ui.stageSummary, ui.resultModal, ui.bossCue].forEach((layer) => {
      if (layer) this.clearLayer(layer);
    });
  },

  resize() {
    const rect = canvas.getBoundingClientRect();
    this.mobileViewport = window.innerWidth <= 430 || Boolean(window.matchMedia?.("(pointer: coarse)")?.matches);
    const dpr = Math.min(window.devicePixelRatio || 1, this.mobileViewport ? 1.5 : 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(canvas.width / VIEW.width, 0, 0, canvas.height / VIEW.height, 0, 0);
    if (this.camera) this.camera.scale = this.mobileViewport ? 0.78 : 0.84;
  },

  frame(time) {
    this.rafSeenAt = Date.now();
    this.tick(time);
    requestAnimationFrame((next) => this.frame(next));
  },

  fallbackFrame() {
    if (Date.now() - this.rafSeenAt < 180) return;
    this.tick(performance.now());
  },
});

Object.assign(RogueGame.prototype, {
  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    document.addEventListener("selectstart", (event) => event.preventDefault());
    document.addEventListener("dragstart", (event) => event.preventDefault());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.mode === "combat") this.openSettings("页面失焦，已自动暂停。");
      if (document.hidden) this.endVirtualJoystick();
      else this.recoverAudio();
    });
    window.addEventListener("pageshow", () => this.recoverAudio());
    window.addEventListener("focus", () => this.recoverAudio());
    document.addEventListener("pointerdown", () => this.sfx.unlock(), { passive: true });
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (event.target.closest("button")) {
          this.sfx.unlock();
          this.sfx.play("tap");
        }
      },
      { capture: true, passive: true },
    );

    ui.start?.addEventListener("click", () => this.smartStart());
    ui.heroCards.forEach((button) => {
      button.addEventListener("click", () => this.selectStartingWeapon(button.dataset.weapon));
    });
    ui.heroConfirmCancel?.addEventListener("click", () => this.cancelHeroConfirm());
    ui.heroConfirmOk?.addEventListener("click", () => this.confirmHeroSelection());
    ui.tutorialNext?.addEventListener("click", () => this.nextTutorial());
    ui.hudAvatar?.addEventListener("click", () => this.openStatsPanel());
    ui.statsClose?.addEventListener("click", () => this.closeStatsPanel());
    ui.pause?.addEventListener("click", () => (this.mode === "settings" ? this.closeSettings() : this.openSettings()));
    ui.settingsClose?.addEventListener("click", () => this.closeSettings());
    ui.resumeRun?.addEventListener("click", () => this.closeSettings());
    ui.restartRun?.addEventListener("click", () => this.confirmRestartRun());
    ui.returnLobby?.addEventListener("click", () => this.confirmReturnLobby());
    ui.openHelp?.addEventListener("click", () => this.showHelp());
    ui.openAudio?.addEventListener("click", () => this.renderAudioSettings());
    ui.refreshUpgrades?.addEventListener("click", () => this.refreshUpgradeChoices());
    ui.refreshShop?.addEventListener("click", () => this.refreshIntermission());
    ui.continueRun?.addEventListener("click", () => this.continueFromIntermission());
    ui.buyCancel?.addEventListener("click", () => this.closeBuyDialog(true));
    ui.buyConfirm?.addEventListener("click", () => this.confirmPurchase());
    ui.stageSettle?.addEventListener("click", () => this.settleRun("暂时结算"));
    ui.stageContinue?.addEventListener("click", () => this.continueAfterStage());
    ui.retryRun?.addEventListener("click", () => this.retryRun());
    ui.changeWeapon?.addEventListener("click", () => this.changeStartingWeapon());
    ui.resultLobby?.addEventListener("click", () => this.returnToLobby());
    ui.bossCueContinue?.addEventListener("click", () => this.closeBossCue());

    canvas.addEventListener("pointerdown", (event) => this.startVirtualJoystick(event));
    canvas.addEventListener("pointermove", (event) => this.updateVirtualJoystick(event));
    canvas.addEventListener("pointerup", (event) => this.endVirtualJoystick(event));
    canvas.addEventListener("pointercancel", (event) => this.endVirtualJoystick(event));
    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (this.mode === "title") this.smartStart();
        else if (this.mode === "combat" || this.mode === "settings") ui.pause?.click();
      }
      this.keys.add(event.code);
    });
    window.addEventListener("keyup", (event) => this.keys.delete(event.code));
  },

  recoverAudio() {
    this.sfx.unlock();
  },

  smartStart() {
    const savedWeapon = this.profile.lastStartingWeapon;
    if (savedWeapon && ROGUE_WEAPONS[savedWeapon]) this.startRun(savedWeapon, { skipTutorial: true });
    else this.openWeaponSelect();
  },

  openWeaponSelect() {
    this.sfx.unlock();
    this.sfx.play("start");
    this.mode = "weaponSelect";
    ui.overlay.classList.add("hidden");
    ui.heroSelect.classList.remove("hidden");
    this.say("选择初始武器，10 秒内开打。");
    this.updateUi();
  },

  selectStartingWeapon(weaponId) {
    const weapon = ROGUE_WEAPONS[weaponId];
    if (!weapon) return;
    this.pendingStartingWeapon = weaponId;
    ui.heroConfirmAvatar.textContent = "";
    ui.heroConfirmAvatar.className = "hero-avatar sprite-avatar";
    ui.heroConfirmAvatar.style.backgroundImage = `url(assets/sprites/weapon_${weaponId}.png)`;
    ui.heroConfirmTitle.textContent = weapon.name;
    ui.heroConfirmText.textContent = `${weapon.role}\n\n${weapon.description}\n\n${weapon.details}`;
    ui.heroConfirm.classList.remove("hidden");
    this.sfx.play("deal");
  },

  cancelHeroConfirm() {
    this.pendingStartingWeapon = null;
    this.clearLayer(ui.heroConfirm);
  },

  confirmHeroSelection() {
    if (!this.pendingStartingWeapon) return;
    this.startRun(this.pendingStartingWeapon, { skipTutorial: false });
  },

  startRun(weaponId, options = {}) {
    const weapon = ROGUE_WEAPONS[weaponId] || ROGUE_WEAPONS.knife;
    this.resetRunState();
    this.startingWeapon = weapon.id;
    this.addWeapon(weapon.id);
    this.profile.lastStartingWeapon = weapon.id;
    this.writeProfile();
    this.clearAllModals();
    ui.overlay.classList.add("hidden");
    this.player.absorb = 0.9;
    this.addEffect("absorb", this.player.x, this.player.y, 64, weapon.color);
    this.say(`${weapon.name} 开局。`);
    this.sfx.play("confirm");
    if (options.skipTutorial || this.profile.settings.seenTutorial) this.startFloor(1);
    else this.openTutorial();
    this.updateUi();
  },

  resetRunState() {
    const keepProfile = this.profile;
    this.resetToTitle();
    this.profile = keepProfile;
    this.clearAllModals();
    this.mode = "combat";
    this.runStats.startTime = performance.now();
  },

  openTutorial() {
    this.mode = "tutorial";
    ui.tutorialKicker.textContent = "";
    ui.tutorialKicker.classList.add("empty");
    ui.tutorialPortrait.textContent = "？";
    ui.tutorialSpeaker.textContent = "操作提示";
    ui.tutorialLine.textContent = "拖动屏幕移动角色。武器会自动攻击。击败敌人获得经验，升级后选择奖励。";
    ui.tutorialNext.textContent = "开始战斗";
    ui.tutorialDialog.classList.add("tip-mode");
    ui.tutorialDialog.classList.remove("hidden");
    this.updateUi();
  },

  nextTutorial() {
    this.profile.settings.seenTutorial = true;
    localStorage.setItem(ROGUE_TUTORIAL_KEY, "1");
    this.writeProfile();
    this.clearLayer(ui.tutorialDialog);
    this.startFloor(1);
  },

  tick(time) {
    let dt = Math.min(0.033, (time - this.last) / 1000 || 0);
    this.last = time;
    this.fps = lerp(this.fps, dt > 0 ? 1 / dt : 60, 0.08);
    if (this.hitStop > 0) {
      this.hitStop -= dt;
      dt *= 0.25;
    }
    this.sayTimer -= dt;
    this.shopMessageTimer -= dt;
    if (this.mode === "combat") this.update(dt);
    else {
      this.updateEffects(dt);
      this.player.flash = Math.max(0, this.player.flash - dt);
      this.player.absorb = Math.max(0, this.player.absorb - dt);
      if (this.sayTimer <= 0) ui.toast.classList.remove("show");
    }
    this.draw();
  },

  clearLayer(layer) {
    if (!layer) return;
    layer.classList.add("hidden");
    layer.classList.remove("locked", "absorbing");
  },

  releaseAll(list, pool) {
    if (!list || !pool) return;
    while (list.length) pool.release(list.pop());
  },

  say(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add("show");
    this.sayTimer = 2.1;
  },

  loadSpriteAssets() {
    const sources = {
      avatar: ROGUE_SPRITES.avatar,
      hero: ROGUE_SPRITES.hero.src,
      slash: ROGUE_SPRITES.effects.slash.src,
      missile: ROGUE_SPRITES.effects.missile.src,
      dart: ROGUE_SPRITES.effects.dart.src,
    };
    const images = {};
    const state = { images, ready: false, loaded: 0, total: Object.keys(sources).length };
    Object.entries(sources).forEach(([key, src]) => {
      const image = new Image();
      image.onload = () => {
        state.loaded += 1;
        state.ready = state.loaded >= state.total;
        if (key === "avatar") this.updateUi?.();
      };
      image.onerror = () => {
        state.loaded += 1;
        state.ready = state.loaded >= state.total;
        images[key] = null;
      };
      image.src = src;
      images[key] = image;
    });
    return state;
  },

  spriteReady(key) {
    const image = this.sprites?.images?.[key];
    return Boolean(image && image.complete && image.naturalWidth > 0);
  },

  effectCap() {
    return this.mobileViewport ? 90 : 150;
  },

  particleCap() {
    return this.mobileViewport ? 120 : 230;
  },

  textCap() {
    return this.mobileViewport ? 32 : 52;
  },
});

Object.assign(RogueGame.prototype, {
  addWeapon(weaponId) {
    if (this.weapons.some((weapon) => weapon.id === weaponId)) {
      this.upgradeWeapon(weaponId, { level: 1 });
      return;
    }
    const base = ROGUE_WEAPONS[weaponId];
    if (!base) return;
    this.weapons.push({
      id: base.id,
      name: base.name,
      shortName: base.shortName,
      color: base.color,
      damage: base.damage,
      cooldown: base.cooldown,
      timer: 0.25,
      range: base.range,
      pierce: base.pierce || 0,
      level: base.level || 1,
      shots: 1,
      speed: weaponId === "dart" ? 330 : 430,
      returnSpeed: weaponId === "dart" ? 420 : 0,
    });
    this.recalculateSynergies();
    this.say(`获得武器：${base.name}`);
  },

  upgradeWeapon(weaponId, changes = {}) {
    const weapon = this.weapons.find((item) => item.id === weaponId);
    if (!weapon) return;
    weapon.level += changes.level || 0;
    weapon.damage += changes.damage || Math.ceil(weapon.damage * 0.12);
    weapon.range += changes.range || 0;
    weapon.speed += changes.speed || 0;
    weapon.returnSpeed += changes.returnSpeed || 0;
    if (changes.cooldown) weapon.cooldown = Math.max(0.18, weapon.cooldown - changes.cooldown);
    this.say(`${weapon.shortName} 强化。`);
  },

  recalculateSynergies() {
    const owned = new Set(this.weapons.map((weapon) => weapon.id));
    const active = Object.values(ROGUE_SYNERGIES).filter((synergy) => synergy.weapons.every((weapon) => owned.has(weapon)));
    const before = new Set(this.synergies.map((synergy) => synergy.id));
    this.synergies = active;
    for (const synergy of active) {
      if (!before.has(synergy.id)) {
        this.highestSynergy = synergy.name;
        if (synergy.rank >= 3) this.unlockAchievement("triBurstFirst");
        this.addEffect(synergy.rank >= 3 ? "triBurst" : "ring", this.player.x, this.player.y, synergy.rank >= 3 ? 98 : 58, COLORS.gold);
        this.say(`组合激活：${synergy.name}`);
      }
    }
  },

  startFloor(floor) {
    this.mode = "combat";
    this.floor = floor;
    this.runStats.floorsReached = Math.max(this.runStats.floorsReached, floor);
    this.profile.highestFloor = Math.max(this.profile.highestFloor || 1, floor);
    this.floorTime = 0;
    this.floorTimeLimit = 90 + Math.min(60, floor * 5);
    this.floorKills = 0;
    this.floorSpawned = 0;
    this.floorSpawnLimit = this.floorLimitFor(floor);
    this.floorGoal = this.floorSpawnLimit + (this.specialForFloor(floor) ? 1 : 0);
    this.spawnTimer = floor === 1 ? 0.2 : 0.55;
    this.specialSpawned = false;
    this.specialDefeated = !this.specialForFloor(floor);
    this.clearAllModals();
    this.say(this.specialForFloor(floor) ? `第 ${floor} 层：强敌正在靠近。` : `第 ${floor} 层：清理怪群。`);
    this.updateUi();
  },

  floorLimitFor(floor) {
    if (floor === 1) return 22;
    if (floor <= 3) return 26 + floor * 4;
    if (floor <= 9) return 38 + floor * 6;
    return Math.min(128, 70 + floor * 6);
  },

  specialForFloor(floor) {
    const map = {
      3: { label: "小 Boss", cue: "某处出现了可怕的气息。", hp: 7, radius: 2.0, color: "#e9c46a", rank: "elite" },
      6: { label: "副首领", cue: "某处空间似乎发生了颤动。", hp: 10, radius: 2.35, color: "#ff70a6", rank: "lieutenant" },
      9: { label: "Boss", cue: "这便是这片空间的领主吗？", hp: 13, radius: 2.75, color: "#ff3d5a", rank: "boss" },
      12: { label: "变异 Boss", cue: "更深处的形体正在扭曲。", hp: 15, radius: 2.85, color: "#bdb2ff", rank: "boss" },
      15: { label: "高压精英", cue: "空气变得尖锐起来。", hp: 15, radius: 2.5, color: "#9bf6ff", rank: "elite" },
      18: { label: "深层守卫", cue: "深层守卫挡住了去路。", hp: 18, radius: 3.0, color: "#ffd166", rank: "lieutenant" },
      20: { label: "最终 Boss", cue: "深层领主醒来了。", hp: 24, radius: 3.25, color: "#ff2f5f", rank: "boss" },
    };
    return map[floor] || null;
  },

  updateUi() {
    ui.wave.textContent = `第${this.floor}层 Lv.${this.level}`;
    ui.timer.textContent = formatTime(Math.max(0, this.floorTimeLimit - this.floorTime));
    ui.remaining.textContent = `剩余${Math.max(0, this.floorGoal - this.floorKills)}`;
    ui.heroName.textContent = `游隙者 Lv.${this.level}`;
    ui.hudAvatar.className = this.spriteReady("avatar") ? "avatar-frame rogue sprite-avatar" : "avatar-frame rogue";
    ui.hudAvatar.style.backgroundImage = this.spriteReady("avatar") ? `url(${ROGUE_SPRITES.avatar})` : "";
    ui.hudAvatar.textContent = this.spriteReady("avatar") ? "" : this.startingWeapon ? ROGUE_WEAPONS[this.startingWeapon]?.icon || "游" : "游";
    ui.hp.textContent = `${Math.max(0, Math.round(this.hp))}/${this.maxHp}`;
    ui.xp.textContent = `${Math.floor(this.xp)}/${this.nextXp}`;
    ui.hpFill.style.width = `${clamp(this.hp / this.maxHp, 0, 1) * 100}%`;
    ui.xpFill.style.width = `${clamp(this.xp / this.nextXp, 0, 1) * 100}%`;
    ui.coins.textContent = this.coins;
    ui.gems.textContent = this.reviveCurrency || 0;
    const weaponText = this.weapons.map((weapon) => `${weapon.shortName}${weapon.level}`).join(" + ") || "未选择";
    const hint = this.synergyHint();
    ui.build.textContent = hint ? `${weaponText} · ${hint}` : `${weaponText} · 最高组合 ${this.highestSynergy}`;
    if (this.sayTimer <= 0) ui.toast.classList.remove("show");
    document.body.dataset.mode = this.mode;
    document.body.dataset.floor = String(this.floor);
    document.body.dataset.level = String(this.level);
    document.body.dataset.weapons = this.weapons.map((weapon) => weapon.id).join(",");
  },

  synergyHint() {
    const owned = new Set(this.weapons.map((weapon) => weapon.id));
    if (owned.size !== 2 || owned.has("knife") + owned.has("magicMissile") + owned.has("dart") !== 2) return "";
    const missing = ["knife", "magicMissile", "dart"].find((weapon) => !owned.has(weapon));
    return `再获得 ${ROGUE_WEAPONS[missing].shortName} 可解锁“三相爆发”`;
  },

  updateEffects(dt) {
    for (let i = this.active.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.active.effects[i];
      effect.life -= dt;
      if (effect.life <= 0) this.releaseActive(this.active.effects, i, this.effectPool);
    }
    for (let i = this.active.particles.length - 1; i >= 0; i -= 1) {
      const p = this.active.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.releaseActive(this.active.particles, i, this.particlePool);
    }
    for (let i = this.active.texts.length - 1; i >= 0; i -= 1) {
      const text = this.active.texts[i];
      text.y -= 24 * dt;
      text.life -= dt;
      if (text.life <= 0) this.releaseActive(this.active.texts, i, this.textPool);
    }
  },

  addEffect(type, x, y, radius, color, direction = 0, fromX = 0, fromY = 0) {
    if (this.active.effects.length >= this.effectCap()) this.releaseActive(this.active.effects, 0, this.effectPool);
    const effect = this.effectPool.get();
    effect.active = true;
    effect.type = type;
    effect.x = x;
    effect.y = y;
    effect.radius = radius;
    effect.color = color;
    effect.direction = direction;
    effect.fromX = fromX;
    effect.fromY = fromY;
    effect.life = type === "triBurst" ? 0.5 : type === "absorb" || type === "ring" ? 0.62 : type === "missile" || type === "dart" || type === "slash" ? 0.3 : 0.42;
    effect.maxLife = effect.life;
    this.active.effects.push(effect);
  },

  releaseActive(list, index, pool) {
    const item = list[index];
    list[index] = list[list.length - 1];
    list.pop();
    pool.release(item);
  },
});

Object.assign(RogueGame.prototype, {
  draw() {
    this.updateCamera();
    ctx.setTransform(canvas.width / VIEW.width, 0, 0, canvas.height / VIEW.height, 0, 0);
    ctx.save();
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);
    if (this.shake > 0) ctx.translate(random(-this.shake, this.shake), random(-this.shake, this.shake));
    ctx.scale(this.camera.scale, this.camera.scale);
    ctx.translate(-this.camera.x, -this.camera.y);
    this.drawBackground();
    this.drawDrops();
    this.drawEffects();
    this.drawEnemies();
    this.drawPlayer();
    this.drawParticles();
    this.drawTexts();
    ctx.restore();
    this.drawOffscreenIndicators();
  },

  updateCamera() {
    if (!this.camera || !this.player) return;
    const viewW = VIEW.width / this.camera.scale;
    const viewH = VIEW.height / this.camera.scale;
    this.camera.x = clamp(this.player.x - viewW / 2, 0, WORLD.width - viewW);
    this.camera.y = clamp(this.player.y - viewH / 2, 0, WORLD.height - viewH);
  },

  drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.height);
    gradient.addColorStop(0, "#101827");
    gradient.addColorStop(1, "#17243a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let y = WORLD.minY; y <= WORLD.maxY; y += 42) {
      ctx.beginPath();
      ctx.moveTo(WORLD.minX, y);
      ctx.lineTo(WORLD.maxX, y);
      ctx.stroke();
    }
    for (let x = WORLD.minX; x <= WORLD.maxX; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, WORLD.minY);
      ctx.lineTo(x, WORLD.maxY);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.strokeRect(WORLD.minX, WORLD.minY, WORLD.maxX - WORLD.minX, WORLD.maxY - WORLD.minY);
  },

  drawSpriteFrame(image, frame, row, frameWidth, frameHeight, x, y, width, height, options = {}) {
    if (!image || !image.complete || image.naturalWidth <= 0) return false;
    const { rotation = 0, alpha = 1, flip = false } = options;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    if (flip) ctx.scale(-1, 1);
    ctx.globalAlpha *= alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, frame * frameWidth, row * frameHeight, frameWidth, frameHeight, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
  },

  activeHeroAnimation() {
    const p = this.player;
    if (p.flash > 0.02) return "hurt";
    if (p.attackAnimTime > 0 && ROGUE_SPRITES.hero.animations[p.attackAnim]) return p.attackAnim;
    const keyMoving = this.keys.has("KeyA") || this.keys.has("ArrowLeft") || this.keys.has("KeyD") || this.keys.has("ArrowRight") || this.keys.has("KeyW") || this.keys.has("ArrowUp") || this.keys.has("KeyS") || this.keys.has("ArrowDown");
    const stickMoving = Math.hypot(p.inputX || 0, p.inputY || 0) > 0.05;
    return keyMoving || stickMoving ? "move" : "idle";
  },

  drawPlayerSprite() {
    const image = this.sprites?.images?.hero;
    if (!this.spriteReady("hero")) return false;
    const animName = this.activeHeroAnimation();
    const anim = ROGUE_SPRITES.hero.animations[animName] || ROGUE_SPRITES.hero.animations.idle;
    const frame = Math.floor((performance.now() / 1000) * anim.fps) % anim.frames;
    const flip = this.player.faceX < 0 && ["move", "attackDart"].includes(animName);
    return this.drawSpriteFrame(image, frame, anim.row, ROGUE_SPRITES.hero.frameWidth, ROGUE_SPRITES.hero.frameHeight, this.player.x, this.player.y - 4, 70, 70, { flip });
  },

  drawEffectAsset(effect, key, x, y, size, rotation = 0, alpha = 1) {
    if (!this.spriteReady(key)) return false;
    const sprite = ROGUE_SPRITES.effects[key];
    const image = this.sprites.images[key];
    const progress = 1 - clamp(effect.life / effect.maxLife, 0, 1);
    const frame = Math.min(sprite.frames - 1, Math.floor(progress * sprite.frames));
    return this.drawSpriteFrame(image, frame, 0, sprite.frameWidth, sprite.frameHeight, x, y, size, size, { rotation, alpha });
  },

  drawPlayer() {
    const p = this.player;
    const color = p.flash > 0 ? "#ffffff" : "#5ff0b5";
    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 14, 21, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    if (p.absorb > 0 || p.shield > 0) {
      ctx.strokeStyle = rgba(p.shield > 0 ? COLORS.xp : COLORS.gold, clamp(p.absorb || 0.5, 0.22, 0.8));
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 28 + (1 - clamp(p.absorb, 0, 1)) * 12, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (!this.drawPlayerSprite()) {
      const lean = p.attackLean || 0;
      ctx.save();
      ctx.translate(p.x + lean, p.y);
      ctx.fillStyle = color;
      roundRect(ctx, -12, -18, 24, 30, 4);
      ctx.fill();
      ctx.fillStyle = "#dffcff";
      ctx.fillRect(-5, -12, 10, 7);
      ctx.fillStyle = "#182235";
      ctx.fillRect(-3, -10, 6, 3);
      ctx.fillStyle = "#7ae582";
      ctx.fillRect(-17, -6, 5, 18);
      ctx.fillRect(12, -6, 5, 18);
      ctx.restore();
    }
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(p.x - 20, p.y - 32, 40, 5);
    ctx.fillStyle = COLORS.hp;
    ctx.fillRect(p.x - 20, p.y - 32, 40 * clamp(this.hp / this.maxHp, 0, 1), 5);
  },

  drawEnemies() {
    for (const enemy of this.active.enemies) {
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      ctx.ellipse(enemy.x, enemy.y + enemy.radius, enemy.radius, enemy.radius * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      const bodyColor = enemy.flash > 0 ? "#ffffff" : enemy.slow > 0 ? COLORS.frost : enemy.color;
      drawChaosBlob(ctx, enemy.x, enemy.y, enemy.radius, bodyColor, enemy.morph || 0, enemy.shape || "box");
      if (enemy.rank && enemy.rank !== "small") {
        ctx.strokeStyle = enemy.color;
        ctx.lineWidth = enemy.rank === "boss" ? 4 : 3;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius + 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = COLORS.text;
        ctx.font = "900 9px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.fillText(enemy.label || "精英", enemy.x, enemy.y - enemy.radius - 18);
      }
      ctx.fillStyle = "rgba(0,0,0,0.52)";
      ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 9, enemy.radius * 2, 4);
      ctx.fillStyle = enemy.rank === "small" ? COLORS.hp : COLORS.danger;
      ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 9, enemy.radius * 2 * clamp(enemy.hp / enemy.maxHp, 0, 1), 4);
    }
  },

  drawDrops() {
    for (const drop of this.active.drops) {
      ctx.fillStyle = COLORS.gold;
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5f4300";
      ctx.fillRect(drop.x - 1.5, drop.y - 4, 3, 8);
    }
  },

  drawEffects() {
    for (const effect of this.active.effects) {
      const t = clamp(effect.life / effect.maxLife, 0, 1);
      ctx.save();
      if (effect.type === "slash") {
        const x = effect.x + Math.cos(effect.direction) * 20;
        const y = effect.y + Math.sin(effect.direction) * 10;
        if (!this.drawEffectAsset(effect, "slash", x, y, Math.max(88, effect.radius * 2.15), effect.direction, 0.92)) {
          ctx.strokeStyle = rgba(effect.color, t);
          ctx.lineWidth = 8 * t + 2;
          ctx.beginPath();
          ctx.arc(effect.x + Math.cos(effect.direction) * 16, effect.y + Math.sin(effect.direction) * 6, effect.radius, effect.direction - 0.85, effect.direction + 0.85);
          ctx.stroke();
        }
      } else if (effect.type === "missile" || effect.type === "dart") {
        const progress = 1 - t;
        const x = lerp(effect.fromX, effect.x, progress);
        const y = lerp(effect.fromY, effect.y, progress);
        const angle = Math.atan2(effect.y - effect.fromY, effect.x - effect.fromX);
        ctx.strokeStyle = rgba(effect.color, t * 0.75);
        ctx.lineWidth = effect.type === "dart" ? 3 : 6;
        ctx.beginPath();
        ctx.moveTo(effect.fromX, effect.fromY);
        ctx.lineTo(x, y);
        ctx.stroke();
        if (!this.drawEffectAsset(effect, effect.type, x, y, effect.type === "dart" ? 72 : 58, angle, 0.95)) {
          ctx.fillStyle = effect.color;
          effect.type === "dart" ? ctx.fillRect(x - 7, y - 2, 14, 4) : pixelCircle(ctx, x, y, 6);
        }
      } else if (effect.type === "triBurst") {
        ctx.strokeStyle = rgba(effect.color, 0.22 + t * 0.6);
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = 0; i < 3; i += 1) {
          const a = -Math.PI / 2 + (i / 3) * Math.PI * 2;
          const x = effect.x + Math.cos(a) * effect.radius * (1.05 - t * 0.2);
          const y = effect.y + Math.sin(a) * effect.radius * (1.05 - t * 0.2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.strokeStyle = rgba(effect.color, 0.2 + t * 0.55);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius * (1.05 - t * 0.18), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  drawParticles() {
    for (const p of this.active.particles) {
      ctx.globalAlpha = clamp(p.life / 0.5, 0, 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.globalAlpha = 1;
    }
  },

  drawTexts() {
    ctx.textAlign = "center";
    ctx.font = "900 10px ui-sans-serif, system-ui";
    for (const text of this.active.texts) {
      ctx.globalAlpha = clamp(text.life / 0.5, 0, 1);
      ctx.fillStyle = text.color;
      ctx.fillText(text.text, text.x, text.y);
      ctx.globalAlpha = 1;
    }
  },

  drawOffscreenIndicators() {
    if (!this.active?.enemies?.length || !this.camera) return;
    const viewW = VIEW.width / this.camera.scale;
    const viewH = VIEW.height / this.camera.scale;
    const left = this.camera.x;
    const right = this.camera.x + viewW;
    const top = this.camera.y;
    const bottom = this.camera.y + viewH;
    const offscreen = this.active.enemies
      .filter((enemy) => enemy.x < left || enemy.x > right || enemy.y < top || enemy.y > bottom)
      .sort((a, b) => distance(a, this.player) - distance(b, this.player))
      .slice(0, this.mobileViewport ? 4 : 6);
    ctx.save();
    ctx.setTransform(canvas.width / VIEW.width, 0, 0, canvas.height / VIEW.height, 0, 0);
    for (const enemy of offscreen) {
      const sx = (enemy.x - this.camera.x) * this.camera.scale;
      const sy = (enemy.y - this.camera.y) * this.camera.scale;
      const x = clamp(sx, 18, VIEW.width - 18);
      const y = clamp(sy, 92, VIEW.height - 92);
      const angle = Math.atan2(sy - VIEW.height / 2, sx - VIEW.width / 2);
      const isBoss = enemy.rank === "boss" || enemy.rank === "lieutenant";
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = isBoss ? COLORS.danger : enemy.rank && enemy.rank !== "small" ? COLORS.gold : "rgba(255,85,112,0.72)";
      ctx.beginPath();
      ctx.moveTo(isBoss ? 13 : 9, 0);
      ctx.lineTo(isBoss ? -8 : -6, isBoss ? -8 : -5);
      ctx.lineTo(isBoss ? -5 : -4, 0);
      ctx.lineTo(isBoss ? -8 : -6, isBoss ? 8 : 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
});

Object.assign(RogueGame.prototype, {
  startVirtualJoystick(event) {
    if (this.mode !== "combat") return;
    this.joystick.active = true;
    this.joystick.pointerId = event.pointerId;
    this.joystick.startX = event.clientX;
    this.joystick.startY = event.clientY;
    this.joystick.currentX = event.clientX;
    this.joystick.currentY = event.clientY;
    this.player.inputX = 0;
    this.player.inputY = 0;
    if (ui.joystick) {
      ui.joystick.style.left = `${event.clientX}px`;
      ui.joystick.style.top = `${event.clientY}px`;
      ui.joystick.classList.add("active");
    }
    if (ui.joystickKnob) {
      ui.joystickKnob.style.transform = "translate(-50%, -50%)";
    }
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    event.preventDefault();
  },

  updateVirtualJoystick(event) {
    if (!this.joystick.active) return;
    if (this.joystick.pointerId !== null && event.pointerId !== this.joystick.pointerId) return;
    const dx = event.clientX - this.joystick.startX;
    const dy = event.clientY - this.joystick.startY;
    const len = Math.hypot(dx, dy);
    const radius = this.joystick.radius;
    const clamped = Math.min(radius, len);
    const nx = len > 0 ? dx / len : 0;
    const ny = len > 0 ? dy / len : 0;
    this.joystick.currentX = this.joystick.startX + nx * clamped;
    this.joystick.currentY = this.joystick.startY + ny * clamped;
    this.player.inputX = nx * Math.min(1, len / radius);
    this.player.inputY = ny * Math.min(1, len / radius);
    if (ui.joystickKnob) {
      ui.joystickKnob.style.transform = `translate(calc(-50% + ${nx * clamped}px), calc(-50% + ${ny * clamped}px))`;
    }
    event.preventDefault();
  },

  endVirtualJoystick(event) {
    if (event?.pointerId !== undefined && this.joystick.pointerId !== null && event.pointerId !== this.joystick.pointerId) return;
    this.joystick.active = false;
    this.joystick.pointerId = null;
    this.player.inputX = 0;
    this.player.inputY = 0;
    ui.joystick?.classList.remove("active");
    if (ui.joystickKnob) ui.joystickKnob.style.transform = "translate(-50%, -50%)";
    if (event?.pointerId !== undefined && canvas.releasePointerCapture) {
      try {
        if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      } catch {}
    }
  },

  updatePlayer(dt) {
    let dx = 0;
    let dy = 0;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) dx -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) dx += 1;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) dy -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) dy += 1;
    if (this.joystick.active) {
      dx = this.player.inputX;
      dy = this.player.inputY;
    }
    const len = Math.hypot(dx, dy);
    if (len > 0.02) {
      this.player.x += (dx / len) * this.player.speed * dt;
      this.player.y += (dy / len) * this.player.speed * dt;
      if (Math.abs(dx) > 0.05) this.player.faceX = dx < 0 ? -1 : 1;
    }
    this.player.x = clamp(this.player.x, WORLD.minX, WORLD.maxX);
    this.player.y = clamp(this.player.y, WORLD.minY, WORLD.maxY);
    this.player.step += len * dt * 10;
    this.player.flash = Math.max(0, this.player.flash - dt);
    this.player.absorb = Math.max(0, this.player.absorb - dt);
    this.player.attackAnimTime = Math.max(0, this.player.attackAnimTime - dt);
    this.player.attackLean = lerp(this.player.attackLean, 0, 1 - Math.pow(0.0005, dt));
    this.updateCamera();
  },
});

Object.assign(RogueGame.prototype, {
  updateEffects(dt) {
    for (let i = this.active.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.active.effects[i];
      if (effect.type === "enemyShot") {
        effect.x += effect.vx * dt;
        effect.y += effect.vy * dt;
        if (distance(effect, this.player) <= effect.radius + this.player.radius) {
          this.hurtPlayer(effect.damage);
          this.releaseActive(this.active.effects, i, this.effectPool);
          continue;
        }
      }
      effect.life -= dt;
      if (effect.life <= 0) this.releaseActive(this.active.effects, i, this.effectPool);
    }
    for (let i = this.active.particles.length - 1; i >= 0; i -= 1) {
      const p = this.active.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.releaseActive(this.active.particles, i, this.particlePool);
    }
    for (let i = this.active.texts.length - 1; i >= 0; i -= 1) {
      const text = this.active.texts[i];
      text.y -= 24 * dt;
      text.life -= dt;
      if (text.life <= 0) this.releaseActive(this.active.texts, i, this.textPool);
    }
  },
});

Object.assign(RogueGame.prototype, {
  update(dt) {
    this.floorTime += dt;
    this.spawnTimer -= dt;
    this.shake = Math.max(0, this.shake - dt * 18);
    this.triBurstCooldown = Math.max(0, this.triBurstCooldown - dt);
    this.updatePlayer(dt);
    this.updateSpawn();
    this.updateWeapons(dt);
    this.updateEnemies(dt);
    this.updateDrops(dt);
    this.updateEffects(dt);
    this.checkFloorClear();
    this.updateUi();
    if (this.hp <= 0) this.gameOver();
  },

  updateSpawn() {
    if (this.floorSpawned >= this.floorSpawnLimit) {
      if (this.specialForFloor(this.floor) && !this.specialSpawned) this.spawnSpecial();
      return;
    }
    if (this.active.enemies.length >= this.enemyCap()) return;
    if (this.spawnTimer > 0) return;
    const batch = this.floor <= 2 ? 1 : this.floor >= 10 ? 3 : this.floor >= 4 ? 2 : 1;
    for (let i = 0; i < batch && this.active.enemies.length < this.enemyCap(); i += 1) {
      if (!this.spawnEnemy()) break;
    }
    const pressure = Math.min(0.46, Math.max(0, this.floor - 3) * 0.035);
    this.spawnTimer = Math.max(0.16, random(0.34, 0.72) - pressure);
    if (this.specialForFloor(this.floor) && !this.specialSpawned && this.floorSpawned >= Math.floor(this.floorSpawnLimit * 0.65)) this.spawnSpecial();
  },

  enemyCap() {
    return this.mobileViewport ? 42 : 76;
  },

  enemyScaleFor(floor) {
    return {
      hp: 0.66 + floor * 0.055 + Math.max(0, floor - 9) * 0.035,
      attack: 0.48 + floor * 0.045,
      speed: 0.9 + Math.min(0.48, floor * 0.018),
      xp: floor === 1 ? 1.7 : 0.86 + floor * 0.045,
    };
  },

  spawnEnemy() {
    if (this.floorSpawned >= this.floorSpawnLimit) return false;
    const scale = this.enemyScaleFor(this.floor);
    const pool = [
      { kind: "grunt", hp: 12, speed: 42, radius: 10, attack: 4, xp: 8, coins: 2, color: "#ff5570", shape: "box" },
      { kind: "fast", hp: 8, speed: 66, radius: 9, attack: 3, xp: 7, coins: 1, color: "#ffb86b", shape: "diamond" },
      { kind: "heavy", hp: 20, speed: 34, radius: 13, attack: 5, xp: 12, coins: 3, color: "#e7edf5", shape: "box" },
    ];
    if (this.floor >= 4) pool.push({ kind: "shooter", hp: 15, speed: 30, radius: 12, attack: 7, xp: 13, coins: 4, color: "#b584ff", shape: "hollow" });
    const base = pool[Math.floor(Math.random() * pool.length)];
    const early = this.floor === 1 && this.floorTime < 20;
    const enemy = this.enemyPool.get();
    this.placeOnEdge(enemy);
    Object.assign(enemy, {
      active: true,
      kind: base.kind,
      rank: "small",
      label: "",
      hp: base.hp * scale.hp * (early ? 0.62 : 1),
      maxHp: base.hp * scale.hp * (early ? 0.62 : 1),
      speed: base.speed * scale.speed * (early ? 0.82 : 1),
      radius: base.radius,
      attack: base.attack * scale.attack * (early ? 0.48 : 1),
      defense: 0,
      xp: Math.ceil(base.xp * scale.xp),
      coins: Math.max(1, Math.round(base.coins * (0.9 + this.floor * 0.04))),
      color: base.color,
      shape: base.shape,
      attackTimer: random(0.6, 1.2),
      shootTimer: base.kind === "shooter" ? random(1.7, 2.8) : 99,
      flash: 0,
      slow: 0,
      bleed: 0,
      cursed: 0,
      marked: 0,
      pulse: random(0, Math.PI * 2),
      morph: random(0, Math.PI * 2),
      spin: random(-1.2, 1.2),
    });
    this.active.enemies.push(enemy);
    this.floorSpawned += 1;
    return true;
  },

  spawnSpecial() {
    const spec = this.specialForFloor(this.floor);
    if (!spec || this.specialSpawned) return;
    const scale = this.enemyScaleFor(this.floor);
    const enemy = this.enemyPool.get();
    this.placeOnEdge(enemy);
    Object.assign(enemy, {
      active: true,
      kind: "special",
      rank: spec.rank,
      label: spec.label,
      hp: 18 * spec.hp * scale.hp,
      maxHp: 18 * spec.hp * scale.hp,
      speed: 31 * scale.speed,
      radius: 14 * spec.radius,
      attack: 6 * scale.attack * (spec.rank === "boss" ? 1.35 : 1),
      defense: 0.08,
      xp: Math.ceil(90 + this.floor * 18),
      coins: Math.ceil((30 + this.floor * 7) * this.runStats.rewardMultiplier),
      color: spec.color,
      shape: "box",
      attackTimer: 0.9,
      shootTimer: 1.6,
      flash: 0,
      slow: 0,
      bleed: 0,
      cursed: 0,
      marked: 0,
      pulse: 0,
      morph: random(0, Math.PI * 2),
      spin: random(-0.8, 0.8),
    });
    this.specialSpawned = true;
    this.specialDefeated = false;
    this.active.enemies.push(enemy);
    this.shake = Math.max(this.shake, spec.rank === "boss" ? 9 : 5);
    this.openBossCue(spec);
    this.sfx.play(spec.rank === "boss" ? "boss" : "level");
  },

  viewBounds(padding = 0) {
    const scale = this.camera?.scale || 1;
    const width = VIEW.width / scale;
    const height = VIEW.height / scale;
    return {
      left: clamp((this.camera?.x || 0) - padding, 0, WORLD.width),
      right: clamp((this.camera?.x || 0) + width + padding, 0, WORLD.width),
      top: clamp((this.camera?.y || 0) - padding, 0, WORLD.height),
      bottom: clamp((this.camera?.y || 0) + height + padding, 0, WORLD.height),
    };
  },

  placeOnEdge(enemy) {
    const side = Math.floor(Math.random() * 4);
    const view = this.viewBounds(82);
    if (side === 0) {
      enemy.x = random(view.left, view.right);
      enemy.y = view.top - 28;
    } else if (side === 1) {
      enemy.x = view.right + 28;
      enemy.y = random(view.top, view.bottom);
    } else if (side === 2) {
      enemy.x = random(view.left, view.right);
      enemy.y = view.bottom + 28;
    } else {
      enemy.x = view.left - 28;
      enemy.y = random(view.top, view.bottom);
    }
    enemy.x = clamp(enemy.x, WORLD.minX - 50, WORLD.maxX + 50);
    enemy.y = clamp(enemy.y, WORLD.minY - 50, WORLD.maxY + 50);
  },

  updateWeapons(dt) {
    for (const weapon of this.weapons) {
      weapon.timer -= dt;
      if (weapon.timer > 0) continue;
      if (weapon.id === "knife") this.castKnife(weapon);
      if (weapon.id === "magicMissile") this.castMagicMissile(weapon);
      if (weapon.id === "dart") this.castDart(weapon);
      const haste = this.hasBlessing("wind") ? 0.88 : 1;
      weapon.timer = Math.max(0.16, weapon.cooldown * haste);
    }
  },

  castKnife(weapon) {
    const target = this.findTarget(weapon.range + 40);
    const angle = target ? Math.atan2(target.y - this.player.y, target.x - this.player.x) : 0;
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    let hits = 0;
    for (const enemy of this.active.enemies) {
      const vx = enemy.x - this.player.x;
      const vy = enemy.y - this.player.y;
      const dist = Math.hypot(vx, vy);
      if (dist > weapon.range + enemy.radius) continue;
      const dot = dist > 0 ? (vx / dist) * ux + (vy / dist) * uy : 1;
      if (dot < 0.28) continue;
      this.damageEnemy(enemy, weapon.damage, weapon.color, "knife");
      if (this.hasBlessing("blood")) enemy.bleed = 3.2;
      hits += 1;
    }
    if (hits) {
      this.player.attackLean = Math.cos(angle) * 4;
      this.player.attackAnim = "attackKnife";
      this.player.attackAnimTime = 0.24;
      this.player.faceX = Math.cos(angle) < -0.05 ? -1 : 1;
      this.addEffect("slash", this.player.x, this.player.y, weapon.range + 10, weapon.color, angle);
      if (this.hasSynergy("arcaneBlades") && Math.random() < 0.35) this.spawnArcaneBladeMissile();
      if (this.hasBlessing("wind")) this.addEffect("slash", this.player.x + ux * 18, this.player.y + uy * 18, weapon.range + 18, COLORS.xp, angle);
      this.recordWeaponHit("knife");
      this.sfx.play("melee");
    }
  },

  castMagicMissile(weapon) {
    const shots = weapon.shots + (this.hasBlessing("arcane") && Math.random() < 0.35 ? 1 : 0);
    let fired = 0;
    const used = [];
    for (let i = 0; i < shots; i += 1) {
      const target = this.findTarget(weapon.range, used, true);
      if (!target) break;
      used.push(target);
      this.damageEnemy(target, weapon.damage * (i > 0 ? 0.62 : 1), weapon.color, "magicMissile");
      this.addEffect("missile", target.x, target.y, 0, weapon.color, 0, this.player.x, this.player.y - 12);
      if (this.hasSynergy("runeDart") && target.marked) this.areaDamage(target.x, target.y, 34, weapon.damage * 0.45, COLORS.mage);
      if (this.hasSynergy("arcaneBlades")) {
        const knife = this.weapons.find((item) => item.id === "knife");
        if (knife) knife.timer = Math.min(knife.timer, 0.08);
      }
      this.recordWeaponHit("magicMissile");
      fired += 1;
    }
    if (fired) {
      this.player.attackAnim = "attackMagic";
      this.player.attackAnimTime = 0.24;
      this.sfx.play("mage");
    }
  },

  castDart(weapon) {
    const target = this.findTarget(weapon.range + 20);
    if (!target) return;
    const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const hits = [];
    for (const enemy of this.active.enemies) {
      const vx = enemy.x - this.player.x;
      const vy = enemy.y - this.player.y;
      const along = vx * ux + vy * uy;
      const side = Math.abs(vx * uy - vy * ux);
      if (along > 0 && along < weapon.range && side < 12 + enemy.radius) hits.push({ enemy, along });
    }
    hits.sort((a, b) => a.along - b.along);
    const maxHits = weapon.pierce + 1;
    for (let i = 0; i < Math.min(maxHits, hits.length); i += 1) {
      const enemy = hits[i].enemy;
      this.damageEnemy(enemy, weapon.damage, weapon.color, "dart");
      enemy.marked = Math.max(enemy.marked, 4);
      if (this.hasBlessing("curse")) enemy.cursed = Math.max(enemy.cursed, 5);
      if (this.hasSynergy("returningDance")) this.damageEnemy(enemy, weapon.damage * 0.45, COLORS.warrior, "knife");
    }
    this.addEffect("dart", this.player.x + ux * weapon.range, this.player.y + uy * weapon.range, 0, weapon.color, angle, this.player.x, this.player.y);
    this.addEffect("dart", this.player.x, this.player.y, 0, weapon.color, angle + Math.PI, this.player.x + ux * weapon.range, this.player.y + uy * weapon.range);
    this.player.attackAnim = "attackDart";
    this.player.attackAnimTime = 0.24;
    this.player.faceX = ux < -0.05 ? -1 : 1;
    if (hits.length) {
      this.recordWeaponHit("dart");
      this.sfx.play("archer");
    }
  },
});

Object.assign(RogueGame.prototype, {
  hasBlessing(id) {
    return this.blessings.some((item) => item.id === id);
  },

  hasSynergy(id) {
    return this.synergies.some((item) => item.id === id);
  },

  findTarget(range, exclude = [], preferMarked = false) {
    let best = null;
    let bestScore = range;
    for (const enemy of this.active.enemies) {
      if (exclude.includes(enemy)) continue;
      const d = distance(enemy, this.player);
      if (d > range) continue;
      const markBonus = preferMarked && (enemy.marked || enemy.cursed) ? 120 : 0;
      const score = d - markBonus;
      if (score < bestScore) {
        best = enemy;
        bestScore = score;
      }
    }
    return best;
  },

  damageEnemy(enemy, damage, color, source = "generic") {
    if (!enemy || enemy.hp <= 0) return;
    const finalDamage = Math.max(1, damage * (1 - (enemy.defense || 0)));
    enemy.hp -= finalDamage;
    enemy.flash = 0.1;
    this.hitStop = Math.max(this.hitStop, 0.004);
    this.floatText(Math.round(finalDamage), enemy.x, enemy.y - enemy.radius - 5, color);
    this.burst(enemy.x, enemy.y, color, 3);
    if (source) this.recordWeaponHit(source);
  },

  areaDamage(x, y, radius, damage, color) {
    let hits = 0;
    for (const enemy of this.active.enemies) {
      if (Math.hypot(enemy.x - x, enemy.y - y) <= radius + enemy.radius) {
        this.damageEnemy(enemy, damage, color, "");
        hits += 1;
      }
    }
    if (hits) this.addEffect("ring", x, y, radius, color);
  },

  recordWeaponHit(weaponId) {
    if (!["knife", "magicMissile", "dart"].includes(weaponId)) return;
    this.lastHits[weaponId] = this.floorTime;
    const ready = ["knife", "magicMissile", "dart"].every((id) => this.lastHits[id] !== undefined && this.floorTime - this.lastHits[id] <= 3);
    if (ready && this.hasSynergy("triBurst") && this.triBurstCooldown <= 0) {
      this.triBurstCooldown = 5.5;
      this.areaDamage(this.player.x, this.player.y, 118, 58 + this.level * 4, COLORS.gold);
      this.addEffect("triBurst", this.player.x, this.player.y, 116, COLORS.gold);
      this.unlockAchievement("triBurstFirst");
      this.say("三相爆发！");
      this.sfx.play("level");
    }
  },

  spawnArcaneBladeMissile() {
    const target = this.findTarget(220, [], true);
    if (!target) return;
    const missile = this.weapons.find((weapon) => weapon.id === "magicMissile");
    const damage = missile ? missile.damage * 0.58 : 22 + this.level * 2;
    this.damageEnemy(target, damage, COLORS.mage, "magicMissile");
    this.addEffect("missile", target.x, target.y, 0, COLORS.mage, 0, this.player.x, this.player.y - 10);
  },

  updateEnemies(dt) {
    for (let i = this.active.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.active.enemies[i];
      enemy.flash = Math.max(0, enemy.flash - dt);
      enemy.slow = Math.max(0, enemy.slow - dt);
      enemy.bleed = Math.max(0, enemy.bleed - dt);
      enemy.cursed = Math.max(0, enemy.cursed - dt);
      enemy.marked = Math.max(0, enemy.marked - dt);
      enemy.attackTimer -= dt;
      enemy.shootTimer -= dt;
      enemy.morph += dt * (6 + Math.abs(enemy.spin || 0) * 2);
      if (enemy.bleed > 0) enemy.hp -= dt * (2 + this.level * 0.45);
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      const keepAway = enemy.kind === "shooter" && len < 150 ? -0.45 : 1;
      const speed = enemy.speed * (enemy.slow > 0 ? 0.55 : 1);
      enemy.x += (dx / len) * speed * keepAway * dt;
      enemy.y += (dy / len) * speed * keepAway * dt;
      if ((enemy.kind === "shooter" || enemy.rank === "boss" || enemy.rank === "lieutenant") && enemy.shootTimer <= 0 && this.floor >= 4) {
        enemy.shootTimer = enemy.rank === "boss" ? 1.6 : random(2.1, 3.2);
        this.fireEnemyShot(enemy);
      }
      if (len <= enemy.radius + this.player.radius + 4 && enemy.attackTimer <= 0) {
        enemy.attackTimer = this.floor === 1 && this.floorTime < 20 ? 1.45 : 0.92;
        this.hurtPlayer(enemy.attack);
      }
      if (enemy.hp <= 0) this.killEnemy(i);
    }
  },

  fireEnemyShot(enemy) {
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const len = Math.hypot(dx, dy) || 1;
    if (this.active.effects.length >= this.effectCap()) this.releaseActive(this.active.effects, 0, this.effectPool);
    const shot = this.effectPool.get();
    Object.assign(shot, {
      active: true,
      type: "enemyShot",
      x: enemy.x,
      y: enemy.y,
      vx: (dx / len) * 115,
      vy: (dy / len) * 115,
      radius: enemy.rank === "boss" ? 7 : 5,
      color: enemy.color,
      damage: enemy.attack * 1.55,
      life: 4,
      maxLife: 4,
    });
    this.active.effects.push(shot);
  },

  killEnemy(index) {
    const enemy = this.active.enemies[index];
    this.floorKills += 1;
    this.runStats.kills += 1;
    if (enemy.rank && enemy.rank !== "small") {
      this.specialDefeated = true;
      this.reviveCurrency += enemy.rank === "boss" ? 2 : 1;
      this.runStats.rewardMultiplier += enemy.rank === "boss" ? 0.12 : 0.06;
    }
    if (enemy.bleed > 0 && this.hasBlessing("blood")) this.areaDamage(enemy.x, enemy.y, 38, 22 + this.level * 2, COLORS.danger);
    if (enemy.cursed > 0 && this.hasBlessing("curse")) this.spreadCurse(enemy);
    this.addXp(enemy.xp);
    this.spawnDrop(enemy.x + random(-8, 8), enemy.y + random(-8, 8), "coin", enemy.coins, 6);
    this.burst(enemy.x, enemy.y, enemy.color, enemy.rank === "small" ? 8 : 24);
    this.releaseActive(this.active.enemies, index, this.enemyPool);
    this.sfx.play("hit");
    this.checkAchievements();
  },

  spreadCurse(source) {
    let count = 0;
    for (const enemy of this.active.enemies) {
      if (enemy === source || count >= 3) continue;
      if (Math.hypot(enemy.x - source.x, enemy.y - source.y) <= 90) {
        enemy.cursed = 5;
        enemy.marked = 4;
        count += 1;
      }
    }
  },

  hurtPlayer(amount) {
    if (this.player.shield > 0) {
      this.player.shield = 0;
      this.addEffect("ring", this.player.x, this.player.y, 42, COLORS.xp);
      return;
    }
    if (this.items.some((item) => item.id === "wristguard") && Math.random() < 0.18) {
      this.addEffect("ring", this.player.x, this.player.y, 38, COLORS.gold);
      this.say("破旧护腕格挡了伤害。");
      return;
    }
    this.hp -= Math.max(1, amount);
    this.player.flash = 0.18;
    this.shake = Math.max(this.shake, 5);
    this.sfx.play("hurt");
    if (navigator.vibrate && this.profile.settings.vibrationEnabled) navigator.vibrate(24);
  },

  spawnDrop(x, y, kind, value, radius) {
    const drop = this.dropPool.get();
    Object.assign(drop, {
      active: true,
      kind,
      x,
      y,
      vx: random(-34, 34),
      vy: random(-34, 34),
      value,
      radius,
      color: COLORS.gold,
    });
    this.active.drops.push(drop);
  },

  updateDrops(dt) {
    for (let i = this.active.drops.length - 1; i >= 0; i -= 1) {
      const drop = this.active.drops[i];
      drop.x += drop.vx * dt;
      drop.y += drop.vy * dt;
      drop.vx *= Math.pow(0.12, dt);
      drop.vy *= Math.pow(0.12, dt);
      const d = distance(drop, this.player);
      const magnet = 76 + (this.items.some((item) => item.id === "magneticCord") ? 58 : 0);
      if (d < magnet) {
        const pull = 1 - Math.pow(0.00005, dt);
        drop.x = lerp(drop.x, this.player.x, pull);
        drop.y = lerp(drop.y, this.player.y, pull);
      }
      if (d < this.player.radius + drop.radius) {
        this.coins += drop.value;
        this.runStats.coinsEarned += drop.value;
        this.sfx.play("coin");
        this.releaseActive(this.active.drops, i, this.dropPool);
      }
    }
  },

  addXp(value) {
    this.xp += value;
    while (this.xp >= this.nextXp) {
      this.xp -= this.nextXp;
      this.level += 1;
      this.nextXp = Math.floor(this.nextXp * 1.28 + 22);
      this.pendingUpgrades += 1;
      this.sfx.play("level");
    }
    this.tryOpenPendingChoice();
  },

  checkFloorClear() {
    const allSpawned = this.floorSpawned >= this.floorSpawnLimit;
    if (this.mode === "combat" && allSpawned && this.specialDefeated && this.active.enemies.length === 0) this.finishFloor();
  },

  burst(x, y, color, count) {
    for (let i = 0; i < count && this.active.particles.length < 230; i += 1) {
      const angle = random(0, Math.PI * 2);
      const speed = random(28, 128);
      const p = this.particlePool.get();
      Object.assign(p, {
        active: true,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: random(2, 5),
        color,
        life: random(0.22, 0.5),
      });
      this.active.particles.push(p);
    }
  },

  floatText(text, x, y, color) {
    if (this.active.texts.length > 52) return;
    const item = this.textPool.get();
    Object.assign(item, { active: true, text, x: x + random(-4, 4), y, color, life: 0.5 });
    this.active.texts.push(item);
  },
});

Object.assign(RogueGame.prototype, {
  tryOpenPendingChoice() {
    if (this.mode !== "combat" || this.pendingUpgrades <= 0) return;
    this.openUpgradeCards();
  },

  openUpgradeCards() {
    this.mode = "upgrade";
    this.currentUpgradeChoices = this.rollUpgradeChoices();
    this.upgradeRefreshPrice = 10;
    this.renderUpgradeCards();
    ui.levelUp.classList.remove("hidden");
    this.sfx.play("deal");
    this.updateUi();
  },

  rollUpgradeChoices() {
    const choices = [];
    const ownedIds = new Set(this.weapons.map((weapon) => weapon.id));
    for (const weaponId of Object.keys(ROGUE_WEAPONS)) {
      if (!ownedIds.has(weaponId)) {
        const weapon = ROGUE_WEAPONS[weaponId];
        choices.push({
          id: `new-${weaponId}`,
          title: `获得 ${weapon.shortName}`,
          type: "武器",
          rarity: "common",
          color: weapon.color,
          text: weapon.description,
          apply: () => this.addWeapon(weaponId),
        });
      }
    }
    for (const weapon of this.weapons) {
      choices.push({
        id: `level-${weapon.id}`,
        title: `${weapon.shortName} 等级 +1`,
        type: "武器强化",
        rarity: "common",
        color: weapon.color,
        text: `${weapon.shortName} 伤害提升，冷却略微减少。`,
        apply: () => this.upgradeWeapon(weapon.id, { level: 1, cooldown: 0.035 }),
      });
      choices.push({
        id: `range-${weapon.id}`,
        title: `${weapon.shortName} 调校`,
        type: "武器强化",
        rarity: "elite",
        color: weapon.color,
        text: weapon.id === "dart" ? "飞行速度与返回速度提升。" : "攻击距离和命中反馈提升。",
        apply: () => this.upgradeWeapon(weapon.id, { range: weapon.id === "knife" ? 5 : 18, speed: 28, returnSpeed: 34 }),
      });
    }
    choices.push(
      {
        id: "twinHilt",
        title: "双生刀柄",
        type: "遗物",
        rarity: "common",
        color: COLORS.warrior,
        text: "刀攻击后，有概率追加一次反向斩击。",
        apply: () => this.addRelic({ id: "twinHilt", name: "双生刀柄" }),
      },
      {
        id: "splitCore",
        title: "分裂星核",
        type: "遗物",
        rarity: "elite",
        color: COLORS.mage,
        text: "魔法飞弹命中后，有概率分裂出小飞弹。",
        apply: () => this.addRelic({ id: "splitCore", name: "分裂星核" }),
      },
      {
        id: "tailFin",
        title: "回旋尾翼",
        type: "遗物",
        rarity: "common",
        color: COLORS.archer,
        text: "飞镖返回时伤害提升。",
        apply: () => this.addRelic({ id: "tailFin", name: "回旋尾翼" }),
      },
      {
        id: "wristguard",
        title: "破旧护腕",
        type: "遗物",
        rarity: "common",
        color: COLORS.gold,
        text: "受到伤害时，有概率格挡本次伤害。",
        apply: () => this.addRelic({ id: "wristguard", name: "破旧护腕" }),
      },
      {
        id: "smallHeal",
        title: "应急治疗",
        type: "补给",
        rarity: "common",
        color: COLORS.hp,
        text: "恢复一部分生命值。",
        apply: () => {
          this.hp = Math.min(this.maxHp, this.hp + 28);
          this.say("生命恢复。");
        },
      },
    );
    return shuffle(choices).slice(0, 3);
  },

  renderUpgradeCards() {
    ui.upgradeTitle.textContent = "升级了！";
    if (ui.upgradeNote) ui.upgradeNote.textContent = "战斗中升级奖励";
    if (ui.refreshUpgrades) {
      ui.refreshUpgrades.textContent = `刷新 ${this.upgradeRefreshPrice}金`;
      ui.refreshUpgrades.disabled = this.coins < this.upgradeRefreshPrice;
    }
    ui.upgradeItems.innerHTML = "";
    ui.upgradeItems.className = "choice-grid card-fan";
    this.currentUpgradeChoices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = `choice-card rarity-${choice.rarity || "common"}`;
      button.type = "button";
      button.style.setProperty("--card-color", choice.color || COLORS.xp);
      button.style.setProperty("--delay", `${index * 80}ms`);
      button.style.setProperty("--r", `${(index - 1) * 8}deg`);
      button.innerHTML = `<small>${choice.type} · ${RARITIES[choice.rarity || "common"].label}</small><strong>${choice.title}</strong><span>${choice.text}</span>`;
      button.addEventListener("click", () => this.chooseUpgrade(choice));
      ui.upgradeItems.appendChild(button);
    });
  },

  refreshUpgradeChoices() {
    if (this.mode !== "upgrade") return;
    if (this.coins < this.upgradeRefreshPrice) {
      this.say(`金币不足，刷新需要 ${this.upgradeRefreshPrice} 金。`);
      this.sfx.play("fail");
      return;
    }
    this.coins -= this.upgradeRefreshPrice;
    this.upgradeRefreshPrice *= 2;
    this.currentUpgradeChoices = this.rollUpgradeChoices();
    this.renderUpgradeCards();
    this.sfx.play("refresh");
    this.updateUi();
  },

  chooseUpgrade(choice) {
    if (this.mode !== "upgrade") return;
    choice.apply(this);
    this.pendingUpgrades = Math.max(0, this.pendingUpgrades - 1);
    this.addEffect("absorb", this.player.x, this.player.y, 62, choice.color || COLORS.xp);
    this.sfx.play("upgradePick");
    this.clearLayer(ui.levelUp);
    this.mode = "combat";
    this.upgradeRefreshPrice = 10;
    this.recalculateSynergies();
    this.tryOpenPendingChoice();
    this.updateUi();
  },

  addRelic(relic) {
    if (!this.items.some((item) => item.id === relic.id)) this.items.push(relic);
    this.say(`获得遗物：${relic.name}`);
    this.sfx.play("confirm");
  },
});

Object.assign(RogueGame.prototype, {
  finishFloor() {
    if (this.mode !== "combat") return;
    this.releaseAll(this.active.enemies, this.enemyPool);
    this.releaseAll(this.active.drops, this.dropPool);
    this.profile.highestFloor = Math.max(this.profile.highestFloor || 1, this.floor);
    if (this.floor >= 9) {
      this.runStats.completedNormal = true;
      this.profile.clearedNormalMode = true;
      this.profile.unlockedDeepChallenge = true;
      this.unlockAchievement("clearFloor9");
    }
    if (this.floor >= 10) {
      this.runStats.enteredDeep = true;
      this.unlockAchievement("enterDeep");
    }
    if (this.floor >= 20) {
      this.unlockAchievement("reachFloor20");
      this.winRun();
      return;
    }
    this.writeProfile();
    if (this.floor % 3 === 0) this.openStageSummary();
    else this.openIntermission();
  },

  openStageSummary() {
    this.mode = "stage";
    ui.stageTitle.textContent = `第 ${this.floor} 层阶段完成`;
    ui.stageBody.innerHTML = this.statRows([
      ["当前到达", `第 ${this.floor} 层`],
      ["击败敌人", this.runStats.kills],
      ["获得金币", this.runStats.coinsEarned],
      ["核心组合", this.highestSynergy],
      ["奖励倍率", `${this.runStats.rewardMultiplier.toFixed(2)}x`],
      ["普通局", this.floor >= 9 ? "已完成" : "进行中"],
    ]);
    ui.stageContinue.textContent = this.floor >= 9 ? "继续深入" : "继续前进";
    ui.stageSummary.classList.remove("hidden");
    this.updateUi();
  },

  continueAfterStage() {
    this.clearLayer(ui.stageSummary);
    this.runStats.rewardMultiplier += this.floor >= 9 ? 0.18 : 0.08;
    if (this.floor >= 10) this.runStats.enteredDeep = true;
    this.openIntermission();
  },

  settleRun(reason = "暂时结算") {
    this.endRun(reason, false);
  },

  openIntermission() {
    const room = this.pickRoomType();
    this.mode = room.id === "shop" ? "shop" : "intermission";
    this.currentRoom = room;
    this.intermissionRefreshPrice = room.id === "shop" ? 12 : 10;
    this.shopSelected = null;
    this.shopOffers = this.rollRoomRewards(room);
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
    this.sfx.play(room.id === "shop" ? "shopOpen" : "deal");
    this.updateUi();
  },

  pickRoomType() {
    if (this.specialForFloor(this.floor)) return { id: "bossReward", title: "高阶层间奖励", copy: "强敌倒下后，空间裂隙里掉出了更珍贵的东西。", shop: false };
    const roll = Math.random();
    if (roll < 0.3) return { id: "shrine", title: "破碎神龛", copy: "某种古老的力量正在回应你。", shop: false };
    if (roll < 0.55) return { id: "forge", title: "流浪铁匠", copy: "他只关心你的武器还能不能撑到下一层。", shop: false };
    if (roll < 0.75) return { id: "relic", title: "遗物箱", copy: "箱子里传来轻微的碰撞声。", shop: false };
    if (roll < 0.9) return { id: "supply", title: "临时补给", copy: "这里很安静，但这种安静通常不会持续太久。", shop: false };
    return { id: "shop", title: "临时商店", copy: "价格不算公道，但你可能没有更好的选择。", shop: true };
  },

  rollRoomRewards(room) {
    if (room.id === "shop") return this.rollShopOffers();
    const rewards = [];
    if (room.id === "shrine" || room.id === "bossReward") rewards.push(...Object.values(ROGUE_BLESSINGS).map((item) => this.rewardFromBlessing(item)));
    if (room.id === "forge" || room.id === "bossReward") rewards.push(...this.weapons.map((weapon) => this.rewardWeaponUpgrade(weapon)));
    if (room.id === "relic" || room.id === "bossReward") rewards.push(...this.relicRewards());
    if (room.id === "supply") rewards.push(...this.supplyRewards());
    if (room.id === "bossReward") rewards.push(this.rewardComboUpgrade());
    return shuffle(rewards).slice(0, 3);
  },

  rewardFromBlessing(blessing) {
    return {
      id: blessing.id,
      title: blessing.name,
      type: "祝福",
      rarity: blessing.rarity,
      color: blessing.color,
      text: blessing.text,
      apply: () => this.addBlessing(blessing.id),
    };
  },

  rewardWeaponUpgrade(weapon) {
    return {
      id: `forge-${weapon.id}`,
      title: weapon.id === "knife" ? "磨利刀锋" : weapon.id === "magicMissile" ? "重刻星纹" : "调整尾翼",
      type: "武器强化",
      rarity: "common",
      color: weapon.color,
      text: `${weapon.shortName} 等级 +1，并获得额外冷却缩减。`,
      apply: () => this.upgradeWeapon(weapon.id, { level: 1, cooldown: 0.05, speed: 20, returnSpeed: 24 }),
    };
  },

  relicRewards() {
    return [
      { id: "poisonFeather", title: "毒羽", type: "遗物", rarity: "common", color: "#7ae582", text: "飞镖和飞弹命中后有概率造成持续伤害。", apply: () => this.addRelic({ id: "poisonFeather", name: "毒羽" }) },
      { id: "magneticCord", title: "磁力绳", type: "遗物", rarity: "common", color: COLORS.xp, text: "飞镖返回时吸附附近经验和金币。", apply: () => this.addRelic({ id: "magneticCord", name: "磁力绳" }) },
      { id: "wristguard", title: "破旧护腕", type: "遗物", rarity: "common", color: COLORS.gold, text: "受到伤害时，有概率格挡本次伤害。", apply: () => this.addRelic({ id: "wristguard", name: "破旧护腕" }) },
      { id: "refreshTicket", title: "升级刷新券", type: "遗物", rarity: "common", color: COLORS.gold, text: "立即获得 20 金币，用于刷新升级选项。", apply: () => { this.coins += 20; this.runStats.coinsEarned += 20; } },
      { id: "oneShield", title: "一次性护盾", type: "遗物", rarity: "elite", color: COLORS.xp, text: "抵挡下一次受到的伤害。", apply: () => { this.player.shield = 1; this.say("获得一次性护盾。"); } },
    ];
  },

  supplyRewards() {
    return [
      { id: "heal", title: "应急治疗", type: "补给", rarity: "common", color: COLORS.hp, text: "恢复一部分生命值。", apply: () => { this.hp = Math.min(this.maxHp, this.hp + 45); } },
      { id: "goldBag", title: "金币袋", type: "补给", rarity: "common", color: COLORS.gold, text: "立即获得一袋金币。", apply: () => { this.coins += 28; this.runStats.coinsEarned += 28; } },
      { id: "xpPack", title: "经验残片", type: "补给", rarity: "common", color: COLORS.xp, text: "获得少量经验。", apply: () => this.addXp(Math.ceil(this.nextXp * 0.36)) },
      { id: "tempo", title: "短暂振奋", type: "补给", rarity: "common", color: COLORS.mage, text: "下一层开始时攻击速度提升。", apply: () => { for (const weapon of this.weapons) weapon.timer = 0.05; } },
    ];
  },

  rewardComboUpgrade() {
    return {
      id: "comboPulse",
      title: "组合脉冲",
      type: "组合",
      rarity: "epic",
      color: COLORS.gold,
      text: "当前激活组合效果增强。若未激活组合，则获得一把缺失武器。",
      apply: () => {
        if (this.synergies.length) {
          this.areaDamage(this.player.x, this.player.y, 120, 48 + this.level * 3, COLORS.gold);
          this.say("组合脉冲强化。");
        } else {
          const missing = Object.keys(ROGUE_WEAPONS).find((id) => !this.weapons.some((weapon) => weapon.id === id));
          if (missing) this.addWeapon(missing);
        }
      },
    };
  },
});

Object.assign(RogueGame.prototype, {
  renderIntermission() {
    const room = this.currentRoom || { id: "supply", title: "临时补给", copy: "" };
    ui.shopKicker.textContent = room.id === "shop" ? "商店房间" : "层间房间";
    ui.shopTitle.textContent = room.title;
    ui.shopCopy.textContent = room.copy;
    ui.shopGold.textContent = `金币 ${this.coins}`;
    ui.refreshShop.textContent = `刷新 ${this.intermissionRefreshPrice}金`;
    ui.refreshShop.disabled = this.coins < this.intermissionRefreshPrice;
    ui.continueRun.textContent = room.id === "shop" ? "进入下一层" : "跳过奖励";
    ui.continueRun.classList.toggle("hidden", room.id !== "shop");
    ui.shopMessage.textContent = "";
    ui.shopItems.innerHTML = "";
    ui.shopItems.className = room.id === "shop" ? "choice-grid shop-grid" : "choice-grid card-fan";
    this.shopOffers.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = `choice-card ${room.id === "shop" ? "shop-card" : ""} rarity-${item.rarity || "common"}`;
      button.type = "button";
      button.style.setProperty("--card-color", item.color || COLORS.xp);
      button.style.setProperty("--delay", `${index * 80}ms`);
      button.style.setProperty("--r", `${(index - 1) * 8}deg`);
      if (room.id === "shop") {
        button.innerHTML = `<span class="shop-icon" aria-hidden="true">${shopIconSvg(item.icon || "crystal")}</span><strong>${item.title}</strong><span>${item.type} · ${item.text}</span><em>${item.sold ? "已购买" : `${item.price} 金币`}</em>`;
      } else {
        button.innerHTML = `<small>${item.type} · ${RARITIES[item.rarity || "common"].label}</small><strong>${item.title}</strong><span>${item.text}</span>`;
      }
      button.disabled = item.sold;
      button.addEventListener("click", () => (room.id === "shop" ? this.openBuyDialog(item) : this.chooseIntermissionReward(item)));
      ui.shopItems.appendChild(button);
    });
  },

  chooseIntermissionReward(item) {
    if (this.mode !== "intermission") return;
    item.apply(this);
    if (item.type === "祝福") this.sfx.play("level");
    else this.sfx.play("upgradePick");
    this.addEffect("absorb", this.player.x, this.player.y, item.rarity === "epic" ? 82 : 62, item.color || COLORS.xp);
    this.recalculateSynergies();
    this.clearLayer(ui.shop);
    this.startFloor(this.floor + 1);
  },

  rollShopOffers() {
    const pool = [];
    pool.push(
      { id: "potion", icon: "potion", title: "生命药剂", type: "补给", rarity: "common", color: COLORS.hp, text: "回复 55 点生命。", basePrice: 18, apply: () => { this.hp = Math.min(this.maxHp, this.hp + 55); } },
      { id: "shield", icon: "shield", title: "一次性护盾", type: "遗物", rarity: "common", color: COLORS.xp, text: "抵挡下一次伤害。", basePrice: 28, apply: () => { this.player.shield = 1; } },
      { id: "ticket", icon: "scroll", title: "升级刷新券", type: "遗物", rarity: "common", color: COLORS.gold, text: "获得 30 金币，专门用于刷新构筑。", basePrice: 20, apply: () => { this.coins += 30; this.runStats.coinsEarned += 30; } },
      { id: "wristguard", icon: "shield", title: "破旧护腕", type: "遗物", rarity: "common", color: COLORS.gold, text: "受到伤害时，有概率格挡本次伤害。", basePrice: 36, apply: () => this.addRelic({ id: "wristguard", name: "破旧护腕" }) },
      { id: "magneticCord", icon: "magnet", title: "磁力绳", type: "遗物", rarity: "common", color: COLORS.xp, text: "提升金币拾取吸附范围。", basePrice: 30, apply: () => this.addRelic({ id: "magneticCord", name: "磁力绳" }) },
    );
    for (const weapon of this.weapons) {
      pool.push({
        id: `shop-${weapon.id}`,
        icon: weapon.id === "knife" ? "sword" : weapon.id === "magicMissile" ? "crystal" : "scope",
        title: `${weapon.shortName} 等级 +1`,
        type: "武器强化",
        rarity: "common",
        color: weapon.color,
        text: "指定武器强化，不提供人物基础属性。",
        basePrice: 34 + weapon.level * 6,
        apply: () => this.upgradeWeapon(weapon.id, { level: 1, cooldown: 0.04 }),
      });
    }
    return shuffle(pool).slice(0, Math.min(5, Math.max(3, pool.length))).map((item) => ({
      ...item,
      price: Math.max(8, Math.floor(item.basePrice * (1 + this.floor * 0.08))),
      sold: false,
    }));
  },

  openBuyDialog(item) {
    this.shopSelected = item;
    ui.buyIcon.innerHTML = shopIconSvg(item.icon || "crystal");
    ui.buyTitle.textContent = item.title;
    ui.buyText.textContent = `${item.type} · ${item.text}`;
    ui.buyPrice.textContent = `${item.price} 金币`;
    ui.buyConfirm.disabled = this.coins < item.price;
    ui.buyConfirm.textContent = this.coins < item.price ? "金币不足" : "确认购买";
    if (this.coins < item.price) {
      this.showShopMessage(`金币不足，还差 ${item.price - this.coins} 金。`);
      this.sfx.play("fail");
    }
    ui.buyDialog.classList.remove("hidden");
  },

  closeBuyDialog(playSound = false) {
    if (playSound) this.sfx.play("tap");
    this.shopSelected = null;
    this.clearLayer(ui.buyDialog);
    if (this.mode === "shop") this.renderIntermission();
  },

  confirmPurchase() {
    const item = this.shopSelected;
    if (!item) return;
    if (this.coins < item.price) {
      this.showShopMessage(`金币不足，刷新需要 ${item.price} 金。`);
      this.sfx.play("fail");
      return;
    }
    this.coins -= item.price;
    item.sold = true;
    item.apply(this);
    this.addEffect("ring", this.player.x, this.player.y, 58, item.color || COLORS.gold);
    this.showShopMessage(`已购买：${item.title}`);
    this.sfx.play("buyConfirm");
    this.closeBuyDialog(false);
    this.renderIntermission();
    this.updateUi();
  },

  refreshIntermission() {
    if (!["shop", "intermission"].includes(this.mode)) return;
    if (this.coins < this.intermissionRefreshPrice) {
      this.showShopMessage(`金币不足，刷新需要 ${this.intermissionRefreshPrice} 金。`);
      this.sfx.play("fail");
      return;
    }
    this.coins -= this.intermissionRefreshPrice;
    this.intermissionRefreshPrice = Math.floor(this.intermissionRefreshPrice * 1.8 + 2);
    this.shopOffers = this.currentRoom.id === "shop" ? this.rollShopOffers() : this.rollRoomRewards(this.currentRoom);
    this.sfx.play("refresh");
    this.renderIntermission();
    this.updateUi();
  },

  continueFromIntermission() {
    if (this.mode !== "shop") return;
    this.clearLayer(ui.shop);
    this.startFloor(this.floor + 1);
  },

  showShopMessage(message) {
    ui.shopMessage.textContent = message;
    this.shopMessageTimer = 2.4;
  },

  addBlessing(id) {
    const blessing = ROGUE_BLESSINGS[id];
    if (!blessing) return;
    if (!this.blessings.some((item) => item.id === id)) this.blessings.push(blessing);
    this.runStats.blessingsFound += 1;
    this.say(`获得祝福：${blessing.name}`);
    this.sfx.play("level");
  },
});

Object.assign(RogueGame.prototype, {
  openBossCue(spec) {
    this.resumeMode = "combat";
    this.mode = "cue";
    ui.bossCueKicker.textContent = spec.rank === "boss" ? "Boss 出现" : spec.rank === "lieutenant" ? "副首领出现" : "精英出现";
    ui.bossCueTitle.textContent = spec.cue;
    ui.bossCueText.textContent = `${spec.label} 正在屏幕外靠近。演出很短，点击即可继续。`;
    ui.bossCue.classList.remove("hidden");
  },

  closeBossCue() {
    this.clearLayer(ui.bossCue);
    if (this.mode === "cue") this.mode = "combat";
  },

  openSettings(message = "") {
    if (["title", "weaponSelect", "tutorial", "upgrade", "intermission", "shop", "stage", "result", "cue"].includes(this.mode)) return;
    this.resumeMode = this.mode || "combat";
    this.mode = "settings";
    ui.settings.classList.remove("hidden");
    this.renderSettingsMenu();
    if (message) this.say(message);
  },

  closeSettings() {
    this.clearLayer(ui.settings);
    ui.settingsContent.classList.add("hidden");
    ui.settingsMenu.classList.remove("hidden");
    if (this.mode === "settings") this.mode = this.resumeMode || "combat";
  },

  renderSettingsMenu() {
    ui.settingsTitle.textContent = "战斗菜单";
    ui.settingsMenu.classList.remove("hidden");
    ui.settingsContent.classList.add("hidden");
    ui.settingsContent.innerHTML = "";
  },

  confirmRestartRun() {
    if (!confirm("确定要重新开始吗？当前进度将会清空。")) return;
    const weapon = this.startingWeapon || this.profile.lastStartingWeapon || "knife";
    this.startRun(weapon, { skipTutorial: true });
  },

  confirmReturnLobby() {
    if (!confirm("确定要返回大厅吗？当前进度将会清空。")) return;
    this.returnToLobby();
  },

  returnToLobby() {
    this.clearAllModals();
    this.resetToTitle();
  },

  showHelp() {
    ui.settingsTitle.textContent = "说明";
    ui.settingsMenu.classList.add("hidden");
    ui.settingsContent.classList.remove("hidden");
    ui.settingsContent.innerHTML = "";
    ui.settingsContent.appendChild(this.settingsBackButton());
    const copy = document.createElement("p");
    copy.className = "modal-copy";
    copy.textContent = "拖动屏幕移动角色。武器会自动攻击。击败敌人获得经验，升级后选择奖励。";
    ui.settingsContent.appendChild(copy);
  },

  renderAudioSettings() {
    ui.settingsTitle.textContent = "游戏设置";
    ui.settingsMenu.classList.add("hidden");
    ui.settingsContent.classList.remove("hidden");
    ui.settingsContent.innerHTML = "";
    ui.settingsContent.appendChild(this.settingsBackButton());
    const panel = document.createElement("div");
    panel.className = "audio-settings";
    panel.innerHTML = `
      <label><span>游戏音效</span><input id="sfx-volume" type="range" min="0" max="1" step="0.05" value="${this.audioSettings.sfxVolume}"></label>
      <label><span>背景音效</span><input id="music-volume" type="range" min="0" max="1" step="0.05" value="${this.audioSettings.musicVolume}"></label>
      <label class="check-row"><input id="sfx-muted" type="checkbox" ${this.audioSettings.sfxMuted ? "checked" : ""}> 关闭游戏音效</label>
      <label class="check-row"><input id="music-muted" type="checkbox" ${this.audioSettings.musicMuted ? "checked" : ""}> 关闭背景音效</label>
    `;
    ui.settingsContent.appendChild(panel);
    panel.querySelector("#sfx-volume").addEventListener("input", (event) => {
      this.audioSettings.sfxVolume = Number(event.target.value);
      this.sfx.setSfxVolume(this.audioSettings.sfxVolume);
      this.writeAudioSettings();
    });
    panel.querySelector("#music-volume").addEventListener("input", (event) => {
      this.audioSettings.musicVolume = Number(event.target.value);
      this.sfx.setMusicVolume(this.audioSettings.musicVolume);
      this.writeAudioSettings();
    });
    panel.querySelector("#sfx-muted").addEventListener("change", (event) => {
      this.audioSettings.sfxMuted = event.target.checked;
      this.sfx.setSfxMuted(this.audioSettings.sfxMuted);
      this.writeAudioSettings();
    });
    panel.querySelector("#music-muted").addEventListener("change", (event) => {
      this.audioSettings.musicMuted = event.target.checked;
      this.sfx.setMusicMuted(this.audioSettings.musicMuted);
      this.writeAudioSettings();
    });
  },

  settingsBackButton() {
    const back = document.createElement("button");
    back.type = "button";
    back.className = "ghost-button settings-back";
    back.textContent = "返回";
    back.addEventListener("click", () => this.renderSettingsMenu());
    return back;
  },

  openStatsPanel() {
    const rows = [
      ["初始武器", this.startingWeapon ? ROGUE_WEAPONS[this.startingWeapon].shortName : "未选择"],
      ["当前武器", this.weapons.map((weapon) => `${weapon.shortName} Lv.${weapon.level}`).join(" / ") || "无"],
      ["祝福", this.blessings.map((item) => item.name).join(" / ") || "无"],
      ["遗物", this.items.map((item) => item.name).join(" / ") || "无"],
      ["激活组合", this.synergies.map((item) => item.name).join(" / ") || "无"],
      ["最高组合", this.highestSynergy],
    ];
    ui.statsTitle.textContent = `游隙者 Lv.${this.level}`;
    ui.statsBody.innerHTML = this.statRows(rows);
    ui.statsPanel.classList.remove("hidden");
  },

  closeStatsPanel() {
    this.clearLayer(ui.statsPanel);
  },

  gameOver() {
    if (this.runEnded) return;
    this.endRun("英雄倒下", true);
  },

  winRun() {
    this.endRun("深层领主已击败", false);
  },

  endRun(title, defeated) {
    this.runEnded = true;
    this.mode = "result";
    this.releaseAll(this.active.enemies, this.enemyPool);
    this.profile.highestFloor = Math.max(this.profile.highestFloor || 1, this.runStats.floorsReached || this.floor);
    this.profile.highestKills = Math.max(this.profile.highestKills || 0, this.runStats.kills);
    if (this.highestSynergy !== "无") this.profile.bestSynergy = this.highestSynergy;
    if (this.runStats.completedNormal) this.profile.clearedNormalMode = true;
    if (this.runStats.enteredDeep) this.profile.unlockedDeepChallenge = true;
    this.writeProfile();
    ui.resultTitle.textContent = title;
    const survived = Math.floor((performance.now() - this.runStats.startTime) / 1000);
    ui.resultBody.innerHTML = this.statRows([
      ["存活时间", formatTime(survived)],
      ["击败敌人", this.runStats.kills],
      ["到达层数", `第 ${Math.max(this.floor, this.runStats.floorsReached)} 层`],
      ["普通局", this.runStats.completedNormal ? "已完成" : "未完成"],
      ["深层挑战", this.runStats.enteredDeep ? "已进入" : "未进入"],
      ["最高组合", this.highestSynergy],
      ["获得金币", this.runStats.coinsEarned],
    ]);
    ui.resultModal.classList.remove("hidden");
    this.sfx.play(defeated ? "fail" : "confirm");
    this.updateUi();
  },

  retryRun() {
    this.startRun(this.startingWeapon || this.profile.lastStartingWeapon || "knife", { skipTutorial: true });
  },

  changeStartingWeapon() {
    this.clearAllModals();
    this.openWeaponSelect();
  },

  statRows(rows) {
    return rows.map(([label, value]) => `<div class="stats-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
  },

  unlockAchievement(id) {
    if (this.profile.unlockedAchievements.includes(id)) return;
    const names = {
      triBurstFirst: "首次触发三相爆发",
      kill300: "单局击败 300 个敌人",
      knifeFloor3: "用刀开局到达第 3 层",
      missileFloor3: "用飞弹开局到达第 3 层",
      dartFloor3: "用飞镖开局到达第 3 层",
      clearFloor9: "首次通关第 9 层",
      enterDeep: "首次进入深层挑战",
      reachFloor20: "首次到达第 20 层",
    };
    this.profile.unlockedAchievements.push(id);
    this.writeProfile();
    this.say(`成就：${names[id] || id}`);
  },

  checkAchievements() {
    if (this.runStats.kills >= 300) this.unlockAchievement("kill300");
    if (this.floor >= 3 && this.startingWeapon === "knife") this.unlockAchievement("knifeFloor3");
    if (this.floor >= 3 && this.startingWeapon === "magicMissile") this.unlockAchievement("missileFloor3");
    if (this.floor >= 3 && this.startingWeapon === "dart") this.unlockAchievement("dartFloor3");
  },
});

window.__swipeDefenseGame = new RogueGame();
