global.UniformSampler2D = function (data) {
    data.mount = (gl) => {
        const tex = loadImageAndCreateTextureInfo(gl, data.url);
        gl.bindTexture(gl.TEXTURE_2D, tex.texture);
    };
    data.setter = (gl, location, value) => {
        return gl.uniform1i(location, 0)
    };
    return data;
}
global.UniformMat4 = function (data) {
    data.setter = (gl, location, value) => gl.uniformMatrix4fv(location, false, value);
    return data;
}
global.UniformVec4 = function (data) {
    data.setter = (gl, location, value) => gl.uniform4fv(location, value);
    return data;
}
global.UniformVec2 = function (data) {
    data.setter = (gl, location, value) => gl.uniform2fv(location, value);
    return data;
}
global.VertexAttrib = function (data, size = 2) {
    data.glSize = size;
    data.mount = gl => {
        data.glBuffer = gl.createBuffer();
        data.glData = new Float32Array(data);
        gl.bindBuffer(gl.ARRAY_BUFFER, data.glBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.glData, gl.DYNAMIC_DRAW);
    };
    data.update = gl => {
        data.glData = new Float32Array(data);
        gl.bindBuffer(gl.ARRAY_BUFFER, data.glBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data.glData);
    };
    return data;
}

function loadImageAndCreateTextureInfo(gl, url, vue) {
    vue.loading++;
    console.log(vue.loading);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var textureInfo = {
        width: 450,   // we don't know the size until it loads
        height: 122,
        texture: tex,
    };
    var img = new Image();
    img.addEventListener('load', function () {
        textureInfo.width = img.width;
        textureInfo.height = img.height;

        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        setTimeout(() => {
            vue.loading--;
            console.log(vue.loading);
        }, 1000);
    });
    img.src = url;

    return textureInfo;
}
global.newAttributeArray = function (value, size = 2) {
    return new Proxy(new AttributeArray(value, size),
        {
            apply: function (target, thisArg, argumentsList) {
                console.log('ENTROO');
                const response = thisArg[target].apply(this, argumentList);
                if (target !== 'bind' || target !== 'update') {
                    thisArg.rebind = true;
                }
                return response;
            },
            set: function (target, property, value, receiver) {
                target[property] = value;
                target.data[property] = value;
                return true;
            }
        }
    );
}
class AttributeArray0 extends Array {
    constructor(value, size = 2) {
        super(...value);
        this.data = new Float32Array(value);
        this.buffer = null;
        this.location = null;
        this.size = size;
        this.count = value.length / size;
        this.rebind = false;
        this.bind = this.bind;
        this.update = this.update;
        this.syncData = this.syncData;
        this.set = this.set;
    }
    bind(gl, shaderProgram, name) {
        // Bind attribute (array)
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.DYNAMIC_DRAW);
        //
        this.location = gl.getAttribLocation(shaderProgram, name);
        gl.enableVertexAttribArray(this.location);
        gl.vertexAttribPointer(
            this.location,
            this.size,
            gl.FLOAT,
            false,
            0,
            0
        );
    };
    update(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        if (this.rebind) {
            gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.DYNAMIC_DRAW);
        } else {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data);
        }
        this.rebind = false;
    };
    syncData() {
        this.data = new Float32Array(this);
        this.count = this.length / this.size;
        this.rebind = true;
    };
    set(index, value) {
        this.data[index] = value;
        this[index] = value;
    };
}
global.AttributeArray = AttributeArray0;
class UniformMat4Variable0 {
    constructor(value) {
        this.data = value;
    }
    bind(gl, shaderProgram, name) {
        this.location = gl.getUniformLocation(shaderProgram, name);
        gl.uniformMatrix4fv(this.location, false, this.data);
    }
    update(gl) {
        gl.uniformMatrix4fv(this.location, false, this.data);
    }
}
global.UniformMat4Variable = UniformMat4Variable0;
class UniformSampler2DVariable0 {
    constructor(value) {
        this.data = value;
        this.tex = null;
    }
    bind(gl, shaderProgram, name, vue) {
        this.tex = loadImageAndCreateTextureInfo(gl, this.data.url, vue);
        this.location = gl.getUniformLocation(shaderProgram, name);
        gl.bindTexture(gl.TEXTURE_2D, this.tex.texture);
        gl.uniform1i(this.location, 0);
    }
    update(gl) {
        gl.uniform1i(this.location, 0);
    }
}
global.UniformSampler2DVariable = UniformSampler2DVariable0;
class UniformFloat {
    constructor(value) {
        this.data = value;
    }
    bind(gl, shaderProgram, name) {
        this.location = gl.getUniformLocation(shaderProgram, name);
        gl.uniform1f(this.location, this.data);
    }
    update(gl) {
        gl.uniform1f(this.location, this.data);
    }
}
global.UniformFloat = UniformFloat;
