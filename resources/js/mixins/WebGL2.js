let lasttime = 0;
export default {
    props: {
        blend: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            gl: null,
            loading: 0,
            shaderProgram: null,
            attributes: {
            },
            variables: {
            },
            vertex_shader: "",
            fragment_shader: ""
        };
    },
    mounted() {
        this.gl = this.$el.getContext("webgl", {
            alpha: true, premultipliedAlpha: false
        });
        if (this.blend) {
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        }

        this.shaderProgram = this.buildShaderProgram();

        this.gl.useProgram(this.shaderProgram);
        this.bindAttributes(this.shaderProgram);
        this.bindVariables(this.shaderProgram);
    },
    watch: {
        loading(loading) {
            if (loading === 0) {
                this.loadScenario();
                this.animateScene(this.shaderProgram);
            }
        }
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
        bindAttributes(shaderProgram) {
            Object.keys(this.attributes).forEach(name => {
                this.attributes[name].bind(this.gl, shaderProgram, name, this);
            });
        },
        updateAttributesValues() {
            Object.keys(this.attributes).forEach(name => {
                this.attributes[name].update(this.gl);
            });
        },
        bindVariables(shaderProgram) {
            Object.keys(this.variables).forEach(name => {
                this.variables[name].bind(this.gl, shaderProgram, name, this);
            });
        },
        updateVariablesValues() {
            Object.keys(this.variables).forEach(name => {
                this.variables[name].update(this.gl);
            });
        },
        animateScene(shaderProgram) {
            //this.gl.useProgram(shaderProgram);
            window.requestAnimationFrame(currentTime => {
                window.document.title = Math.round(1 / (currentTime - lasttime) * 1000);
                lasttime = currentTime;
                this.animateFrame(shaderProgram, currentTime);
                this.animateScene(shaderProgram);
            });
        }
    },
};
