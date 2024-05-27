<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "CollapseModal",
  components: {
    ResetModal,
  },
  data() {
    return {
      gainedAtoms: new Decimal(),
      gainedCollapses: 0,
    };
  },
  computed: {
    message() {
      return `Upon Collapse, everything pre-Collapse will be reset.`;
    },
    gainedResources() {
      return `You will gain ${quantify("Collapse", this.gainedCollapses, 2, 0)} and ${quantify("Atom", this.gainedAtoms, 2, 0)}.`;
    },
    startingResources() {
      return `You will start your next Collapse based on your Atom Milestones.`;
    },
  },
  methods: {
    update() {
      this.gainedAtoms = gainedAtoms();
      this.gainedCollapses = getCollapseGain();
    },
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
