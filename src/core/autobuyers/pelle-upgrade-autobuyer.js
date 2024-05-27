import { GalaxyGeneratorUpgrades } from "../globals";
import { AutobuyerState } from "./autobuyer";

export class PelleUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.pelleUpgrades.all[this.id - 1];
  }

  get name() {
    if (this.id <= 5)
      return [
        "Antimatter Dimension Mult",
        "Game Speed Mult",
        "Glyph Level Max",
        "Infinity Power Conversion Rate",
        "Galaxy Power Mult",
      ][this.id - 1];
    const name = ["Additive", "Multiplicative", "AM", "IP", "EP"][this.id - 6];
    return `Galaxy Generator ${name} Boost`;
  }

  get isUnlocked() {
    return AtomMilestone.am6.isReached;
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (this.id <= 5) PelleUpgrade.rebuyables[this.id - 1].purchase();
    else if (player.celestials.pelle.galaxyGenerator.unlocked) GalaxyGeneratorUpgrades.all[this.id - 6].purchase();
  }

  static get entryCount() {
    return 10;
  }

  static get autobuyerGroupName() {
    return "Pelle Rebuyable Upgrade";
  }

  static get isActive() {
    return player.auto.pelleUpgrades.isActive;
  }

  static set isActive(value) {
    player.auto.pelleUpgrades.isActive = value;
  }
}
