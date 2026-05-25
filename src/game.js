const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const ui = {
  wave: document.querySelector("#wave"),
  timer: document.querySelector("#timer"),
  remaining: document.querySelector("#remaining"),
  heroName: document.querySelector("#hero-name"),
  hudAvatar: document.querySelector("#hud-avatar"),
  hp: document.querySelector("#hp"),
  hpFill: document.querySelector("#hp-fill"),
  coins: document.querySelector("#coins"),
  gems: document.querySelector("#gems"),
  minimapCanvas: document.querySelector("#minimap-canvas"),
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
  echo: "#53d8fb",
  warrior: "#ffe66d",
  mage: "#bdb2ff",
  archer: "#7ae582",
  frost: "#9bf6ff",
  fire: "#ff9f1c",
  playerSkin: "#f5c7a9",
  playerHair: "#2a1a19",
  playerCloth: "#4ee2a0",
};

const HEART_HP = 20;
const HIT_HEART_DAMAGE = HEART_HP / 2;

const RARITIES = {
  common: { label: "普通", color: "#4ee2a0", weight: 62 },
  elite: { label: "精英", color: "#53d8fb", weight: 25 },
  epic: { label: "史诗", color: "#bdb2ff", weight: 10 },
  legendary: { label: "传说", color: "#ffd166", weight: 3 },
};

function rarityColor(rarity = "common") {
  return RARITIES[rarity]?.color || RARITIES.common.color;
}

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

function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
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

const ROGUE_STORAGE_KEY = "endless-rift-profile-v1";
const ROGUE_TUTORIAL_KEY = "endless-rift-seen-tutorial";
const ROGUE_SPRITES = {
  avatar: "assets/sprites/hero_avatar.png",
  hero: {
    src: "assets/sprites/hero_spritesheet.png",
    frameWidth: 128,
    frameHeight: 128,
    directions: {
      idle_front: { src: "assets/sprites/hero_idle_4dir.png", row: 0 },
      idle_right: { src: "assets/sprites/hero_idle_4dir.png", row: 1 },
      idle_back: { src: "assets/sprites/hero_idle_4dir.png", row: 2 },
      idle_left: { src: "assets/sprites/hero_idle_4dir.png", row: 3 },
      attack_front: { src: "assets/sprites/hero_attack_4dir.png", row: 0 },
      attack_right: { src: "assets/sprites/hero_attack_4dir.png", row: 1 },
      attack_back: { src: "assets/sprites/hero_attack_4dir.png", row: 2 },
      attack_left: { src: "assets/sprites/hero_attack_4dir.png", row: 3 },
    },
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
    slash: { src: "assets/sprites/effect_knife_attack_right.png", frameWidth: 512, frameHeight: 512, frames: 8, fps: 22 },
    missile: { src: "assets/sprites/effect_magic_missile_sheet.png", frameWidth: 256, frameHeight: 256, frames: 7, fps: 24 },
    dart: { src: "assets/sprites/effect_dart_trail.png", frameWidth: 128, frameHeight: 128, frames: 7, fps: 20 },
    needle: { src: "assets/sprites/effect_needle_attack_right.png", frameWidth: 512, frameHeight: 512, frames: 8, fps: 24 },
  },
};

const ROGUE_MAPS = [
  { id: "map01", label: "1-10层", src: "assets/maps/map_01_05.png" },
  { id: "map02", label: "11-20层", src: "assets/maps/map_06_10.png" },
  { id: "map03", label: "21-30层", src: "assets/maps/map_11_15.png" },
  { id: "map04", label: "31-40层", src: "assets/maps/map_16_20.png" },
];

const GAME_DATA = window.GAMEFIGHT_DATA || {};
const DATA_WEAPON_CONFIGS = GAME_DATA.weaponConfigs || {};

const ROGUE_WEAPONS = {
  knife: {
    id: "knife",
    name: "太刀",
    shortName: "太刀",
    role: "近身赌命流",
    color: COLORS.warrior,
    icon: "刀",
    description: "中近距离范围攻击，攻速较低，但拥有稳定清怪、连段和突进成长。",
    details: "太刀不是旧短刃。\n它的节奏更慢，但范围更稳。\n\n攻击方式：自动朝最近敌人挥出扇形刀光。",
    damage: 24,
    cooldown: 0.72,
    range: 58,
    level: 1,
  },
  magicMissile: {
    id: "magicMissile",
    name: "法杖",
    shortName: "法杖",
    role: "奥术弹幕流",
    color: COLORS.mage,
    icon: "杖",
    description: "远程法术武器，依靠魔法弹、分裂弹、魔法阵和贯穿光束控场。",
    details: "法杖会自动锁定敌人。\n前期安全稳定，后期依靠魔阵和光束清场。\n\n攻击方式：自动锁定并发射魔法弹。",
    damage: 34,
    cooldown: 0.86,
    range: 230,
    level: 1,
  },
  dart: {
    id: "dart",
    name: "回旋飞镖",
    shortName: "飞镖",
    role: "拉扯收割流",
    color: COLORS.archer,
    icon: "镖",
    description: "真正的伤害发生在返回那一刻。适合边跑边布置死亡路线。",
    details: "它总会回来。\n只是回来时，身后通常少了一群敌人。\n\n攻击方式：向目标投掷穿透飞镖，随后沿清晰轨迹返回。",
    damage: 21,
    cooldown: 0.72,
    range: 238,
    pierce: 2,
    level: 1,
  },
};

Object.assign(ROGUE_WEAPONS, DATA_WEAPON_CONFIGS);

const ROGUE_SYNERGIES = {
  arcaneBlades: { id: "arcaneBlades", name: "奥术剑阵", weapons: ["knife", "magicMissile"], rank: 2, text: "太刀命中时有概率生成魔法弹，法杖命中后缩短太刀冷却。" },
  returningDance: { id: "returningDance", name: "回旋刃舞", weapons: ["knife", "dart"], rank: 2, text: "飞镖返回路径穿过敌人时触发额外太刀斩击。" },
  runeDart: { id: "runeDart", name: "符文飞镖", weapons: ["magicMissile", "dart"], rank: 2, text: "飞镖标记敌人，法杖优先追踪标记并造成小爆炸。" },
  triBurst: { id: "triBurst", name: "三相爆发", weapons: ["knife", "magicMissile", "dart"], rank: 3, text: "3 秒内触发太刀、法杖、飞镖命中后生成三角法阵爆发。" },
};

const ECONOMY = GAME_DATA.economy || {};
const PLAYER_UPGRADES = GAME_DATA.playerUpgrades || [];
const WEAPON_ENCHANTMENTS = GAME_DATA.weaponEnchantments || { generic: [] };
const SHRINE_EVENTS = GAME_DATA.shrineEvents || [];
const FLOOR_PLAN = GAME_DATA.floorPlan || {};
const BOSS_WEAPON_DROP = GAME_DATA.bossWeaponDrop || { floors: [10, 20], pool: ["fist", "knife", "magicMissile", "dart", "needle"] };
const SINGLE_REFRESH_BASE = ECONOMY.singleRefreshBase || ECONOMY.levelRefreshBase || 100;
const SINGLE_REFRESH_MULTIPLIER = ECONOMY.singleRefreshMultiplier || 2;
const WEAPON_ORDER = (BOSS_WEAPON_DROP.pool || ["fist", "knife", "magicMissile", "dart", "needle"]).filter((id) => ROGUE_WEAPONS[id]);
const DEFAULT_UNLOCKED_WEAPONS = WEAPON_ORDER.filter((id) => ROGUE_WEAPONS[id]?.isDefaultUnlocked);
const ROMAN_LEVELS = ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"];

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
    this.hitEffectPool = new Pool(() => ({}));
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
      unlockedWeapons: DEFAULT_UNLOCKED_WEAPONS,
      unlockedAchievements: [],
      highestFloor: 1,
      clearedNormalMode: false,
      unlockedDeepChallenge: false,
      clearedFirstTenthBoss: false,
      highestKills: 0,
      bestSynergy: "无",
      settings: { seenTutorial: false, sfxEnabled: true, vibrationEnabled: true },
    };
    try {
      const saved = JSON.parse(localStorage.getItem(ROGUE_STORAGE_KEY) || "{}") || {};
      return {
        ...defaults,
        ...saved,
        unlockedWeapons: Array.from(new Set([...(defaults.unlockedWeapons || []), ...((Array.isArray(saved.unlockedWeapons) ? saved.unlockedWeapons : []) || [])])).filter((id) => ROGUE_WEAPONS[id]),
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
    this.releaseAll?.(this.active?.hitEffects || [], this.hitEffectPool);
    this.mode = "title";
    this.resumeMode = "combat";
    this.pendingStartingWeapon = null;
    this.runEnded = false;
    this.floor = 1;
    this.level = 1;
    this.hp = 120;
    this.maxHp = 120;
    this.coins = 0;
    this.gems = 0;
    this.reviveCurrency = 0;
    this.pendingFloorStart = null;
    this.pendingUpgradeNextFloor = null;
    this.pendingUpgradeNextCopy = "";
    this.bossRewardPending = false;
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
    this.currentRefreshPrice = SINGLE_REFRESH_BASE;
    this.currentRefreshContext = "";
    this.intermissionRefreshPrice = 12;
    this.blacksmithLockedIndex = -1;
    this.pendingEnchantChoice = null;
    this.shopOffers = [];
    this.shopSelected = null;
    this.shopMessageTimer = 0;
    this.safeEvent = null;
    this.pendingSafeNextFloor = null;
    this.pendingNextFloor = null;
    this.killBuffTimer = 0;
    this.killHasteStacks = 0;
    this.nextFloorModifiers = {};
    this.currentFloorModifiers = {};
    this.sayTimer = 0;
    this.hitStop = 0;
    this.shake = 0;
    this.floorTransition = null;
    this.bossIntro = null;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.comboTextCooldown = 0;
    this.joystick = { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0, radius: 48, pointerId: null };
    this.player = {
      x: WORLD.width / 2,
      y: WORLD.height / 2,
      radius: 15,
      baseSpeed: 170,
      inputX: 0,
      inputY: 0,
      speed: 170,
      flash: 0,
      hurtKick: 0,
      invuln: 0,
      hurtSpeedTimer: 0,
      calmTime: 0,
      step: 0,
      absorb: 0,
      attackLean: 0,
      attackAnim: "idle",
      attackAnimTime: 0,
      faceX: 1,
      faceY: 0,
      shield: 0,
    };
    this.playerUpgrades = [];
    this.upgradeStats = {
      maxHpBonus: 0,
      speedMult: 0,
      pickupRangeMult: 0,
      pickupSpeedMult: 0,
      damageMult: 0,
      attackSpeedMult: 0,
      critChance: 0,
      hurtIframes: 0,
      floorShield: 0,
      hurtSpeedBoost: 0,
      calmSpeed: 0,
      rareBias: 0,
    };
    this.weapons = [];
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
      rewardMultiplier: 1,      bossWeaponDrops: [],
    };
    this.camera = { x: 0, y: 0, scale: window.innerWidth <= 430 ? 0.78 : 0.84 };
    this.active = { enemies: [], drops: [], particles: [], texts: [], effects: [], hitEffects: [] };
    this.clearAllModals();
    ui.overlay.classList.remove("hidden");
    ui.overlay.querySelector("h1").textContent = "无尽裂隙";
    ui.start.textContent = "进入裂隙";
    if (!this.profile.unlockedWeapons?.length) this.profile.unlockedWeapons = [...DEFAULT_UNLOCKED_WEAPONS];
    if (ui.profileSummary) {
      const unlocked = this.unlockedWeaponIds?.().length || DEFAULT_UNLOCKED_WEAPONS.length;
      ui.profileSummary.textContent = `最高第 ${this.profile.highestFloor || 1} 层 · 最高击杀 ${this.profile.highestKills || 0} · 已解锁武器 ${unlocked}/${WEAPON_ORDER.length}`;
    }
    this.updateUi();
    this.draw();
  },

  clearAllModals() {
    [ui.shop, ui.levelUp, ui.heroSelect, ui.heroConfirm, ui.buyDialog, ui.tutorialDialog, ui.statsPanel, ui.settings, ui.stageSummary, ui.resultModal, ui.bossCue].forEach((layer) => {
      if (layer) this.clearLayer(layer);
    });
  },

  resetSingleRefresh(context = "") {
    this.currentRefreshContext = context;
    this.currentRefreshPrice = SINGLE_REFRESH_BASE;
  },

  spendSingleRefresh(label = "刷新") {
    const price = this.currentRefreshPrice || SINGLE_REFRESH_BASE;
    if (this.coins < price) {
      const message = `金币不足，${label}需要 ${price} 金。`;
      this.say(message);
      this.showShopMessage?.(message);
      this.sfx.play("fail");
      return false;
    }
    this.coins -= price;
    this.currentRefreshPrice = Math.floor(price * SINGLE_REFRESH_MULTIPLIER);
    this.say(`${label}：-${price}`);
    this.sfx.play("refresh");
    this.updateUi();
    return true;
  },

  beginFloorTransition(phase = "enter") {
    this.floorTransition = {
      phase,
      time: 0,
      duration: phase === "leave" ? 1.05 : 1.35,
    };
  },

  resetCombo() {
    this.comboCount = 0;
    this.comboTimer = 0;
    this.comboTextCooldown = 0;
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
    ui.stageSettle?.addEventListener("click", () => this.settleRun(this.floor >= 10 ? "十层循环突破" : "暂时结算"));
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
        else if (this.mode === "combat" || this.mode === "safe" || this.mode === "settings") ui.pause?.click();
      }
      this.keys.add(event.code);
    });
    window.addEventListener("keyup", (event) => this.keys.delete(event.code));
  },

  recoverAudio() {
    this.sfx.unlock();
  },

  smartStart() {
    this.openWeaponSelect();
  },

  openWeaponSelect() {
    this.sfx.unlock();
    this.sfx.play("start");
    this.mode = "weaponSelect";
    ui.overlay.classList.add("hidden");
    this.renderWeaponSelect();
    ui.heroSelect.classList.remove("hidden");
    this.say("选择初始武器。");
    this.updateUi();
  },

  renderWeaponSelect() {
    const panel = ui.heroSelect?.querySelector(".hero-panel");
    const title = panel?.querySelector("h2");
    const copy = panel?.querySelector(".modal-copy");
    const grid = ui.heroSelect?.querySelector(".hero-grid");
    if (title) title.textContent = "选择初始武器";
    if (copy) copy.textContent = "选择武器进入裂隙。";
    if (!grid) return;
    grid.innerHTML = "";
    const unlocked = this.unlockedWeaponIds();
    unlocked.forEach((weaponId) => {
      const weapon = ROGUE_WEAPONS[weaponId];
      if (!weapon) return;
      const button = document.createElement("button");
      button.className = "hero-card";
      button.type = "button";
      button.dataset.weapon = weapon.id;
      button.style.setProperty("--card-color", rarityColor("common"));
      const asset = weapon.asset || `assets/sprites/weapon_${weapon.id}.png`;
      const avatarStyle = weapon.asset ? ` style="background-image: url('${asset}')"` : "";
      const skill = this.weaponSkill(weapon, 1);
      button.innerHTML = `
        <span class="hero-avatar ${weapon.asset ? "sprite-avatar" : ""}"${avatarStyle} aria-label="${weapon.name}">${weapon.icon || weapon.shortName?.[0] || "武"}</span>
        <strong>${weapon.name}</strong>
        <em>${weapon.roleDescription || weapon.role || ""}</em>
        <span>${skill?.skillName || "基础技能"}</span>
      `;
      button.addEventListener("click", () => this.selectStartingWeapon(weapon.id));
      grid.appendChild(button);
    });
  },

  unlockedWeaponIds() {
    const saved = Array.isArray(this.profile.unlockedWeapons) ? this.profile.unlockedWeapons : [];
    const unlocked = new Set([...DEFAULT_UNLOCKED_WEAPONS, ...saved]);
    return WEAPON_ORDER.filter((id) => unlocked.has(id));
  },

  isWeaponUnlocked(weaponId) {
    return this.unlockedWeaponIds().includes(weaponId);
  },

  weaponConfig(weaponOrId) {
    const id = typeof weaponOrId === "string" ? weaponOrId : weaponOrId?.id;
    return ROGUE_WEAPONS[id] || null;
  },

  weaponMaxLevel(weaponOrId) {
    return this.weaponConfig(weaponOrId)?.maxLevel || 5;
  },

  weaponLevelLabel(level = 1) {
    return ROMAN_LEVELS[clamp(Math.round(level), 1, ROMAN_LEVELS.length - 1)] || String(level);
  },

  weaponSkill(weaponOrId, level = 1) {
    const weapon = this.weaponConfig(weaponOrId);
    if (!weapon?.levelSkills?.length) return null;
    const current = clamp(Math.round(level), 1, this.weaponMaxLevel(weapon));
    return [...weapon.levelSkills].reverse().find((skill) => skill.level <= current) || weapon.levelSkills[0];
  },

  weaponSkillText(weaponOrId, level = 1) {
    const weapon = this.weaponConfig(weaponOrId);
    const skill = this.weaponSkill(weapon, level);
    if (!weapon || !skill) return "";
    return `${weapon.name}${this.weaponLevelLabel(level)} · ${skill.skillName}\n${skill.skillDescription}\n\n玩法说明：${skill.gameplayDescription}`;
  },

  showWeaponNotice(title, copy, button = "确认") {
    this.currentRoom = { id: "weaponNotice", title, copy, button };
    this.shopOffers = [];
    this.mode = "weaponNotice";
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
    this.sfx.play("deal");
  },

  selectStartingWeapon(weaponId) {
    const weapon = ROGUE_WEAPONS[weaponId];
    if (!weapon) return;
    if (!this.isWeaponUnlocked(weaponId)) {
      this.showWeaponNotice("尚未解锁", "该武器需要在空间裂隙中击败 BOSS 后获得，解锁后才可在大厅中选择。", "确认");
      return;
    }
    this.pendingStartingWeapon = weaponId;
    ui.heroConfirmAvatar.textContent = "";
    ui.heroConfirmAvatar.className = weapon.asset ? "hero-avatar sprite-avatar" : "hero-avatar";
    ui.heroConfirmAvatar.style.backgroundImage = weapon.asset ? `url(${weapon.asset})` : "";
    ui.heroConfirmAvatar.textContent = weapon.asset ? "" : weapon.icon || "武";
    ui.heroConfirmTitle.textContent = `${weapon.name} ${this.weaponLevelLabel(1)}`;
    const skill = this.weaponSkill(weapon, 1);
    ui.heroConfirmText.textContent = `${weapon.roleDescription || weapon.role}\n${skill?.skillName || "基础技能"}`;
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
    if (options.skipTutorial) this.startFloor(1);
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
    ui.tutorialSpeaker.textContent = "冲破第 1 层！";
    ui.tutorialLine.innerHTML = `
      <div class="tip-lines">
        <span>清空裂隙怪潮，夺回武器回声</span>
        <span>通关奖励：裂隙祝福三选一</span>
        <span>首破第 10 层 Boss：唤醒新武器</span>
      </div>
    `;
    ui.tutorialNext.textContent = "确认进入第 1 层";
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
    if (this.floorTransition) {
      this.floorTransition.time += dt;
      if (this.floorTransition.time >= this.floorTransition.duration) this.floorTransition = null;
    }
    if (this.mode === "bossIntro") this.updateBossIntro(dt);
    if (this.mode === "combat" || this.mode === "safe") this.update(dt);
    else {
      if (this.mode !== "cue") this.updateEffects(dt);
      this.player.flash = Math.max(0, this.player.flash - dt);
      this.player.absorb = Math.max(0, this.player.absorb - dt);
      if (this.sayTimer <= 0) ui.toast.classList.remove("show");
    }
    this.draw();
  },

  clearLayer(layer) {
    if (!layer) return;
    layer.classList.add("hidden");
    layer.classList.remove("locked", "absorbing", "defeat-only");
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
    };
    Object.entries(ROGUE_SPRITES.hero.directions || {}).forEach(([key, sprite]) => {
      sources[key] = sprite.src;
    });
    Object.entries(ROGUE_SPRITES.effects).forEach(([key, effect]) => {
      sources[key] = effect.src;
    });
    ROGUE_MAPS.forEach((map, index) => {
      sources[`map${index}`] = map.src;
    });
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

  hitEffectCap() {
    return this.mobileViewport ? 56 : 92;
  },

  particleCap() {
    return this.mobileViewport ? 120 : 230;
  },

  textCap() {
    return this.mobileViewport ? 32 : 52;
  },
});

