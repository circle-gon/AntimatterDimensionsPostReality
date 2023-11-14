import { DC } from "./constants";
import { BitPurchasableMechanicState, RebuyableMechanicState, GameMechanicState } from "./game-mechanics";

export function migrateSaves(player) {
  // change effarig shards to decimal
  player.celestials.effarig.relicShards = new Decimal(player.celestials.effarig.relicShards);
  player.reality.imaginaryMachines = new Decimal(player.reality.imaginaryMachines);
  player.reality.iMCap = new Decimal(player.reality.iMCap);
  player.celestials.ra.peakGamespeed = new Decimal(player.celestials.ra.peakGamespeed);
  player.challenge.normal.bestTimes = player.challenge.normal.bestTimes.map((i) => new Decimal(i));
  player.challenge.infinity.bestTimes = player.challenge.infinity.bestTimes.map((i) => new Decimal(i));

  player.records.thisReality.bestRSMin = new Decimal(player.records.thisReality.bestRSMin);
  player.records.thisReality.bestRSMinVal = new Decimal(player.records.thisReality.bestRSMinVal);

  function patchTime(value) {
    return Decimal.NUMBER_MAX_VALUE.eq(value) || Decimal.MAX_VALUE.eq(value) ? Decimal.MAX_LIMIT : new Decimal(value);
  }

  function swapToDecimal(name) {
    player.records["this" + name].time = new Decimal(player.records["this" + name].time);
    player.records["best" + name].time = patchTime(player.records["best" + name].time);
  }

  function fixRecents(name) {
    player.records["recent" + name] = player.records["recent" + name].map((i) => {
      return [patchTime(i[0]), ...i.slice(1)];
    });
  }

  swapToDecimal("Infinity");
  swapToDecimal("Eternity");
  swapToDecimal("Reality");

  fixRecents("Infinities");
  fixRecents("Eternities");
  fixRecents("Realities");

  player.records.totalTimePlayed = new Decimal(player.records.totalTimePlayed);
  player.records.totalTimePlayedAtBHUnlock = new Decimal(player.records.totalTimePlayedAtBHUnlock);
  player.celestials.enslaved.stored = new Decimal(player.celestials.enslaved.stored);
  player.records.thisInfinity.lastBuyTime = new Decimal(player.records.thisInfinity.lastBuyTime);
  player.auto.reality.shard = new Decimal(player.auto.reality.shard);
  const l = player.celestials.laitela;
  l.darkEnergy = new Decimal(l.darkEnergy);
  l.singularities = new Decimal(l.singularities);
  l.lastCheckedMilestones = new Decimal(l.lastCheckedMilestones);
  l.darkMatterMult = new Decimal(l.darkMatterMult);
  player.auto.annihilation.multiplier = new Decimal(player.auto.annihilation.multiplier);
  player.reality.glyphs.sac = Object.fromEntries(
    Object.entries(player.reality.glyphs.sac).map((i) => [i[0], new Decimal(i[1])])
  );
  player.records.achTimer = new Decimal(player.records.achTimer);

  // New stuff that has been added
  player.records.thisCollapse.time = player.records.totalTimePlayed;
  player.records.thisCollapse.realTime = player.records.realTimePlayed;
  player.records.thisCollapse.realTimeNoStore = player.records.realTimePlayed;

  // new dilation autobuyers
  player.auto.dilationUpgrades.all = [
    ...player.auto.dilationUpgrades.all,
    ...Array.range(0, 3).map(() => ({
      isActive: false,
      lastTick: 0,
    })),
  ];
}

// lazy way to hide the "in this Collapse" text until you know about it
export function atomTimeText() {
  return PlayerProgress.atomUnlocked() ? " in this Collapse" : "";
}

export function gainedAtoms() {
  const gain = DC.D1;
  gain = gain.mul(AtomicParticle(1).effects[1]);
  gain = gain.timesEffectOf(AtomUpgrade(1));
  return gain;
}

function getCollapseGain() {
  return 1;
}

