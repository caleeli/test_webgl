let lasttime = 0;
export default {
    data() {
        return {
            gl: null,
            attributes: {
            },
            variables: {
            },
            vertex_shader: "",
            fragment_shader: ""
        };
    },
    mounted() {
        this.gl = this.$el.getContext("webgl");

        const shaderProgram = this.buildShaderProgram();

        this.loadAttributes(shaderProgram);
        this.loadVariables(shaderProgram);

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
                vertexCount = data.length / data.glSize;
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
        loadAttributes() {
            Object.keys(this.attributes).forEach(name => {
                this.attributes[name].mount(this.gl);
            });
        },
        updateAttributesValues() {
            Object.keys(this.attributes).forEach(name => {
                this.attributes[name].update(this.gl);
            });
        },
        loadVariables() {
            Object.keys(this.variables).forEach(name => {
                this.variables[name].mount ? this.variables[name].mount(this.gl) : null;
            });
        },
        updateVariables(shaderProgram) {
            Object.keys(this.variables).forEach(name => {
                const setter = this.variables[name].setter;
                setter(this.gl, this.gl.getUniformLocation(shaderProgram, name), this.variables[name]);
            });
        },
        animateScene(shaderProgram) {
            this.gl.useProgram(shaderProgram);
            const vertexCount = this.updateAttributes(shaderProgram);

            window.requestAnimationFrame(currentTime => {
                //console.log(Math.round(1 / (currentTime - lasttime)*1000));
                window.document.title = Math.round(1 / (currentTime - lasttime)*1000);
                lasttime = currentTime;
                this.animateFrame(shaderProgram, currentTime, vertexCount);
                this.animateScene(shaderProgram);
            });
        }
    },
    /*watch: {
        attributes: {
            deep: true,
            handler(data) {
                this.loadAttributes();
            }
        }
    }*/
};
