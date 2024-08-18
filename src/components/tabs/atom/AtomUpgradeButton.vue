<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "AtomUpgradeButton",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText,
  },
  props: {
    upgrade: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isAvailableForPurchase: false,
      canBeBought: false,
      isRebuyable: false,
      isBought: false,
      isPossible: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
      canBeLocked: false,
      hasRequirementLock: false,
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-atom-upgrade-btn--bought": this.isBought,
        "c-atom-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-atom-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-atom-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement,
      };
    },
    canLock() {
      return this.config.canLock && !(this.isAvailableForPurchase || this.isBought);
    },
  },
  watch: {
    // IsAutobuyerOn(newValue) {
    // Autobuyer.realityUpgrade(this.upgrade.id).isActive = newValue;
    // }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      this.isAutoUnlocked = false; // Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied;
      this.canBeLocked = upgrade.config.canLock && !this.isAvailableForPurchase;
      this.hasRequirementLock = upgrade.hasPlayerLock;
      // If (this.isRebuyable) this.isAutobuyerOn = Autobuyer.realityUpgrade(upgrade.id).isActive;
    },
    toggleLock(upgrade) {
      if (this.isRebuyable) return;
      upgrade.toggleMechanicLock();
    },
    quantify
  },
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-atom-upgrade-btn c-atom-upgrade-btn"
      @click.shift.exact="toggleLock(upgrade)"
      @click.exact="upgrade.purchase()"
    >
      <HintText type="atomUpgrades" class="l-hint-text--atom-upgrade c-hint-text--atom-upgrade">
        {{ config.name }}
      </HintText>
      <span>
        <DescriptionDisplay :config="config" />
        <template v-if="$viewModel.shiftDown === isAvailableForPurchase && !isRebuyable">
          <br />
          <DescriptionDisplay
            :config="requirementConfig"
            label="Requirement:"
            class="c-atom-upgrade-btn__requirement"
          />
        </template>
        <template v-else>
          <EffectDisplay :config="config" br />
          <CostDisplay v-if="!isBought" :config="config" br name="Atom" />
          <!-- This has to be a bad method but it works so -->
          <template v-if="!isBought && config.cost.base !== undefined">
            <br />
            Base cost: {{ quantify("Atom", config.cost.base, 0, 0) }}
            <br />
          </template>
        </template>
      </span>
    </button>
    <div v-if="canBeLocked" class="o-requirement-lock">
      <i v-if="hasRequirementLock" class="fas fa-lock" />
      <i v-else-if="canLock" class="fas fa-lock-open" />
    </div>
    <PrimaryToggleButton
      v-if="isRebuyable && isAutoUnlocked"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="l--spoon-btn-group__little-spoon-atom-btn o-primary-btn--atom-upgrade-toggle"
    />
  </div>
</template>

<style scoped></style>