function updateCollapseStats() {
  player.records.bestCollapse.time = player.records.bestCollapse.time.min(player.records.thisCollapse.time);
  player.records.bestCollapse.realTime = Math.min(
    player.records.bestCollapse.realTime,
    player.records.thisCollapse.realTime
  );
  player.records.bestCollapse.realTimeNoStore = Math.min(
    player.records.bestCollapse.realTimeNoStore,
    player.records.thisCollapse.realTimeNoStore
  );
}

function resetCollapseStats() {
  player.records.thisCollapse.time = DC.D0;
  player.records.thisCollapse.realTime = 0;
  player.records.thisCollapse.realTimeNoStore = 0;
  player.records.thisCollapse.maxAM = DC.D0;
  player.records.thisCollapse.maxIP = DC.D0;
  player.records.thisCollapse.maxEP = DC.D0;
  player.records.thisCollapse.maxRM = DC.D0;
  player.records.thisCollapse.maxIM = DC.D0;
}

function askCollapseConfirmation() {
  if (player.options.confirmations.collapse) {
    Modal.collapse.show();
  } else {
    collapse();
  }
}

function lockAchievementsOnCollapse() {
  for (const achievement of Achievements.preAtom) {
    achievement.lock();
  }
  player.reality.achTimer = DC.D0;
}

function giveRealityUpgrade(num) {
  const upg = RealityUpgrade(num);
  player.reality.upgReqs |= 1 << upg.id;
  upg.hasPlayerLock = false;
  upg.isBought = true;
  upg.onPurchased();
}

