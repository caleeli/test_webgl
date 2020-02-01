<template>
  <canvas :width="width" :height="height"></canvas>
</template>

<script>
let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
// details

let aspectRatio;

// Vertex information

let vertexArray;
let vertexBuffer;
let vertexNumComponents;
let vertexCount;

// Rendering data shared with the
// scalers.

// Animation timing

let previousTime = 0.0;
let degreesPerSecond = 90.0;

let shaderProgram;

///
let currentAngle, rotationRate;

function UniformVec4(data) {
  data.glType = "uniform4fv";
  return data;
}
function UniformVec2(data) {
  data.glType = "uniform2fv";
  return data;
}
function VertexAttrib(data, size = 2) {
  data.glSize = size;
  data.mount = gl => {
    data.glBuffer = gl.createBuffer();
    data.glData = new Float32Array(data);
    gl.bindBuffer(gl.ARRAY_BUFFER, data.glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.glData, gl.STATIC_DRAW);
  };
  return data;
}

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
    glCanvas = this.$el;
    gl = glCanvas.getContext("webgl");

    shaderProgram = this.buildShaderProgram();

    aspectRatio = glCanvas.width / glCanvas.height;
    //currentRotation = [0, 1];
    //currentScale = [1.0, aspectRatio];

    /*vertexArray = new Float32Array([
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

    window.abc = vertexArray;

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.DYNAMIC_DRAW);

    vertexNumComponents = 2;
    vertexCount = vertexArray.length / vertexNumComponents;*/

    this.loadAttributes(shaderProgram);

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
    buildShaderProgram() {
      const shaderInfo = [
        {
          type: gl.VERTEX_SHADER,
          code: this.vertex_shader
        },
        {
          type: gl.FRAGMENT_SHADER,
          code: this.fragment_shader
        }
      ];

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
    updateAttributes(shaderProgram) {
      let vertexCount = 0;
      Object.keys(this.attributes).forEach(name => {
        const data = this.attributes[name];
        gl.bindBuffer(gl.ARRAY_BUFFER, data.glBuffer);
        vertexCount += data.length / data.glSize;
        const aVertexPosition = gl.getAttribLocation(
          shaderProgram,
          name
        );
        gl.enableVertexAttribArray(aVertexPosition);
        gl.vertexAttribPointer(
          aVertexPosition,
          data.glSize,
          gl.FLOAT,
          false,
          0,
          0
        );
      });
      return vertexCount;
    },
    loadAttributes(shaderProgram) {
      Object.keys(this.attributes).forEach(name => {
        this.attributes[name].mount(gl);
      });
    },
    updateVariables(shaderProgram) {
      Object.keys(this.variables).forEach(name => {
        const type = this.variables[name].glType;
        gl[type](
          gl.getUniformLocation(shaderProgram, name),
          this.variables[name]
        );
      });
    },
    animateScene() {
      gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      gl.clearColor(0.8, 0.9, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      let radians = (currentAngle * Math.PI) / 180.0;

      this.variables.uRotationVector[0] = Math.sin(radians);
      this.variables.uRotationVector[1] = Math.cos(radians);

      gl.useProgram(shaderProgram);

      this.updateVariables(shaderProgram);
      const vertexCount = this.updateAttributes(shaderProgram);

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
    'attributes.aVertexPosition': {
      deep: true,
      handler(data) {
        data.mount(gl);
      }
    }
  }
};
</script>

<style>
</style>
