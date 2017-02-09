/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// ------------------------------ The cc.Node's render command for WebGL ----------------------------------
(function() {
    cc.Node.WebGLRenderCmd = function (renderable) {
        cc.Node.RenderCmd.call(this, renderable);
        this._shaderProgram = null;
    };

    var proto = cc.Node.WebGLRenderCmd.prototype = Object.create(cc.Node.RenderCmd.prototype);
    proto.constructor = cc.Node.WebGLRenderCmd;

    proto._updateColor = function(){};

    proto.setShaderProgram = function (shaderProgram) {
        this._shaderProgram = shaderProgram;
    };

    proto.getShaderProgram = function () {
        return this._shaderProgram;
    };

    var setUniform = function(location, p, gl) {
        if (cc.isArray(p)) {
            var len = p.length;
            if (len === 1)
                gl.uniform1fv(location, p);
            else if (len === 2)
                gl.uniform2fv(location, p);
            else if (len === 3)
                gl.uniform3fv(location, p);
            else if (len === 4)
                gl.uniform4fv(location, p);
        }
    };

    // Added by yaochunhui
    proto.applyShaderParams = function () {
        var node = this._node;
        var program = this._shaderProgram;
        if (node && program && program._programObj) {
            var gl = program._glContext;
            if (node._shaderParams) {
                cc.each(node._shaderParams, function(val, key){
                    if (!val)
                        return;
                    var location = program.getUniformLocationForName(key);
                    if (!location)
                        return;
                    setUniform(location, val, gl);
                }, this);
            }

            if (node._shaderTextures) {
                var texUnit = 1;
                cc.each(node._shaderTextures, function(val, key){
                    if (!val)
                        return;
                    var location = program.getUniformLocationForName(key);
                    if (!location)
                        return;

                    cc.glBindTexture2DN(texUnit, val);
                    gl.uniform1i(location, texUnit);
                    texUnit++;
                }, this);
            }
        }
    }
})();