export function collapse() {
  EventHub.dispatch(GAME_EVENT.COLLAPSE_BEFORE);

  GameEnd.creditsClosed = false;
  GameEnd.creditsEverClosed = false;
  player.isGameEnd = false;

  const atomsGained = gainedAtoms();
  const collapsesMade = getCollapseGain();
  Currency.atoms.add(atomsGained);
  player.atom.totalAtoms = player.atom.totalAtoms.add(atomsGained);
  Currency.collapses.add(collapsesMade);
  updateCollapseStats();
  addCollapseTime(player.records.thisCollapse.time, player.records.thisCollapse.realTime, atomsGained, collapsesMade);

  // RESET

  if (!AtomMilestone.am1.isReached) {
    player.challenge = {
      normal: {
        current: 0,
        bestTimes: Array.repeat(Decimal.MAX_LIMIT, 11),
        completedBits: 0,
      },
      infinity: {
        current: 0,
        bestTimes: Array.repeat(Decimal.MAX_LIMIT, 8),
        completedBits: 0,
      },
      eternity: {
        current: 0,
        unlocked: 0,
        requirementBits: 0,
      },
    };
  }

  lockAchievementsOnCollapse();

  // Celestials
  player.celestials.teresa = {
    pouredAmount: 0,
    unlockBits: 0,
    run: false,
    bestRunAM: DC.D1,
    bestAMSet: [],
    perkShop: Array.repeat(0, 5),
    lastRepeatedMachines: DC.D0,
    quoteBits: AtomMilestone.am1.isReached ? player.celestials.teresa.quoteBits : 0,
  };

  player.celestials.effarig = {
    relicShards: DC.D0,
    unlockBits: 0,
    run: false,
    glyphWeights: {
      ep: 25,
      repl: 25,
      dt: 25,
      eternities: 25,
    },
    autoAdjustGlyphWeights: false,
    quoteBits: AtomMilestone.am1.isReached ? player.celestials.effarig.quoteBits : 0,
  };

  Object.assign(player.celestials.enslaved, {
    isStoring: false,
    stored: DC.D0,
    isStoringReal: false,
    storedReal: 0,
    autoStoreReal: false,
    isAutoReleasing: false,
    unlocks: [],
    run: false,
    completed: false,
    tesseracts: 0,
    hasSecretStudy: false,
    feltEternity: false,
    progressBits: 0,
    hintBits: 0,
    hintUnlockProgress: 0,
    glyphHintsGiven: 0,
    zeroHintTime: 0,
    quoteBits: AtomMilestone.am1.isReached ? player.celestials.enslaved.quoteBits : 0,
    isDischargingReal: false,
  });
  Enslaved.autoReleaseTick = 0;

  V.reset();
  player.celestials.v.quoteBits = AtomMilestone.am1.isReached ? player.celestials.teresa.quoteBits : 0;

  Ra.reset();
  player.celestials.ra.petWithRemembrance = "";
  player.celestials.ra.momentumTime = 0;
  player.celestials.ra.alchemy = Array.repeat(0, 21).map(() => ({
    amount: 0,
    reaction: false,
  }));
  player.celestials.ra.highestRefinementValue = {
    power: 0,
    infinity: 0,
    time: 0,
    replication: 0,
    dilation: 0,
    effarig: 0,
  };
  player.celestials.ra.quoteBits = AtomMilestone.am1.isReached ? player.celestials.ra.quoteBits : 0;

  Laitela.reset();
  Object.assign(player.celestials.laitela, {
    run: false,
    entropy: 0,
    thisCompletion: 3600,
    upgrades: {},
    darkEnergy: DC.D0,
    lastCheckedMilestones: DC.D0,
    quoteBits: AtomMilestone.am1.isReached ? player.celestials.laitela.quoteBits : 0,
  });

  Object.assign(player.celestials.pelle, {
    doomed: false,
    upgrades: new Set(),
    remnants: 0,
    realityShards: DC.D0,
    records: {
      totalAntimatter: DC.D0,
      totalInfinityPoints: DC.D0,
      totalEternityPoints: DC.D0,
    },
    rebuyables: {
      antimatterDimensionMult: 0,
      timeSpeedMult: 0,
      glyphLevels: 0,
      infConversion: 0,
      galaxyPower: 0,
      galaxyGeneratorAdditive: 0,
      galaxyGeneratorMultiplicative: 0,
      galaxyGeneratorAntimatterMult: 0,
      galaxyGeneratorIPMult: 0,
      galaxyGeneratorEPMult: 0,
    },
    rifts: {
      vacuum: {
        fill: DC.D0,
        active: false,
        reducedTo: 1,
      },
      decay: {
        fill: DC.D0,
        active: false,
        percentageSpent: 0,
        reducedTo: 1,
      },
      chaos: {
        fill: 0,
        active: false,
        reducedTo: 1,
      },
      recursion: {
        fill: DC.D0,
        active: false,
        reducedTo: 1,
      },
      paradox: {
        fill: DC.D0,
        active: false,
        reducedTo: 1,
      },
    },
    progressBits: 0,
    galaxyGenerator: {
      unlocked: false,
      spentGalaxies: 0,
      generatedGalaxies: 0,
      phase: 0,
      sacrificeActive: false,
    },
    collapsed: {
      upgrades: false,
      rifts: false,
      galaxies: false,
    },
    quoteBits: AtomMilestone.am1.isReached ? player.celestials.pelle.quoteBits : 0,
  });

  // Reality
  player.reality.upgReqs = 0;
  player.reality.imaginaryUpgReqs = 0;
  player.reality.upgradeBits = 0;
  player.reality.imaginaryUpgradeBits = 0;
  player.reality.realityMachines = DC.D0;
  player.reality.reqLock.reality = 0;
  player.reality.reqLock.imaginary = 0;
  player.reality.imaginaryMachines = DC.D0;
  player.reality.maxRM = DC.D0;
  player.reality.iMCap = DC.D0;
  player.reality.glyphs.sac.power = DC.D0;
  player.reality.glyphs.sac.infinity = DC.D0;
  player.reality.glyphs.sac.replication = DC.D0;
  player.reality.glyphs.sac.time = DC.D0;
  player.reality.glyphs.sac.dilation = DC.D0;
  player.reality.glyphs.sac.effarig = DC.D0;
  player.reality.glyphs.sac.reality = DC.D0;
  player.reality.glyphs.undo = [];
  player.reality.perkPoints = 0;
  player.realities = 0;
  player.reality.perks.clear();

  for (let i = 1; i <= 5; i++) {
    player.reality.rebuyables[i] = 0;
  }

  for (let i = 1; i <= 10; i++) {
    player.reality.imaginaryRebuyables[i] = 0;
  }

  player.blackHole = Array.range(0, 2).map((id) => ({
    id,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0,
  }));

  player.records.thisReality = {
    time: DC.D0,
    realTime: 0,
    maxAM: DC.D0,
    maxIP: DC.D0,
    maxEP: DC.D0,
    bestEternitiesPerMs: DC.D0,
    maxReplicanti: DC.D0,
    maxDT: DC.D0,
    bestRSmin: DC.D0,
    bestRSminVal: DC.D0,
  };
  player.records.bestReality = {
    time: Decimal.MAX_LIMIT,
    realTime: Number.MAX_VALUE,
    glyphStrength: 0,
    RM: DC.D0,
    RMSet: [],
    RMmin: DC.D0,
    RMminSet: [],
    glyphLevel: 0,
    glyphLevelSet: [],
    bestEP: DC.D0,
    bestEPSet: [],
    speedSet: [],
    iMCapSet: [],
    laitelaSet: [],
  };

  // remove all glyphs in inventory that aren't companion
  for (const glyph of Glyphs.inventory) {
    if (glyph !== null && (!AtomMilestone.am1.isReached || glyph.type !== "companion"))
      Glyphs.removeFromInventory(glyph, false);
  }

  // remove all active glyphs that aren't companion
  const protectedRows = player.reality.glyphs.protectedRows;
  player.reality.glyphs.protectedRows = 0;

  for (const activeGlyph of player.reality.glyphs.active) {
    Glyphs.active[activeGlyph.idx] = null;
    if (activeGlyph.type === "companion" && AtomMilestone.am1.isReached) {
      let index = Glyphs.findFreeIndex(false);
      // this will always have an index because we set it to no protection
      Glyphs.addToInventory(activeGlyph, index, true);
    }
  }
  player.reality.glyphs.active = [];
  player.reality.glyphs.protectedRows = protectedRows;

  // Reality
  recalculateAllGlyphs();
  Glyphs.updateMaxGlyphCount(true);
  Glyphs.refreshActive();
  resetRealityRuns();
  clearCelestialRuns();
  player.reality.unlockedEC = 0;
  player.reality.lastAutoEC = 0;
  player.reality.gainedAutoAchievements = false;
  player.reality.hasCheckedFilter = false;

  // Eternity
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = 0;
  player.records.thisEternity.maxAM = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  player.records.bestEternity.time = Decimal.MAX_LIMIT;
  player.records.bestEternity.realTime = Number.MAX_VALUE;
  player.records.bestEternity.bestEPminReality = DC.D0;
  Currency.timeShards.reset();
  Currency.eternityPoints.reset();
  EternityUpgrade.epMult.reset();
  Currency.eternities.reset();
  player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  player.eternityChalls = {};
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Currency.timeTheorems.reset();
  player.dilation.studies = [];
  player.dilation.active = false;
  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0,
    11: 0,
    12: 0,
    13: 0,
  };
  Currency.tachyonParticles.reset();
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
  Currency.dilatedTime.reset();
  player.dilation.lastEP = DC.DM1;
  resetEternityRuns();
  fullResetTimeDimensions();
  resetTimeDimensions();

  // Infinity
  player.records.bestInfinity.time = Decimal.MAX_LIMIT;
  player.records.bestInfinity.realTime = Number.MAX_VALUE;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = 0;
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisInfinity.bestIPmin = DC.D0;
  initializeChallengeCompletions(true);
  disChargeAll();
  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = false;
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Replicanti.reset(true);
  playerInfinityUpgradesOnReset();
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  secondSoftReset(false);
  InfinityDimensions.resetAmount();
  Currency.infinityPoints.reset();

  // Pre-Infinity
  player.sacrificed = DC.D0;
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  resetChallengeStuff();
  AntimatterDimensions.reset();
  resetTickspeed();

  // Misc
  resetCollapseStats();
  if (player.options.automatorEvents.clearOnReality) AutomatorData.clearEventLog();
  if (Player.automatorUnlocked && AutomatorBackend.state.forceRestart) {
    // Make sure to restart the current script instead of using the editor script - the editor script might
    // not be a valid script to run; this at best stops it from running and at worst causes a crash
    AutomatorBackend.start(AutomatorBackend.state.topLevelScript);
  }
  AchievementTimers.marathon2.reset();
  Tab.dimensions.antimatter.show();

  Lazy.invalidateAll();
  ECTimeStudyState.invalidateCachedRequirements();
  Player.resetRequirements("atom");

  if (AtomMilestone.am1.isReached) {
    // this needs to be done this way because some perks rely on others
    const visited = [];
    const toVisit = [Perk.firstPerk];
    while (toVisit.length > 0) {
      Currency.perkPoints.add(1);
      const perk = toVisit.shift();
      visited.push(perk);
      toVisit.push(...perk.connectedPerks.filter((p) => !visited.includes(p)));
      perk.purchase();
    }

    giveRealityUpgrade(10);
    giveRealityUpgrade(13);
    giveRealityUpgrade(25);

    // no need for onPurchased call since none of the upgrades have ite none of the upgrades have it
    for (const upg of PelleUpgrades.singles) upg.isBought = true
  }
  if (AtomUpgrade(8).isBought) {
    // this must be done this way because ach 188 should not be obtained
    for (let ach = 181; ach <= 187; ach++) Achievement(ach).unlock();
  }

  EventHub.dispatch(GAME_EVENT.COLLAPSE_AFTER);
}

