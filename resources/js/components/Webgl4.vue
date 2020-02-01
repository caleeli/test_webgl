<template>
  <canvas :width="width" :height="height"></canvas>
</template>

<script>
import WebgGL from "../mixins/WebGL";

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
      previousTime: 0.0,
      degreesPerSecond: 90.0,
      currentAngle: 0,
      rotationRate: 6,
      ////
      attributes: {
        aVertexPosition: VertexAttrib([
          -0.5,
          0.5,
          0.5,
          0.5,
          0.5,
          -0.5,
          -0.5,
          0.5,
          0.5,
          -0.5,
          -0.5,
          -0.5
        ])
      },
      variables: {
        uGlobalColor: UniformVec4([0.9, 0.7, 0.2, 1.0]),
        uScalingFactor: UniformVec2([1, 1]),
        uRotationVector: UniformVec2([0, 1])
      },
      vertex_shader: `
        attribute vec2 aVertexPosition;

        uniform vec2 uScalingFactor;
        uniform vec2 uRotationVector;

        void main() {
            vec2 rotatedPosition = vec2(
                aVertexPosition.x * uRotationVector.y +
                    aVertexPosition.y * uRotationVector.x,
                aVertexPosition.y * uRotationVector.y -
                    aVertexPosition.x * uRotationVector.x
            );

            gl_Position = vec4(rotatedPosition * uScalingFactor, 0.0, 1.0);
        }
      `,
      fragment_shader: `
        #ifdef GL_ES
            precision highp float;
        #endif

        uniform vec4 uGlobalColor;

        void main() {
            gl_FragColor = uGlobalColor;
        }
      `
    };
  },
  methods: {
    animateFrame(currentTime) {
      //this.gl.viewport(0, 0, this.$el.width, this.$el.height);
      //this.gl.clearColor(0.8, 0.9, 1.0, 1.0);
      //this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      const radians = (this.currentAngle * Math.PI) / 180.0;

      this.variables.uRotationVector[0] = Math.sin(radians);
      this.variables.uRotationVector[1] = Math.cos(radians);

      let deltaAngle =
        ((currentTime - this.previousTime) / 1000.0) * this.degreesPerSecond;

      this.currentAngle = (this.currentAngle + deltaAngle) % 360;

      this.previousTime = currentTime;
    }
  }
};
</script>

<style>
</style>
