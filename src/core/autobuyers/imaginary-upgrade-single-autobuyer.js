import { AutobuyerState } from "./autobuyer";

export class NonRepeatableImaginaryUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.imaginaryUpgradesSingles;
  }

  get name() {
    return `Non-repeatable Imaginary Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return AtomMilestone.am8.isReached;
  }

  get bulk() {
    return 0;
  }

  tick() {
    for (let i = 11; i <= 25; i++) {
      ImaginaryUpgrade(i).purchase();
    }
  }
}
