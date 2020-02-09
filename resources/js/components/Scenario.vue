<template>
  <canvas :width="width" :height="height" @mousemove="mousemove" @click="click"></canvas>
</template>

<script>
import WebGL from "./Webgl";

export default {
  extends: WebGL,
  props: {
    height: {
      type: Number,
      default: 360
    },
    width: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      selected: 0
    };
  },
  methods: {
    tick() {
      this.$emit("tick");
    },
    loadScenario() {
      this.$emit("load-scenario");
    },
    ////
    click(event) {
      this.$emit("click", event);
    },
    mousemove(event) {
      this.$emit("mousemove", event);
    }
  }
};
</script>
