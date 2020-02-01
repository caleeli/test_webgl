<template>
  <canvas :width="width" :height="height"></canvas>
</template>

<script>
let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
// details

let aspectRatio;
let currentRotation = [0, 1];
let currentScale = [1.0, 1.0];

// Vertex information

let vertexArray;
let vertexBuffer;
let vertexNumComponents;
let vertexCount;

// Rendering data shared with the
// scalers.

let uScalingFactor;
let uGlobalColor;
let uRotationVector;
let aVertexPosition;

// Animation timing

let previousTime = 0.0;
let degreesPerSecond = 90.0;

//////
let shaderProgram;
let currentAngle;
let rotationRate;

vertexArray = new Float32Array([
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
]);

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
      vertexArray: [
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
      ],
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
          gl_FragColor = texture2D(u_texture, v_texcoord);
        }
      `
    };
  },
  mounted() {
    glCanvas = this.$el;
    gl = glCanvas.getContext("webgl");

    const shaderSet = [
      {
        type: gl.VERTEX_SHADER,
        code: this.vertex_shader
      },
      {
        type: gl.FRAGMENT_SHADER,
        code: this.fragment_shader
      }
    ];

    shaderProgram = this.buildShaderProgram(shaderSet);

    aspectRatio = glCanvas.width / glCanvas.height;
    currentRotation = [0, 1];
    currentScale = [1.0, aspectRatio];

    /*vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    vertexNumComponents = 2;
    vertexCount = vertexArray.length / vertexNumComponents;*/

    currentAngle = 0.0;
    rotationRate = 6;

    this.animateScene();
  },
  methods: {
    bindAttribute(value) {
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(value);
        gl.vertexAttribPointer(value, 2, gl.FLOAT, false, 0, 0);
        return buffer;
    },
    buildShaderProgram(shaderInfo) {
      let program = gl.createProgram();

      shaderInfo.forEach(desc => {
        let shader = this.compileShader(desc.code, desc.type);

        if (shader) {
          gl.attachShader(program, shader);
        }
      });

      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Error linking shader program:");
        console.log(gl.getProgramInfoLog(program));
      }

      return program;
    },
    compileShader(code, type) {
      let shader = gl.createShader(type);

      gl.shaderSource(shader, code);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
          `Error compiling ${
            type === gl.VERTEX_SHADER ? "vertex" : "fragment"
          } shader:`
        );
        console.log(gl.getShaderInfoLog(shader));
      }
      return shader;
    },
    animateScene() {
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

      vertexNumComponents = 2;
      vertexCount = vertexArray.length / vertexNumComponents;

      /////
      gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      gl.clearColor(0.8, 0.9, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      let radians = (currentAngle * Math.PI) / 180.0;
      currentRotation[0] = Math.sin(radians);
      currentRotation[1] = Math.cos(radians);

      gl.useProgram(shaderProgram);

      uScalingFactor = gl.getUniformLocation(shaderProgram, "uScalingFactor");
      uGlobalColor = gl.getUniformLocation(shaderProgram, "uGlobalColor");
      uRotationVector = gl.getUniformLocation(shaderProgram, "uRotationVector");

      gl.uniform2fv(uScalingFactor, currentScale);
      gl.uniform2fv(uRotationVector, currentRotation);
      gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");

      gl.enableVertexAttribArray(aVertexPosition);
      gl.vertexAttribPointer(
        aVertexPosition,
        vertexNumComponents,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

      window.requestAnimationFrame(currentTime => {
        let deltaAngle =
          ((currentTime - previousTime) / 1000.0) * degreesPerSecond;

        currentAngle = (currentAngle + deltaAngle) % 360;

        previousTime = currentTime;
        this.animateScene();
      });
    }
  },
  watch: {
    vertexArray: {
      deep: true,
      handler() {
        console.log(this.vertexArray);
        vertexArray = new Float32Array(this.vertexArray);
      }
    }
  }
};
</script>

<style>
</style>
