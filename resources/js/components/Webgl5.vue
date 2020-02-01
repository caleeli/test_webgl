<template>
  <canvas :width="width" :height="height"></canvas>
</template>

<script>
const m4 = require("../globals/m4.js");
import WebgGL from "../mixins/WebGL";
const sprites = 10000;

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
        a_position: VertexAttrib([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
        a_texcoord: VertexAttrib([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1])
      },
      variables: {
        u_matrix: UniformMat4(this.getMatrix(0, 0, 32, 32)),
        u_texture: UniformSampler2D({ url: require("../modules/star.jpg") })
      },
      vertex_shader: `
        attribute vec4 a_position;
        //attribute mat4 u_matrix;
        attribute vec2 a_texcoord;

        uniform mat4 u_matrix;
        //uniform vec4 a_position;
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
            gl_FragColor = texture2D(u_texture, v_texcoord);
        }
      `
    };
  },
  methods: {
    createSprite(
      x = Math.random() * 5,
      y = Math.random() * 5,
      w = 1 + Math.random() * 4,
      h = 1 + Math.random() * 4
    ) {
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
      this.attributes.a_texcoord.push(0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1);
    },
    moveSprite(
      s = 0,
      x = Math.random() * 5,
      y = Math.random() * 5,
      w = 1 + Math.random() * 4,
      h = 1 + Math.random() * 4
    ) {
      let i = s * 12;
      this.attributes.a_position[i++] = x;
      this.attributes.a_position[i++] = y;
      this.attributes.a_position[i++] = x;
      this.attributes.a_position[i++] = y + h;
      this.attributes.a_position[i++] = x + w;
      this.attributes.a_position[i++] = y;
      this.attributes.a_position[i++] = x + w;
      this.attributes.a_position[i++] = y;
      this.attributes.a_position[i++] = x;
      this.attributes.a_position[i++] = y + h;
      this.attributes.a_position[i++] = x + w;
      this.attributes.a_position[i++] = y + h;
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
    animateFrame(shaderProgram, currentTime, vertexCount) {
      /*for (let i = 0; i < 100; i++) {
        this.variables.u_matrix = UniformMat4(
          this.getMatrix(
            Math.random() * 500,
            Math.random() * 500,
            10 + Math.random() * 10,
            10 + Math.random() * 10
          )
        );
        this.updateVariables(shaderProgram);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);
      }*/
      for (let i = 0; i < sprites; i++) {
        this.moveSprite(i);
      }
      this.updateAttributesValues();
      this.updateVariables(shaderProgram);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);
    }
  },
  mounted() {
    for (let i = 0; i < sprites; i++) {
      this.createSprite();
    }
    this.loadAttributes();
  }
};
</script>

<style>
</style>
