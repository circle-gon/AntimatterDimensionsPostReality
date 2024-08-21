<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SkipContentModal",
  components: {
    ModalWrapperChoice,
  },
  methods: {
    handleYesClick() {
      skipToNewContent();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice :show-cancel="true" @confirm="handleYesClick">
    <template #header>Skipping to new Content</template>
    <div class="c-modal-message__text">
      You are about to jump to the beginning of this mod's content.<br />
      Because of technical limitations, you will only keep everything that restarting the game does.
    </div>
  </ModalWrapperChoice>
</template>
