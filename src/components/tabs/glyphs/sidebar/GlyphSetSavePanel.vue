<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";
import ToggleButton from "@/components/ToggleButton";

export default {
  name: "GlyphSetSavePanel",
  components: {
    ToggleButton,
    GlyphSetPreview,
  },
  data() {
    return {
      hasEquipped: true,
      glyphSets: [],
      names: [],
      effects: false,
      rarity: false,
      level: false,
    };
  },
  computed: {
    questionmarkTooltip() {
      return `Glyph Presets work like Time Study Loadouts, allowing you to equip a
        full set of previously-saved Glyphs`;
    },
    noSet() {
      return `No Glyph Preset saved in this slot`;
    },
    levelText() {
      switch (this.level) {
        case 0:
          return "Exact";
        case 1:
          return "Increased";
        case 2:
          return "Any";
        default:
          return "???";
      }
    },
  },
  watch: {
    effects(newValue) {
      player.options.ignoreGlyphEffects = newValue;
    },
    rarity(newValue) {
      player.options.ignoreGlyphRarity = newValue;
    },
    level(newValue) {
      player.options.ignoreGlyphLevel = newValue;
    },
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED, this.refreshGlyphSets);
    this.on$(GAME_EVENT.GLYPH_SET_SAVE_CHANGE, this.refreshGlyphSets);
    this.refreshGlyphSets();
    for (let i = 0; i < player.reality.glyphs.sets.length; i++) {
      this.names[i] = player.reality.glyphs.sets[i].name;
    }
  },
  methods: {
    update() {
      this.hasEquipped = Glyphs.activeList.length > 0;
      this.effects = player.options.ignoreGlyphEffects;
      this.rarity = player.options.ignoreGlyphRarity;
      this.level = player.options.ignoreGlyphLevel;
    },
    refreshGlyphSets() {
      this.glyphSets = player.reality.glyphs.sets.map((g) => Glyphs.copyForRecords(g.glyphs));
    },
    setName(id) {
      const name = this.names[id] === "" ? "" : `: ${this.names[id]}`;
      return `Glyph Preset #${id + 1}${name}`;
    },
    saveGlyphSet(id) {
      if (!this.hasEquipped || player.reality.glyphs.sets[id].glyphs.length) return;
      player.reality.glyphs.sets[id].glyphs = Glyphs.active.compact();
      this.refreshGlyphSets();
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
    loadGlyphSet(set, id) {
      const name = this.setName(id);
      const missingGlyphs = Glyphs.equipGlyphSet(set);
      if (missingGlyphs === -1) return;
      if (missingGlyphs > 0) {
        GameUI.notify.error(`Could not find or equip ${missingGlyphs} ${pluralize("Glyph", missingGlyphs)} from
        ${name}.`);
      } else {
        GameUI.notify.success(`Successfully loaded ${name}.`);
      }
    },
    deleteGlyphSet(id) {
      if (!player.reality.glyphs.sets[id].glyphs.length) return;
      if (player.options.confirmations.deleteGlyphSetSave) Modal.glyphSetSaveDelete.show({ glyphSetId: id });
      else {
        player.reality.glyphs.sets[id].glyphs = [];
        this.refreshGlyphSets();
        EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
      }
    },
    nicknameBlur(event) {
      player.reality.glyphs.sets[event.target.id].name = event.target.value.slice(0, 20);
      this.names[event.target.id] = player.reality.glyphs.sets[event.target.id].name;
      this.refreshGlyphSets();
    },
    setLengthValid(set) {
      return set.length && set.length <= Glyphs.activeSlotCount;
    },
    loadingTooltip(set) {
      return this.setLengthValid(set) && this.hasEquipped
        ? "This set may not load properly because you already have some Glyphs equipped"
        : null;
    },
    glyphSetKey(set, index) {
      return `${index} ${Glyphs.hash(set)}`;
    },
  },
};
</script>

<template>
  <div class="l-glyph-sacrifice-options c-glyph-sacrifice-options l-glyph-sidebar-panel-size">
    <span
      v-tooltip="questionmarkTooltip"
      class="l-glyph-sacrifice-options__help c-glyph-sacrifice-options__help o-questionmark"
    >
      ?
    </span>
    <div class="l-glyph-set-save__header">
      When loading a preset, try to match the following attributes. "Exact" will only equip Glyphs identical to the ones
      in the preset. "Any" will essentially ignore that attribute, acting as if all Glyphs have matched it. The other
      settings will, loosely speaking, allow "better" Glyphs to be equipped in their place.
    </div>
    <div class="c-glyph-set-save-container">
      <ToggleButton
        v-model="effects"
        class="c-glyph-set-save-setting-button"
        label="Effects:"
        on="Including"
        off="Exact"
      />
      <button class="c-glyph-set-save-setting-button" @click="level = (level + 1) % 3">Level: {{ levelText }}</button>
      <ToggleButton
        v-model="rarity"
        class="c-glyph-set-save-setting-button"
        label="Rarity:"
        on="Increased"
        off="Exact"
      />
    </div>
    <div v-for="(set, id) in glyphSets" :key="id" class="c-glyph-single-set-save">
      <div class="c-glyph-set-preview-area">
        <GlyphSetPreview
          :key="glyphSetKey(set, id)"
          :text="setName(id)"
          :text-hidden="true"
          :glyphs="set"
          :flip-tooltip="true"
          :none-text="noSet"
        />
      </div>
      <div class="c-glyph-single-set-save-flexbox">
        <div ach-tooltip="Set a custom name (up to 20 characters)">
          <input
            :id="id"
            type="text"
            size="20"
            maxlength="20"
            placeholder="Custom set name"
            class="c-glyph-sets-save-name__input"
            :value="names[id]"
            @blur="nicknameBlur"
          />
        </div>
        <div class="c-glyph-single-set-save-flexbox-buttons">
          <button
            class="c-glyph-set-save-button"
            :class="{ 'c-glyph-set-save-button--unavailable': !hasEquipped || set.length }"
            @click="saveGlyphSet(id)"
          >
            Save
          </button>
          <button
            v-tooltip="loadingTooltip(set)"
            class="c-glyph-set-save-button"
            :class="{ 'c-glyph-set-save-button--unavailable': !setLengthValid(set) }"
            @click="loadGlyphSet(set, id)"
          >
            Load
          </button>
          <button
            class="c-glyph-set-save-button"
            :class="{ 'c-glyph-set-save-button--unavailable': !set.length }"
            @click="deleteGlyphSet(id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-glyph-set-save__header {
  margin: -1.5rem 2rem 0;
}

.c-glyph-set-save-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  margin: 1rem auto 0;
}

.c-glyph-single-set-save-flexbox {
  width: 17rem;
}

.c-glyph-set-preview-area {
  width: 18rem;
}
</style>
