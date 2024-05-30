import { IntervaledAutobuyerState } from "./autobuyer";

export class DilationUpgradeAutobuyerState extends IntervaledAutobuyerState {
  get _upgradeName() {
    return ["dtGain", "galaxyThreshold", "tachyonGain", "dtGainPelle", "galaxyMultiplier", "tickspeedPower"][
      this.id - 1
    ];
  }

  get data() {
    return player.auto.dilationUpgrades.all[this.id - 1];
  }

  get name() {
    return [
      `Dilated Time Multiplier`,
      `Tachyon Galaxy Threshold`,
      "Tachyon Particle Multiplier",
      "Pelle DT Multiplier",
      "Pelle TG Multiplier",
      "Tickspeed Power",
    ][this.id - 1];
  }

  get interval() {
    return (1000 * Perk.autobuyerFasterDilation.effectOrDefault(1)) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return (
      Perk.autobuyerDilation.isEffectActive &&
      (AtomMilestone.am5.isReached || !Pelle.isDoomed) &&
      // If this is not the doomed ones, we're fine, but if it is, we need the Atom Upgrade
      (!["dtGainPelle", "galaxyMultiplier", "tickspeedPower"].includes(this._upgradeName) || AtomUpgrade(5).isBought)
    );
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REALITY;
  }

  get bulk() {
    // TODO: increase bulk "naturally"
    return 1e100;
    return PerkShopUpgrade.bulkDilation.effectOrDefault(1);
  }

  tick() {
    super.tick();
    const upgradeName = this._upgradeName;
    DilationUpgrade[upgradeName].purchase(this.bulk);
  }

  static get entryCount() {
    return 6;
  }

  static get autobuyerGroupName() {
    return "Dilation Upgrade";
  }

  static get isActive() {
    return player.auto.dilationUpgrades.isActive;
  }

  static set isActive(value) {
    player.auto.dilationUpgrades.isActive = value;
  }
}
