<script>
export default {
  name: "AutomatorDocsManPage",
  props: {
    command: {
      type: Object,
      required: true,
    },
  },
  computed: {
    description() {
      const desc = this.command.description;
      return typeof desc === "function" ? desc() : desc;
    },
    syntax() {
      const syntax = this.command.syntax;
      return typeof syntax === "function" ? syntax() : syntax;
    },
    examples() {
      const examples = this.command.examples;
      return typeof examples === "function" ? examples() : examples;
    },
  },
};
</script>

<template>
  <div class="c-automator-docs-page">
    <b>NAME</b>
    <div class="c-automator-docs-page__indented" v-html="command.keyword" />
    <b>SYNTAX</b>
    <div class="c-automator-docs-page__indented" v-html="syntax" />
    <template v-if="command.description">
      <b>DESCRIPTION</b>
      <div class="c-automator-docs-page__indented" v-html="description" />
    </template>
    <template v-for="section in command.sections">
      <b :key="section.name">{{ section.name }}</b>
      <template v-for="item in section.items">
        <div :key="item.header" class="c-automator-docs-page__indented">
          <div v-html="item.header" />
          <div class="c-automator-docs-page__indented" v-html="item.description" />
        </div>
      </template>
    </template>
    <template v-if="examples">
      <b>USAGE EXAMPLES</b>
      <div v-for="example in examples" :key="example" class="c-automator-docs-page__indented" v-html="example" />
    </template>
  </div>
</template>

<style scoped></style>
