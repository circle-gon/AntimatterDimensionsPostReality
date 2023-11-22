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
        However, there will be nerfs past that, and it will force a Collapse.`.split("\n");
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
  <ModalWrapperChoice
    :show-cancel="false"
    @confirm="handleYesClick"
  >
    <template #header>
      You are Breaking the Universe
    </template>
    <div class="c-modal-message__text">
      <span
        v-for="(line, index) in message"
        :key="index"
      > {{ line }} <br> </span>
    </div>
    <template #confirm-text>
      Break
    </template>
  </ModalWrapperChoice>
</template>