export function collapseResetRequest() {
  if (!Player.canCollapse) return;
  askCollapseConfirmation();
}

export function breakUniverse() {
  // TODO: expand this
  player.atom.broken = true;
  collapse();
}

export class AtomMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    // TODO: testing
    return player.records.bestCollapse.realTimeNoStore < this.time;
  }

  get time() {
    return this.config.time;
  }

  get reward() {
    return this.config.reward;
  }
}

export const AtomMilestone = mapGameDataToObject(
  GameDatabase.atom.milestones,
  (config) => new AtomMilestoneState(config)
);

class AtomUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }

  get currency() {
    return Currency.atoms;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.atom.upgradeBits;
  }

  set bits(value) {
    player.atom.upgradeBits = value;
  }

  get hasPlayerLock() {
    return false;
  }

  get isLockingMechanics() {
    const shouldBypass = this.config.bypassLock?.() ?? false;
    return this.hasPlayerLock && this.isPossible && !shouldBypass && !this.isAvailableForPurchase;
  }

  get isAvailableForPurchase() {
    return true;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  tryUnlock() {
    const atomReached = PlayerProgress.atomUnlocked();
    if (!atomReached || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.atom.upgReqs |= 1 << this.id;
    GameUI.notify.reality(`You've unlocked an Atom Upgrade: ${this.config.name}`);
    this.hasPlayerLock = false;
  }
}

class RebuyableAtomUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.atoms;
  }

  get boughtAmount() {
    return player.atom.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.atom.rebuyables[this.id] = value;
  }
}

