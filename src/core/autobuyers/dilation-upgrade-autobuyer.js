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
    if (["dtGainPelle", "galaxyMultiplier", "tickspeedPower"].includes(this._upgradeName))
      return AtomUpgrade(3).isBought && !Pelle.isDoomed;

    return Perk.autobuyerDilation.isEffectActive && !Pelle.isDoomed;
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
