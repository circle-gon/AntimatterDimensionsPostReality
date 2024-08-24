<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "BreakUniverseModal",
  components: {
    ModalWrapperChoice,
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
      breakUniverse();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice :show-cancel="false" @confirm="handleYesClick">
    <template #header> You are Breaking the Universe </template>
    <div class="c-modal-message__text">
      <!-- eslint-disable-next-line vue/no-static-inline-styles -->
      <div style="color: var(--color-bad); font-size: 1.2em">
        WARNING: THIS FEATURE IS UNSTABLE. PROCEED AT YOUR OWN RISK.
      </div>
      <br />
      <span v-for="(line, index) in message" :key="index"> {{ line }} <br /> </span>
    </div>
    <template #confirm-text> Break </template>
  </ModalWrapperChoice>
</template>

<style>

</style>