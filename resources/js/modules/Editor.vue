<template>
  <div class="row w-100 h-100">
    <div class="col-1 p-0">
      <button
        v-for="sprite in sprites"
        :key="sprite"
        class="btn btn-info w-100"
        type="button"
        @click="choose(sprite)"
      >{{ sprite }}</button>
    </div>
    <div class="col position-relative p-0">
      <img class="scenario" :src="world" width="1200" />
      <scenario
        ref="scenario"
        class="scenario"
        @mousemove="mousemove"
        @click="click"
        @load-scenario="loadScenario"
        :width="1200"
        :height="600"
        :map="map"
      ></scenario>
    </div>
  </div>
</template>

<script>
export default {
  path: "/",
  mixins: [window.workflowMixin],
  data() {
    return {
      world: require("../../textures/place.png"),
      map: {
        helicopter: [
          { x: 0, y: 64, w: 18, h: 16, speed: 1, sx: 1, sy: 1 },
          { x: 18, y: 64, w: 18, h: 16 },
          { x: 36, y: 64, w: 18, h: 16 },
          { x: 54, y: 64, w: 18, h: 16 },
          { x: 72, y: 64, w: 18, h: 16 },
          { x: 90, y: 64, w: 18, h: 16 }
        ],
        car: [{ x: 140, y: 64, w: 28, h: 16, speed: 1, sx: 1, sy: 1 }],
        factory: [
          { x: 0, y: 0, w: 64, h: 64, speed: 0.01, sx: 16, sy: 16 },
          { x: 64, y: 0, w: 64, h: 64 },
          { x: 128, y: 0, w: 64, h: 64 },
          { x: 192, y: 0, w: 64, h: 64 },
          { x: 256, y: 0, w: 64, h: 64 },
          { x: 320, y: 0, w: 64, h: 64 },
          { x: 384, y: 0, w: 64, h: 64 }
        ]
      },
      selected: -1
    };
  },
  computed: {
    sprites() {
      return Object.keys(this.map);
    }
  },
  methods: {
    loadScenario() {
      const scenario = this.$refs.scenario;
      scenario.createSprites(1, scenario.map["helicopter"], 300, 200);
      this.selected = scenario.sprites.length - 1;
    },
    choose(spriteName) {
      const scenario = this.$refs.scenario;
      const sprite = scenario.map[spriteName];
      this.selected = scenario.sprites.length - 1;
      scenario.changeSprite(this.selected, sprite);
      scenario.resizeSprite(this.selected, sprite[0].w, sprite[0].h);
    },
    click(event) {
      const scenario = this.$refs.scenario;
      const c = this.selected;
      const sprite = scenario.sprites[c];
      const x =
        Math.round((event.offsetX - scenario.size[c].w * 0.5) / sprite[0].sx) *
        sprite[0].sx;
      const y =
        Math.round((event.offsetY - scenario.size[c].h * 0.5) / sprite[0].sy) *
        sprite[0].sy;
      scenario.createSprite(sprite, x, y);
      this.selected = scenario.sprites.length - 1;
    },
    mousemove(event) {
      const scenario = this.$refs.scenario;
      if (scenario.sprites.length && this.selected > -1) {
        const c = this.selected;
        const sprite = scenario.sprites[c];
        const x =
          Math.round(
            (event.offsetX - scenario.size[c].w * 0.5) / sprite[0].sx
          ) * sprite[0].sx;
        const y =
          Math.round(
            (event.offsetY - scenario.size[c].h * 0.5) / sprite[0].sy
          ) * sprite[0].sy;
        scenario.teleportSprite(c, x, y);
      }
    }
  }
};
</script>

<style scoped>
.scenario {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