const AUIndex = mapGameData(GameDatabase.atom.upgrades, (config) =>
  config.id % 5 === 1 ? new RebuyableAtomUpgradeState(config) : new AtomUpgradeState(config)
);

export const AtomUpgrade = (id) => AUIndex[id];

export const AtomUpgrades = {
  all: AUIndex.compact(),
  // used for the pelle rebuyable dilation upgrades
  dilExpo(id) {
    if (Pelle.isDoomed) return 1;
    if (id === 11) return 1.5;
    if (id === 12) return 3.5;
    return 3;
  },
};

class AtomicParticleState extends GameMechanicState {
  get name() {
    return this.config.name;
  }
  get color() {
    return this.config.color;
  }
  get amount() {
    return player.atom.particles[this.config.id];
  }
  get effects() {
    return this.config.bonus(this.amount);
  }
  get effectDescriptions() {
    return this.config.description(this.effects);
  }

  // a utility
  static createAccessor(gameData) {
    return super.createAccessor(
      gameData.map((i, id) => ({
        ...i,
        id,
      }))
    );
  }
}

export const AtomicParticle = AtomicParticleState.createAccessor(GameDatabase.atom.power);

export const AtomicPower = {
  get gain() {
    if (!PlayerProgress.atomUnlocked()) return DC.D0;
    let base = player.atom.totalAtoms.mul(Currency.collapses.value);
    base = base.mul(AtomicParticle(1).effects[0]);
    return base;
  },
  tick(realDiff) {
    player.atom.atomicPower = player.atom.atomicPower.add(this.gain.mul(realDiff / 1000));
  },
  use(slot) {
    player.atom.particles[slot] = player.atom.particles[slot].add(player.atom.atomicPower);
    player.atom.atomicPower = DC.D0;
  },
};
