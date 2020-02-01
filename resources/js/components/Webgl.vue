<template>
  <canvas :width="width" :height="height"></canvas>
</template>

<script>
const m4 = require("../globals/m4.js");
import WebgGL from "../mixins/WebGL2";
const sprites = 1;

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
    }
  },
  data() {
    return {
      ////
      attributes: {
        a_position: new AttributeArray([
          /*0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1*/
        ]),
        a_texcoord: new AttributeArray([
          /*0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1*/
        ])
      },
      variables: {
        u_matrix: new UniformMat4Variable(this.getMatrix(0, 0, 32, 32)),
        u_texture: new UniformSampler2DVariable({
          url: require("../../textures/defenzaciudad.png")
        })
      },
      map: {
        helicopter: [
          { x: 0, y: 64, w: 18, h: 16 },
          { x: 18, y: 64, w: 18, h: 16 },
          { x: 36, y: 64, w: 18, h: 16 },
          { x: 54, y: 64, w: 18, h: 16 },
          { x: 72, y: 64, w: 18, h: 16 },
          { x: 90, y: 64, w: 18, h: 16 }
        ]
      },
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

        void main() {
            vec4 color = texture2D(u_texture, v_texcoord);
            if ( color.a < 0.5 ) discard ;
            gl_FragColor = color ;
        }
      `
    };
  },
  methods: {
    createSprite(
      count = 1,
      x = Math.random() * 55,
      y = Math.random() * 55,
      w = 1 + Math.random() * 4,
      h = 1 + Math.random() * 4,
      t = Math.floor(Math.random() * 9)
    ) {
      for (let i = 0; i < count; i++) {
        x = Math.random() * 55;
        y = Math.random() * 55;
        t = Math.floor(Math.random() * 9);
        this.attributes.a_position.push(
          //0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1
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
        /*const tw =
          this.map.helicopter[0].w / this.variables.u_texture.tex.width;
        const th =
          this.map.helicopter[0].h / this.variables.u_texture.tex.height;
        const tx =
          this.map.helicopter[0].x / this.variables.u_texture.tex.width;
        const ty =
          this.map.helicopter[0].y / this.variables.u_texture.tex.height;*/
        const tx=0,ty=0,tw=0.5,th=0.5;
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
    teleportSprite(
      s = 0,
      x = (Math.random() - 0.5) * 35,
      y = Math.random() * 5,
      w = 1 + Math.random() * 4,
      h = 1 + Math.random() * 4
    ) {
      let i = s * 12;
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

      const tw = this.map.helicopter[0].w / this.variables.u_texture.tex.width;
      const th = this.map.helicopter[0].h / this.variables.u_texture.tex.height;
      const tx = this.map.helicopter[0].x / this.variables.u_texture.tex.width;
      const ty = this.map.helicopter[0].y / this.variables.u_texture.tex.height;
      i = s * 12;
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

      /*const tw = this.map.helicopter[0].w / this.variables.u_texture.tex.width;
      const th = this.map.helicopter[0].h / this.variables.u_texture.tex.height;
      const tx = this.map.helicopter[0].x / this.variables.u_texture.tex.width;
      const ty = this.map.helicopter[0].y / this.variables.u_texture.tex.height;*/
      /*const tx=0,ty=0,tw=0.5,th=0.5;
      //console.log(tx,ty,tw,th);
      i = s * 12;
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
      this.attributes.a_texcoord.set(i++, ty + th);*/
    },
    getMatrix(x, y, w, h) {
      // this matrix will convert from pixels to clip space
      var matrix = m4.orthographic(0, 600, 360, 0, -1, 1);

      // this matrix will translate our quad to dstX, dstY
      matrix = m4.translate(matrix, x, y, 0);

      // this matrix will scale our 1 unit quad
      // from 1 unit to texWidth, texHeight units
      matrix = m4.scale(matrix, w, h, 1);
      return matrix;
    },
    animateFrame(shaderProgram, currentTime) {
      for (let i = 0; i < sprites; i++) {
        this.moveSprite(i);
      }
      this.updateAttributesValues();
      this.gl.drawArrays(
        this.gl.TRIANGLES,
        0,
        this.attributes.a_position.count
      );
    }
  },
  mounted() {
    this.createSprite(sprites);
  }
};
</script>

<style>
</style>
