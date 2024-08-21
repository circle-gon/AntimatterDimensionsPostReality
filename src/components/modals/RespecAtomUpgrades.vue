<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "BreakUniverseModal",
  components: {
    ModalWrapperChoice,
  },
  data() {
    return {
      respec: new Decimal(0),
    };
  },
  computed: {
    message() {
      const infinity = formatPostBreak(Decimal.MAX_VALUE, 2);
      return `Breaking the Universe will allow you to gain antimatter past ${infinity}.
        Many nerfs will be imposed.
        You will gain additional Atoms on Collapse based on Antimatter produced over ${infinity}.
        It will also allow you to Collapse without Dooming your Reality, but you will need to reach\
        ${infinity} antimatter first.`.split("\n");
    },
  },
  methods: {
    handleYesClick() {
      respecAtomUpgrades();
    },
    update() {
      this.respec.copyFrom(player.atom.upgradeSpent);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice option="respecAtomUpgrades" @confirm="handleYesClick">
    <template #header>Atom Upgrade Respec</template>
    <div class="c-modal-message__text">
      Respeccing your Atom Upgrades will refund {{ quantify("Atom", respec, 0, 0) }}. All single-purchase upgrades that
      scale in cost will become unbought, and all other upgrades are unaffected. This will also force a Collapse.
    </div>
    <template #confirm-text>Respec</template>
  </ModalWrapperChoice>
</template>
