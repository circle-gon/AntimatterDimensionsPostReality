<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "FirstTimeModal",
  components: {
    ModalWrapperChoice,
  },
  methods: {
    handleYesClick() {
      Modal.skipContent.show();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice :show-cancel="true" @confirm="handleYesClick">
    <template #header>First Time Info</template>
    <div class="c-modal-message__text">
      It appears that it is your first time playing this mod.<br />
      This mod's content starts after vanilla AD's end. If you want, you can skip to the new content directly.<br />
      If you decide later that you want to skip to the new content, click on the "Saving" subtab of "Options", then
      click on the button "Skip to new content".
    </div>
    <template #cancel-text>Nah</template>
    <template #confirm-text>Let's do it!</template>
  </ModalWrapperChoice>
</template>
