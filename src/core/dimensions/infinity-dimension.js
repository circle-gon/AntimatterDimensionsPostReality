import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function infinityDimensionCommonMultiplier() {
  let mult =
    Math.log10(ShopPurchase.allDimPurchases.currentMult) +
    Effects.log10Sum(
      Achievement(75),
      TimeStudy(82),
      TimeStudy(92),
      TimeStudy(162),
      InfinityChallenge(1).reward,
      InfinityChallenge(6).reward,
      EternityChallenge(4).reward,
      EternityChallenge(9).reward,
      EternityUpgrade.idMultEP,
      EternityUpgrade.idMultEternities,
      EternityUpgrade.idMultICRecords,
      AlchemyResource.dimensionality,
      ImaginaryUpgrade(8),
      PelleRifts.recursion.milestones[1],
    );

  if (Replicanti.areUnlocked && Replicanti.amount.gt(1)) {
    mult += replicantiMult().log10();
  }

  return powAndCap(mult);
}

export function toggleAllInfDims() {
  const areEnabled = Autobuyer.infinityDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.infinityDimension(i).isActive = !areEnabled;
  }
}

class InfinityDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.infinity, tier);
    const UNLOCK_REQUIREMENTS = [
      undefined,
      DC.E1100,
      DC.E1900,
      DC.E2400,
      DC.E10500,
      DC.E30000,
      DC.E45000,
      DC.E54000,
      DC.E60000,
    ];
    this._unlockRequirement = UNLOCK_REQUIREMENTS[tier];
    const COST_MULTS = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30];
    this._costMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 50, 30, 10, 5, 5, 5, 5, 5];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
    this._baseCost = new Decimal(BASE_COSTS[tier]);
    this.ipRequirement = BASE_COSTS[1];
  }

  /** @returns {Decimal} */
  get cost() {
    return this.data.cost;
  }

  /** @param {Decimal} value */
  set cost(value) {
    this.data.cost = value;
  }

  get baseAmount() {
    return this.data.baseAmount;
  }

  set baseAmount(value) {
    this.data.baseAmount = value;
  }

  get isUnlocked() {
    return this.data.isUnlocked;
  }

  set isUnlocked(value) {
    this.data.isUnlocked = value;
  }

  get amRequirement() {
    return this._unlockRequirement;
  }

  get antimatterRequirementReached() {
    return player.records.thisEternity.maxAM.gte(this.amRequirement);
  }

  get hasIPUnlock() {
    return this.tier === 1 && !PlayerProgress.eternityUnlocked();
  }

  get ipRequirementReached() {
    return !this.hasIPUnlock || Currency.infinityPoints.value.gte(this.ipRequirement);
  }

  get canUnlock() {
    return (Perk.bypassIDAntimatter.canBeApplied || this.antimatterRequirementReached) && this.ipRequirementReached;
  }

  get isAvailableForPurchase() {
    return this.isContinuumAvailable && this.isAffordable && !this.isCapped;
  }

  get isContinuumAvailable() {
    return InfinityDimensions.canBuy() && this.isUnlocked;
  }

  get isAffordable() {
    return Currency.infinityPoints.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    let toGain = DC.D0;
    if (tier === 8) {
      // We need a extra 10x here (since ID8 production is per-second and
      // other ID production is per-10-seconds).
      EternityChallenge(7).reward.applyEffect((v) => (toGain = v.times(10)));
      if (EternityChallenge(7).isRunning) EternityChallenge(7).applyEffect((v) => (toGain = v.times(10)));
    } else {
      toGain = InfinityDimension(tier + 1).productionPerSecond;
    }
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get continuumValue() {
    if (!this.isContinuumAvailable) return 0;
    if (ImaginaryUpgrade(15).isLockingMechanics) return 0;

    let continuumValue = Currency.infinityPoints.value.div(this.baseCost).log10() / Math.log10(this.costMultiplier) + 1;

    continuumValue *= InfinityDimensions.extraPurchases;
    continuumValue = Math.clampMax(continuumValue, this.purchaseCap);
    return Math.clampMin(continuumValue, 0);
  }

  get continuumAmount() {
    if (!InfinityDimensions.continuumActive) return 0;
    return Math.floor(10 * this.continuumValue);
  }

  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  get productionPerSecond() {
    if (
      EternityChallenge(2).isRunning ||
      EternityChallenge(10).isRunning ||
      (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)
    ) {
      return DC.D0;
    }
    let production = this.totalAmount.log10();
    if (EternityChallenge(11).isRunning) {
      return powAndCap(production);
    }
    if (EternityChallenge(7).isRunning) {
      production += Tickspeed.perSecond.log10();
    }
    production += this.multiplier.log10();
    return powAndCap(production);
  }

  get multiplier() {
    const tier = this.tier;
    if (EternityChallenge(11).isRunning) return DC.D1;
    let mult =
      GameCache.infinityDimensionCommonMultiplier.value.log10() +
      Effects.log10Sum(
        tier === 1 ? Achievement(94) : null,
        tier === 4 ? TimeStudy(72) : null,
        tier === 1 ? EternityChallenge(2).reward : null,
      );

    const dimAmount = InfinityDimensions.continuumActive ? this.continuumValue : Math.floor(this.baseAmount / 10);
    mult += dimAmount * this.powerMultiplier.log10();

    if (tier === 1) {
      mult += PelleRifts.decay.milestones[0].effectOrDefault(DC.D1).log10();
    }

    mult *= getAdjustedGlyphEffect("infinitypow");
    mult *= getAdjustedGlyphEffect("effarigdimensions");
    mult *= getAdjustedGlyphEffect("curseddimensions");
    mult *= Effects.product(AlchemyResource.infinity);
    mult *= Ra.momentumValue;
    mult *= PelleRifts.paradox.effectValue.toNumber();

    if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
      mult = dilatedValueOf(powAndCap(mult)).log10();
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(powAndCap(mult)).log10();
    } else if (V.isRunning) {
      mult *= 0.5;
    }

    if (PelleStrikes.powerGalaxies.hasStrike) {
      mult *= 0.5;
    }

    return powAndCap(mult);
  }

  get isProducing() {
    const tier = this.tier;
    if (
      EternityChallenge(2).isRunning ||
      EternityChallenge(10).isRunning ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)
    ) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    let costMult = this._costMultiplier;
    EternityChallenge(12).reward.applyEffect((v) => (costMult = Math.pow(costMult, v)));
    return costMult;
  }

  get powerMultiplier() {
    return new Decimal(this._powerMultiplier)
      .timesEffectsOf(this._tier === 8 ? GlyphSacrifice.infinity : null)
      .pow(ImaginaryUpgrade(14).effectOrDefault(1));
  }

  get purchases() {
    // Because each ID purchase gives 10 IDs
    return this.data.baseAmount / 10;
  }

  get purchaseCap() {
    if (Enslaved.isRunning) {
      return 1;
    }
    return InfinityDimensions.capIncrease + (this.tier === 8 ? Number.MAX_VALUE : InfinityDimensions.HARDCAP_PURCHASES);
  }

  get isCapped() {
    const realPurchases = InfinityDimensions.continuumActive ? this.continuumValue : this.purchases;
    return realPurchases >= this.purchaseCap;
  }

  get hardcapIPAmount() {
    // This needs to be done because extra purchases will cause the cap to be reached earlier
    const extras = InfinityDimensions.continuumActive ? InfinityDimensions.extraPurchases : 1;
    return this._baseCost.times(Decimal.pow(this.costMultiplier, this.purchaseCap / extras));
  }

  resetAmount() {
    this.amount = new Decimal(this.baseAmount);
  }

  fullReset() {
    this.cost = new Decimal(this.baseCost);
    this.amount = DC.D0;
    this.bought = 0;
    this.baseAmount = 0;
    this.isUnlocked = false;
  }

  unlock() {
    if (this.isUnlocked) return true;
    if (!this.canUnlock) return false;
    this.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.INFINITY_DIMENSION_UNLOCKED, this.tier);
    if (this.tier === 1 && !PlayerProgress.eternityUnlocked()) {
      Tab.dimensions.infinity.show();
    }
    return true;
  }

  // Only ever called from manual actions
  buySingle() {
    if (InfinityDimensions.continuumActive) return false;
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;
    if (ImaginaryUpgrade(15).isLockingMechanics) {
      const lockString =
        this.tier === 1 ? "purchase a 1st Infinity Dimension" : "purchase a Dimension which will produce 1st IDs";
      ImaginaryUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }

    Currency.infinityPoints.purchase(this.cost);
    this.cost = Decimal.round(this.cost.times(this.costMultiplier));
    // Because each ID purchase gives 10 IDs
    this.amount = this.amount.plus(10);
    this.baseAmount += 10;

    if (EternityChallenge(8).isRunning) {
      player.eterc8ids -= 1;
    }

    return true;
  }

  buyMax(auto) {
    if (InfinityDimensions.continuumActive) return false;
    if (!this.isAvailableForPurchase) return false;
    if (ImaginaryUpgrade(15).isLockingMechanics) {
      const lockString =
        this.tier === 1 ? "purchase a 1st Infinity Dimension" : "purchase a Dimension which will produce 1st IDs";
      if (!auto) ImaginaryUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }

    let purchasesUntilHardcap = this.purchaseCap - this.purchases;
    if (EternityChallenge(8).isRunning) {
      purchasesUntilHardcap = Math.clampMax(purchasesUntilHardcap, player.eterc8ids);
    }

    const costScaling = new LinearCostScaling(
      Currency.infinityPoints.value,
      this.cost,
      this.costMultiplier,
      purchasesUntilHardcap,
    );

    if (costScaling.purchases <= 0) return false;

    Currency.infinityPoints.purchase(costScaling.totalCost);
    this.cost = this.cost.times(costScaling.totalCostMultiplier);
    // Because each ID purchase gives 10 IDs
    this.amount = this.amount.plus(10 * costScaling.purchases);
    this.baseAmount += 10 * costScaling.purchases;

    if (EternityChallenge(8).isRunning) {
      player.eterc8ids -= costScaling.purchases;
    }
    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {InfinityDimensionState}
 */
export const InfinityDimension = InfinityDimensionState.createAccessor();

export const InfinityDimensions = {
  /**
   * @type {InfinityDimensionState[]}
   */
  all: InfinityDimension.index.compact(),
  HARDCAP_PURCHASES: 2000000,

  unlockNext() {
    if (InfinityDimension(8).isUnlocked) return;
    this.next().unlock();
  },

  next() {
    if (InfinityDimension(8).isUnlocked) throw "All Infinity Dimensions are unlocked";
    return this.all.first((dim) => !dim.isUnlocked);
  },

  resetAmount() {
    Currency.infinityPower.reset();
    for (const dimension of InfinityDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of InfinityDimensions.all) {
      dimension.fullReset();
    }
  },

  get capIncrease() {
    return Math.floor(Tesseracts.capIncrease());
  },

  get totalDimCap() {
    return this.HARDCAP_PURCHASES + this.capIncrease;
  },

  canBuy() {
    return (
      !EternityChallenge(2).isRunning &&
      !EternityChallenge(10).isRunning &&
      (!EternityChallenge(8).isRunning || player.eterc8ids > 0)
    );
  },

  canAutobuy() {
    return this.canBuy() && !EternityChallenge(8).isRunning;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      InfinityDimension(tier).produceDimensions(InfinityDimension(tier - 1), diff.div(10));
    }

    if (EternityChallenge(7).isRunning) {
      if (!NormalChallenge(10).isRunning) {
        InfinityDimension(1).produceDimensions(AntimatterDimension(7), diff);
      }
    } else {
      InfinityDimension(1).produceCurrency(Currency.infinityPower, diff);
    }

    player.requirementChecks.reality.maxID1 = player.requirementChecks.reality.maxID1.clampMin(
      InfinityDimension(1).totalAmount,
    );
  },

  tryAutoUnlock() {
    if (!EternityMilestone.autoUnlockID.isReached || InfinityDimension(8).isUnlocked) return;
    for (const dimension of this.all) {
      // If we cannot unlock this one, we can't unlock the rest, either
      if (!dimension.unlock()) break;
    }
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    // Try to unlock dimensions
    const unlockedDimensions = this.all.filter((dimension) => dimension.unlock());

    // Try to buy single from the highest affordable new dimensions
    unlockedDimensions
      .slice()
      .reverse()
      .forEach((dimension) => {
        if (dimension.purchases === 0) dimension.buySingle();
      });

    // Try to buy max from the lowest dimension (since lower dimensions have bigger multiplier per purchase)
    unlockedDimensions.forEach((dimension) => dimension.buyMax(false));
  },

  get powerConversionRate() {
    const multiplier = PelleRifts.paradox.milestones[2].effectOrDefault(1);
    return (7 + getAdjustedGlyphEffect("infinityrate") + PelleUpgrade.infConversion.effectOrDefault(0)) * multiplier;
  },

  get ADMultiplier() {
    // Deal with >ee308 values wrapping to 0
    const log = Currency.infinityPower.value.max(1).log10() * this.powerConversionRate;
    return powAndCap(log);
  },

  get continuumUnlocked() {
    return !EternityChallenge(8).isRunning && AtomUpgrade(4).isBought && Laitela.continuumUnlocked;
  },

  get continuumActive() {
    return this.continuumUnlocked && !player.auto.continuumDisabled.ID;
  },

  setContinuum(value) {
    player.auto.continuumDisabled.ID = !value;
  },

  get extraPurchases() {
    return AtomicParticle(0).effects[0] * Effects.product(AtomUpgrade(4));
  },
};
