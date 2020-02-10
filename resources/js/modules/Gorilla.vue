<template>
  <div class="editor w-100 h-100">
    <div class="position-relative" style="width:100%; height:100%;">
      <img class="scenario" :src="world" style="width: 100%;" />
      <scenario
        ref="scenario"
        class="scenario"
        :blend="false"
        :texture="texture"
        @load-scenario="runGame"
        @tick="tick"
        :width="large"
        :height="floor"
        :map="map"
        style="width:100%;"
      ></scenario>
      <div class="left">{{ names[0] }}</div>
      <div class="right">{{ names[1] }}</div>
      <prompt ref="prompt" />
    </div>
  </div>
</template>

<script>
const floor = 480;
const large = 720;

export default {
  path: "/",
  mixins: [window.workflowMixin],
  data() {
    return {
      large,
      floor,
      explosions: [],
      edificios: [],
      names: ["David", "Patricia"],
      nextTickResolve: null,
      gorillas: [],
      banana: -1,
      explosion1: -1,
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
          { x: 668, y: 176, w: 16, h: 16, a: 0.0, sx: 1, sy: 1, speed: 1 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.1 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.2 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.3 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.4 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.5 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.6 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.7 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.8 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 0.9 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.0 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.1 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.2 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.3 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.4 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.5 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.6 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.7 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.8 },
          { x: 668, y: 176, w: 16, h: 16, a: Math.PI * 1.9 }
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
          { x: 668, y: 120, w: 28, h: 28, a: Math.PI * 2, z: 1.0, speed: 0.5 },
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
        explosion1End: [
          { x: 668, y: 148, w: 28, h: 28, a: 0.0, z: 1.0, speed: 1 }
        ],
        explosion2: [
          {
            x: 637,
            y: 229,
            w: 60,
            h: 44,
            a: 0,
            z: 0.1,
            speed: 0.4
          },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.2 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.3 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.4 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.5 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.6 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.7 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.8 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.9 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 1.0 }
        ],
        explosion2b: [
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 1.0, speed: 0.8 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.9 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.8 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.7 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.6 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.5 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.4 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.3 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.2 },
          { x: 637, y: 229, w: 60, h: 44, a: 0, z: 0.1 }
        ],
        explosion2End: [
          { x: 637, y: 273, w: 60, h: 44, a: 0.0, z: 1.0, speed: 1 }
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
    submit() {
      alert(this.angle);
    },
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
      return scenario.createSpriteBase(
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
      const edificios = this.edificios;
      do {
        let pos = this.crearEdificio(scenario, x);
        edificios.push(pos);
        x = pos.x + pos.w;
      } while (x < large);
      this.gorillas.push(
        this.ponerGorila(scenario, edificios[1]),
        this.ponerGorila(scenario, edificios[edificios.length - 2])
      );
    },
    buildScenario() {
      const scenario = this.$refs.scenario;
      // place sun
      scenario.createSpriteBase(
        scenario.map.sol1,
        large * 0.5,
        60,
        scenario.map.sol1[0].w,
        scenario.map.sol1[0].h,
        0
      );
      this.crearCiudad(scenario);
      this.banana = scenario.createSpriteBase(scenario.map.banana, -16, -16);
      this.explosion1 = scenario.createSpriteBase(
        scenario.map.explosion1,
        -16,
        -16
      );
      scenario.sync();
    },
    runGame() {
      this.buildScenario();
      this.game();
    },
    async game() {
      let turno = 0;
      let exit = false;
      while (!exit) {
        const angle = await this.$refs.prompt.ask(
          this.names[turno],
          "Angle",
          turno
        );
        const velocity = await this.$refs.prompt.ask(
          this.names[turno],
          "Velocity",
          turno
        );
        exit = await this.lanzarBanana(
          this.gorillas[turno],
          angle,
          velocity,
          1 - turno * 2
        );
        turno = (turno + 1) % 2;
      }
    },
    async lanzarBanana(gorilla, a, v, dir) {
      const g = 9.8;
      const vx = v * Math.cos((a / 180) * Math.PI) * dir;
      const vy = v * Math.sin((a / 180) * Math.PI);

      const scenario = this.$refs.scenario;
      const pos = scenario.size[gorilla];
      const x0 = pos.x - pos.w * 0.5 * dir;
      const y0 = pos.y - pos.h * 0.5 - 8;
      for (let t = 0; ; t += 0.1) {
        await this.nextTick();
        const x = x0 + t * vx;
        const y = y0 - (t * vy - 0.5 * g * t * t);
        if (
          (x > large + 16 && vx > 0) ||
          (x < -16 && vx < 0) ||
          y > floor ||
          y < -floor
        ) {
          scenario.teleportSprite(this.banana, -16, -16);
          break;
        }
        // Detección de colisión
        let choco = false;
        let exploto = -1;
        // Detección de colisión con edificios
        this.edificios.forEach(edificio => {
          const x1 = edificio.x;
          const x2 = edificio.x + edificio.w;
          const y1 = edificio.y;
          const inAExplosion = this.explosions.find(
            explo =>
              Math.sqrt(
                (explo.x - x) * (explo.x - x) + (explo.y - y) * (explo.y - y)
              ) <=
              this.map.explosion1End[0].w * 0.5
          );
          choco |= x >= x1 && x <= x2 && y >= y1 && !inAExplosion;
        });
        // Detección de colisión con gorilla
        this.gorillas.forEach((s, i) => {
          const gorilla = scenario.size[s];
          const x1 = gorilla.x - gorilla.w * 0.5;
          const x2 = gorilla.x + gorilla.w * 0.5;
          const y1 = gorilla.y - gorilla.h * 0.5;
          const y2 = gorilla.y + gorilla.h * 0.5;
          if (x >= x1 && x <= x2 && y >= y1 && y <= y2) exploto = i;
        });
        // Dibuja explosion o banana
        if (exploto > -1) {
          const gorilla = scenario.size[this.gorillas[exploto]];
          await this.explotar(
            scenario,
            gorilla.x,
            gorilla.y,
            this.map.explosion2,
            this.map.explosion2b,
            this.map.explosion2End
          );
          this.resetGame();
          break;
        } else if (choco) {
          await this.explotar(
            scenario,
            x,
            y,
            this.map.explosion1,
            this.map.explosion1b,
            this.map.explosion1End
          );
          break;
        } else {
          scenario.teleportSprite(this.banana, x, y);
        }
      }
      return false;
    },
    async explotar(scenario, x, y, explo1, explo2, explo3) {
      let explosion = this.banana;
      this.explosions.push({ x, y });
      scenario.teleportSprite(explosion, x, y);
      scenario.changeSprite(explosion, explo1);
      const anim = scenario.setAnimationPos(explosion, 0);
      await scenario.clock(anim.end);
      scenario.changeSprite(explosion, explo3);
      this.banana = scenario.createSpriteBase(explo2, x, y);
      const anim2 = scenario.setAnimationPos(this.banana, 0);
      scenario.sync();
      await scenario.clock(anim2.end);
      scenario.changeSprite(this.banana, this.map.banana);
      scenario.teleportSprite(this.banana, -16, -16);
    },
    tick() {
      this.nextTickResolve ? this.nextTickResolve() : null;
      this.nextTickResolve = null;
    },
    nextTick() {
      return new Promise(resolve => {
        this.nextTickResolve = resolve;
      });
    },
    resetGame() {
      this.$refs.scenario.reset();
      this.edificios.splice(0);
      this.gorillas.splice(0);
      this.explosions.splice(0);
      this.buildScenario();
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
