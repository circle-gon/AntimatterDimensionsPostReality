<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "CollapseModal",
  components: {
    ResetModal,
  },
  computed: {
    message() {
      return `Upon Collapse, everything pre-Collapse will be reset.`;
    },
    gainedResources() {
      return `You will gain absolutely nothing.`;
    },
    startingResources() {
      return `You will start your next Collapse with absolutely nothing.`;
    },
  },
  methods: {
    handleYesClick() {
      collapse();
      EventHub.ui.offAll(this);
    },
  },
};
</script>

<template>
  <ResetModal
    header="You are about to Collapse"
    :message="message"
    :gained-resources="gainedResources"
    :starting-resources="startingResources"
    :confirm-fn="handleYesClick"
    confirm-option="collapse"
  />
</template>
