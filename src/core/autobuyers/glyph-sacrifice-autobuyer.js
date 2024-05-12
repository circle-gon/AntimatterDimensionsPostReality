import { AutobuyerState } from "./autobuyer";

export class GlyphSacrificeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.glyphSacrifice;
  }

  get name() {
    return `Glyph Sacrifice Generator`;
  }

  get isUnlocked() {
    return AtomMilestone.am4.isReached;
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (Currency.perkPoints.gt(0) && GlyphSacrificeHandler.canSacrifice) {
      GlyphSacrificeHandler.removeGlyph(GlyphGenerator.musicGlyph(), true)
      Currency.perkPoints.subtract(1)
    }
  }
}