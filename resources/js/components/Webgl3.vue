<template>
  <canvas :width="width" :height="height"></canvas>
</template>

<script>
export default {
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
      gl: null,
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
  mounted() {
    this.gl = this.$el.getContext("webgl");

    const shaderProgram = this.buildShaderProgram();

    this.loadAttributes(shaderProgram);

    this.animateScene(shaderProgram);
  },
  methods: {
    buildShaderProgram() {
      const shaderInfo = [
        {
          type: this.gl.VERTEX_SHADER,
          code: this.vertex_shader
        },
        {
          type: this.gl.FRAGMENT_SHADER,
          code: this.fragment_shader
        }
      ];

      let program = this.gl.createProgram();

      shaderInfo.forEach(desc => {
        let shader = this.compileShader(desc.code, desc.type);

        if (shader) {
          this.gl.attachShader(program, shader);
        }
      });

      this.gl.linkProgram(program);

      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        console.log("Error linking shader program:");
        console.log(this.gl.getProgramInfoLog(program));
      }

      return program;
    },
    compileShader(code, type) {
      let shader = this.gl.createShader(type);

      this.gl.shaderSource(shader, code);
      this.gl.compileShader(shader);

      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.log(
          `Error compiling ${
            type === this.gl.VERTEX_SHADER ? "vertex" : "fragment"
          } shader:`
        );
        console.log(this.gl.getShaderInfoLog(shader));
      }
      return shader;
    },
    updateAttributes(shaderProgram) {
      let vertexCount = 0;
      Object.keys(this.attributes).forEach(name => {
        const data = this.attributes[name];
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, data.glBuffer);
        vertexCount += data.length / data.glSize;
        const aVertexPosition = this.gl.getAttribLocation(shaderProgram, name);
        this.gl.enableVertexAttribArray(aVertexPosition);
        this.gl.vertexAttribPointer(
          aVertexPosition,
          data.glSize,
          this.gl.FLOAT,
          false,
          0,
          0
        );
      });
      return vertexCount;
    },
    loadAttributes(shaderProgram) {
      Object.keys(this.attributes).forEach(name => {
        this.attributes[name].mount(this.gl);
      });
    },
    updateVariables(shaderProgram) {
      Object.keys(this.variables).forEach(name => {
        const type = this.variables[name].glType;
        this.gl[type](
          this.gl.getUniformLocation(shaderProgram, name),
          this.variables[name]
        );
      });
    },
    animateScene(shaderProgram) {
      this.gl.viewport(0, 0, this.$el.width, this.$el.height);
      this.gl.clearColor(0.8, 0.9, 1.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      const radians = (this.currentAngle * Math.PI) / 180.0;

      this.variables.uRotationVector[0] = Math.sin(radians);
      this.variables.uRotationVector[1] = Math.cos(radians);

      this.gl.useProgram(shaderProgram);

      this.updateVariables(shaderProgram);
      const vertexCount = this.updateAttributes(shaderProgram);

      this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);

      window.requestAnimationFrame(currentTime => {
        let deltaAngle =
          ((currentTime - this.previousTime) / 1000.0) * this.degreesPerSecond;

        this.currentAngle = (this.currentAngle + deltaAngle) % 360;

        this.previousTime = currentTime;
        this.animateScene(shaderProgram);
      });
    }
  },
  watch: {
    attributes: {
      deep: true,
      handler(data) {
        Object.keys(this.attributes).forEach(name => {
          this.attributes[name].mount(this.gl);
        });
      }
    }
  }
};
</script>

<style>
</style>
