<script>
export default {
  name: "NewGame",
  data() {
    return {
      opacity: 0,
      visible: false,
      hasMoreCosmetics: false,
      selectedSetName: "",
      collapses: 0,
      gainedAtoms: new Decimal(0),
    };
  },
  computed: {
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden",
      };
    },
    collapseText() {
      if (this.collapses === 0) return "";
      return ` for ${format(this.gainedAtoms, 2)} ${pluralize("Atom", this.gainedAtoms)}`;
    },
  },
  methods: {
    update() {
      this.visible = GameEnd.endState > END_STATE_MARKERS.SHOW_NEW_GAME && !GameEnd.removeAdditionalEnd;
      this.opacity = (GameEnd.endState - END_STATE_MARKERS.SHOW_NEW_GAME) * 2;
      this.hasMoreCosmetics = GlyphAppearanceHandler.lockedSets.length > 0;
      this.selectedSetName = GlyphAppearanceHandler.chosenFromModal?.name ?? "None (will choose randomly)";
      this.gainedAtoms.copyFrom(gainedAtoms());
      this.collapses = Currency.collapses.value;
    },
    collapse() {
      // Don't show the confirmation window because it doesn't matter
      collapse();
      // NG.startNewGame();
    },
    openSelectionModal() {
      Modal.cosmeticSetChoice.show();
    },
  },
};
</script>

<template>
  <div
    class="c-new-game-container"
    :style="style"
  >
    <h2>... eons stacked on eons stacked on eons stacked on eons ...</h2>
    <h2>In order to go further, you must Collapse this Universe.</h2>
    <h3>You can use the button in the top-right to view the game as it is right now.</h3>
    <div class="c-new-game-button-container">
      <button
        class="c-new-game-button"
        @click="collapse"
      >
        Collapse this Universe{{ collapseText }}
      </button>
    </div>
    <br>
    <h3 v-if="hasMoreCosmetics">
      Because of the fragmentation of this Universe, you also unlock a new cosmetic set of your choice for Glyphs. These
      are freely modifiable once you reach Reality again, but are purely visual and offer no gameplay bonuses.
      <br>
      <button
        class="c-new-game-button"
        @click="openSelectionModal"
      >
        Choose Cosmetic Set
      </button>
      <br>
      <br>
      Selected Set: {{ selectedSetName }}
    </h3>
    <h3 v-else>
      You have unlocked all Glyph cosmetic sets!
    </h3>
  </div>
</template>

<style scoped>
.c-new-game-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.t-s12 .c-new-game-container {
  color: white;
}

.c-new-game-button-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.c-new-game-button {
  font-family: Typewriter;
  background: grey;
  border: black;
  border-radius: var(--var-border-radius, 0.5rem);
  margin-top: 1rem;
  padding: 1rem;
  cursor: pointer;
}
</style>
