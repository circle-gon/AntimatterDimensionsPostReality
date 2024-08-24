import { AutobuyerState } from "./autobuyer";

export class TesseractAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.tesseract;
  }

  get name() {
    return `Tesseract Autobuyer`;
  }

  get isUnlocked() {
    return AtomMilestone.am7.isReached;
  }

  get isEnabled() {
    return true;
  }

  get bulk() {
    return 0;
  }

  tick() {
    Tesseracts.buyTesseract();
  }
}