Object.assign(RogueGame.prototype, {
  syncWeaponDerivedStats(weapon) {
    const base = this.weaponConfig(weapon);
    if (!base || !weapon) return null;
    const maxLevel = this.weaponMaxLevel(base);
    weapon.level = clamp(Math.round(weapon.level || 1), 1, maxLevel);
    const skill = this.weaponSkill(base, weapon.level);
    const levelBonus = Math.max(0, weapon.level - 1) * 0.12;
    const echoBonus = (weapon.echoBoosts || 0) * 0.08;
    weapon.name = base.name;
    weapon.shortName = base.shortName || base.name;
    weapon.color = base.color || COLORS.gold;
    weapon.icon = base.icon || "武";
    weapon.maxLevel = maxLevel;
    weapon.currentSkill = skill;
    weapon.effectType = skill?.effectType || weapon.effectType || base.id;
    weapon.baseDamage = base.damage || weapon.baseDamage || 10;
    weapon.baseCooldown = skill?.cooldown || base.cooldown || weapon.baseCooldown || 0.7;
    weapon.baseRange = base.id === "magicMissile" ? Math.max(base.range || 0, skill?.range || 0) : skill?.range || base.range || weapon.baseRange || 70;
    weapon.damage = Math.ceil(weapon.baseDamage * (1 + levelBonus + echoBonus)) + (weapon.bonusDamage || 0);
    weapon.cooldown = Math.max(0.18, weapon.baseCooldown - (weapon.cooldownReduction || 0) - (weapon.echoBoosts || 0) * 0.01);
    weapon.range = weapon.baseRange + (weapon.bonusRange || 0) + (weapon.echoBoosts || 0) * 3;
    weapon.pierce = (base.pierce || 0) + (base.id === "dart" && weapon.level >= 2 ? 1 : 0) + (weapon.bonusPierce || 0);
    weapon.shots = base.shots || 1;
    weapon.speed = (base.id === "dart" ? 330 : 430) + (weapon.bonusSpeed || 0);
    weapon.returnSpeed = (base.id === "dart" ? 420 : 0) + (weapon.bonusReturnSpeed || 0);
    return skill;
  },

  addWeapon(weaponId) {
    if (this.weapons.some((weapon) => weapon.id === weaponId)) {
      this.upgradeWeapon(weaponId, { level: 1 });
      return;
    }
    const base = ROGUE_WEAPONS[weaponId];
    if (!base) return;
    const weapon = {
      id: base.id,
      name: base.name,
      shortName: base.shortName,
      color: base.color,
      icon: base.icon,
      baseDamage: base.damage,
      baseCooldown: base.cooldown,
      baseRange: base.range,
      basePierce: base.pierce || 0,
      damage: base.damage,
      cooldown: base.cooldown,
      timer: 0.25,
      range: base.range,
      pierce: base.pierce || 0,
      level: 1,
      maxLevel: base.maxLevel || 5,
      shots: 1,
      speed: weaponId === "dart" ? 330 : 430,
      returnSpeed: weaponId === "dart" ? 420 : 0,
      bonusDamage: 0,
      bonusRange: 0,
      bonusPierce: 0,
      bonusSpeed: 0,
      bonusReturnSpeed: 0,
      cooldownReduction: 0,
      echoBoosts: 0,
      enchantments: [],
      attackCount: 0,
      killBuffTimer: 0,
    };
    this.syncWeaponDerivedStats(weapon);
    this.weapons.push(weapon);
    this.recalculateSynergies();
    this.say(`获得武器：${base.name}`);
  },

  upgradeWeapon(weaponId, changes = {}) {
    const weapon = this.weapons.find((item) => item.id === weaponId);
    if (!weapon) return { upgraded: false, capped: false, level: 0, skill: null };
    const before = weapon.level || 1;
    const maxLevel = this.weaponMaxLevel(weapon);
    if (changes.level) weapon.level = clamp(before + changes.level, 1, maxLevel);
    const upgraded = weapon.level > before;
    if (changes.damage !== undefined) weapon.bonusDamage = (weapon.bonusDamage || 0) + changes.damage;
    else if (!changes.level || upgraded) weapon.bonusDamage = (weapon.bonusDamage || 0) + Math.ceil(Math.max(1, weapon.damage) * 0.08);
    if (changes.range) weapon.bonusRange = (weapon.bonusRange || 0) + changes.range;
    if (changes.pierce) weapon.bonusPierce = (weapon.bonusPierce || 0) + changes.pierce;
    if (changes.speed) weapon.bonusSpeed = (weapon.bonusSpeed || 0) + changes.speed;
    if (changes.returnSpeed) weapon.bonusReturnSpeed = (weapon.bonusReturnSpeed || 0) + changes.returnSpeed;
    if (changes.cooldown) weapon.cooldownReduction = (weapon.cooldownReduction || 0) + changes.cooldown;
    const skill = this.syncWeaponDerivedStats(weapon);
    this.say(upgraded ? `${weapon.shortName} ${this.weaponLevelLabel(weapon.level)}` : `${weapon.shortName} 手感提升`);
    return { upgraded, capped: !upgraded && before >= maxLevel, level: weapon.level, skill };
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

  cycleStep(floor = this.floor) {
    const length = FLOOR_PLAN.cycleLength || 10;
    return ((Math.max(1, floor) - 1) % length) + 1;
  },

  cycleEventFor(floor = this.floor) {
    return FLOOR_PLAN.cycleEvents?.[this.cycleStep(floor)] || null;
  },

  safeFloorType(floor) {
    const plan = this.cycleEventFor(floor);
    if (!plan?.type || plan.type === "boss" || plan.type === "elite" || plan.type === "lieutenant") return null;
    if (plan.type === "safe_shrine") return "shrine";
    if (plan.type === "safe_blacksmith") return "blacksmith";
    return null;
  },

  startFloor(floor, options = {}) {
    const safeType = this.safeFloorType(floor);
    if (safeType) {
      this.startSafeEventFloor(floor, safeType, floor + 1);
      return;
    }
    this.mode = "combat";
    this.floor = floor;
    this.resetCombo();
    this.resetSingleRefresh("floor");
    this.pendingNextFloor = null;
    this.runStats.floorsReached = Math.max(this.runStats.floorsReached, floor);
    this.profile.highestFloor = Math.max(this.profile.highestFloor || 1, floor);
    this.floorTime = 0;
    this.floorTimeLimit = 90 + Math.min(60, floor * 5);
    this.floorKills = 0;
    this.floorSpawned = 0;
    const special = this.specialForFloor(floor);
    this.floorSpawnLimit = special?.rank === "boss" ? 0 : this.floorLimitFor(floor);
    this.floorGoal = this.floorSpawnLimit + (special ? 1 : 0);
    this.spawnTimer = floor === 1 ? 0.2 : 0.55;
    this.specialSpawned = false;
    this.specialDefeated = !special;
    this.bossRewardPending = false;
    this.safeEvent = null;
    this.currentFloorModifiers = this.nextFloorModifiers || {};
    this.nextFloorModifiers = {};
    this.player.x = WORLD.width / 2;
    this.player.y = WORLD.height / 2;
    if (this.upgradeStats.floorShield) this.player.shield = Math.max(this.player.shield, this.upgradeStats.floorShield);
    this.clearAllModals();
    this.beginFloorTransition("enter");
    const step = this.cycleStep(floor);
    const floorCopy = {
      1: `第 ${floor} 层：新循环起步。`,
      2: `第 ${floor} 层：裂隙祝福生效。`,
      4: `第 ${floor} 层：神龛之后，压力开始抬高。`,
      5: `第 ${floor} 层：裂隙追猎者堵住了路。`,
      6: `第 ${floor} 层：怪群密度继续上升。`,
      7: `第 ${floor} 层：为铁匠前的金币做准备。`,
      9: `第 ${floor} 层：副首领会验证你的附魔。`,
      10: `第 ${floor} 层：阶段 Boss 带着武器回声出现。`,
    };
    this.say(this.specialForFloor(floor) ? floorCopy[step] || `第 ${floor} 层：强敌正在靠近。` : floorCopy[step] || `第 ${floor} 层：清理怪群。`);
    this.updateUi();
  },

  startSafeEventFloor(floor, type, nextFloor) {
    this.mode = "safe";
    this.floor = floor;
    this.resetCombo();
    this.resetSingleRefresh("safe");
    this.runStats.floorsReached = Math.max(this.runStats.floorsReached, floor);
    this.profile.highestFloor = Math.max(this.profile.highestFloor || 1, floor);
    if (floor >= 10) this.runStats.enteredDeep = true;
    this.pendingSafeNextFloor = nextFloor;
    this.floorTime = 0;
    this.floorTimeLimit = 0;
    this.floorKills = 0;
    this.floorSpawned = this.floorSpawnLimit;
    this.floorSpawnLimit = 0;
    this.floorGoal = 0;
    this.specialSpawned = false;
    this.specialDefeated = true;
    this.bossRewardPending = false;
    this.currentFloorModifiers = this.nextFloorModifiers || {};
    this.nextFloorModifiers = {};
    this.releaseAll(this.active.enemies, this.enemyPool);
    this.releaseAll(this.active.drops, this.dropPool);
    this.clearAllModals();
    this.beginFloorTransition("enter");
    this.player.x = WORLD.minX + 86;
    this.player.y = WORLD.height / 2;
    this.safeEvent = {
      type,
      x: WORLD.maxX - 150,
      y: random(WORLD.minY + 160, WORLD.maxY - 160),
      radius: 34,
      opened: false,
      completed: false,
    };
    if (this.upgradeStats.floorShield) this.player.shield = Math.max(this.player.shield, this.upgradeStats.floorShield);
    this.say(type === "shrine" ? `第 ${floor} 层：沉默神龛等待裂隙交易。` : `第 ${floor} 层：流浪铁匠在另一侧等你。`);
    this.updateUi();
  },

  requestNextFloor(nextFloor, copy = "") {
    this.clearAllModals();
    this.mode = "nextFloor";
    this.pendingNextFloor = nextFloor;
    this.currentRoom = {
      id: "nextFloor",
      title: `第${nextFloor}层`,
      copy: copy || "裂隙不会替你保留勇气",
    };
    this.shopOffers = [];
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
    this.sfx.play("deal");
    this.updateUi();
  },

  floorLimitFor(floor) {
    if (floor === 1) return 18;
    if (floor <= 3) return 20 + floor * 3;
    if (floor <= 9) return 28 + floor * 3;
    return Math.min(96, 52 + floor * 4);
  },

  specialForFloor(floor) {
    const loop = Math.floor((Math.max(1, floor) - 1) / (FLOOR_PLAN.cycleLength || 10));
    const pressure = Math.min(10, loop * 2);
    const map = {
      5: { label: "裂隙追猎者", cue: `第 ${floor} 层的裂隙追猎者正在靠近。`, hp: 10 + pressure, radius: 2.45, color: rarityColor("elite"), rank: "boss", escapeAtHalf: true, hpMult: 3 },
      9: { label: "副首领", cue: `第 ${floor} 层的副首领站在附魔刚成形的路口。`, hp: 13 + pressure, radius: 2.65, color: rarityColor("epic"), rank: "lieutenant" },
      10: { label: "阶段 Boss", cue: `第 ${floor} 层的阶段 Boss 带着武器回声踏出裂隙。`, hp: 17 + pressure, radius: 3.05, color: rarityColor("legendary"), rank: "boss", hpMult: 10 },
    };
    return map[this.cycleStep(floor)] || null;
  },

  updateUi() {
    ui.wave.textContent = `第 ${this.floor} 层`;
    ui.timer.textContent = formatTime(Math.max(0, Math.floor(this.floorTime || 0)));
    ui.remaining.textContent = this.mode === "safe" ? (this.safeEvent?.completed ? "已完成" : "寻找事件") : `击破 ${Math.min(this.floorKills, this.floorGoal)} / ${this.floorGoal}`;
    ui.heroName.textContent = "游隙者";
    ui.hudAvatar.className = this.spriteReady("avatar") ? "avatar-frame rogue sprite-avatar" : "avatar-frame rogue";
    ui.hudAvatar.style.backgroundImage = this.spriteReady("avatar") ? `url(${ROGUE_SPRITES.avatar})` : "";
    ui.hudAvatar.textContent = this.spriteReady("avatar") ? "" : this.startingWeapon ? ROGUE_WEAPONS[this.startingWeapon]?.icon || "游" : "游";
    this.renderHeartHud();
    ui.hpFill.style.width = `${clamp(this.hp / this.maxHp, 0, 1) * 100}%`;
    ui.coins.textContent = this.coins;
    if (ui.gems) ui.gems.textContent = this.reviveCurrency || this.gems || 0;
    if (ui.build) ui.build.textContent = this.growthSummary();
    if (this.sayTimer <= 0) ui.toast.classList.remove("show");
    document.body.dataset.mode = this.mode;
    document.body.dataset.floor = String(this.floor);
    document.body.dataset.level = String(this.level);
    document.body.dataset.weapons = this.weapons.map((weapon) => weapon.id).join(",");
  },

  renderHeartHud() {
    if (!ui.hp) return;
    const maxHearts = Math.max(1, Math.ceil(this.maxHp / HEART_HP));
    const halfHearts = Math.max(0, Math.ceil(this.hp / HIT_HEART_DAMAGE));
    ui.hp.className = "heart-row";
    ui.hp.setAttribute("aria-label", `${Math.max(0, Math.ceil(this.hp / HIT_HEART_DAMAGE))}/${maxHearts * 2} 半颗爱心`);
    ui.hp.innerHTML = "";
    for (let i = 0; i < maxHearts; i += 1) {
      const heart = document.createElement("span");
      const remaining = halfHearts - i * 2;
      heart.className = `heart ${remaining >= 2 ? "full" : remaining === 1 ? "half" : "empty"}`;
      heart.setAttribute("aria-hidden", "true");
      ui.hp.appendChild(heart);
    }
  },

  growthSummary() {
    const weapon = this.primaryWeapon();
    const skillName = weapon?.currentSkill?.skillName || this.weaponSkill(weapon, weapon?.level || 1)?.skillName;
    const weaponText = weapon ? `${weapon.shortName}${this.weaponLevelLabel(weapon.level)} · ${skillName || "基础技能"} · 附魔 ${(weapon.enchantments || []).map((item) => item.name).join("/") || "无"}` : "未选择武器";
    const upgradeText = this.playerUpgrades.length ? this.playerUpgrades.slice(-2).map((item) => item.name).join("/") : "祝福无";
    return `祝福 ${upgradeText} · ${weaponText}`;
  },

  synergyHint() {
    const owned = new Set(this.weapons.map((weapon) => weapon.id));
    const triad = ROGUE_SYNERGIES.triBurst.weapons;
    if (owned.size !== 2 || triad.filter((weapon) => owned.has(weapon)).length !== 2) return "";
    const missing = triad.find((weapon) => !owned.has(weapon));
    return `再获得 ${ROGUE_WEAPONS[missing].shortName} 可解锁“三相爆发”`;
  },

  mapIndexForFloor(floor = this.floor) {
    return clamp(Math.floor((Math.max(1, floor) - 1) / 10), 0, ROGUE_MAPS.length - 1);
  },

  updateEffects(dt) {
    for (let i = this.active.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.active.effects[i];
      effect.life -= dt;
      if (effect.life <= 0) this.releaseActive(this.active.effects, i, this.effectPool);
    }
    for (let i = this.active.hitEffects.length - 1; i >= 0; i -= 1) {
      const fx = this.active.hitEffects[i];
      fx.x += (fx.vx || 0) * dt;
      fx.y += (fx.vy || 0) * dt;
      fx.vx *= Math.pow(0.04, dt);
      fx.vy *= Math.pow(0.04, dt);
      fx.life -= dt;
      if (fx.life <= 0) this.releaseActive(this.active.hitEffects, i, this.hitEffectPool);
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
      text.x += (text.vx || 0) * dt;
      text.y += (text.vy || -24) * dt;
      text.life -= dt;
      if (text.life <= 0) this.releaseActive(this.active.texts, i, this.textPool);
    }
  },

  addEffect(type, x, y, radius, color, direction = 0, fromX = 0, fromY = 0, flags = {}) {
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
    effect.friendlyAttack = Boolean(flags.friendlyAttack || ["slash", "missile", "dart", "needle"].includes(type));
    effect.life = type === "triBurst" ? 0.5 : type === "absorb" || type === "ring" ? 0.62 : type === "missile" ? 0.46 : type === "dart" || type === "slash" || type === "needle" ? 0.3 : 0.42;
    effect.maxLife = effect.life;
    this.active.effects.push(effect);
  },

  spawnHitFx(kind, x, y, options = {}) {
    if (this.active.hitEffects.length >= this.hitEffectCap()) this.releaseActive(this.active.hitEffects, 0, this.hitEffectPool);
    const fx = this.hitEffectPool.get();
    const life = options.life ?? (kind === "dust" ? 0.34 : 0.22);
    Object.assign(fx, {
      active: true,
      kind,
      x,
      y,
      vx: options.vx || 0,
      vy: options.vy || 0,
      radius: options.radius || 18,
      angle: options.angle || 0,
      color: options.color || "rgba(210,205,195,0.7)",
      life,
      maxLife: life,
    });
    this.active.hitEffects.push(fx);
  },

  addHitFeedback(enemy, color, source = "generic") {
    const dx = enemy.x - this.player.x;
    const dy = enemy.y - this.player.y;
    const angle = Math.atan2(dy, dx);
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    const dustColor = source === "knife" ? "rgba(225,218,205,0.72)" : "rgba(188,178,210,0.5)";
    this.spawnHitFx("burst", enemy.x - nx * enemy.radius * 0.15, enemy.y - ny * enemy.radius * 0.15, {
      angle,
      color,
      radius: source === "knife" ? 24 : 18,
      life: source === "knife" ? 0.24 : 0.18,
    });
    for (let i = 0; i < 2; i += 1) {
      this.spawnHitFx("dust", enemy.x - nx * enemy.radius * 0.45 + random(-6, 6), enemy.y + enemy.radius * 0.35 + random(-5, 6), {
        angle: angle + random(-0.45, 0.45),
        color: dustColor,
        vx: -nx * random(26, 58) + random(-16, 16),
        vy: -Math.abs(ny) * random(8, 20) + random(-10, 8),
        radius: random(7, source === "knife" ? 13 : 10),
        life: random(0.24, 0.38),
      });
    }
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
    this.drawSafeEvent();
    this.drawAttackRanges();
    this.drawBossTelegraphs();
    this.drawDrops();
    this.drawEffects();
    this.drawHitEffects();
    this.drawEnemies();
    this.drawPlayer();
    this.drawParticles();
    this.drawTexts();
    ctx.restore();
    this.drawOffscreenIndicators();
    this.drawMinimap();
    this.drawBossIntroOverlay();
    this.drawFloorTransition();
  },

  updateCamera() {
    if (!this.camera || !this.player) return;
    const viewW = VIEW.width / this.camera.scale;
    const viewH = VIEW.height / this.camera.scale;
    const focus = this.bossIntro?.boss || this.player;
    this.camera.x = clamp(focus.x - viewW / 2, 0, WORLD.width - viewW);
    this.camera.y = clamp(focus.y - viewH / 2, 0, WORLD.height - viewH);
  },

  drawBackground() {
    const mapIndex = this.mapIndexForFloor();
    const mapImage = this.sprites?.images?.[`map${mapIndex}`];
    if (mapImage && mapImage.complete && mapImage.naturalWidth > 0) {
      ctx.drawImage(mapImage, 0, 0, WORLD.width, WORLD.height);
      ctx.fillStyle = "rgba(3, 6, 12, 0.28)";
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1;
      ctx.strokeRect(WORLD.minX, WORLD.minY, WORLD.maxX - WORLD.minX, WORLD.maxY - WORLD.minY);
      return;
    }
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

  drawSafeEvent() {
    if (!this.safeEvent || this.safeEvent.completed) return;
    const event = this.safeEvent;
    const pulse = 1 + Math.sin(performance.now() / 260) * 0.06;
    const color = event.type === "shrine" ? rarityColor("epic") : rarityColor("legendary");
    ctx.save();
    ctx.translate(event.x, event.y);
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.beginPath();
    ctx.ellipse(0, 24, 42, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = rgba(color, 0.52);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, event.radius * pulse, 0, Math.PI * 2);
    ctx.stroke();
    if (event.type === "shrine") {
      ctx.fillStyle = "#211733";
      roundRect(ctx, -22, -18, 44, 42, 6);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.fillRect(-5, -33, 10, 20);
      ctx.fillRect(-17, -3, 34, 7);
      ctx.fillStyle = "#ffd166";
      pixelCircle(ctx, 0, 2, 5);
    } else {
      ctx.fillStyle = "#2a1809";
      roundRect(ctx, -24, -12, 48, 28, 5);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.fillRect(-17, -24, 34, 14);
      ctx.fillStyle = "#f6d58a";
      ctx.fillRect(-6, -34, 12, 12);
    }
    ctx.fillStyle = COLORS.text;
    ctx.font = "900 11px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.fillText(event.type === "shrine" ? "沉默" : "铁匠", 0, -44);
    ctx.restore();
  },

  drawBossTelegraphs() {
    for (const enemy of this.active.enemies || []) {
      if (enemy.rank !== "boss") continue;
      ctx.save();
      if (enemy.bossState === "finalAoeWarn") {
        ctx.fillStyle = "rgba(255,85,112,0.22)";
        ctx.fillRect(WORLD.minX, WORLD.minY, WORLD.maxX - WORLD.minX, WORLD.maxY - WORLD.minY);
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.safeRadius || 96, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "rgba(78,226,160,0.9)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.safeRadius || 96, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (enemy.bossState === "meteorWarn") {
        const rocks = enemy.bossRocks || [];
        for (let i = 0; i < rocks.length; i += 1) {
          const rock = rocks[i];
          ctx.fillStyle = i === enemy.bossRockIndex ? "rgba(255,85,112,0.3)" : "rgba(255,209,102,0.18)";
          ctx.strokeStyle = i === enemy.bossRockIndex ? "rgba(255,255,255,0.82)" : "rgba(255,209,102,0.72)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(rock.x, rock.y, rock.radius + 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#51423b";
          ctx.fillRect(rock.x - rock.radius, rock.y - rock.radius, rock.radius * 2, rock.radius * 2);
        }
      }
      if (enemy.bossState === "dashWarn") {
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(enemy.bossAngle || 0);
        ctx.fillStyle = "rgba(255,85,112,0.18)";
        roundRect(ctx, 0, -18, 220, 36, 6);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,85,112,0.72)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      if (enemy.bossState === "quakeWarn") {
        const pulse = 1 + Math.sin(performance.now() / 120) * 0.04;
        ctx.fillStyle = "rgba(255,85,112,0.18)";
        ctx.strokeStyle = "rgba(255,85,112,0.86)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 118 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      if (enemy.bossState === "waveCharge" || enemy.bossState === "waveFire") {
        const width = enemy.bossState === "waveFire" ? 118 : 104;
        const length = 1280;
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(enemy.bossAngle || 0);
        ctx.fillStyle = enemy.bossState === "waveFire" ? "rgba(83,216,251,0.22)" : "rgba(255,85,112,0.2)";
        ctx.strokeStyle = enemy.bossState === "waveFire" ? "rgba(83,216,251,0.82)" : "rgba(255,85,112,0.82)";
        ctx.lineWidth = 3;
        roundRect(ctx, -8, -width / 2, length, width, 8);
        ctx.fill();
        ctx.stroke();
      }
      if (enemy.bossState === "lockAim") {
        const target = enemy.bossLockTarget || this.player;
        ctx.strokeStyle = "rgba(255,85,112,0.9)";
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,85,112,0.18)";
        ctx.beginPath();
        ctx.arc(target.x, target.y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.68)";
        ctx.stroke();
      }
      if (enemy.bossState === "laserWarn" || enemy.bossState === "laserDash") {
        const lines = enemy.bossLaserLines || [];
        for (let i = 0; i < lines.length; i += 1) {
          const line = lines[i];
          ctx.save();
          ctx.translate(enemy.x, enemy.y);
          ctx.rotate(line.angle);
          const active = i === enemy.bossLaserIndex;
          ctx.fillStyle = active ? "rgba(255,85,112,0.24)" : "rgba(255,85,112,0.13)";
          ctx.strokeStyle = active ? "rgba(255,255,255,0.82)" : "rgba(255,85,112,0.48)";
          ctx.lineWidth = active ? 3 : 1.5;
          roundRect(ctx, 0, -11, 1240, 22, 4);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.restore();
    }
  },

  drawAttackRanges() {
    if (this.mode !== "combat" && this.mode !== "safe" && this.mode !== "bossIntro") return;
    for (const weapon of this.weapons || []) {
      if (weapon.id !== "knife" && weapon.id !== "fist") continue;
      const target = this.findTarget(weapon.range + 44);
      const angle = target ? Math.atan2(target.y - this.player.y, target.x - this.player.x) : Math.atan2(this.player.faceY || 0, this.player.faceX || 1);
      ctx.save();
      ctx.translate(this.player.x, this.player.y);
      ctx.rotate(angle);
      if (weapon.id === "knife") {
        ctx.fillStyle = "rgba(255, 230, 109, 0.12)";
        ctx.strokeStyle = "rgba(255, 230, 109, 0.62)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, weapon.range + 18, -0.82, 0.82);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(78, 226, 160, 0.12)";
        ctx.strokeStyle = "rgba(78, 226, 160, 0.58)";
        ctx.lineWidth = 2;
        roundRect(ctx, 8, -22, weapon.range + 30, 44, 8);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  drawFloorTransition() {
    if (!this.floorTransition) return;
    const { phase, time, duration } = this.floorTransition;
    const p = clamp(time / duration, 0, 1);
    const reveal = phase === "enter" ? 1 - p : p;
    const tile = 34;
    const span = VIEW.width + VIEW.height;
    ctx.save();
    ctx.setTransform(canvas.width / VIEW.width, 0, 0, canvas.height / VIEW.height, 0, 0);
    ctx.fillStyle = "#05070d";
    for (let y = -tile; y < VIEW.height + tile; y += tile) {
      for (let x = -tile; x < VIEW.width + tile; x += tile) {
        const diagonal = (x + y + tile) / span;
        const local = clamp((reveal - diagonal + 0.18) / 0.24, 0, 1);
        if (local <= 0) continue;
        const s = tile * local;
        ctx.beginPath();
        ctx.moveTo(x + tile / 2, y + tile / 2 - s / 2);
        ctx.lineTo(x + tile / 2 + s / 2, y + tile / 2);
        ctx.lineTo(x + tile / 2, y + tile / 2 + s / 2);
        ctx.lineTo(x + tile / 2 - s / 2, y + tile / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  },

  drawBossIntroOverlay() {
    if (!this.bossIntro) return;
    const t = this.bossIntro.time;
    const duration = this.bossIntro.duration || 3.2;
    const alpha = t < duration - 0.45 ? 1 : clamp((duration - t) / 0.45, 0, 1);
    ctx.save();
    ctx.setTransform(canvas.width / VIEW.width, 0, 0, canvas.height / VIEW.height, 0, 0);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0,0,0,0.36)";
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
    const lines = [
      { y: 58, r: -0.24, x: -80, speed: 220, w: 420 },
      { y: 148, r: 0.22, x: -140, speed: 260, w: 520 },
      { y: 258, r: -0.2, x: -60, speed: 180, w: 460 },
      { y: 402, r: 0.24, x: -180, speed: 240, w: 560 },
      { y: 528, r: -0.18, x: -110, speed: 210, w: 480 },
    ];
    lines.forEach((line, index) => {
      const slide = Math.min(0, line.x + t * line.speed - (index % 2 ? 28 : 0));
      ctx.save();
      ctx.translate(slide, line.y);
      ctx.rotate(line.r);
      this.drawWarningTape(line.w, 34, index);
      ctx.restore();
    });
    ctx.restore();
  },

  drawWarningTape(width, height, offset = 0) {
    ctx.fillStyle = "#f2131f";
    ctx.fillRect(0, -height / 2, width, height);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, -height / 2, width, height);
    ctx.clip();
    ctx.fillStyle = "#08080a";
    for (let x = -height * 2 + offset * 9; x < width + height; x += 28) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate(-0.64);
      ctx.fillRect(-5, -height, 13, height * 2);
      ctx.restore();
    }
    ctx.restore();
    ctx.strokeStyle = "#08080a";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, -height / 2, width, height);
    ctx.fillStyle = "#08080a";
    ctx.font = "900 20px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let x = 72; x < width; x += 142) {
      ctx.strokeStyle = "rgba(255,255,255,0.82)";
      ctx.lineWidth = 3;
      ctx.strokeText("⚠ WARING", x, 0);
      ctx.fillText("⚠ WARING", x, 0);
    }
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

  heroFacingKey(prefix) {
    const p = this.player;
    if (Math.abs(p.faceY || 0) > Math.abs(p.faceX || 0) * 0.78) return `${prefix}_${p.faceY < 0 ? "back" : "front"}`;
    return `${prefix}_${p.faceX < 0 ? "left" : "right"}`;
  },

  drawDirectionalHeroSprite() {
    const prefix = this.player.attackAnimTime > 0 ? "attack" : "idle";
    const key = this.heroFacingKey(prefix);
    const sprite = ROGUE_SPRITES.hero.directions?.[key];
    const image = this.sprites?.images?.[key];
    if (!sprite || !image || !image.complete || image.naturalWidth <= 0) return false;
    const rowHeight = image.naturalHeight / 4;
    const bob = prefix === "idle" ? Math.sin(performance.now() / 220) * 1.2 : 0;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, sprite.row * rowHeight, image.naturalWidth, rowHeight, this.player.x - 38, this.player.y - 62 + bob, 76, 116);
    ctx.restore();
    return true;
  },

  drawPlayerSprite() {
    if (this.drawDirectionalHeroSprite()) return true;
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
    const frame = effect.frameOverride ?? Math.min(sprite.frames - 1, Math.floor(progress * sprite.frames));
    effect.frameOverride = undefined;
    return this.drawSpriteFrame(image, frame, 0, sprite.frameWidth, sprite.frameHeight, x, y, size, size, { rotation, alpha });
  },

  drawMagicMissileEffect(effect, progress, x, y, angle, fade) {
    if (!this.spriteReady("missile")) return false;
    const travelEnd = 0.56;
    let frame = 0;
    let drawX = x;
    let drawY = y;
    let rotation = angle;
    let size = 64;
    let alpha = fade;
    if (progress < travelEnd) {
      const travel = clamp(progress / travelEnd, 0, 1);
      frame = Math.min(2, Math.floor(travel * 3));
      size = [46, 60, 78][frame] || 66;
      alpha = 0.95;
    } else {
      const impact = clamp((progress - travelEnd) / (1 - travelEnd), 0, 1);
      frame = 3 + Math.min(3, Math.floor(impact * 4));
      drawX = effect.x;
      drawY = effect.y;
      rotation = 0;
      size = 86 + impact * 34;
      alpha = frame >= 6 ? 0.58 * fade : 0.92 * fade;
    }
    effect.frameOverride = frame;
    return this.drawEffectAsset(effect, "missile", drawX, drawY, size, rotation, alpha);
  },

  drawHitEffects() {
    for (const fx of this.active.hitEffects || []) {
      const t = clamp(fx.life / fx.maxLife, 0, 1);
      const progress = 1 - t;
      ctx.save();
      if (fx.kind === "dust") {
        ctx.globalAlpha = t * 0.52;
        ctx.fillStyle = fx.color || "rgba(210,205,195,0.7)";
        ctx.translate(fx.x, fx.y);
        ctx.rotate(fx.angle || 0);
        ctx.beginPath();
        ctx.ellipse(0, 0, fx.radius * (1 + progress * 1.8), fx.radius * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalAlpha = t * 0.88;
        ctx.strokeStyle = fx.color || COLORS.text;
        ctx.lineWidth = 2 + 3 * t;
        ctx.translate(fx.x, fx.y);
        ctx.rotate(fx.angle || 0);
        ctx.beginPath();
        for (let i = 0; i < 6; i += 1) {
          const a = (i / 6) * Math.PI * 2;
          const r1 = fx.radius * (0.25 + progress * 0.25);
          const r2 = fx.radius * (0.75 + progress * 0.75);
          ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
          ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  drawPlayer() {
    const p = this.player;
    const color = p.flash > 0 ? "#ffffff" : "#5ff0b5";
    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 14, 21, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    if (p.absorb > 0 || p.shield > 0) {
      ctx.strokeStyle = rgba(p.shield > 0 ? COLORS.echo : COLORS.gold, clamp(p.absorb || 0.5, 0.22, 0.8));
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
      const bodyColor = enemy.flash > 0 ? "#ff435c" : enemy.slow > 0 ? COLORS.frost : enemy.color;
      if (enemy.flash > 0) {
        ctx.save();
        ctx.globalAlpha = clamp(enemy.flash / 0.16, 0, 1) * 0.45;
        ctx.fillStyle = "#ff435c";
        ctx.shadowColor = "#ff435c";
        ctx.shadowBlur = 14;
        pixelCircle(ctx, enemy.x, enemy.y, enemy.radius + 3);
        ctx.restore();
      }
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
      const pulse = 1 + Math.sin(drop.pulse || 0) * 0.12;
      ctx.save();
      ctx.translate(drop.x, drop.y);
      ctx.scale(pulse, pulse);
      ctx.shadowColor = drop.color;
      ctx.shadowBlur = drop.kind === "weaponEcho" ? 18 : 6;
      if (drop.kind === "weaponEcho") {
        ctx.strokeStyle = "rgba(83,216,251,0.78)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, drop.radius + 9 + Math.sin(drop.pulse) * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = drop.kind === "weaponEcho" ? COLORS.echo : drop.kind === "coinBag" ? "#ffd166" : COLORS.gold;
      ctx.beginPath();
      ctx.arc(0, 0, drop.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5f4300";
      if (drop.kind === "weaponEcho") {
        ctx.fillStyle = "#07131d";
        ctx.fillRect(-5, -7, 10, 14);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-2, -10, 4, 20);
      } else if (drop.kind === "coinBag") {
        roundRect(ctx, -5, -5, 10, 12, 3);
        ctx.fill();
      } else ctx.fillRect(-1.5, -4, 3, 8);
      ctx.restore();
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
      } else if (effect.type === "missile" || effect.type === "dart" || effect.type === "needle") {
        const progress = 1 - t;
        const x = lerp(effect.fromX, effect.x, progress);
        const y = lerp(effect.fromY, effect.y, progress);
        const angle = Math.atan2(effect.y - effect.fromY, effect.x - effect.fromX);
        const isNeedle = effect.type === "needle";
        ctx.strokeStyle = rgba(effect.color, effect.type === "dart" || isNeedle ? t * 0.75 : t * 0.34);
        ctx.lineWidth = effect.type === "dart" || isNeedle ? 3 : 4;
        if (effect.type === "dart" || isNeedle || progress < 0.82) {
          ctx.beginPath();
          ctx.moveTo(effect.fromX, effect.fromY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        const drewAsset = effect.type === "missile"
          ? this.drawMagicMissileEffect(effect, progress, x, y, angle, 0.95)
          : this.drawEffectAsset(effect, effect.type, x, y, isNeedle ? 96 : 72, angle, 0.95);
        if (!drewAsset) {
          ctx.fillStyle = effect.color;
          effect.type === "missile" ? pixelCircle(ctx, x, y, 6) : ctx.fillRect(x - 7, y - 2, 14, 4);
        }
      } else if (effect.type === "bossMissile") {
        ctx.fillStyle = COLORS.danger;
        ctx.strokeStyle = "rgba(255,255,255,0.58)";
        ctx.lineWidth = 2;
        pixelCircle(ctx, effect.x, effect.y, effect.radius + 4);
        ctx.stroke();
      } else if (effect.type === "bossAoe") {
        const progress = 1 - t;
        ctx.fillStyle = progress < 0.68 ? "rgba(255,85,112,0.16)" : "rgba(255,85,112,0.32)";
        ctx.strokeStyle = progress < 0.68 ? "rgba(255,85,112,0.82)" : "rgba(255,255,255,0.72)";
        ctx.lineWidth = progress < 0.68 ? 2 : 4;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius * (0.78 + progress * 0.22), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
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
    for (const text of this.active.texts) {
      const maxLife = text.maxLife || 0.5;
      const t = clamp(text.life / maxLife, 0, 1);
      const progress = 1 - t;
      const size = text.size || 12;
      ctx.save();
      ctx.translate(text.x, text.y);
      ctx.scale(1 + progress * (text.kind === "combo" ? 0.18 : 0.1), 1 + progress * 0.04);
      ctx.globalAlpha = t;
      ctx.font = `900 ${size}px ui-sans-serif, system-ui`;
      ctx.fillStyle = text.color;
      ctx.strokeStyle = "rgba(8,10,18,0.84)";
      ctx.lineWidth = text.kind === "combo" ? 5 : 4;
      ctx.strokeText(text.text, 0, 0);
      ctx.fillText(text.text, 0, 0);
      ctx.restore();
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

  drawMinimap() {
    const mini = ui.minimapCanvas;
    if (!mini) return;
    const mctx = mini.getContext("2d");
    const w = mini.width;
    const h = mini.height;
    mctx.clearRect(0, 0, w, h);
    mctx.fillStyle = "rgba(6,10,18,0.86)";
    mctx.fillRect(0, 0, w, h);
    mctx.strokeStyle = "rgba(255,255,255,0.22)";
    mctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    const sx = w / WORLD.width;
    const sy = h / WORLD.height;
    const dot = (x, y, color, size = 3, shape = "circle") => {
      const px = clamp(x * sx, 4, w - 4);
      const py = clamp(y * sy, 4, h - 4);
      mctx.fillStyle = color;
      if (shape === "diamond") {
        mctx.beginPath();
        mctx.moveTo(px, py - size);
        mctx.lineTo(px + size, py);
        mctx.lineTo(px, py + size);
        mctx.lineTo(px - size, py);
        mctx.closePath();
        mctx.fill();
      } else if (shape === "square") {
        mctx.fillRect(px - size, py - size, size * 2, size * 2);
      } else {
        mctx.beginPath();
        mctx.arc(px, py, size, 0, Math.PI * 2);
        mctx.fill();
      }
    };
    if (this.safeEvent && !this.safeEvent.completed) {
      dot(this.safeEvent.x, this.safeEvent.y, this.safeEvent.type === "shrine" ? rarityColor("epic") : rarityColor("legendary"), 4, this.safeEvent.type === "shrine" ? "diamond" : "square");
    }
    for (const enemy of this.active.enemies || []) {
      if (enemy.rank === "boss") dot(enemy.x, enemy.y, rarityColor("legendary"), 5, "diamond");
      else if (enemy.rank === "lieutenant") dot(enemy.x, enemy.y, rarityColor("epic"), 4, "diamond");
    }
    const special = this.specialForFloor(this.floor);
    if (special && !this.specialSpawned && special.rank !== "elite") dot(WORLD.maxX - 80, WORLD.minY + 90, rarityColor("common"), 3, "diamond");
    dot(this.player.x, this.player.y, "#ffffff", 3.5, "circle");
  },
});

Object.assign(RogueGame.prototype, {
  startVirtualJoystick(event) {
    if (this.mode !== "combat" && this.mode !== "safe") return;
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
    this.player.invuln = Math.max(0, this.player.invuln - dt);
    this.player.hurtSpeedTimer = Math.max(0, this.player.hurtSpeedTimer - dt);
    this.player.calmTime = this.player.flash > 0 ? 0 : this.player.calmTime + dt;
    const calmBonus = this.upgradeStats.calmSpeed > 0 ? clamp(this.player.calmTime / 5, 0, 1) * this.upgradeStats.calmSpeed : 0;
    const hurtBonus = this.player.hurtSpeedTimer > 0 ? this.upgradeStats.hurtSpeedBoost : 0;
    this.player.speed = this.player.baseSpeed * (1 + this.upgradeStats.speedMult + calmBonus + hurtBonus);
    if (len > 0.02) {
      this.player.x += (dx / len) * this.player.speed * dt;
      this.player.y += (dy / len) * this.player.speed * dt;
      if (Math.abs(dx) > 0.05) this.player.faceX = dx < 0 ? -1 : 1;
      if (Math.abs(dy) > 0.05) this.player.faceY = dy;
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
        if (this.mode !== "combat" && this.mode !== "safe") continue;
        effect.x += effect.vx * dt;
        effect.y += effect.vy * dt;
        const blocker = this.findBulletBlocker(effect, i);
        if (blocker >= 0) {
          this.addEffect("ring", effect.x, effect.y, 26, COLORS.echo);
          this.active.effects[blocker].life = 0;
          this.releaseActive(this.active.effects, i, this.effectPool);
          continue;
        }
        if (distance(effect, this.player) <= effect.radius + this.player.radius) {
          this.hurtPlayer(effect.damage);
          this.releaseActive(this.active.effects, i, this.effectPool);
          continue;
        }
      }
      if (effect.type === "bossMissile") {
        effect.x += effect.vx * dt;
        effect.y += effect.vy * dt;
        if (distance(effect, this.player) <= effect.radius + this.player.radius) {
          this.hurtPlayer(effect.damage);
          this.addEffect("ring", effect.x, effect.y, 42, COLORS.danger);
          this.releaseActive(this.active.effects, i, this.effectPool);
          continue;
        }
      }
      if (effect.type === "bossAoe") {
        const progress = 1 - effect.life / effect.maxLife;
        if (!effect.didDamage && progress >= 0.68) {
          effect.didDamage = true;
          if (distance(effect, this.player) <= effect.radius + this.player.radius) this.hurtPlayer(effect.damage);
          this.shake = Math.max(this.shake, 4.5);
        }
      }
      effect.life -= dt;
      if (effect.life <= 0) this.releaseActive(this.active.effects, i, this.effectPool);
    }
    for (let i = this.active.hitEffects.length - 1; i >= 0; i -= 1) {
      const fx = this.active.hitEffects[i];
      fx.x += (fx.vx || 0) * dt;
      fx.y += (fx.vy || 0) * dt;
      fx.vx *= Math.pow(0.04, dt);
      fx.vy *= Math.pow(0.04, dt);
      fx.life -= dt;
      if (fx.life <= 0) this.releaseActive(this.active.hitEffects, i, this.hitEffectPool);
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
      text.x += (text.vx || 0) * dt;
      text.y += (text.vy || -24) * dt;
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
    this.comboTimer = Math.max(0, this.comboTimer - dt);
    this.comboTextCooldown = Math.max(0, this.comboTextCooldown - dt);
    if (this.comboTimer <= 0) this.comboCount = 0;
    this.killBuffTimer = Math.max(0, this.killBuffTimer - dt);
    this.riftPulseTimer = Math.max(0, this.riftPulseTimer - dt);
    this.updatePlayer(dt);
    if (this.mode === "safe") {
      this.updateSafeEvent();
      this.updateDrops(dt);
      this.updateEffects(dt);
      this.updateUi();
      return;
    }
    this.updateSpawn();
    this.updateWeapons(dt);
    this.updateEnemies(dt);
    this.updateDrops(dt);
    this.updateEffects(dt);
    this.checkFloorClear();
    this.updateUi();
    if (this.hp <= 0) this.gameOver();
  },

  updateSafeEvent() {
    if (!this.safeEvent || this.safeEvent.completed || this.safeEvent.opened) return;
    if (distance(this.player, this.safeEvent) > this.safeEvent.radius + this.player.radius + 14) return;
    this.safeEvent.opened = true;
    if (this.safeEvent.type === "shrine") this.openShrineEvent();
    else this.openBlacksmithEvent();
  },

  updateSpawn() {
    if (this.cycleStep(this.floor) === 10) {
      if (!this.specialSpawned) this.spawnSpecial();
      return;
    }
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
    };
  },

  spawnEnemy() {
    if (this.floorSpawned >= this.floorSpawnLimit) return false;
    const scale = this.enemyScaleFor(this.floor);
    const pool = [
      { kind: "grunt", hp: 12, speed: 42, radius: 10, attack: 4, coins: 2, color: "#ff5570", shape: "box" },
      { kind: "fast", hp: 8, speed: 66, radius: 9, attack: 3, coins: 1, color: "#ffb86b", shape: "diamond" },
      { kind: "heavy", hp: 20, speed: 34, radius: 13, attack: 5, coins: 3, color: "#e7edf5", shape: "box" },
    ];
    if (this.floor >= 4) pool.push({ kind: "shooter", hp: 15, speed: 30, radius: 12, attack: 7, coins: 4, color: "#b584ff", shape: "hollow" });
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
      attack: base.attack * scale.attack * (early ? 0.48 : 1) * (1 + (this.currentFloorModifiers.enemyDamageMult || 0)),
      defense: 0,
      coins: Math.max(1, Math.round(base.coins * (0.9 + this.floor * 0.04))),
      color: base.color,
      shape: base.shape,
      attackTimer: random(0.6, 1.2),
      shootTimer: base.kind === "shooter" ? random(1.7, 2.8) : 99,
      flash: 0,
      knockX: 0,
      knockY: 0,
      slow: 0,
      bleed: 0,
      burn: 0,
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
    if (spec.rank === "boss") {
      enemy.x = WORLD.width / 2;
      enemy.y = WORLD.minY + 260;
    } else {
      this.placeOnEdge(enemy);
    }
    Object.assign(enemy, {
      active: true,
      kind: "special",
      rank: spec.rank,
      label: spec.label,
      hp: 18 * spec.hp * scale.hp * (spec.hpMult || 1),
      maxHp: 18 * spec.hp * scale.hp * (spec.hpMult || 1),
      speed: 31 * scale.speed,
      radius: 14 * spec.radius,
      attack: 6 * scale.attack * (spec.rank === "boss" ? 1.35 : 1) * (1 + (this.currentFloorModifiers.enemyDamageMult || 0)),
      defense: 0.08,
      coins: Math.ceil((30 + this.floor * 7) * this.runStats.rewardMultiplier),
      color: spec.color,
      shape: "box",
      attackTimer: 0.9,
      shootTimer: 1.6,
      flash: 0,
      knockX: 0,
      knockY: 0,
      slow: 0,
      bleed: 0,
      burn: 0,
      cursed: 0,
      marked: 0,
      pulse: 0,
      morph: random(0, Math.PI * 2),
      spin: random(-0.8, 0.8),
      bossState: spec.rank === "boss" ? "idle" : "",
      bossTimer: spec.rank === "boss" ? 1.1 : 0,
      bossAbilityIndex: 0,
      bossShotTimer: 0,
      bossWaveDamageTimer: 0,
      bossAngle: 0,
      bossHalfPhaseDone: false,
      bossFinalLaserDone: false,
      bossLaserLines: [],
      bossLaserIndex: 0,
      bossLockTarget: null,
      invulnerable: false,
      escapeAtHalf: Boolean(spec.escapeAtHalf),
    });
    this.specialSpawned = true;
    this.specialDefeated = false;
    this.active.enemies.push(enemy);
    this.shake = Math.max(this.shake, spec.rank === "boss" ? 9 : 5);
    if (spec.rank === "boss") this.startBossIntro(enemy);
    else this.openBossCue(spec);
    this.sfx.play(spec.rank === "boss" ? "boss" : "level");
  },

  startBossIntro(boss) {
    this.mode = "bossIntro";
    this.bossIntro = { boss, time: 0, duration: 3.25, absorbed: false };
    boss.bossState = "intro";
    boss.bossTimer = 99;
    const count = this.mobileViewport ? 7 : 11;
    for (let i = 0; i < count; i += 1) {
      const minion = this.enemyPool.get();
      const angle = (i / count) * Math.PI * 2 + random(-0.22, 0.22);
      const radius = random(135, 265);
      Object.assign(minion, {
        active: true,
        kind: "introMinion",
        rank: "small",
        label: "",
        hp: 1,
        maxHp: 1,
        speed: 0,
        radius: random(8, 12),
        attack: 0,
        defense: 0,
        coins: 0,
        color: i % 2 ? "#ff5570" : "#e7edf5",
        shape: i % 3 ? "diamond" : "box",
        x: clamp(boss.x + Math.cos(angle) * radius, WORLD.minX + 16, WORLD.maxX - 16),
        y: clamp(boss.y + Math.sin(angle) * radius, WORLD.minY + 16, WORLD.maxY - 16),
        attackTimer: 99,
        shootTimer: 99,
        flash: 0,
        knockX: 0,
        knockY: 0,
        slow: 0,
        bleed: 0,
        burn: 0,
        cursed: 0,
        marked: 0,
        pulse: random(0, Math.PI * 2),
        morph: random(0, Math.PI * 2),
        spin: random(-1.2, 1.2),
        introAbsorb: true,
      });
      this.active.enemies.push(minion);
    }
  },

  updateBossIntro(dt) {
    const intro = this.bossIntro;
    if (!intro?.boss) return;
    intro.time += dt;
    this.shake = Math.max(this.shake, intro.time < 2.35 ? 10 : 5);
    const pull = clamp((intro.time - 0.68) / 1.7, 0, 1);
    for (let i = this.active.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.active.enemies[i];
      if (!enemy.introAbsorb) continue;
      enemy.x = lerp(enemy.x, intro.boss.x, 1 - Math.pow(0.0008, dt * (2 + pull * 4)));
      enemy.y = lerp(enemy.y, intro.boss.y, 1 - Math.pow(0.0008, dt * (2 + pull * 4)));
      enemy.radius = Math.max(1, enemy.radius - dt * 8 * pull);
      if (pull >= 0.98 || distance(enemy, intro.boss) < intro.boss.radius * 0.55) {
        this.burst(enemy.x, enemy.y, COLORS.danger, 5);
        this.releaseActive(this.active.enemies, i, this.enemyPool);
      }
    }
    if (intro.time >= intro.duration) {
      this.bossIntro = null;
      intro.boss.bossState = "idle";
      intro.boss.bossTimer = 0.5;
      this.mode = "combat";
      this.say("阶段 Boss 已进入战斗。");
    }
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

  isEnemyVisible(enemy, padding = 32) {
    if (!enemy) return false;
    const view = this.viewBounds(padding);
    return enemy.x + enemy.radius >= view.left
      && enemy.x - enemy.radius <= view.right
      && enemy.y + enemy.radius >= view.top
      && enemy.y - enemy.radius <= view.bottom;
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

  weaponEnchantValue(weapon, key) {
    return (weapon.enchantments || []).reduce((sum, item) => sum + (item.effect?.[key] || 0) * (item.level || 1), 0);
  },

  weaponHasEnchant(weapon, key) {
    return (weapon.enchantments || []).some((item) => item.effect?.[key]);
  },

  weaponDamage(weapon, base = weapon.damage) {
    let mult = 1 + this.upgradeStats.damageMult + this.weaponEnchantValue(weapon, "damageMult");
    if (this.killBuffTimer > 0) mult += 0.22;
    if (weapon.killBuffTimer > 0) mult += weapon.killDamageBuff || 0;
    if (this.currentFloorModifiers.damageMult) mult += this.currentFloorModifiers.damageMult;
    const crit = Math.random() < this.upgradeStats.critChance;
    return base * mult * (crit ? 1.85 : 1);
  },

  weaponCooldown(weapon) {
    const hasteFromKills = 0;
    const attackSpeed = this.upgradeStats.attackSpeedMult + this.weaponEnchantValue(weapon, "attackSpeedMult") + hasteFromKills;
    return Math.max(0.14, weapon.cooldown / Math.max(0.35, 1 + attackSpeed));
  },

  primaryWeapon() {
    return this.weapons.find((weapon) => weapon.id === this.startingWeapon) || this.weapons[0] || null;
  },

  faceAngle(angle) {
    this.player.faceX = Math.cos(angle) < -0.05 ? -1 : 1;
    this.player.faceY = Math.sin(angle);
  },

  updateWeapons(dt) {
    for (const weapon of this.weapons) {
      weapon.timer -= dt;
      weapon.killBuffTimer = Math.max(0, (weapon.killBuffTimer || 0) - dt);
      if (weapon.timer > 0) continue;
      if (weapon.id === "fist") this.castFist(weapon);
      else if (weapon.id === "knife") this.castKnife(weapon);
      else if (weapon.id === "magicMissile") this.castMagicMissile(weapon);
      else if (weapon.id === "dart") this.castDart(weapon);
      else if (weapon.id === "needle") this.castNeedle(weapon);
      weapon.timer = this.weaponCooldown(weapon);
    }
  },

  castFist(weapon) {
    const target = this.findTarget(weapon.range + 36);
    if (!target) return;
    const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    weapon.attackCount = (weapon.attackCount || 0) + 1;
    this.damageEnemy(target, this.weaponDamage(weapon), weapon.color, "fist", { weapon });
    if (weapon.level >= 2) this.damageEnemy(target, this.weaponDamage(weapon, weapon.damage * 0.72), rgba(weapon.color, 0.9), "fist", { weapon });
    if (weapon.level >= 3 && weapon.attackCount % 3 === 0) {
      this.areaDamage(this.player.x + ux * 34, this.player.y + uy * 34, weapon.range + 16, this.weaponDamage(weapon, weapon.damage * 0.85), weapon.color);
      this.shake = Math.max(this.shake, 3.2);
    }
    if (weapon.level >= 4 && weapon.attackCount % 4 === 0) {
      this.player.x = clamp(this.player.x + ux * 36, WORLD.minX, WORLD.maxX);
      this.player.y = clamp(this.player.y + uy * 36, WORLD.minY, WORLD.maxY);
      this.areaDamage(this.player.x + ux * 22, this.player.y + uy * 22, weapon.range + 18, this.weaponDamage(weapon, weapon.damage * 0.75), COLORS.fire);
    }
    if (weapon.level >= 5 && weapon.attackCount % 5 === 0) {
      for (let i = 0; i < 3; i += 1) this.areaDamage(this.player.x + ux * (26 + i * 18), this.player.y + uy * (26 + i * 18), weapon.range + 10, this.weaponDamage(weapon, weapon.damage * 0.46), weapon.color);
      this.areaDamage(this.player.x, this.player.y, weapon.range + 52, this.weaponDamage(weapon, weapon.damage * 0.9), COLORS.gold);
    }
    this.player.attackLean = ux * 5;
    this.player.attackAnim = "attackKnife";
    this.player.attackAnimTime = 0.18;
    this.faceAngle(angle);
    this.addEffect("ring", this.player.x + ux * 28, this.player.y + uy * 18, weapon.range + 10, weapon.color, 0, 0, 0, { friendlyAttack: true });
    this.recordWeaponHit("fist");
    this.sfx.play("melee");
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
      this.damageEnemy(enemy, this.weaponDamage(weapon), weapon.color, "knife", { armorPierce: this.weaponEnchantValue(weapon, "armorPierce"), weapon });
      if (this.weaponHasEnchant(weapon, "burn")) enemy.burn = Math.max(enemy.burn || 0, this.weaponEnchantValue(weapon, "burn"));
      hits += 1;
    }
    if (hits) {
      weapon.attackCount = (weapon.attackCount || 0) + 1;
      this.player.attackLean = Math.cos(angle) * 4;
      this.player.attackAnim = "attackKnife";
      this.player.attackAnimTime = 0.24;
      this.faceAngle(angle);
      this.addEffect("slash", this.player.x, this.player.y, weapon.range + 10, weapon.color, angle);
      if (weapon.level >= 2) {
        this.addEffect("slash", this.player.x + ux * 10, this.player.y + uy * 8, weapon.range + 2, COLORS.gold, angle + 0.08);
        this.areaDamage(this.player.x + ux * 24, this.player.y + uy * 12, weapon.range - 4, this.weaponDamage(weapon, weapon.damage * 0.52), COLORS.gold);
      }
      if (weapon.level >= 3 && weapon.attackCount % 3 === 0) {
        this.addEffect("slash", this.player.x + ux * 44, this.player.y + uy * 18, weapon.range + 34, COLORS.echo, angle);
        this.areaDamage(this.player.x + ux * 62, this.player.y + uy * 22, weapon.range + 30, this.weaponDamage(weapon, weapon.damage * 0.72), COLORS.echo);
      }
      if (weapon.level >= 4 && weapon.attackCount % 4 === 0) {
        this.player.x = clamp(this.player.x + ux * 42, WORLD.minX, WORLD.maxX);
        this.player.y = clamp(this.player.y + uy * 42, WORLD.minY, WORLD.maxY);
        this.areaDamage(this.player.x, this.player.y, weapon.range + 18, this.weaponDamage(weapon, weapon.damage * 0.65), weapon.color);
      }
      if (weapon.level >= 5 && weapon.attackCount % 5 === 0) {
        this.addEffect("triBurst", this.player.x, this.player.y, weapon.range + 58, weapon.color);
        this.areaDamage(this.player.x, this.player.y, weapon.range + 64, this.weaponDamage(weapon, weapon.damage * 1.15), weapon.color);
      }
      if (this.hasSynergy("arcaneBlades") && Math.random() < 0.35) this.spawnArcaneBladeMissile();
      const cycloneEvery = this.weaponEnchantValue(weapon, "knifeCycloneEvery");
      if (cycloneEvery && weapon.attackCount % Math.max(1, Math.round(cycloneEvery)) === 0) this.areaDamage(this.player.x, this.player.y, weapon.range + 36, this.weaponDamage(weapon, weapon.damage * 0.58), COLORS.warrior);
      if (this.weaponEnchantValue(weapon, "twinCast") && Math.random() < this.weaponEnchantValue(weapon, "twinCast")) {
        this.addEffect("slash", this.player.x, this.player.y, weapon.range + 12, COLORS.gold, angle + Math.PI);
        this.areaDamage(this.player.x, this.player.y, weapon.range + 10, this.weaponDamage(weapon, weapon.damage * 0.42), COLORS.gold);
      }
      this.recordWeaponHit("knife");
      this.sfx.play("melee");
    }
  },

  castMagicMissile(weapon) {
    weapon.attackCount = (weapon.attackCount || 0) + 1;
    const echoEvery = this.weaponEnchantValue(weapon, "missileEchoEvery");
    const echo = echoEvery && weapon.attackCount % Math.max(1, Math.round(echoEvery)) === 0 ? 1 : 0;
    const twin = this.weaponEnchantValue(weapon, "twinCast") && Math.random() < this.weaponEnchantValue(weapon, "twinCast") ? 1 : 0;
    const shots = weapon.shots + echo + twin;
    let fired = 0;
    const used = [];
    const pierce = this.weaponEnchantValue(weapon, "missilePierce");
    for (let i = 0; i < shots; i += 1) {
      const target = this.findTarget(weapon.range, used, true);
      if (!target) break;
      used.push(target);
      const damage = this.weaponDamage(weapon, weapon.damage * (i > 0 ? 0.62 : 1));
      this.damageEnemy(target, damage, weapon.color, "magicMissile", { weapon });
      this.addEffect("missile", target.x, target.y, 0, weapon.color, 0, this.player.x, this.player.y - 12);
      if (i === 0 && weapon.level >= 3 && weapon.attackCount % 3 === 0) {
        this.addEffect("ring", target.x, target.y, 68, weapon.color);
        this.areaDamage(target.x, target.y, weapon.level >= 4 ? 84 : 68, damage * (weapon.level >= 4 ? 0.72 : 0.42), weapon.color);
      }
      if (i === 0 && weapon.level >= 5 && weapon.attackCount % 5 === 0) {
        const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        for (const enemy of this.active.enemies) {
          const vx = enemy.x - this.player.x;
          const vy = enemy.y - this.player.y;
          const along = vx * ux + vy * uy;
          const side = Math.abs(vx * uy - vy * ux);
          if (along > 0 && along < weapon.range + 70 && side < 18 + enemy.radius) this.damageEnemy(enemy, damage * 0.55, COLORS.echo, "magicMissile", { weapon });
        }
        this.addEffect("dart", this.player.x + ux * (weapon.range + 80), this.player.y + uy * (weapon.range + 80), 0, COLORS.echo, angle, this.player.x, this.player.y);
      }
      if (pierce > 0) {
        const next = this.findTarget(weapon.range, used, true);
        if (next) {
          used.push(next);
          this.damageEnemy(next, damage * 0.58, weapon.color, "magicMissile", { weapon });
          this.addEffect("missile", next.x, next.y, 0, rgba(weapon.color, 0.9), 0, target.x, target.y);
        }
      }
      if (this.weaponEnchantValue(weapon, "missileExplode")) this.areaDamage(target.x, target.y, this.weaponEnchantValue(weapon, "missileExplode"), damage * 0.32, COLORS.fire);
      if ((weapon.level >= 2 && i === 0) || (this.weaponEnchantValue(weapon, "missileSplit") && Math.random() < this.weaponEnchantValue(weapon, "missileSplit"))) {
        for (let s = 0; s < 2; s += 1) {
          const splitTarget = this.findTarget(150, used, false);
          if (!splitTarget) break;
          used.push(splitTarget);
          this.damageEnemy(splitTarget, damage * 0.34, COLORS.mage, "magicMissile", { weapon });
          this.addEffect("missile", splitTarget.x, splitTarget.y, 0, COLORS.mage, 0, target.x, target.y);
        }
      }
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
      if (used[0]) this.faceAngle(Math.atan2(used[0].y - this.player.y, used[0].x - this.player.x));
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
    weapon.attackCount = (weapon.attackCount || 0) + 1;
    const maxHits = weapon.pierce + 1 + this.weaponEnchantValue(weapon, "dartPierce");
    for (let i = 0; i < Math.min(maxHits, hits.length); i += 1) {
      const enemy = hits[i].enemy;
      const damage = this.weaponDamage(weapon);
      this.damageEnemy(enemy, damage, weapon.color, "dart", { weapon });
      if (weapon.level >= 3) this.damageEnemy(enemy, damage * 0.38, COLORS.gold, "dart", { weapon });
      if (weapon.level >= 4) this.areaDamage(enemy.x, enemy.y, 28, damage * 0.24, weapon.color);
      if (this.weaponEnchantValue(weapon, "dartReturnDamage")) this.damageEnemy(enemy, damage * this.weaponEnchantValue(weapon, "dartReturnDamage"), COLORS.gold, "dart", { weapon });
      enemy.marked = Math.max(enemy.marked || 0, 4);
      if (this.hasSynergy("returningDance")) this.damageEnemy(enemy, weapon.damage * 0.45, COLORS.warrior, "knife");
      if (this.weaponEnchantValue(weapon, "dartRicochet") && Math.random() < this.weaponEnchantValue(weapon, "dartRicochet")) {
        const bounce = this.findTarget(130, [enemy], false);
        if (bounce) {
          this.damageEnemy(bounce, damage * 0.45, COLORS.archer, "dart", { weapon });
          this.addEffect("dart", bounce.x, bounce.y, 0, COLORS.archer, angle, enemy.x, enemy.y);
        }
      }
    }
    if (weapon.level >= 5 && weapon.attackCount % 5 === 0) {
      for (const offset of [-0.34, 0.34]) {
        const a = angle + offset;
        const ox = Math.cos(a);
        const oy = Math.sin(a);
        for (const enemy of this.active.enemies) {
          const vx = enemy.x - this.player.x;
          const vy = enemy.y - this.player.y;
          const along = vx * ox + vy * oy;
          const side = Math.abs(vx * oy - vy * ox);
          if (along > 0 && along < weapon.range && side < 12 + enemy.radius) this.damageEnemy(enemy, this.weaponDamage(weapon, weapon.damage * 0.7), weapon.color, "dart", { weapon });
        }
        this.addEffect("dart", this.player.x + ox * weapon.range, this.player.y + oy * weapon.range, 0, weapon.color, a, this.player.x, this.player.y);
        this.addEffect("dart", this.player.x, this.player.y, 0, weapon.color, a + Math.PI, this.player.x + ox * weapon.range, this.player.y + oy * weapon.range);
      }
    }
    if (this.weaponHasEnchant(weapon, "dartTrail")) this.areaDamage(this.player.x + ux * weapon.range * 0.5, this.player.y + uy * weapon.range * 0.5, 34, this.weaponDamage(weapon, weapon.damage * 0.35), COLORS.echo);
    this.addEffect("dart", this.player.x + ux * weapon.range, this.player.y + uy * weapon.range, 0, weapon.color, angle, this.player.x, this.player.y);
    this.addEffect("dart", this.player.x, this.player.y, 0, weapon.color, angle + Math.PI, this.player.x + ux * weapon.range, this.player.y + uy * weapon.range);
    this.player.attackAnim = "attackDart";
    this.player.attackAnimTime = 0.24;
    this.faceAngle(angle);
    if (hits.length) {
      this.recordWeaponHit("dart");
      this.sfx.play("archer");
    }
  },

  castNeedle(weapon) {
    const target = this.findTarget(weapon.range, [], true);
    if (!target) return;
    weapon.attackCount = (weapon.attackCount || 0) + 1;
    const damage = this.weaponDamage(weapon);
    const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
    this.damageEnemy(target, damage, weapon.color, "needle", { weapon });
    this.addEffect("needle", target.x, target.y, 0, weapon.color, angle, this.player.x, this.player.y - 10);
    if (weapon.level >= 2) {
      target.needleMarks = (target.needleMarks || 0) + 1;
      target.marked = Math.max(target.marked || 0, 4);
      this.floatText(`针线 ${target.needleMarks}`, target.x, target.y - target.radius - 18, weapon.color, { size: 12, life: 0.52, vy: -24, kind: "combo" });
    }
    if (weapon.level >= 3 && (target.needleMarks || 0) >= 3) {
      target.needleMarks = 0;
      this.damageEnemy(target, this.weaponDamage(weapon, weapon.damage * 1.75), COLORS.gold, "needle", { weapon });
      this.addEffect("ring", target.x, target.y, 44, weapon.color);
      if (weapon.level >= 4) {
        const bounce = this.findTarget(150, [target], false);
        if (bounce) {
          bounce.needleMarks = (bounce.needleMarks || 0) + 1;
          bounce.marked = Math.max(bounce.marked || 0, 4);
          this.damageEnemy(bounce, this.weaponDamage(weapon, weapon.damage * 0.55), weapon.color, "needle", { weapon });
          this.addEffect("needle", bounce.x, bounce.y, 0, weapon.color, Math.atan2(bounce.y - target.y, bounce.x - target.x), target.x, target.y);
        }
      }
      if (weapon.level >= 5) {
        this.areaDamage(target.x, target.y, 76, this.weaponDamage(weapon, weapon.damage * 0.62), weapon.color);
        this.addEffect("triBurst", target.x, target.y, 76, weapon.color);
      }
    }
    this.player.attackAnim = "attackMagic";
    this.player.attackAnimTime = 0.18;
    this.faceAngle(angle);
    this.recordWeaponHit("needle");
    this.sfx.play("mage");
  },
});

Object.assign(RogueGame.prototype, {
  hasSynergy(id) {
    return this.synergies.some((item) => item.id === id);
  },

  findTarget(range, exclude = [], preferMarked = false) {
    let best = null;
    let bestScore = range;
    for (const enemy of this.active.enemies) {
      if (exclude.includes(enemy)) continue;
      if (!this.isEnemyVisible(enemy, 48)) continue;
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

  damageEnemy(enemy, damage, color, source = "generic", options = {}) {
    if (!enemy || enemy.hp <= 0) return;
    if (enemy.invulnerable) {
      if (!enemy.invulnTextTimer || this.floorTime - enemy.invulnTextTimer > 0.45) {
        this.floatText("无敌", enemy.x, enemy.y - enemy.radius - 8, COLORS.echo, { size: 14, life: 0.38, vy: -20 });
        enemy.invulnTextTimer = this.floorTime;
      }
      return;
    }
    const pierce = clamp(options.armorPierce || 0, 0, 0.9);
    const finalDefense = Math.max(0, (enemy.defense || 0) * (1 - pierce));
    const finalDamage = Math.max(1, damage * (1 - finalDefense));
    enemy.hp -= finalDamage;
    const isMelee = source === "knife" || source === "fist";
    const isHeavy = Boolean(options.heavy) || source === "" || finalDamage >= Math.max(28, enemy.maxHp * 0.08);
    const freezeBase = isHeavy ? random(0.08, 0.12) : random(0.04, 0.06);
    const freezeScale = enemy.rank === "boss" ? 0.34 : enemy.rank && enemy.rank !== "small" ? 0.72 : 1;
    enemy.freeze = Math.max(enemy.freeze || 0, freezeBase * freezeScale);
    enemy.flash = isMelee ? 0.16 : 0.13;
    const dx = enemy.x - this.player.x;
    const dy = enemy.y - this.player.y;
    const len = Math.hypot(dx, dy) || 1;
    const knockScale = enemy.rank === "boss" ? 0.25 : enemy.rank && enemy.rank !== "small" ? 0.45 : 1;
    const knock = (source === "knife" ? 122 : source === "fist" ? 116 : source === "dart" ? 58 : source === "needle" ? 28 : 38) * knockScale;
    enemy.knockX = (enemy.knockX || 0) + (dx / len) * knock;
    enemy.knockY = (enemy.knockY || 0) + (dy / len) * knock;
    this.hitStop = Math.max(this.hitStop, (isHeavy ? 0.018 : 0.01) * freezeScale);
    this.shake = Math.max(this.shake, isHeavy ? 3.4 * freezeScale : isMelee ? 2.2 * freezeScale : 1.2 * freezeScale);
    const now = performance.now();
    if (navigator.vibrate && this.profile.settings.vibrationEnabled && now - (this.lastHitVibrateAt || 0) > 44) {
      navigator.vibrate(isHeavy ? 18 : 8);
      this.lastHitVibrateAt = now;
    }
    this.floatText(Math.round(finalDamage), enemy.x, enemy.y - enemy.radius - 5, color, {
      size: enemy.rank && enemy.rank !== "small" ? 18 : 15,
      life: 0.7,
      vy: -38,
    });
    this.registerComboHit(enemy, color);
    this.addHitFeedback(enemy, color, source);
    this.burst(enemy.x, enemy.y, color, isMelee ? 5 : 3);
    const weapon = options.weapon;
    if (weapon && this.weaponEnchantValue(weapon, "riftPulseChance") && Math.random() < this.weaponEnchantValue(weapon, "riftPulseChance")) {
      this.areaDamage(enemy.x, enemy.y, 52, finalDamage * 0.34, COLORS.mage);
    }
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
    if (!ROGUE_WEAPONS[weaponId]) return;
    this.lastHits[weaponId] = this.floorTime;
    const triad = ROGUE_SYNERGIES.triBurst.weapons;
    const ready = triad.every((id) => this.lastHits[id] !== undefined && this.floorTime - this.lastHits[id] <= 3);
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
      enemy.burn = Math.max(0, (enemy.burn || 0) - dt);
      enemy.cursed = Math.max(0, enemy.cursed - dt);
      enemy.marked = Math.max(0, enemy.marked - dt);
      enemy.attackTimer -= dt;
      enemy.shootTimer -= dt;
      enemy.morph += dt * (6 + Math.abs(enemy.spin || 0) * 2);
      enemy.freeze = Math.max(0, (enemy.freeze || 0) - dt);
      if (enemy.freeze > 0) {
        if (enemy.hp <= 0) this.killEnemy(i);
        continue;
      }
      if (Math.abs(enemy.knockX || 0) + Math.abs(enemy.knockY || 0) > 0.1) {
        enemy.x += (enemy.knockX || 0) * dt;
        enemy.y += (enemy.knockY || 0) * dt;
        const damp = Math.pow(0.018, dt);
        enemy.knockX *= damp;
        enemy.knockY *= damp;
      }
      if (enemy.bleed > 0) enemy.hp -= dt * (2 + this.level * 0.45);
      if (enemy.burn > 0) enemy.hp -= dt * (5 + this.level * 0.6);
      if (enemy.rank === "boss") {
        this.updateBoss(enemy, dt);
        if (enemy.escapedBoss) {
          this.handleBossEscape(enemy, i);
          return;
        }
        enemy.x = clamp(enemy.x, WORLD.minX + enemy.radius, WORLD.maxX - enemy.radius);
        enemy.y = clamp(enemy.y, WORLD.minY + enemy.radius, WORLD.maxY - enemy.radius);
        if (enemy.hp <= 0) this.killEnemy(i);
        continue;
      }
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      const keepAway = enemy.kind === "shooter" && len < 150 ? -0.45 : 1;
      const speed = enemy.speed * (enemy.slow > 0 ? 0.55 : 1);
      enemy.x += (dx / len) * speed * keepAway * dt;
      enemy.y += (dy / len) * speed * keepAway * dt;
      enemy.x = clamp(enemy.x, WORLD.minX + enemy.radius, WORLD.maxX - enemy.radius);
      enemy.y = clamp(enemy.y, WORLD.minY + enemy.radius, WORLD.maxY - enemy.radius);
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

  updateBoss(enemy, dt) {
    enemy.bossTimer -= dt;
    const toPlayer = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
    const moveTowardPlayer = (speedScale = 0.35) => {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      enemy.x += (dx / len) * enemy.speed * speedScale * dt;
      enemy.y += (dy / len) * enemy.speed * speedScale * dt;
    };

    if (enemy.escapeAtHalf && enemy.hp <= enemy.maxHp * 0.5) {
      enemy.escapedBoss = true;
      return;
    }
    if (!enemy.bossHalfPhaseDone && enemy.hp <= enemy.maxHp * 0.5) {
      this.startBossSplitPhase(enemy);
      return;
    }
    if (enemy.bossHalfPhaseDone && !enemy.invulnerable && !enemy.bossFinalLaserDone && enemy.hp <= enemy.maxHp * 0.1) {
      enemy.bossFinalLaserDone = true;
      this.startBossFinalAoe(enemy);
      return;
    }

    if (!enemy.bossState || enemy.bossState === "idle") {
      moveTowardPlayer(0.42);
      if (enemy.bossTimer <= 0) {
        const abilityCount = enemy.escapeAtHalf ? 4 : 5;
        const ability = Math.floor(Math.random() * abilityCount);
        enemy.bossAbilityIndex += 1;
        enemy.bossAngle = toPlayer;
        if (ability === 0) {
          enemy.bossState = "dashWarn";
          enemy.bossTimer = 0.55;
        } else if (ability === 1) {
          enemy.bossState = "spinBarrage";
          enemy.bossTimer = 3;
          enemy.bossShotTimer = 0;
        } else if (ability === 2) {
          enemy.x = clamp(this.player.x, WORLD.minX + enemy.radius, WORLD.maxX - enemy.radius);
          enemy.y = clamp((this.camera?.y || 0) + 110, WORLD.minY + enemy.radius, WORLD.maxY - enemy.radius);
          enemy.bossAngle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
          enemy.bossState = "waveCharge";
          enemy.bossTimer = 3;
        } else if (ability === 3) {
          enemy.bossState = "lockAim";
          enemy.bossTimer = 3;
          enemy.bossLockTarget = { x: this.player.x, y: this.player.y };
        } else {
          this.startBossMeteorSequence(enemy);
        }
      }
      return;
    }

    if (enemy.bossState === "finalAoeWarn") {
      if (enemy.bossTimer <= 0) {
        if (distance(enemy, this.player) > (enemy.safeRadius || 96) + this.player.radius) this.hurtPlayer(enemy.attack * 5, { halfHearts: 4 });
        this.addEffect("triBurst", enemy.x, enemy.y, 180, COLORS.danger);
        this.shake = Math.max(this.shake, 12);
        enemy.bossState = "idle";
        enemy.bossTimer = 1.45;
      }
      return;
    }

    if (enemy.bossState === "meteorWarn") {
      if (!enemy.bossRocks?.length) {
        enemy.bossState = "idle";
        enemy.bossTimer = 1.1;
        return;
      }
      enemy.bossRockTimer -= dt;
      if (enemy.bossRockTimer <= 0) {
        const rock = enemy.bossRocks[enemy.bossRockIndex];
        if (rock) {
          if (distance(rock, this.player) <= rock.radius + 24 + this.player.radius) this.hurtPlayer(enemy.attack * 1.8);
          this.addEffect("ring", rock.x, rock.y, rock.radius + 24, COLORS.danger);
          this.shake = Math.max(this.shake, 6);
        }
        enemy.bossRockIndex += 1;
        enemy.bossRockTimer = 0.72;
        if (enemy.bossRockIndex >= enemy.bossRocks.length) {
          enemy.bossRocks = [];
          enemy.bossState = "idle";
          enemy.bossTimer = 1.25;
        }
      }
      return;
    }

    if (enemy.bossState === "splitInvuln") {
      enemy.invulnerable = true;
      enemy.bossShotTimer -= dt;
      if (enemy.bossShotTimer <= 0) {
        enemy.bossShotTimer = 2;
        for (let i = 0; i < 50; i += 1) this.spawnBossAoe(enemy);
      }
      if (!this.active.enemies.some((item) => item.phaseMinion && item.ownerBoss === enemy)) {
        enemy.invulnerable = false;
        enemy.bossState = "idle";
        enemy.bossTimer = 0.75;
        this.say("Boss 的无敌状态解除了。");
      }
      return;
    }

    if (enemy.bossState === "lockAim") {
      enemy.bossLockTarget = { x: this.player.x, y: this.player.y };
      if (enemy.bossTimer <= 0) {
        for (let i = 0; i < 10; i += 1) this.fireBossMissile(enemy, enemy.bossLockTarget, i);
        enemy.bossState = "idle";
        enemy.bossTimer = 1.1;
      }
      return;
    }

    if (enemy.bossState === "laserWarn") {
      enemy.bossShotTimer -= dt;
      if (enemy.bossShotTimer <= 0) {
        enemy.bossShotTimer = 0.18;
        enemy.bossLaserIndex += 1;
        if (enemy.bossLaserIndex >= enemy.bossLaserLines.length) {
          enemy.bossLaserIndex = 0;
          enemy.bossState = "laserDash";
          enemy.bossTimer = 0.18;
        }
      }
      return;
    }

    if (enemy.bossState === "laserDash") {
      const line = enemy.bossLaserLines[enemy.bossLaserIndex];
      if (line) {
        enemy.bossAngle = line.angle;
        enemy.x = clamp(enemy.x + Math.cos(line.angle) * 720 * dt, WORLD.minX + enemy.radius, WORLD.maxX - enemy.radius);
        enemy.y = clamp(enemy.y + Math.sin(line.angle) * 720 * dt, WORLD.minY + enemy.radius, WORLD.maxY - enemy.radius);
        if (this.playerInBossWave(enemy, 34, 1280)) this.hurtPlayer(enemy.attack * 1.15);
      }
      if (enemy.bossTimer <= 0) {
        enemy.bossLaserIndex += 1;
        enemy.bossTimer = 0.18;
        if (enemy.bossLaserIndex >= enemy.bossLaserLines.length) {
          enemy.bossLaserLines = [];
          enemy.bossState = "idle";
          enemy.bossTimer = 1.25;
        }
      }
      return;
    }

    if (enemy.bossState === "dashWarn") {
      if (enemy.bossTimer <= 0) {
        enemy.bossState = "dashMove";
        enemy.bossTimer = 0.34;
      }
      return;
    }

    if (enemy.bossState === "dashMove") {
      enemy.x += Math.cos(enemy.bossAngle) * 620 * dt;
      enemy.y += Math.sin(enemy.bossAngle) * 620 * dt;
      if (enemy.bossTimer <= 0) {
        enemy.bossState = "quakeWarn";
        enemy.bossTimer = 2;
      }
      return;
    }

    if (enemy.bossState === "quakeWarn") {
      if (enemy.bossTimer <= 0) {
        if (distance(enemy, this.player) <= 118 + this.player.radius) this.hurtPlayer(enemy.attack * 1.35);
        this.addEffect("triBurst", enemy.x, enemy.y, 118, COLORS.danger);
        this.shake = Math.max(this.shake, 7);
        enemy.bossState = "idle";
        enemy.bossTimer = 1.1;
      }
      return;
    }

    if (enemy.bossState === "spinBarrage") {
      enemy.bossAngle += dt * 5.2;
      enemy.bossShotTimer -= dt;
      if (enemy.bossShotTimer <= 0) {
        enemy.bossShotTimer = 0.12;
        this.fireBossShot(enemy, enemy.bossAngle);
        this.fireBossShot(enemy, enemy.bossAngle + Math.PI);
      }
      if (enemy.bossTimer <= 0) {
        enemy.bossState = "idle";
        enemy.bossTimer = 1.2;
      }
      return;
    }

    if (enemy.bossState === "waveCharge") {
      if (enemy.bossTimer <= 0) {
        enemy.bossState = "waveFire";
        enemy.bossTimer = 1.35;
        enemy.bossWaveDamageTimer = 0;
      }
      return;
    }

    if (enemy.bossState === "waveFire") {
      enemy.bossWaveDamageTimer -= dt;
      if (enemy.bossWaveDamageTimer <= 0) {
        enemy.bossWaveDamageTimer = 0.24;
        if (this.playerInBossWave(enemy, 112, 1280)) this.hurtPlayer(enemy.attack * 1.18);
      }
      if (enemy.bossTimer <= 0) {
        enemy.bossState = "idle";
        enemy.bossTimer = 1.35;
      }
    }
  },

  playerInBossWave(enemy, width = 112, length = 1280) {
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const ux = Math.cos(enemy.bossAngle || 0);
    const uy = Math.sin(enemy.bossAngle || 0);
    const along = dx * ux + dy * uy;
    const side = Math.abs(dx * uy - dy * ux);
    return along > -18 && along < length && side < width / 2 + this.player.radius;
  },

  startBossSplitPhase(enemy) {
    enemy.bossHalfPhaseDone = true;
    enemy.invulnerable = true;
    enemy.bossState = "splitInvuln";
    enemy.bossTimer = 99;
    enemy.bossShotTimer = 0.65;
    enemy.knockX = 0;
    enemy.knockY = 0;
    this.say("Boss 半血分裂，小怪全灭前本体无敌。");
    for (let i = 0; i < 10; i += 1) {
      const minion = this.enemyPool.get();
      const angle = (i / 10) * Math.PI * 2 + random(-0.18, 0.18);
      const radius = random(90, 210);
      Object.assign(minion, {
        active: true,
        kind: "bossSplit",
        rank: "small",
        label: "",
        hp: 28 + this.floor * 3,
        maxHp: 28 + this.floor * 3,
        speed: 68,
        radius: 10,
        attack: 0,
        defense: 0,
        coins: 0,
        color: i % 2 ? COLORS.danger : COLORS.echo,
        shape: i % 2 ? "diamond" : "box",
        x: clamp(enemy.x + Math.cos(angle) * radius, WORLD.minX + 16, WORLD.maxX - 16),
        y: clamp(enemy.y + Math.sin(angle) * radius, WORLD.minY + 16, WORLD.maxY - 16),
        attackTimer: 0.9,
        shootTimer: 99,
        flash: 0,
        knockX: 0,
        knockY: 0,
        slow: 0,
        bleed: 0,
        burn: 0,
        cursed: 0,
        marked: 0,
        pulse: random(0, Math.PI * 2),
        morph: random(0, Math.PI * 2),
        spin: random(-1.2, 1.2),
        phaseMinion: true,
        ownerBoss: enemy,
      });
      this.active.enemies.push(minion);
    }
  },

  startBossLaserSequence(enemy) {
    enemy.bossState = "laserWarn";
    enemy.bossLaserIndex = 0;
    enemy.bossShotTimer = 0.2;
    enemy.bossLaserLines = [];
    const base = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
    for (let i = 0; i < 10; i += 1) {
      enemy.bossLaserLines.push({ angle: base + random(-1.25, 1.25) + (i - 4.5) * 0.05 });
    }
  },

  startBossFinalAoe(enemy) {
    enemy.bossState = "finalAoeWarn";
    enemy.bossTimer = 3;
    enemy.safeRadius = 98;
    this.say("Boss 正在引爆全屏裂隙，靠近它脚下的安全范围！");
  },

  startBossMeteorSequence(enemy) {
    const corners = [
      { x: WORLD.minX + 120, y: WORLD.minY + 140 },
      { x: WORLD.maxX - 120, y: WORLD.minY + 140 },
      { x: WORLD.maxX - 120, y: WORLD.maxY - 140 },
      { x: WORLD.minX + 120, y: WORLD.maxY - 140 },
    ];
    enemy.bossState = "meteorWarn";
    enemy.bossTimer = 99;
    enemy.bossRockIndex = 0;
    enemy.bossRockTimer = 0.8;
    enemy.bossRocks = corners.map((corner) => ({
      x: corner.x + random(-42, 42),
      y: corner.y + random(-42, 42),
      radius: 34,
    }));
    this.say("巨石正在裂隙四角成形。");
  },

  spawnBossAoe(enemy) {
    if (this.active.effects.length >= this.effectCap()) this.releaseActive(this.active.effects, 0, this.effectPool);
    const effect = this.effectPool.get();
    Object.assign(effect, {
      active: true,
      type: "bossAoe",
      x: random(WORLD.minX + 70, WORLD.maxX - 70),
      y: random(WORLD.minY + 90, WORLD.maxY - 90),
      radius: 42,
      color: COLORS.danger,
      damage: enemy.attack * 1.05,
      life: 1.15,
      maxLife: 1.15,
      didDamage: false,
      friendlyAttack: false,
    });
    this.active.effects.push(effect);
  },

  fireBossMissile(enemy, target, index = 0) {
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const base = Math.atan2(dy, dx);
    const spread = (index - 4.5) * 0.055;
    const angle = base + spread;
    const len = Math.hypot(dx, dy) || 1;
    if (this.active.effects.length >= this.effectCap()) this.releaseActive(this.active.effects, 0, this.effectPool);
    const shot = this.effectPool.get();
    Object.assign(shot, {
      active: true,
      type: "bossMissile",
      x: enemy.x,
      y: enemy.y,
      vx: Math.cos(angle) * (245 + index * 4),
      vy: Math.sin(angle) * (245 + index * 4),
      radius: 8,
      color: COLORS.danger,
      damage: enemy.attack * 1.15,
      life: 3.4,
      maxLife: 3.4,
      friendlyAttack: false,
    });
    this.active.effects.push(shot);
  },

  fireBossShot(enemy, angle) {
    if (this.active.effects.length >= this.effectCap()) this.releaseActive(this.active.effects, 0, this.effectPool);
    const shot = this.effectPool.get();
    Object.assign(shot, {
      active: true,
      type: "enemyShot",
      x: enemy.x,
      y: enemy.y,
      vx: Math.cos(angle) * 190,
      vy: Math.sin(angle) * 190,
      radius: 6,
      color: COLORS.danger,
      damage: enemy.attack * 0.9,
      life: 4,
      maxLife: 4,
      bossBullet: true,
      friendlyAttack: false,
    });
    this.active.effects.push(shot);
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
      bossBullet: false,
      friendlyAttack: false,
    });
    this.active.effects.push(shot);
  },

  spawnBossEchoDrop(enemy) {
    const reward = this.rollBossWeaponReward();
    this.spawnDrop(enemy.x, enemy.y, "weaponEcho", 0, 15, {
      vx: random(-24, 24),
      vy: -70,
      reward,
    });
  },

  handleBossEscape(enemy, index) {
    this.specialDefeated = true;
    this.bossRewardPending = false;
    this.burst(enemy.x, enemy.y, enemy.color, 28);
    this.releaseActive(this.active.enemies, index, this.enemyPool);
    this.releaseAll(this.active.enemies, this.enemyPool);
    this.releaseAll(this.active.drops, this.dropPool);
    this.say("怪物逃去了裂隙深处。");
    this.openFloorUpgrade(this.floor, { nextFloor: this.floor + 1, nextCopy: "怪物逃去了裂隙深处，请前往寻找。" });
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
    if (enemy.cursed > 0) this.spreadCurse(enemy);
    this.onEnemyKilled(enemy);
    this.rollCoinDrops(enemy);
    if (enemy.rank === "boss") {
      this.bossRewardPending = true;
      this.spawnBossEchoDrop(enemy);
      this.say("Boss 的武器回声掉落了。");
    }
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

  hurtPlayer(amount, options = {}) {
    if (this.player.invuln > 0) return;
    if (this.player.shield > 0) {
      this.player.shield = 0;
      this.addEffect("ring", this.player.x, this.player.y, 42, COLORS.echo);
      this.player.invuln = 0.35 + this.upgradeStats.hurtIframes;
      return;
    }
    const halfHearts = Math.max(1, options.halfHearts || 1);
    this.hp -= HIT_HEART_DAMAGE * halfHearts;
    this.floatText(halfHearts === 1 ? "-半颗" : `-${halfHearts / 2}颗`, this.player.x, this.player.y - 38, COLORS.danger, { size: 14, life: 0.62, vy: -26 });
    this.player.flash = 0.18;
    this.player.invuln = 0.55 + this.upgradeStats.hurtIframes;
    this.player.hurtSpeedTimer = this.upgradeStats.hurtSpeedBoost > 0 ? 2.2 : 0;
    this.player.calmTime = 0;
    this.shake = Math.max(this.shake, 5);
    this.sfx.play("hurt");
    if (navigator.vibrate && this.profile.settings.vibrationEnabled) navigator.vibrate(24);
  },

  onEnemyKilled(enemy) {
    const knife = this.weapons.find((weapon) => weapon.id === "knife");
    if (knife?.killDamageBuff) knife.killBuffTimer = 3.6;
  },

  rollCoinDrops(enemy) {
    const coinMult = this.currentFloorModifiers.coinMult || 1;
    if (enemy.rank === "boss") {
      const range = ECONOMY.bossCoinAmount?.[this.floor] || ECONOMY.bossCoinAmount?.default || [40, 70];
      const gain = Math.ceil(randomInt(range[0], range[1]) * coinMult);
      const count = 36;
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 + random(-0.16, 0.16);
        const speed = random(95, 250);
        this.spawnDrop(enemy.x, enemy.y, i % 7 === 0 ? "coinBag" : "coin", Math.max(1, Math.round(gain / count)), i % 7 === 0 ? 8 : 6, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
      }
      this.floatText("金币喷涌！", enemy.x, enemy.y - enemy.radius - 28, COLORS.gold, { size: 18, life: 0.8, vy: -28 });
      return;
    }
    if (enemy.rank && enemy.rank !== "small") {
      const range = ECONOMY.eliteCoinAmount || [10, 20];
      this.spawnDrop(enemy.x + random(-14, 14), enemy.y + random(-14, 14), "coin", Math.ceil(randomInt(range[0], range[1]) * coinMult), 7);
      return;
    }
    const chanceRange = ECONOMY.normalCoinChance || { min: 0.12, max: 0.18 };
    const chance = clamp(chanceRange.min + this.floor * 0.008, chanceRange.min, chanceRange.max);
    if (Math.random() < chance) {
      const range = ECONOMY.normalCoinAmount || [1, 2];
      this.spawnDrop(enemy.x + random(-8, 8), enemy.y + random(-8, 8), "coin", Math.ceil(randomInt(range[0], range[1]) * coinMult), 6);
    }
    if (Math.random() < (ECONOMY.coinBagChance || 0.025)) {
      const range = ECONOMY.coinBagAmount || [8, 15];
      this.spawnDrop(enemy.x + random(-10, 10), enemy.y + random(-10, 10), "coinBag", Math.ceil(randomInt(range[0], range[1]) * coinMult), 8);
    }
  },

  spawnDrop(x, y, kind, value, radius, options = {}) {
    const drop = this.dropPool.get();
    const color = {
      coin: COLORS.gold,
      coinBag: COLORS.gold,
      weaponEcho: COLORS.echo,
      material: COLORS.fire,
    }[kind] || COLORS.gold;
    Object.assign(drop, {
      active: true,
      kind,
      x,
      y,
      vx: options.vx ?? random(-34, 34),
      vy: options.vy ?? random(-34, 34),
      value,
      radius,
      color,
      pulse: random(0, Math.PI * 2),
      reward: options.reward || null,
    });
    this.active.drops.push(drop);
  },

  updateDrops(dt) {
    for (let i = this.active.drops.length - 1; i >= 0; i -= 1) {
      const drop = this.active.drops[i];
      drop.pulse += dt * 7;
      drop.x += drop.vx * dt;
      drop.y += drop.vy * dt;
      drop.vx *= Math.pow(0.12, dt);
      drop.vy *= Math.pow(0.12, dt);
      const d = distance(drop, this.player);
      const magnet = this.pickupRange(drop);
      if (d < magnet) {
        const pull = 1 - Math.pow(0.00005, dt * this.pickupSpeed());
        drop.x = lerp(drop.x, this.player.x, pull);
        drop.y = lerp(drop.y, this.player.y, pull);
      }
      if (d < this.player.radius + drop.radius) {
        this.collectDrop(drop);
        this.releaseActive(this.active.drops, i, this.dropPool);
      }
    }
  },

  pickupRange(drop = null) {
    const base = 76;
    return base * (1 + this.upgradeStats.pickupRangeMult);
  },

  pickupSpeed() {
    return 1 + this.upgradeStats.pickupSpeedMult;
  },

  collectDrop(drop) {
    if (drop.kind === "weaponEcho") {
      this.bossRewardPending = false;
      this.player.absorb = 0.8;
      const reward = this.applyBossWeaponDrop(drop.reward || this.rollBossWeaponReward());
      this.floatText(reward.title, this.player.x, this.player.y - 42, COLORS.echo, { size: 16, life: 0.9, vy: -26 });
      this.openPostBossReward(reward);
      return;
    }
    this.coins += drop.value;
    this.runStats.coinsEarned += drop.value;
    this.player.absorb = 0.45;
    this.floatText(`金币 +${drop.value}`, this.player.x, this.player.y - 30, COLORS.gold);
    this.sfx.play("coin");
  },

  checkFloorClear() {
    const allSpawned = this.floorSpawned >= this.floorSpawnLimit;
    if (this.bossRewardPending) return;
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

  floatText(text, x, y, color, options = {}) {
    if (this.active.texts.length > 52) return;
    const item = this.textPool.get();
    const life = options.life || 0.62;
    Object.assign(item, {
      active: true,
      text,
      x: x + random(-4, 4),
      y,
      vx: options.vx ?? random(-8, 8),
      vy: options.vy ?? -34,
      color,
      size: options.size || 15,
      kind: options.kind || "damage",
      life,
      maxLife: life,
    });
    this.active.texts.push(item);
  },

  registerComboHit(enemy, color) {
    if (this.comboTimer <= 0) this.comboCount = 0;
    this.comboCount += 1;
    this.comboTimer = 1.35;
    if (this.comboCount < 3) return;
    const shouldShow = this.comboCount === 3 || this.comboCount % 5 === 0 || this.comboTextCooldown <= 0;
    if (!shouldShow) return;
    this.comboTextCooldown = 0.18;
    this.floatText(`${this.comboCount} COMBO`, enemy.x, enemy.y - enemy.radius - 30, COLORS.gold, {
      kind: "combo",
      size: this.comboCount >= 20 ? 22 : 18,
      life: 0.58,
      vy: -22,
      vx: 0,
    });
  },
});

Object.assign(RogueGame.prototype, {
  tryOpenPendingChoice() {
    return false;
  },

  openFloorUpgrade(floor, options = {}) {
    this.clearAllModals();
    this.mode = "upgrade";
    this.pendingFloorStart = options.startFloor || null;
    this.pendingUpgradeNextFloor = options.nextFloor || null;
    this.pendingUpgradeNextCopy = options.nextCopy || "";
    this.resetSingleRefresh("upgrade");
    this.currentUpgradeChoices = this.rollUpgradeChoices();
    this.renderUpgradeCards();
    ui.levelUp.classList.remove("hidden");
    this.sfx.play("deal");
    this.updateUi();
  },

  openUpgradeCards() {
    this.openFloorUpgrade(this.floor || 1);
  },

  rollUpgradeChoices() {
    const currentWeaponId = this.primaryWeapon()?.id || this.startingWeapon;
    const pool = PLAYER_UPGRADES
      .filter((upgrade) => !upgrade.weaponAffinity || upgrade.weaponAffinity === currentWeaponId)
      .map((upgrade) => ({ ...upgrade }));
    return shuffle(pool).slice(0, 3).map((choice) => ({
      ...choice,
      title: choice.name,
      type: "裂隙祝福",
      text: choice.stat,
      apply: () => this.applyPlayerUpgrade(choice),
    }));
  },

  renderUpgradeCards() {
    ui.upgradeTitle.textContent = "怪潮清空！";
    if (ui.upgradeNote) ui.upgradeNote.textContent = "选择你的裂隙祝福";
    if (ui.refreshUpgrades) {
      ui.refreshUpgrades.textContent = `刷新 ${this.currentRefreshPrice || SINGLE_REFRESH_BASE}金`;
      ui.refreshUpgrades.disabled = false;
    }
    ui.upgradeItems.innerHTML = "";
    ui.upgradeItems.className = "choice-grid card-fan";
    this.currentUpgradeChoices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = `choice-card rarity-${choice.rarity || "common"}`;
      button.type = "button";
      button.style.setProperty("--card-color", rarityColor(choice.rarity));
      button.style.setProperty("--delay", `${index * 80}ms`);
      button.style.setProperty("--r", `${(index - 1) * 8}deg`);
      button.innerHTML = `<small>${RARITIES[choice.rarity || "common"].label}</small><strong>${choice.title}</strong><span>${choice.text}</span>`;
      button.addEventListener("click", () => this.chooseUpgrade(choice));
      ui.upgradeItems.appendChild(button);
    });
  },

  refreshUpgradeChoices() {
    if (this.mode !== "upgrade") return;
    if (!this.spendSingleRefresh("刷新祝福")) return;
    this.currentUpgradeChoices = this.rollUpgradeChoices();
    this.renderUpgradeCards();
    this.updateUi();
  },

  chooseUpgrade(choice) {
    if (this.mode !== "upgrade") return;
    choice.apply(this);
    this.level = Math.max(1, this.playerUpgrades.length);
    this.addEffect("absorb", this.player.x, this.player.y, 62, rarityColor(choice.rarity));
    this.sfx.play("upgradePick");
    this.clearLayer(ui.levelUp);
    this.recalculateSynergies();
    const nextFloor = this.pendingFloorStart;
    this.pendingFloorStart = null;
    const nextAfterUpgrade = this.pendingUpgradeNextFloor;
    const nextCopy = this.pendingUpgradeNextCopy;
    this.pendingUpgradeNextFloor = null;
    this.pendingUpgradeNextCopy = "";
    if (nextAfterUpgrade) this.requestNextFloor(nextAfterUpgrade, nextCopy);
    else if (nextFloor) this.startFloor(nextFloor, { skipPreUpgrade: true });
    else this.mode = "combat";
    this.updateUi();
  },

  applyPlayerUpgrade(choice) {
    const effect = choice.effect || {};
    this.playerUpgrades.push({ id: choice.id, name: choice.name, type: "裂隙祝福", stat: choice.stat });
    if (effect.maxHp) {
      this.maxHp += effect.maxHp;
      this.hp = Math.min(this.maxHp, this.hp + (effect.heal || effect.maxHp));
      this.upgradeStats.maxHpBonus += effect.maxHp;
    }
    if (effect.heal && !effect.maxHp) this.hp = Math.min(this.maxHp, this.hp + effect.heal);
    if (effect.floorShield) {
      this.upgradeStats.floorShield += effect.floorShield;
      this.player.shield = Math.max(this.player.shield, effect.shieldNow || effect.floorShield);
    }
    if (effect.speedMult) this.upgradeStats.speedMult += effect.speedMult;
    if (effect.pickupRangeMult) this.upgradeStats.pickupRangeMult += effect.pickupRangeMult;
    if (effect.pickupSpeedMult) this.upgradeStats.pickupSpeedMult += effect.pickupSpeedMult;
    if (effect.damageMult) this.upgradeStats.damageMult += effect.damageMult;
    if (effect.attackSpeedMult) this.upgradeStats.attackSpeedMult += effect.attackSpeedMult;
    if (effect.critChance) this.upgradeStats.critChance += effect.critChance;
    if (effect.hurtIframes) this.upgradeStats.hurtIframes += effect.hurtIframes;
    if (effect.hurtSpeedBoost) this.upgradeStats.hurtSpeedBoost += effect.hurtSpeedBoost;
    if (effect.calmSpeed) this.upgradeStats.calmSpeed += effect.calmSpeed;
    this.say(`裂隙祝福：${choice.name}`);
  },

  openShrineEvent() {
    this.mode = "shrine";
    this.currentRoom = {
      id: "shrine",
      title: "沉默神龛",
      copy: "它没有说话，但你知道它想要什么。",
    };
    this.shopOffers = [
      ...shuffle(SHRINE_EVENTS.map((event) => ({ ...event, title: event.name, type: `【${event.tag}】`, text: `${event.cost}，${event.reward}。\n${event.text}`, apply: () => this.applyShrineEvent(event) }))).slice(0, 3),
      { id: "leaveShrine", title: "离开神龛", type: "【离开】", rarity: "common", color: rarityColor("common"), text: "今天先不把命交出去。", apply: () => this.completeSafeEvent("你离开了神龛。") },
    ];
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
    this.sfx.play("shopOpen");
  },

  applyShrineEvent(event) {
    if (event.price && this.coins < event.price) {
      this.showShopMessage("金币不足，裂隙交易不接受赊账。");
      this.sfx.play("fail");
      return;
    }
    if (event.price) this.coins -= event.price;
    const effect = event.effect || {};
    if (effect.loseMaxHp) {
      this.maxHp = Math.max(40, this.maxHp - effect.loseMaxHp);
      this.hp = Math.min(this.hp, this.maxHp);
    }
    if (effect.coins) {
      this.coins += effect.coins;
      this.runStats.coinsEarned += effect.coins;
    }
    if (effect.healPercent) this.hp = Math.min(this.maxHp, this.hp + this.maxHp * effect.healPercent);
    if (effect.setHp) this.hp = effect.setHp;
    if (effect.nextFloorDamageMult) this.nextFloorModifiers.damageMult = (this.nextFloorModifiers.damageMult || 0) + effect.nextFloorDamageMult;
    if (effect.nextFloorEnemyDamageMult) this.nextFloorModifiers.enemyDamageMult = (this.nextFloorModifiers.enemyDamageMult || 0) + effect.nextFloorEnemyDamageMult;
    if (effect.nextFloorCoinMult) this.nextFloorModifiers.coinMult = Math.max(this.nextFloorModifiers.coinMult || 1, effect.nextFloorCoinMult);
    if (effect.grantUpgradeRarity) {
      const pick = shuffle(PLAYER_UPGRADES.filter((upgrade) => upgrade.rarity !== "common").map((upgrade) => ({ ...upgrade }))).shift() || PLAYER_UPGRADES[0];
      this.applyPlayerUpgrade(pick);
    }
    if (effect.randomReward) {
      const pick = shuffle(PLAYER_UPGRADES.filter((upgrade) => upgrade.rarity !== "common").map((upgrade) => ({ ...upgrade }))).shift() || PLAYER_UPGRADES[0];
      this.applyPlayerUpgrade(pick);
    }
    this.addEffect("absorb", this.player.x, this.player.y, 78, rarityColor(event.rarity));
    this.completeSafeEvent(`${event.name} 已生效。`);
  },

  openBlacksmithEvent() {
    this.mode = "blacksmith";
    this.resetSingleRefresh("blacksmith");
    this.blacksmithLockedIndex = -1;
    this.pendingEnchantChoice = null;
    this.currentRoom = {
      id: "blacksmith",
      title: "裂隙铁匠",
      copy: "为当前武器附魔。",
    };
    this.shopOffers = this.rollBlacksmithOffers();
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
    this.sfx.play("shopOpen");
  },

  rollBlacksmithOffers() {
    const weapon = this.primaryWeapon();
    if (!weapon) return [];
    const generic = WEAPON_ENCHANTMENTS.generic || [];
    const specific = WEAPON_ENCHANTMENTS[weapon.id] || [];
    const pool = [...generic, ...specific].filter((item) => !weapon.enchantments?.some((owned) => owned.id === item.id)).map((item) => ({ ...item }));
    const source = pool.length ? pool : [...generic, ...specific].map((item) => ({ ...item }));
    return shuffle(source).slice(0, 3).map((item) => this.formatBlacksmithOffer(item));
  },

  rollBlacksmithOffer() {
    return this.rollBlacksmithOffers()[0] || null;
  },

  formatBlacksmithOffer(item) {
    if (!item) return null;
    return {
      ...item,
      title: item.name,
      type: item.tag || "附魔",
      text: this.shortEnchantText(item.stat || item.text || ""),
      apply: () => this.prepareEnchantConfirm(item),
    };
  },

  shortEnchantText(text = "") {
    return String(text)
      .replace(/当前武器/g, "")
      .replace(/命中时/g, "命中")
      .replace(/概率/g, "")
      .replace(/范围/g, "范围")
      .replace(/攻击频率/g, "攻速")
      .replace(/伤害/g, "伤害")
      .slice(0, 18);
  },

  prepareEnchantConfirm(enchant) {
    this.pendingEnchantChoice = enchant;
    this.currentRoom = {
      id: "blacksmith",
      title: "确认附魔",
      copy: `${enchant.name}：${this.shortEnchantText(enchant.stat || "")}`,
      button: "确认附魔",
      confirmingEnchant: true,
    };
    this.shopOffers = [];
    this.renderIntermission();
    this.sfx.play("deal");
  },

  applyWeaponEnchant(enchant) {
    const weapon = this.primaryWeapon();
    if (!weapon) return;
    const existing = weapon.enchantments.find((item) => item.id === enchant.id);
    if (existing) existing.level = (existing.level || 1) + 1;
    else weapon.enchantments.push({ ...enchant, level: 1 });
    if (enchant.effect?.killDamageBuff) weapon.killDamageBuff = Math.max(weapon.killDamageBuff || 0, enchant.effect.killDamageBuff);
    this.addEffect("ring", this.player.x, this.player.y, 70, rarityColor(enchant.rarity));
    this.say(`附魔：${enchant.name}`);
    this.recalculateSynergies();
  },

  isBossWeaponDropFloor(floor = this.floor) {
    const floors = Array.isArray(BOSS_WEAPON_DROP.floors) ? BOSS_WEAPON_DROP.floors : [];
    return floors.includes(this.cycleStep(floor)) || this.cycleStep(floor) === 10;
  },

  rollBossWeaponReward() {
    const current = this.primaryWeapon();
    const locked = (BOSS_WEAPON_DROP.pool || []).filter((id) => ROGUE_WEAPONS[id] && !this.isWeaponUnlocked(id));
    const shouldGuarantee = BOSS_WEAPON_DROP.guaranteeNewWeaponOnFirstTenthBoss && this.cycleStep(this.floor) === 10 && !this.profile.clearedFirstTenthBoss && locked.length;
    const unlockChance = shouldGuarantee || (locked.length && Math.random() < 0.32);
    if (unlockChance) return this.bossWeaponChoice(shuffle([...locked])[0], "unlock");
    return this.bossWeaponChoice(current?.id || this.startingWeapon, "upgrade");
  },

  bossWeaponChoice(weaponId, forcedResult = "") {
    const weapon = ROGUE_WEAPONS[weaponId];
    const owned = this.weapons.find((item) => item.id === weaponId);
    const unlocked = this.isWeaponUnlocked(weaponId);
    const canUpgrade = Boolean(owned && owned.level < this.weaponMaxLevel(owned));
    const result = forcedResult || (!unlocked ? "unlock" : "upgrade");
    const rarity = result === "unlock" ? "epic" : canUpgrade ? "elite" : "common";
    const actionText = {
      unlock: "新武器解锁",
      upgrade: canUpgrade ? `当前武器升至 ${this.weaponLevelLabel((owned?.level || 1) + 1)}` : "当前武器打磨",
    }[result];
    return {
      id: `boss-echo-${weaponId}`,
      weaponId,
      icon: weaponId === "magicMissile" ? "crystal" : weaponId === "dart" ? "scope" : weaponId === "needle" ? "scroll" : weaponId === "fist" ? "shield" : "sword",
      title: `${weapon.name}回声`,
      type: "武器回声",
      rarity,
      color: rarityColor(rarity),
      text: actionText,
      apply: () => this.applyBossWeaponDrop({ weaponId, floor: this.floor }),
    };
  },
  applyBossWeaponDrop(drop) {
    const weaponId = drop?.weaponId;
    const dropped = ROGUE_WEAPONS[weaponId];
    const owned = this.weapons.find((item) => item.id === weaponId);
    if (!dropped) return { title: "武器掉落", copy: "裂隙里掉出的武器数据异常，本次没有获得奖励。", button: "继续挑战", record: { result: "invalid" } };

    let record;
    let title;
    let copy;
    let button = "继续挑战";

    if (!this.isWeaponUnlocked(weaponId)) {
      this.profile.unlockedWeapons = Array.from(new Set([...(this.profile.unlockedWeapons || []), weaponId]));
      this.writeProfile();
      title = "新武器已解锁";
      copy = `${dropped.name} 已加入大厅。`;
      button = "确认";
      record = { result: "unlock", weaponId, isNewUnlock: true };
    } else if (owned && owned.level < this.weaponMaxLevel(owned)) {
      const before = owned.level || 1;
      const upgrade = this.upgradeWeapon(weaponId, { level: 1 });
      if (upgrade.upgraded) {
        const skill = upgrade.skill || this.weaponSkill(dropped, upgrade.level);
        title = "武器升阶";
        copy = `${dropped.name} ${this.weaponLevelLabel(upgrade.level)} · ${skill?.skillName || "新动作"}`;
        record = { result: "upgrade", weaponId, beforeLevel: before, afterLevel: upgrade.level, skillName: skill?.skillName || "" };
      } else {
        record = { result: "upgrade", weaponId, capped: true };
        title = "当前武器打磨";
        copy = "当前武器手感提升。";
      }
    } else {
      const upgrade = this.upgradeWeapon(this.primaryWeapon()?.id || this.startingWeapon, { cooldown: 0.05, speed: 18, returnSpeed: 18 });
      title = "当前武器打磨";
      copy = upgrade?.upgraded ? "当前武器升阶。" : "当前武器手感提升。";
      record = { result: "upgrade", weaponId: this.primaryWeapon()?.id || this.startingWeapon, capped: true };
    }

    this.runStats.bossWeaponDrops.push({ floor: this.floor, weaponId, ...record });
    const rewardRarity = record.result === "unlock" ? "epic" : record.result === "upgrade" ? "elite" : "common";
    this.addEffect("absorb", this.player.x, this.player.y, 92, rarityColor(rewardRarity));
    this.sfx.play(record.result === "unlock" ? "level" : "confirm");
    return { title, copy, button, record };
  },

  openBossWeaponReward() {
    this.resetSingleRefresh("weaponReward");
    const offers = [this.rollBossWeaponReward()].filter(Boolean);
    this.mode = "weaponReward";
    this.currentRoom = {
      id: "weaponReward",
      title: "武器回声",
      copy: "当前结果。可刷新。",
      button: "继续挑战",
    };
    this.shopOffers = offers;
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
  },

  completeBossWeaponReward(reward) {
    const completedAllMaps = this.floor >= 40;
    if (this.cycleStep(this.floor) === 10) {
      this.runStats.completedNormal = true;
      this.runStats.enteredDeep = this.floor >= 10;
      this.profile.clearedNormalMode = true;
      this.profile.unlockedDeepChallenge = true;
      this.profile.clearedFirstTenthBoss = true;
      this.unlockAchievement("clearFloor10");
      this.writeProfile();
    }
    this.currentRoom = {
      ...(this.currentRoom || {}),
      completed: true,
      title: completedAllMaps ? "四十层裂隙已通关" : reward.title,
      copy: completedAllMaps ? "你已经突破 1-40 层全部地图。重新开始后可选择武器开启新一轮挑战。" : reward.copy,
      button: completedAllMaps ? "重新开始" : "进入下一层",
    };
    this.shopOffers = [];
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
  },

  openPostBossReward(reward) {
    const completedAllMaps = this.floor >= 40;
    if (this.cycleStep(this.floor) === 10) {
      this.runStats.completedNormal = true;
      this.runStats.enteredDeep = this.floor >= 10;
      this.profile.clearedNormalMode = true;
      this.profile.unlockedDeepChallenge = true;
      this.profile.clearedFirstTenthBoss = true;
      this.unlockAchievement("clearFloor10");
      this.writeProfile();
    }
    this.mode = "nextFloor";
    this.pendingNextFloor = this.floor + 1;
    this.currentRoom = {
      id: "nextFloor",
      afterBossReward: !completedAllMaps,
      title: completedAllMaps ? "四十层裂隙已通关" : reward.title,
      copy: completedAllMaps ? "你已经突破 1-40 层全部地图。重新开始后可选择武器开启新一轮挑战。" : reward.copy,
      button: completedAllMaps ? "重新开始" : "选择裂隙祝福",
    };
    this.shopOffers = [];
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
    this.updateUi();
  },

  completeSafeEvent(message) {
    if (this.safeEvent) {
      this.safeEvent.completed = true;
      this.safeEvent.opened = true;
    }
    this.currentRoom = {
      ...(this.currentRoom || {}),
      completed: true,
      copy: message,
    };
    this.shopOffers = [];
    this.renderIntermission();
    ui.shop.classList.remove("hidden");
    this.sfx.play("confirm");
  },
});

Object.assign(RogueGame.prototype, {
  finishFloor() {
    if (this.mode !== "combat") return;
    this.resetSingleRefresh("floorEnd");
    this.releaseAll(this.active.enemies, this.enemyPool);
    this.releaseAll(this.active.drops, this.dropPool);
    this.profile.highestFloor = Math.max(this.profile.highestFloor || 1, this.floor);
    if (this.floor >= 10) {
      this.runStats.enteredDeep = true;
      this.unlockAchievement("enterDeep");
    }
    if (this.floor >= 20) {
      this.unlockAchievement("reachFloor20");
    }
    this.writeProfile();
    this.openFloorUpgrade(this.floor, { nextFloor: this.floor + 1 });
  },

  openStageSummary(normalClear = false) {
    this.mode = "stage";
    const isNormalClear = normalClear && this.cycleStep(this.floor) === 10;
    ui.stageTitle.textContent = isNormalClear ? "十层循环突破" : `第 ${this.floor} 层完成`;
    ui.stageBody.innerHTML = this.statRows([
      ["当前到达", `第 ${this.floor} 层`],
      ["击败敌人", this.runStats.kills],
      ["获得金币", this.runStats.coinsEarned],
      ["裂隙祝福", this.playerUpgrades.map((item) => item.name).slice(-3).join(" / ") || "无"],
      ["武器附魔", this.weapons.flatMap((weapon) => weapon.enchantments || []).map((item) => item.name).join(" / ") || "无"],      ["十层循环", this.profile.clearedNormalMode ? "已突破" : "进行中"],
    ]);
    ui.stageSettle.textContent = isNormalClear ? "带着奖励离开" : "暂时结算";
    ui.stageContinue.textContent = "继续前进";
    ui.stageSummary.classList.remove("hidden");
    this.updateUi();
  },

  continueAfterStage() {
    this.clearLayer(ui.stageSummary);
    this.runStats.rewardMultiplier += this.floor >= 9 ? 0.18 : 0.08;
    if (this.floor >= 10) this.runStats.enteredDeep = true;
    this.requestNextFloor(this.floor + 1);
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
    if (roll < 0.3) return { id: "shrine", title: "沉默神龛", copy: "沉默神龛正在等待一笔裂隙交易。", shop: false };
    if (roll < 0.55) return { id: "forge", title: "流浪铁匠", copy: "他只关心你的武器还能不能撑到下一层。", shop: false };
    if (roll < 0.9) return { id: "supply", title: "临时补给", copy: "这里很安静，但这种安静通常不会持续太久。", shop: false };
    return { id: "shop", title: "临时商店", copy: "价格不算公道，但你可能没有更好的选择。", shop: true };
  },

  rollRoomRewards(room) {
    if (room.id === "shop") return this.rollShopOffers();
    const rewards = [];
    if (room.id === "forge" || room.id === "bossReward") rewards.push(...this.weapons.map((weapon) => this.rewardWeaponUpgrade(weapon)));
    if (room.id === "supply") rewards.push(...this.supplyRewards());
    if (room.id === "bossReward") rewards.push(this.rewardComboUpgrade());
    return shuffle(rewards).slice(0, 3);
  },

  rewardWeaponUpgrade(weapon) {
    const titles = {
      fist: "缠紧拳带",
      knife: "磨亮刀纹",
      magicMissile: "重刻杖纹",
      dart: "校准回旋",
      needle: "重理针线",
    };
    return {
      id: `forge-${weapon.id}`,
      title: titles[weapon.id] || `${weapon.shortName} 升阶`,
      type: "武器升阶",
      rarity: "common",
      color: rarityColor("common"),
      text: weapon.level >= this.weaponMaxLevel(weapon) ? "手感提升" : "升一阶",
      apply: () => this.upgradeWeapon(weapon.id, { level: 1, cooldown: 0.05, speed: 20, returnSpeed: 24 }),
    };
  },

  supplyRewards() {
    return [
      { id: "heal", title: "应急治疗", type: "补给", rarity: "common", color: rarityColor("common"), text: "恢复 2 颗爱心。", apply: () => { this.hp = Math.min(this.maxHp, this.hp + 40); } },
      { id: "goldBag", title: "金币袋", type: "补给", rarity: "common", color: rarityColor("common"), text: "立即获得一袋金币。", apply: () => { this.coins += 28; this.runStats.coinsEarned += 28; } },
      { id: "tempo", title: "短暂振奋", type: "补给", rarity: "common", color: rarityColor("common"), text: "下一层开始时攻击速度提升。", apply: () => { for (const weapon of this.weapons) weapon.timer = 0.05; } },
    ];
  },

  rewardComboUpgrade() {
    return {
      id: "comboPulse",
      title: "组合脉冲",
      type: "组合",
      rarity: "epic",
      color: rarityColor("epic"),
      text: "当前激活组合效果增强。若未激活组合，则获得一把缺失武器。",
      apply: () => {
        if (this.synergies.length) {
          this.areaDamage(this.player.x, this.player.y, 120, 48 + this.level * 3, COLORS.gold);
          this.say("组合脉冲");
        } else this.upgradeWeapon(this.primaryWeapon()?.id, { cooldown: 0.04 });
      },
    };
  },
});

Object.assign(RogueGame.prototype, {
  renderIntermission() {
    const room = this.currentRoom || { id: "supply", title: "临时补给", copy: "" };
    const isShop = room.id === "shop";
    const isShrine = room.id === "shrine";
    const isBlacksmith = room.id === "blacksmith";
    const isCompletedSafe = Boolean(room.completed);
    const isNextFloor = room.id === "nextFloor";
    const isBossRewardNotice = Boolean(room.afterBossReward);
    const isWeaponReward = room.id === "weaponReward";
    const isWeaponNotice = room.id === "weaponNotice";
    ui.shopKicker.textContent = isBossRewardNotice ? "武器回声" : isNextFloor ? "下一层" : isWeaponReward ? "武器回声" : isWeaponNotice ? "武器提示" : isShop ? "裂隙商店" : isShrine ? "裂隙交易" : isBlacksmith ? "武器附魔" : "层间房间";
    ui.shopTitle.textContent = room.title;
    ui.shopCopy.textContent = room.copy;
    ui.shopGold.textContent = `金币 ${this.coins}`;
    if (isNextFloor || isWeaponNotice || (isWeaponReward && isCompletedSafe) || (isBlacksmith && isCompletedSafe) || (isBlacksmith && room.confirmingEnchant)) {
      ui.refreshShop.classList.add("hidden");
    } else if (isBlacksmith) {
      const price = this.currentRefreshPrice || SINGLE_REFRESH_BASE;
      ui.refreshShop.textContent = `刷新 ${price}金`;
      ui.refreshShop.disabled = false;
      ui.refreshShop.classList.remove("hidden");
    } else if (isWeaponReward) {
      const price = this.currentRefreshPrice || SINGLE_REFRESH_BASE;
      ui.refreshShop.textContent = `刷新 ${price}金`;
      ui.refreshShop.disabled = false;
      ui.refreshShop.classList.remove("hidden");
    } else if (isShop || room.id === "intermission") {
      ui.refreshShop.textContent = `刷新商品 ${this.intermissionRefreshPrice}金`;
      ui.refreshShop.disabled = false;
      ui.refreshShop.classList.remove("hidden");
    } else {
      ui.refreshShop.classList.add("hidden");
    }
    ui.continueRun.textContent = room.confirmingEnchant ? "确认附魔" : isWeaponReward || isWeaponNotice ? room.button || "确认" : isNextFloor ? room.button || "确认进入下一层" : this.pendingSafeNextFloor ? `进入第 ${this.pendingSafeNextFloor} 层` : "进入下一层";
    ui.continueRun.classList.toggle("hidden", !(isNextFloor || room.confirmingEnchant || (isWeaponReward && isCompletedSafe) || isWeaponNotice || isShop || (isCompletedSafe && !isWeaponReward)));
    ui.shopMessage.textContent = "";
    ui.shopItems.innerHTML = "";
    ui.shop.classList.toggle("next-floor-modal", isNextFloor);
    ui.shop.classList.toggle("blacksmith-choice-modal", isBlacksmith && !room.confirmingEnchant);
    ui.shop.classList.toggle("blacksmith-confirm-modal", isBlacksmith && room.confirmingEnchant);
    ui.shopItems.className = isShop || isShrine ? "choice-grid shop-grid" : isBlacksmith && !room.confirmingEnchant ? "choice-grid card-fan" : isBlacksmith || isWeaponReward ? "choice-grid single-result" : "choice-grid card-fan";
    this.shopOffers.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = `choice-card ${isShop || isShrine || isBlacksmith ? "shop-card" : ""} rarity-${item.rarity || "common"}`;
      button.type = "button";
      button.style.setProperty("--card-color", rarityColor(item.rarity));
      button.style.setProperty("--delay", `${index * 80}ms`);
      button.style.setProperty("--r", `${(index - 1) * 8}deg`);
      if (isShop || isShrine || isBlacksmith) {
        const priceText = item.sold ? "成交" : item.price ? (this.coins < item.price ? "金币不足" : `${item.price} 金币`) : item.button || "选择";
        button.innerHTML = `<span class="shop-icon" aria-hidden="true">${shopIconSvg(item.icon || (isShrine ? "skull" : isBlacksmith ? "sword" : "coin"))}</span><strong>${item.title}</strong><span>${item.type} · ${item.text}</span><em>${priceText}</em>`;
      } else {
        button.innerHTML = `<small>${item.type} · ${RARITIES[item.rarity || "common"].label}</small><strong>${item.title}</strong><span>${item.text}</span>`;
      }
      button.disabled = Boolean(item.sold);
      button.addEventListener("click", () => (isShop ? this.openBuyDialog(item) : this.chooseIntermissionReward(item)));
      ui.shopItems.appendChild(button);
    });
  },

  chooseIntermissionReward(item) {
    if (!["intermission", "shrine", "blacksmith", "weaponReward"].includes(this.mode)) return;
    if (item.price && this.coins < item.price) {
      this.showShopMessage("金币不足。钱不够，命也不够。");
      this.sfx.play("fail");
      return;
    }
    const modeBeforeApply = this.mode;
    if (item.price && this.mode !== "shrine") this.coins -= item.price;
    const result = item.apply(this);
    if (modeBeforeApply === "weaponReward") {
      this.completeBossWeaponReward(result);
      return;
    }
    if (modeBeforeApply === "shrine" || modeBeforeApply === "blacksmith") return;
    this.sfx.play("upgradePick");
    this.addEffect("absorb", this.player.x, this.player.y, item.rarity === "epic" ? 82 : 62, rarityColor(item.rarity));
    this.recalculateSynergies();
    this.clearLayer(ui.shop);
    this.requestNextFloor(this.floor + 1);
  },

  rollShopOffers() {
    const pool = [];
    pool.push(
      { id: "potion", icon: "potion", title: "爱心药剂", type: "补给", rarity: "common", color: rarityColor("common"), text: "回复 2 颗爱心。", basePrice: 18, apply: () => { this.hp = Math.min(this.maxHp, this.hp + 40); } },
      { id: "shield", icon: "shield", title: "一次性护盾", type: "补给", rarity: "common", color: rarityColor("common"), text: "抵挡下一次伤害。", basePrice: 28, apply: () => { this.player.shield = 1; } },
      { id: "ticket", icon: "scroll", title: "祝福刷新券", type: "补给", rarity: "common", color: rarityColor("common"), text: "获得 30 金币。", basePrice: 20, apply: () => { this.coins += 30; this.runStats.coinsEarned += 30; } },
    );
    for (const weapon of [this.primaryWeapon()].filter(Boolean)) {
      const iconMap = { fist: "shield", knife: "sword", magicMissile: "crystal", dart: "scope", needle: "scroll" };
      pool.push({
        id: `shop-${weapon.id}`,
        icon: iconMap[weapon.id] || "sword",
        title: `${weapon.shortName} 升阶`,
        type: "武器升阶",
        rarity: "common",
        color: rarityColor("common"),
        text: weapon.level >= this.weaponMaxLevel(weapon) ? "手感提升" : `当前 ${this.weaponLevelLabel(weapon.level)} → 升阶`,
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
    ui.buyConfirm.disabled = false;
    ui.buyConfirm.textContent = this.coins < item.price ? "金币不足" : "成交";
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
      this.showShopMessage(`金币不足，购买需要 ${item.price} 金，还差 ${item.price - this.coins} 金。`);
      this.sfx.play("fail");
      return;
    }
    this.coins -= item.price;
    item.sold = true;
    item.apply(this);
    this.addEffect("ring", this.player.x, this.player.y, 58, rarityColor(item.rarity));
    this.showShopMessage(`已购买：${item.title}`);
    this.sfx.play("buyConfirm");
    this.closeBuyDialog(false);
    this.renderIntermission();
    this.updateUi();
  },

  refreshIntermission() {
    if (!["shop", "intermission", "blacksmith", "weaponReward"].includes(this.mode)) return;
    if (this.mode === "weaponReward") {
      if (this.currentRoom?.completed) return;
      if (!this.spendSingleRefresh("刷新回声")) return;
      this.shopOffers = [this.rollBossWeaponReward()].filter(Boolean);
      this.renderIntermission();
      this.updateUi();
      return;
    }
    if (this.mode === "blacksmith") {
      if (this.currentRoom?.confirmingEnchant || this.currentRoom?.completed) return;
      if (!this.spendSingleRefresh("刷新附魔")) return;
      this.shopOffers = this.rollBlacksmithOffers();
      this.renderIntermission();
      this.updateUi();
      return;
    }
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
    if (this.mode === "weaponReward") {
      if (!this.currentRoom?.completed) {
        this.showShopMessage("先选择一个武器回声。");
        this.sfx.play("fail");
        return;
      }
      if (this.floor >= 40) {
        this.retryRun();
        return;
      }
      this.clearLayer(ui.shop);
      this.openFloorUpgrade(this.floor, { nextFloor: this.floor + 1 });
      return;
    }
    if (this.mode === "weaponNotice") {
      this.clearLayer(ui.shop);
      this.mode = ui.heroSelect && !ui.heroSelect.classList.contains("hidden") ? "weaponSelect" : "title";
      return;
    }
    if (this.mode === "nextFloor") {
      if (this.floor >= 40 && this.currentRoom?.button === "重新开始") {
        this.retryRun();
        return;
      }
      const next = this.pendingNextFloor || this.floor + 1;
      this.clearLayer(ui.shop);
      this.pendingNextFloor = null;
      if (this.currentRoom?.afterBossReward) {
        this.openFloorUpgrade(this.floor, { nextFloor: next });
        return;
      }
      this.startFloor(next);
      return;
    }
    if (this.mode === "blacksmith" && this.currentRoom?.confirmingEnchant) {
      const enchant = this.pendingEnchantChoice;
      if (!enchant) {
        this.showShopMessage("没有可确认的附魔。");
        this.sfx.play("fail");
        return;
      }
      this.applyWeaponEnchant(enchant);
      this.pendingEnchantChoice = null;
      const next = this.pendingSafeNextFloor || this.floor + 1;
      this.clearLayer(ui.shop);
      this.pendingSafeNextFloor = null;
      this.openFloorUpgrade(this.floor, { nextFloor: next, nextCopy: "附魔完成。" });
      return;
    }
    if (["shrine", "blacksmith"].includes(this.mode) && this.currentRoom?.completed) {
      const next = this.pendingSafeNextFloor || this.floor + 1;
      this.clearLayer(ui.shop);
      this.pendingSafeNextFloor = null;
      this.openFloorUpgrade(this.floor, { nextFloor: next });
      return;
    }
    if (this.mode !== "shop") return;
    this.clearLayer(ui.shop);
    this.requestNextFloor(this.floor + 1);
  },

  showShopMessage(message) {
    ui.shopMessage.textContent = message;
    this.shopMessageTimer = 2.4;
  },

  findBulletBlocker(shot, shotIndex) {
    for (let j = this.active.effects.length - 1; j >= 0; j -= 1) {
      if (j === shotIndex) continue;
      const effect = this.active.effects[j];
      if (!effect.friendlyAttack) continue;
      if (effect.radius && ["slash", "ring", "triBurst"].includes(effect.type)) {
        if (Math.hypot(shot.x - effect.x, shot.y - effect.y) <= shot.radius + effect.radius) return j;
        continue;
      }
      const ax = effect.fromX || effect.x;
      const ay = effect.fromY || effect.y;
      const bx = effect.x;
      const by = effect.y;
      const vx = bx - ax;
      const vy = by - ay;
      const lenSq = vx * vx + vy * vy || 1;
      const t = clamp(((shot.x - ax) * vx + (shot.y - ay) * vy) / lenSq, 0, 1);
      const px = ax + vx * t;
      const py = ay + vy * t;
      if (Math.hypot(shot.x - px, shot.y - py) <= shot.radius + 14) return j;
    }
    return -1;
  },

});

Object.assign(RogueGame.prototype, {
  openBossCue(spec) {
    this.resumeMode = "combat";
    this.mode = "cue";
    for (let i = this.active.effects.length - 1; i >= 0; i -= 1) {
      if (this.active.effects[i].type === "enemyShot") this.releaseActive(this.active.effects, i, this.effectPool);
    }
    this.player.invuln = Math.max(this.player.invuln || 0, 0.8);
    ui.bossCueKicker.textContent = spec.rank === "boss" ? "Boss 出现" : spec.rank === "lieutenant" ? "副首领出现" : "精英出现";
    ui.bossCueTitle.textContent = spec.cue;
    ui.bossCueText.textContent = spec.escapeAtHalf ? "打到半血后，它会逃向裂隙深处。" : spec.rank === "boss" ? "击败它后会在场内掉落武器回声。" : `${spec.label} 正在靠近。`;
    ui.bossCue.classList.remove("hidden");
  },

  closeBossCue() {
    this.clearLayer(ui.bossCue);
    if (this.mode === "cue") this.mode = "combat";
  },

  openSettings(message = "") {
    if (["title", "weaponSelect", "tutorial", "upgrade", "intermission", "shop", "shrine", "blacksmith", "weaponReward", "nextFloor", "stage", "result", "cue"].includes(this.mode)) return;
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
    this.clearAllModals();
    this.profile.lastStartingWeapon = null;
    this.writeProfile();
    this.resetToTitle();
    this.openWeaponSelect();
  },

  confirmReturnLobby() {
    if (!confirm("确定要返回主界面吗？当前本局进度将会清空。")) return;
    this.returnToLobby();
  },

  returnToLobby() {
    this.clearAllModals();
    this.profile.lastStartingWeapon = null;
    this.writeProfile();
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
    copy.textContent = "移动，攻击，刷新。第 10 层只有 Boss。";
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
    const weapon = this.primaryWeapon();
    const rows = [
      ["初始武器", this.startingWeapon ? ROGUE_WEAPONS[this.startingWeapon].shortName : "未选择"],
      ["当前武器", this.weapons.map((item) => `${item.shortName}${this.weaponLevelLabel(item.level)} · ${this.weaponSkill(item, item.level)?.skillName || "基础技能"}`).join(" / ") || "无"],
      ["技能说明", weapon ? this.weaponSkillText(weapon, weapon.level).replace(/\n+/g, " / ") : "无"],
      ["裂隙祝福", this.playerUpgrades.map((item) => item.name).join(" / ") || "无"],
      ["武器附魔", weapon?.enchantments?.map((item) => `${item.name} ${item.level || 1}阶`).join(" / ") || "无"],
      ["激活组合", this.synergies.map((item) => item.name).join(" / ") || "无"],      ["金币收入", this.runStats.coinsEarned],
    ];
    ui.statsTitle.textContent = "游隙者";
    ui.statsBody.innerHTML = this.statRows(rows);
    ui.statsPanel.classList.remove("hidden");
  },

  closeStatsPanel() {
    this.clearLayer(ui.statsPanel);
  },

  gameOver() {
    if (this.runEnded) return;
    this.endRun("你倒下了。", true);
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
    const reachedFloor = Math.max(this.floor, this.runStats.floorsReached);
    const nextBossFloor = Math.ceil(reachedFloor / 10) * 10;
    const bossDistance = Math.max(0, nextBossFloor - reachedFloor);
    ui.resultModal.classList.toggle("defeat-only", Boolean(defeated));
    ui.resultBody.innerHTML = this.statRows(defeated ? [
      ["存活时间", formatTime(survived)],
      ["击败敌人", this.runStats.kills],
      ["到达层数", `第 ${reachedFloor} 层`],
      ["距离 Boss 层", bossDistance > 0 ? `还差 ${bossDistance} 层` : "已到达"],
    ] : [
      ["存活时间", formatTime(survived)],
      ["击败敌人", this.runStats.kills],
      ["到达层数", `第 ${reachedFloor} 层`],
      ["武器掉落", this.runStats.bossWeaponDrops.map((drop) => `${ROGUE_WEAPONS[drop.weaponId]?.shortName || drop.weaponId}:${drop.result}`).join(" / ") || "无"],
      ["十层循环", this.runStats.completedNormal ? "已突破" : "未突破"],
      ["深层推进", this.runStats.enteredDeep ? "已进入" : "未进入"],
      ["最高组合", this.highestSynergy],
      ["获得金币", this.runStats.coinsEarned],
    ]);
    ui.resultModal.classList.remove("hidden");
    this.sfx.play(defeated ? "fail" : "confirm");
    this.updateUi();
  },

  retryRun() {
    this.clearAllModals();
    this.resetToTitle();
    this.openWeaponSelect();
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
      knifeFloor3: "用太刀开局到达第 3 层",
      missileFloor3: "用法杖开局到达第 3 层",
      dartFloor3: "用飞镖开局到达第 3 层",
      clearFloor10: "首次击败第 10 层 Boss",
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


