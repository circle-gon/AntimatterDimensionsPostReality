import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const gamespeed = {
  total: {
    name: "Game speed",
    displayOverride: () => {
      if (Enslaved.isStoringRealTime) return `Set to ${format(0)} (storing real time)`;
      if (EternityChallenge(12).isRunning) return `${formatX(1)}/${formatInt(1000)} (fixed)`;
      const curr = getGameSpeedupFactor();

      const bh = MultiplierTabHelper.blackHoleSpeeds();
      const currBH = bh.current;
      const avgBH = bh.average;

      const avgSpeed = Enslaved.isAutoReleasing ? getGameSpeedupForDisplay() : curr.div(currBH).mul(avgBH);
      const avgString = ` (current) | ${formatX(avgSpeed, 2, 2)} (average)`;
      return `${formatX(curr, 2, 2)}${curr.eq(avgSpeed) ? "" : avgString}`;
    },
    multValue: () => getGameSpeedupForDisplay(),
    isActive: () => PlayerProgress.seenAlteredSpeed(),
    dilationEffect: () => (Effarig.isRunning ? Effarig.multDilation : 1),
    isDilated: true,
    overlay: ["Δ", `<i class="fas fa-clock" />`, `<i class="fas fa-circle" />`],
  },
  glyph: {
    name: "Equipped Glyphs",
    multValue: () => getAdjustedGlyphEffect("timespeed"),
    powValue: () => getAdjustedGlyphEffect("effarigblackhole"),
    isActive: () => PlayerProgress.realityUnlocked() && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  blackHoleCurr: {
    name: "Current Black Hole Speedup",
    multValue: () => MultiplierTabHelper.blackHoleSpeeds().current,
    isActive: () => BlackHole(1).isUnlocked && !BlackHoles.arePaused && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.BLACK_HOLE,
  },
  blackHoleAvg: {
    name: "Average Black Hole Speedup",
    multValue: () => MultiplierTabHelper.blackHoleSpeeds().average,
    isActive: () => BlackHole(1).isUnlocked && !BlackHoles.arePaused && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.BLACK_HOLE,
  },
  achievementMult: {
    name: "30 V-Achievement Milestone - Achievement Multiplier",
    multValue: () => VUnlocks.achievementBH.effectOrDefault(1).pow(BlackHoles.list.countWhere((bh) => bh.isUnlocked)),
    isActive: () => !BlackHoles.arePaused && VUnlocks.achievementBH.canBeApplied && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  pulsing: {
    name: "Auto-Discharging Stored Time",
    multValue: () =>
      Enslaved.isAutoReleasing ? Enslaved.autoReleaseSpeed.div(getGameSpeedupFactor()).max(1) : getGameSpeedupFactor(),
    isActive: () => Enslaved.canRelease() && Enslaved.isAutoReleasing && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.BH_PULSE,
  },
  singularity: {
    name: "Singularity Milestone - Game speed based on Singularities",
    multValue: () => SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1),
    isActive: () => SingularityMilestone.gamespeedFromSingularities.canBeApplied && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.SINGULARITY,
  },
  pelle: {
    name: "Pelle Upgrade - Repeatable Game speed",
    multValue: () => PelleUpgrade.timeSpeedMult.effectValue.toNumber(),
    isActive: () => Pelle.isDoomed && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.PELLE,
  },

  ec12: {
    name: "Eternity Challenge 12",
    multValue: () => Decimal.div(0.001, getGameSpeedupForDisplay()),
    isActive: () => EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.CHALLENGE("eternity"),
  },
  chargingBH: {
    name: "Black Hole Charging",
    // The 0 in multValue is irrelevant; if this upgrade isn't available, the subtab is hidden by 1x total effect
    multValue: () => (Ra.unlocks.autoPulseTime.canBeApplied ? 0.01 : 0),
    isActive: () => Enslaved.isStoringGameTime,
    icon: MultiplierTabIcons.BLACK_HOLE,
  },
  invertedBH: {
    name: "Inverted Black Hole",
    multValue: () => player.blackHoleNegative,
    isActive: () => BlackHoles.areNegative,
    icon: MultiplierTabIcons.CHALLENGE("eternity"),
  },
  nerfLaitela: {
    name: "Lai'tela's Reality",
    powValue: () => Math.clampMax(Time.thisRealityRealTime.totalMinutes / 10, 1),
    isActive: () => Laitela.isRunning,
    icon: MultiplierTabIcons.GENERIC_LAITELA,
  },
  atomUpgrade: {
    name: "Atom Upgrade 'Starter Pack'",
    multValue: () => 1e3,
    isActive: () => AtomUpgrade(2).isBought,
    icon: MultiplierTabIcons.ATOM,
  },
  atomicParticle: {
    name: "Atomic Electrons",
    powValue: () => AtomicParticle(2).effects[1],
    isActive: () => AtomicParticle(2).effects[1] > 1,
    icon: MultiplierTabIcons.ATOM,
  },
};
