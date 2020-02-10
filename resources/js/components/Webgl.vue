<template>
  <canvas :width="width" :height="height" @mousemove="mousemove"></canvas>
</template>

<script>
const m4 = require("../globals/m4.js");
import WebgGL from "../mixins/WebGL2";
const txSize = 4;
export default {
  mixins: [WebgGL],
  props: {
    height: {
      type: Number,
      default: 360
    },
    width: {
      type: Number,
      default: 600
    },
    map: {
      type: Object
    },
    texture: {
      default() {
        return require("../../textures/defenzaciudad.png");
      }
    }
  },
  data() {
    return {
      nextClockResolve: [],
      j: 0,
      ////
      attributes: {
        a_position: new AttributeArray([]),
        a_texcoord: new AttributeArray([])
      },
      variables: {
        u_matrix: new UniformMat4Variable(this.getMatrix(0, 0, 1, 1)),
        rand0: new UniformFloatVariable(Math.random()),
        u_texture: new UniformSampler2DVariable({
          url: this.texture
        })
      },
      angle: [],
      size: [],
      sprites: [],
      vertex_shader: `
        attribute vec4 a_position;
        attribute vec2 a_texcoord;

        uniform mat4 u_matrix;
        varying vec2 v_texcoord;

        void main() {
            float fRotation = 0.01;
            float c = cos(fRotation);
            float s = sin(fRotation);

            vec4 uPosition = u_matrix * a_position;

            gl_Position = uPosition;
            v_texcoord = a_texcoord;
        }
      `,
      fragment_shader: `
        precision mediump float;

        varying vec2 v_texcoord;

        uniform sampler2D u_texture;
        uniform float rand0;

        float random(){
            return (fract(sin(dot(v_texcoord.xy ,vec2(12.9898,78.233))) * 43758.5453) + rand0) * 0.5;
        }

        void main() {
            //float rand = random();
            vec4 color = texture2D(u_texture, v_texcoord);
            if ( color.a == 0.0 ) discard ;
            gl_FragColor = color ;
        }
      `
    };
  },
  methods: {
    reset() {
      this.j = 0;
      this.attributes.a_position.splice(0);
      this.attributes.a_texcoord.splice(0);
      this.nextClockResolve.splice(0);
      this.size.splice(0);
      this.angle.splice(0);
      this.sprites.splice(0);
      this.sync();
    },
    createSprites(
      count = 1,
      sprite,
      xx = 55,
      yy = 55,
      w = sprite[0].w,
      h = sprite[0].h
    ) {
      let x, y;
      for (let i = 0; i < count; i++) {
        x = Math.random() * xx;
        y = Math.random() * yy;
        let a = Math.random() * Math.PI;
        this.createSpriteBase(sprite, x, y, w, h, a);
      }
      this.attributes.a_position.syncData();
      this.attributes.a_texcoord.syncData();
    },
    createSprite(sprite, x = 0, y = 0, w, h, a = 0, z = 1) {
      w = w === undefined ? sprite[0].w : w;
      h = h === undefined ? sprite[0].h : h;
      const s = this.createSpriteBase(sprite, x, y, w, h, a, z);
      this.attributes.a_position.syncData();
      this.attributes.a_texcoord.syncData();
      return s;
    },
    sync() {
      this.attributes.a_position.syncData();
      this.attributes.a_texcoord.syncData();
    },
    createSpriteBase(sprite, x, y, w, h, a, z) {
      w = w === undefined ? sprite[0].w : w;
      h = h === undefined ? sprite[0].h : h;
      a = a === undefined ? sprite[0].a || 0 : a;
      z = z === undefined ? sprite[0].z || 1 : z;
      const cos = Math.cos(a) * 0.5;
      const sin = Math.sin(a) * 0.5;
      const wcos = w * cos * z;
      const wsin = w * sin * z;
      const hcos = h * cos * z;
      const hsin = h * sin * z;
      this.attributes.a_position.push(
        x + (-wcos - hsin),
        y - (hcos - wsin),
        x + (-wcos + hsin),
        y - (-hcos - wsin),
        x + (wcos - hsin),
        y - (hcos + wsin),
        x + (wcos - hsin),
        y - (hcos + wsin),
        x + (-wcos + hsin),
        y - (-hcos - wsin),
        x + (wcos + hsin),
        y - (-hcos + wsin)
      );
      const tw = (sprite[0].w / this.variables.u_texture.tex.width) * txSize;
      const th = (sprite[0].h / this.variables.u_texture.tex.height) * txSize;
      const tx = (sprite[0].x / this.variables.u_texture.tex.width) * txSize;
      const ty = (sprite[0].y / this.variables.u_texture.tex.height) * txSize;
      this.sprites.push(sprite);
      this.angle.push(a);
      this.size.push({ x, y, w, h, z, s: 0 });
      this.attributes.a_texcoord.push(
        tx,
        ty,
        tx,
        ty + th,
        tx + tw,
        ty,
        tx + tw,
        ty,
        tx,
        ty + th,
        tx + tw,
        ty + th
      );
      return this.size.length - 1;
    },
    teleportSprite(s = 0, x, y, a, z) {
      let i = s * 12;
      let w = this.size[s].w;
      let h = this.size[s].h;
      this.size[s].x = x = x === undefined ? this.size[s].x : x;
      this.size[s].y = y = y === undefined ? this.size[s].y : y;
      this.angle[s] = a = a === undefined ? this.angle[s] : a;
      this.size[s].z = z = z === undefined ? this.size[s].z : z;
      const cos = Math.cos(a) * 0.5;
      const sin = Math.sin(a) * 0.5;
      const wcos = w * cos * z;
      const wsin = w * sin * z;
      const hcos = h * cos * z;
      const hsin = h * sin * z;
      this.attributes.a_position.set(i++, x + (-wcos - hsin));
      this.attributes.a_position.set(i++, y - (hcos - wsin));
      this.attributes.a_position.set(i++, x + (-wcos + hsin));
      this.attributes.a_position.set(i++, y - (-hcos - wsin));
      this.attributes.a_position.set(i++, x + (wcos - hsin));
      this.attributes.a_position.set(i++, y - (hcos + wsin));
      this.attributes.a_position.set(i++, x + (wcos - hsin));
      this.attributes.a_position.set(i++, y - (hcos + wsin));
      this.attributes.a_position.set(i++, x + (-wcos + hsin));
      this.attributes.a_position.set(i++, y - (-hcos - wsin));
      this.attributes.a_position.set(i++, x + (wcos + hsin));
      this.attributes.a_position.set(i++, y - (-hcos + wsin));
    },
    moveSprite(
      s = 0,
      vx = (Math.random() - 0.5) * 0.1,
      vy = (Math.random() - 0.5) * 0.1
    ) {
      this.size[s].x += vx;
      this.size[s].y += vy;
      let i = s * 12 - 1;
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vx);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vy);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vx);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vy);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vx);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vy);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vx);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vy);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vx);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vy);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vx);
      i++;
      this.attributes.a_position.set(i, this.attributes.a_position[i] + vy);
    },
    changeSprite(s, sprite) {
      this.sprites[s] = sprite;
      this.size[s].w = sprite[0].w;
      this.size[s].h = sprite[0].h;
      this.size[s].z = sprite[0].z || 1;
    },
    resizeSprite(s, w, h) {
      this.size[s].w = w;
      this.size[s].h = h;
      let i = s * 12;
      this.teleportSprite(s);
    },
    animateSprites() {
      for (let s = 0; s < this.sprites.length; s++) {
        const j =
          Math.round(
            this.j * (this.sprites[s][0].speed || 1) + this.size[s].s
          ) % this.sprites[s].length;
        const sprite = this.sprites[s][j];
        // Animate texture
        const tex = this.variables.u_texture.tex;
        const tw = (sprite.w / tex.width) * txSize;
        const th = (sprite.h / tex.height) * txSize;
        const tx = (sprite.x / tex.width) * txSize;
        const ty = (sprite.y / tex.height) * txSize;
        let i = s * 12;
        this.attributes.a_texcoord.set(i++, tx);
        this.attributes.a_texcoord.set(i++, ty);
        this.attributes.a_texcoord.set(i++, tx);
        this.attributes.a_texcoord.set(i++, ty + th);
        this.attributes.a_texcoord.set(i++, tx + tw);
        this.attributes.a_texcoord.set(i++, ty);
        this.attributes.a_texcoord.set(i++, tx + tw);
        this.attributes.a_texcoord.set(i++, ty);
        this.attributes.a_texcoord.set(i++, tx);
        this.attributes.a_texcoord.set(i++, ty + th);
        this.attributes.a_texcoord.set(i++, tx + tw);
        this.attributes.a_texcoord.set(i++, ty + th);
        // Animate zoom and angle
        if (sprite.z || sprite.a) {
          this.teleportSprite(s, undefined, undefined, sprite.a, sprite.z);
        }
      }
    },
    setAnimationPos(s, pos) {
      this.size[s].s = pos - this.j * (this.sprites[s][0].speed || 1);
      return {
        start: this.j,
        end:
          this.j +
          Math.round(
            (this.sprites[s].length - 1) / (this.sprites[s][0].speed || 1)
          )
      };
    },
    getMatrix(x, y, w, h) {
      var matrix = m4.orthographic(0, this.width, this.height, 0, -1, 1);
      //matrix = m4.multiply(matrix, [0, 1, 0, -1, 0, 0, 0, 0, 1]);
      matrix = m4.translate(matrix, x, y, 0);
      matrix = m4.scale(matrix, w, h, 1);
      return matrix;
    },
    animateFrame(shaderProgram, currentTime) {
      this.clockTick(this.j);
      this.variables.rand0.data = Math.random();
      this.animateSprites();
      this.updateAttributesValues();
      this.updateVariablesValues();
      if (this.attributes.a_position.count) {
        this.gl.drawArrays(
          this.gl.TRIANGLES,
          0,
          this.attributes.a_position.count
        );
      }
      this.tick();
      this.j++;
    },
    clockTick(j) {
      for (let i = 0, l = this.nextClockResolve.length; i < l; i++) {
        const clock = this.nextClockResolve[i];
        ////
        if (j >= clock.j) {
          clock.resolve();
          this.nextClockResolve.splice(i, 1);
          i--;
          l--;
        }
      }
    },
    clock(j = 0) {
      return new Promise(resolve => {
        this.nextClockResolve.push({ resolve, j });
      });
    },
    loadScenario() {},
    tick() {},
    ////
    mousemove(event) {}
  }
};
</script>
