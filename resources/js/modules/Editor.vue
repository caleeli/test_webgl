<template>
  <div class="editor row w-100 h-100">
    <div class="col-1 p-0">
      <input class="form-control" v-model="angle" />
      <button
        v-for="sprite in sprites"
        :key="sprite"
        class="btn btn-info w-100"
        type="button"
        @click="choose(sprite)"
      >{{ sprite }}</button>
    </div>
    <div class="col p-0">
      <div class="position-relative" style="width:640px; height:480px;">
        <img class="scenario" :src="world" width="640" />
        <scenario
          ref="scenario"
          class="scenario"
          :texture="texture"
          @mousemove="mousemove"
          @click="click"
          @load-scenario="loadScenario"
          :width="640"
          :height="480"
          :map="map"
        ></scenario>
        <div class="left">{{ name1 }}</div>
        <div class="right">{{ name2 }}</div>
      </div>
    </div>
  </div>
</template>

<script>
const floor = 480;
const large = 640;

export default {
  path: "/",
  mixins: [window.workflowMixin],
  data() {
    return {
      name1: "David",
      name2: "Patricia",
      angle: 0,
      prevX: 0,
      prevY: 0,
      /*world: require("../../textures/place.png"),
      map: {
        helicopter: [
          { x: 0, y: 64, w: 18, h: 16, speed: 1, sx: 8, sy: 8 },
          { x: 18, y: 64, w: 18, h: 16 },
          { x: 36, y: 64, w: 18, h: 16 },
          { x: 54, y: 64, w: 18, h: 16 },
          { x: 72, y: 64, w: 18, h: 16 },
          { x: 90, y: 64, w: 18, h: 16 }
        ],
        car: [{ x: 140, y: 64, w: 28, h: 16, speed: 1, sx: 8, sy: 8 }],
        asphalt: [{ x: 228, y: 64, w: 16, h: 16, speed: 1, sx: 8, sy: 8 }],
        factory: [
          { x: 0, y: 0, w: 64, h: 64, speed: 0.01, sx: 8, sy: 8 },
          { x: 64, y: 0, w: 64, h: 64 },
          { x: 128, y: 0, w: 64, h: 64 },
          { x: 192, y: 0, w: 64, h: 64 },
          { x: 256, y: 0, w: 64, h: 64 },
          { x: 320, y: 0, w: 64, h: 64 },
          { x: 384, y: 0, w: 64, h: 64 }
        ],
        house: [{ x: 0, y: 80, w: 48, h: 32, speed: 0.01, sx: 8, sy: 8 }],
        building1: [{ x: 448, y: 0, w: 64, h: 64, speed: 0.01, sx: 8, sy: 8 }],
        building2: [{ x: 512, y: 0, w: 64, h: 64, speed: 0.01, sx: 8, sy: 8 }],
        building3: [{ x: 576, y: 0, w: 64, h: 64, speed: 0.01, sx: 8, sy: 8 }]
      },*/
      world: require("../../textures/sky.jpg"),
      texture: require("../../textures/gorilla.png"),
      map: {
        ventana1: [
          { x: 0, y: 0, w: 6, h: 16, sx: 10, sy: 18, speed: 0.001 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 0, w: 6, h: 16, speed: 0.01 },
          { x: 0, y: 32, w: 6, h: 16, speed: 0.01 }
        ],
        ventana2: [{ x: 0, y: 16, w: 6, h: 16, sx: 10, sy: 18 }],
        edificio1: [{ x: 6, y: 0, w: 60, h: 270, sx: 5, sy: 18 }],
        edificio2: [{ x: 66, y: 0, w: 70, h: 270, sx: 5, sy: 18 }],
        edificio3: [{ x: 136, y: 0, w: 80, h: 270, sx: 5, sy: 18 }],
        edificio4: [{ x: 216, y: 0, w: 60, h: 270, sx: 5, sy: 18 }],
        edificio5: [{ x: 276, y: 0, w: 70, h: 270, sx: 5, sy: 18 }],
        edificio6: [{ x: 346, y: 0, w: 80, h: 270, sx: 5, sy: 18 }],
        edificio7: [{ x: 426, y: 0, w: 60, h: 270, sx: 5, sy: 18 }],
        edificio8: [{ x: 486, y: 0, w: 70, h: 270, sx: 5, sy: 18 }],
        edificio9: [{ x: 556, y: 0, w: 80, h: 270, sx: 5, sy: 18 }],
        banana: [
          { x: 636, y: 228, w: 16, h: 16, a: 0.0, sx: 1, sy: 1, speed: 1 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.1 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.2 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.3 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.4 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.5 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.6 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.7 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.8 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 0.9 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.0 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.1 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.2 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.3 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.4 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.5 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.6 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.7 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.8 },
          { x: 636, y: 228, w: 16, h: 16, a: Math.PI * 1.9 }
        ],
        sol1: [{ x: 636, y: 0, w: 60, h: 60, sx: 4, sy: 4 }],
        sol2: [{ x: 636, y: 60, w: 60, h: 60, sx: 4, sy: 4 }],
        gorilla1: [{ x: 636, y: 120, w: 32, h: 36, sx: 4, sy: 4 }],
        gorilla2: [{ x: 636, y: 156, w: 32, h: 36, sx: 4, sy: 4 }],
        gorilla3: [{ x: 636, y: 192, w: 32, h: 36, sx: 4, sy: 4 }],
        explosion1: [
          {
            x: 668,
            y: 120,
            w: 28,
            h: 28,
            a: 0.0,
            z: 0.1,
            speed: 0.8
          },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 0.2, z: 0.2 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 0.4, z: 0.3 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 0.6, z: 0.4 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 0.8, z: 0.5 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.0, z: 0.6 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.2, z: 0.7 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.4, z: 0.8 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.6, z: 0.9 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 1.0 }
        ],
        explosion1b: [
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 2, z: 1.0, speed: 0.8 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.9 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.8 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.7 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.6 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.5 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.4 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.3 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.2 },
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 1.8, z: 0.1 }
        ],
        explosion2: [
          {
            x: 636,
            y: 276,
            w: 60,
            h: 44,
            a: 0,
            z: 0.1,
            speed: 0.5
          },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.2 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.3 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.4 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.5 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.6 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.7 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.8 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.9 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 1.0 }
        ],
        explosion2b: [
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 1.0, speed: 0.5 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.9 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.8 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.7 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.6 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.5 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.4 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.3 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.2 },
          { x: 636, y: 276, w: 60, h: 44, a: 0, z: 0.1 }
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
    crearEdificio(scenario, x) {
      let j = Math.floor(Math.random() * 9 + 1);
      let sprite = scenario.map[`edificio${j}`];
      let y = floor - Math.floor(Math.random() * 11 + 3) * 20;
      scenario.createSprite(
        sprite,
        x + sprite[0].w * 0.5,
        y + sprite[0].h * 0.5,
        sprite[0].w,
        sprite[0].h
      );
      for (let xv = x + 5, xl = x + sprite[0].w; xv < xl; xv += 10) {
        for (let yv = y + 10, yl = y + sprite[0].h; yv < yl; yv += 20) {
          let v = Math.floor(Math.random() * 2 + 1);
          let spriteV = scenario.map[`ventana${v}`];
          scenario.createSpriteBase(
            spriteV,
            xv,
            yv,
            spriteV[0].w,
            spriteV[0].h,
            0
          );
        }
      }
      return { x, y, w: sprite[0].w };
    },
    ponerGorila(scenario, edificio) {
      scenario.createSpriteBase(
        scenario.map.gorilla3,
        edificio.x + edificio.w * 0.5,
        edificio.y - scenario.map.gorilla3[0].h * 0.5,
        scenario.map.gorilla3[0].w,
        scenario.map.gorilla3[0].h,
        0
      );
    },
    crearCiudad(scenario) {
      let x = 0;
      const edificios = [];
      do {
        let pos = this.crearEdificio(scenario, x);
        edificios.push(pos);
        x = pos.x + pos.w;
      } while (x < 640);
      this.ponerGorila(scenario, edificios[1]);
      this.ponerGorila(scenario, edificios[edificios.length - 2]);
    },
    loadScenario() {
      const scenario = this.$refs.scenario;
      scenario.createSpriteBase(
        scenario.map.sol1,
        large * 0.5,
        60,
        scenario.map.sol1[0].w,
        scenario.map.sol1[0].h,
        0
      );
      this.crearCiudad(scenario);
      scenario.createSprites(1, scenario.map["sol1"], 300, 200);
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
      const sx = sprite[0].sx || 1;
      const sy = sprite[0].sy || 1;
      const x = Math.round(event.offsetX / sx) * sx;
      const y = Math.round(event.offsetY / sy) * sy;
      const a = (Math.PI * eval(this.angle)) / 180;
      scenario.createSprite(sprite, x, y, sprite[0].w, sprite[0].h, a);
      this.selected = scenario.sprites.length - 1;
      this.prevX = event.offsetX;
      this.prevY = event.offsetY;
    },
    mousemove(event) {
      const scenario = this.$refs.scenario;
      if (scenario.sprites.length && this.selected > -1) {
        const c = this.selected;
        const sprite = scenario.sprites[c];
        const sx = sprite[0].sx || 1;
        const sy = sprite[0].sy || 1;
        const x = Math.round(event.offsetX / sx) * sx;
        const y = Math.round(event.offsetY / sy) * sy;
        const a = (Math.PI * eval(this.angle)) / 180;
        scenario.teleportSprite(c, x, y, a);
      }
      this.prevX = event.offsetX;
      this.prevY = event.offsetY;
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
.editor {
  font-family: "PerfectDOSVGA437Win";
}
.left {
  position: absolute;
  top: 0em;
  left: 1em;
  color: white;
}
.right {
  position: absolute;
  top: 0em;
  right: 1em;
  color: white;
}
</style>
