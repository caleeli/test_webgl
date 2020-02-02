<template>
  <canvas :width="width" :height="height" @mousemove="mousemove"></canvas>
</template>

<script>
const m4 = require("../globals/m4.js");
import WebgGL from "../mixins/WebGL2";
const txSize = 8;
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
    }
  },
  data() {
    return {
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
          url: require("../../textures/defenzaciudad.png")
        })
      },
      size: [],
      sprites: [],
      vertex_shader: `
        attribute vec4 a_position;
        attribute vec2 a_texcoord;

        uniform mat4 u_matrix;
        varying vec2 v_texcoord;

        void main() {
            gl_Position = u_matrix * a_position;
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
            if ( color.a < 0.5 ) discard ;
            gl_FragColor = color ;
        }
      `
    };
  },
  methods: {
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
        this.attributes.a_position.push(
          x,
          y,
          x,
          y + h,
          x + w,
          y,
          x + w,
          y,
          x,
          y + h,
          x + w,
          y + h
        );
        const tw = (sprite[0].w / this.variables.u_texture.tex.width) * txSize;
        const th = (sprite[0].h / this.variables.u_texture.tex.height) * txSize;
        const tx = (sprite[0].x / this.variables.u_texture.tex.width) * txSize;
        const ty = (sprite[0].y / this.variables.u_texture.tex.height) * txSize;
        this.sprites.push(sprite);
        this.size.push({ w, h });
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
      }
      this.attributes.a_position.syncData();
      this.attributes.a_texcoord.syncData();
    },
    createSprite(sprite, x = 0, y = 0, w, h) {
      w = w === undefined ? sprite[0].w : w;
      h = h === undefined ? sprite[0].h : h;
      this.attributes.a_position.push(
        x,
        y,
        x,
        y + h,
        x + w,
        y,
        x + w,
        y,
        x,
        y + h,
        x + w,
        y + h
      );
      const tw = (sprite[0].w / this.variables.u_texture.tex.width) * txSize;
      const th = (sprite[0].h / this.variables.u_texture.tex.height) * txSize;
      const tx = (sprite[0].x / this.variables.u_texture.tex.width) * txSize;
      const ty = (sprite[0].y / this.variables.u_texture.tex.height) * txSize;
      this.sprites.push(sprite);
      this.size.push({ w, h });
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
      this.attributes.a_position.syncData();
      this.attributes.a_texcoord.syncData();
    },
    teleportSprite(
      s = 0,
      x = (Math.random() - 0.5) * 35,
      y = Math.random() * 5
    ) {
      let i = s * 12;
      let w = this.size[s].w;
      let h = this.size[s].h;
      this.attributes.a_position.set(i++, x);
      this.attributes.a_position.set(i++, y);
      this.attributes.a_position.set(i++, x);
      this.attributes.a_position.set(i++, y + h);
      this.attributes.a_position.set(i++, x + w);
      this.attributes.a_position.set(i++, y);
      this.attributes.a_position.set(i++, x + w);
      this.attributes.a_position.set(i++, y);
      this.attributes.a_position.set(i++, x);
      this.attributes.a_position.set(i++, y + h);
      this.attributes.a_position.set(i++, x + w);
      this.attributes.a_position.set(i++, y + h);
    },
    moveSprite(
      s = 0,
      vx = (Math.random() - 0.5) * 0.1,
      vy = (Math.random() - 0.5) * 0.1
    ) {
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
    },
    resizeSprite(s, w, h) {
      this.size[s].w = w;
      this.size[s].h = h;
      let i = s * 12;
      this.teleportSprite(
        s,
        this.attributes.a_position[i],
        this.attributes.a_position[i + 1]
      );
    },
    animateSprites() {
      for (let s = 0; s < this.sprites.length; s++) {
        const j =
          (Math.round(this.j * this.sprites[s][0].speed) + s) %
          this.sprites[s].length;
        const tw =
          (this.sprites[s][j].w / this.variables.u_texture.tex.width) * txSize;
        const th =
          (this.sprites[s][j].h / this.variables.u_texture.tex.height) * txSize;
        const tx =
          (this.sprites[s][j].x / this.variables.u_texture.tex.width) * txSize;
        const ty =
          (this.sprites[s][j].y / this.variables.u_texture.tex.height) * txSize;
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
      }
      this.j++;
    },
    getMatrix(x, y, w, h) {
      var matrix = m4.orthographic(0, this.width, this.height, 0, -1, 1);
      matrix = m4.translate(matrix, x, y, 0);
      matrix = m4.scale(matrix, w, h, 1);
      return matrix;
    },
    animateFrame(shaderProgram, currentTime) {
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
    },
    loadScenario() {},
    ////
    mousemove(event) {}
  }
};
</script>
