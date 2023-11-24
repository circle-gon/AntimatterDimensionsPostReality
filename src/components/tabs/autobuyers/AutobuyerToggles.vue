<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "AutobuyerToggles",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
  },
  data() {
    return {
      isDoomed: false,
      autobuyersOn: false,
      showContinuum: false,
      disableADContinuum: false,
      disableIDContinuum: false,
      disableTDContinuum: false,
      unlockedExtras: false,
      allAutobuyersDisabled: false,
    };
  },
  computed: {
    overrideStyle() {
      return {
        "padding-bottom": this.unlockedExtras ? "0rem" : "0.8rem",
      };
    },
  },
  watch: {
    autobuyersOn(newValue) {
      player.auto.autobuyersOn = newValue;
    },
    disableADContinuum(newValue) {
      if (ImaginaryUpgrade(21).isLockingMechanics && !newValue) {
        ImaginaryUpgrade(21).tryShowWarningModal();
        return;
      }
      Laitela.setContinuum(!newValue);
    },
    disableIDContinuum(newValue) {
      InfinityDimensions.setContinuum(!newValue);
    },
    disableTDContinuum(newValue) {
      TimeDimensions.setContinuum(!newValue);
    },
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.autobuyersOn = player.auto.autobuyersOn;
      this.showContinuum = Laitela.isUnlocked || AtomUpgrade(5).isBought;
      this.disableADContinuum = player.auto.continuumDisabled.AD;
      this.disableIDContinuum = player.auto.continuumDisabled.ID;
      this.disableTDContinuum = player.auto.continuumDisabled.TD;
      this.unlockedExtras = AtomUpgrade(5).isBought;
      this.allAutobuyersDisabled = Autobuyers.unlocked.every((autobuyer) => !autobuyer.isActive);
    },
    toggleAllAutobuyers() {
      for (const autobuyer of Autobuyers.unlocked) {
        autobuyer.isActive = this.allAutobuyersDisabled;
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="c-subtab-option-container" :style="overrideStyle">
      <PrimaryToggleButton
        v-model="autobuyersOn"
        on="Pause autobuyers"
        off="Resume autobuyers"
        class="o-primary-btn--subtab-option"
      />
      <PrimaryButton class="o-primary-btn--subtab-option" @click="toggleAllAutobuyers()">
        {{ allAutobuyersDisabled ? "Enable" : "Disable" }} all autobuyers
      </PrimaryButton>
      <span v-if="isDoomed">
        <PrimaryButton v-if="showContinuum" class="o-primary-btn--subtab-option"> Continuum is disabled </PrimaryButton>
      </span>
      <span v-else-if="showContinuum && !unlockedExtras">
        <PrimaryToggleButton
          v-model="disableADContinuum"
          on="Enable Continuum"
          off="Disable Continuum"
          class="o-primary-btn--subtab-option"
        />
      </span>
    </div>
    <div v-if="showContinuum && unlockedExtras && !isDoomed" class="c-subtab-option-container">
      <PrimaryToggleButton
        v-model="disableADContinuum"
        on="Enable AD Continuum"
        off="Disable AD Continuum"
        class="o-primary-btn--subtab-option"
      />
      <PrimaryToggleButton
        v-model="disableIDContinuum"
        on="Enable ID Continuum"
        off="Disable ID Continuum"
        class="o-primary-btn--subtab-option"
      />
      <PrimaryToggleButton
        v-model="disableTDContinuum"
        on="Enable TD Continuum"
        off="Disable TD Continuum"
        class="o-primary-btn--subtab-option"
      />
    </div>
  </div>
</template>

<style scoped></style>
