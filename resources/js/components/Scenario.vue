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
    loadScenario() {
      this.$emit("load-scenario");
      //this.createSprites(40, this.map.factory, 300, 200, 64, 64);
      //this.createSprites(1, this.map.helicopter, 300, 200);
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
