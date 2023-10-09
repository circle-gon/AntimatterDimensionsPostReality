<script>
import { AutobuyerInputFunctions } from "../autobuyers/AutobuyerInput.vue"

export default {
  name: "AnnihilationButton",
  data() {
    return {
      darkMatter: new Decimal(0),
      darkMatterMult: new Decimal(0),
      darkMatterMultGain: new Decimal(0),
      autobuyerUnlocked: false,
      annihilationButtonVisible: false,
      matterRequirement: 0,
      darkMatterMultRatio: new Decimal(0),
      isEnabled: true,
      isValid: true,
      isFocused: false,
      displayValue: "0"
    };
  },
  computed: {
    annihilationInputStyle() {
      return { "background-color": this.isEnabled ? "" : "var(--color-bad)" };
    },
    annihilationInputClass() {
      return this.isValid ? undefined : "o-autobuyer-input--invalid"
    }
  },
  methods: {
    update() {
      this.darkMatter.copyFrom(Currency.darkMatter);
      this.darkMatterMult.copyFrom(Laitela.darkMatterMult);
      this.darkMatterMultGain = Laitela.darkMatterMultGain;
      this.autobuyerUnlocked = Autobuyer.annihilation.isUnlocked;
      this.annihilationButtonVisible = Laitela.canAnnihilate || this.autobuyerUnlocked;
      this.matterRequirement = Laitela.annihilationDMRequirement;
      this.darkMatterMultRatio = Laitela.darkMatterMultRatio;
      this.isEnabled = player.auto.annihilation.isActive;
      if (!this.isFocused) this.updateActualValue();
    },
    annihilate() {
      Laitela.annihilate();
    },
    // copied from AutobuyerInput.vue
    updateActualValue() {
      const actualValue = player.auto.annihilation.multiplier;
      if (this.areEqual(this.actualValue, actualValue)) return;
      this.actualValue = AutobuyerInputFunctions.decimal.copyValue(actualValue);
      this.updateDisplayValue();
    },
    areEqual(value, other) {
      if (other === undefined || value === undefined) return false;
      return AutobuyerInputFunctions.decimal.areEqual(value, other);
    },
    updateDisplayValue() {
      this.displayValue = AutobuyerInputFunctions.decimal.formatValue(this.actualValue);
    },
    handleInput(event) {
      const input = event.target.value;
      this.displayValue = input;
      if (input.length === 0) {
        this.isValid = false;
        return;
      }
      const parsedValue = AutobuyerInputFunctions.decimal.tryParse(input);
      this.isValid = parsedValue !== undefined;
      this.actualValue = AutobuyerInputFunctions.decimal.copyValue(parsedValue);
    },
    handleFocus() {
      this.isFocused = true;
    },
    handleBlur() {
      if (this.isValid) {
        player.auto.annihilation.multiplier = AutobuyerInputFunctions.decimal.copyValue(this.actualValue);
      } else {
        this.updateActualValue();
      }
      this.updateDisplayValue();
      this.isValid = true;
      this.isFocused = false;
    }
  }
};
</script>

<template>
  <div class="l-laitela-annihilation-container">
    <button
      v-if="darkMatter.lt(matterRequirement)"
      class="l-laitela-annihilation-button"
    >
      Annihilation requires {{ format(matterRequirement, 2) }} Dark Matter
    </button>
    <button
      v-else
      class="l-laitela-annihilation-button c-laitela-annihilation-button"
      @click="annihilate"
    >
      <b>Annihilate your Dark Matter Dimensions</b>
    </button>
    <br>
    <br>
    <span v-if="darkMatterMult.gt(1)">
      Current multiplier to all Dark Matter Dimensions: <b>{{ formatX(darkMatterMult, 2, 2) }}</b>
      <br>
      <br>
      Annihilation will reset your Dark Matter and Dark Matter Dimension amounts, but also add
      <b>+{{ format(darkMatterMultGain, 2, 2) }}</b> to your Annihilation multiplier.
      <br>
      (<b>{{ formatX(darkMatterMultRatio, 2, 2) }}</b> from previous multiplier)
      <span v-if="autobuyerUnlocked">
        <br>
        <br>
        Auto-Annihilate when adding
        <input
          type="text"
          :value="displayValue"
          :style="annihilationInputStyle"
          :class="annihilationInputClass"
          class="c-small-autobuyer-input c-laitela-annihilation-input"
          @blur="handleBlur"
          @focus="handleFocus"
          @input="handleInput"
        >
        to the multiplier.
      </span>
    </span>
    <span v-else>
      Annihilation will reset your Dark Matter and Dark Matter Dimension amounts, but will give a permanent
      multiplier of <b>{{ formatX(darkMatterMultGain.add(1), 2, 2) }}</b> to all Dark Matter Dimensions.
    </span>
  </div>
</template>
