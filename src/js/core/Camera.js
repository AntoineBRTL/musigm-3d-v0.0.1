import { DirectionLight } from "./component/DirectionLight.js";
import { Light } from "./component/Light.js";
import { Material } from "./component/Material.js";
import { Mesh } from "./component/Mesh.js";
import { DEFAULT_OLD_FRAGMENT_SHADER_SOURCE } from "./Constant.js";
import { GameObject } from "./GameObject.js";
import { Matrix4 } from "./math/Matrix4.js";
import { Vector3 } from "./math/Vector3.js";
import { Scene } from "./Scene.js";

export class Camera extends GameObject{

    /**
     * Web-gl camera
     */
     constructor(args){

        if(!args){
            args = new Object();
        }

        super(args);

        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas;

        /**
         * @type {WebGL2RenderingContext}
         */
        this.gl;

        /**
         * @type {Array<number>}
         */
        this.clearColor = [0.0, 0.0, 0.0, 1.0] || args.clearColor;

        /**
         * @type {Array<Object>}
         */
        this.programMaterials = new Array();

        /**
         * @type {number}
         */
        this.fov = 60 || args.fov;

        /**
         * @type {Function}
         */
        this.onResize = function(){}

        // init the camera
        this.init();
    }

    /**
     * Transformation matrix
     * @return {Matrix3} Transformation matrix
     */
    get transform() {
        return new Matrix4().scaled(this.scale).rotated(this.rotation).translated(this.position);
    }

    /**
     * @return {Matrix4}
     */
    get projectionMatrix() {
        return new Matrix4().perspective(
            this.fov * (Math.PI / 180),
            this.canvas.width / this.canvas.height,
            0.1,
            1000.0
        );
    }

    /**
     * lock the user cursor using the click event
     * @param {Function} callback 
     */
    lockCursor(callback){
        window.addEventListener("click", function(e){
            this.canvas.requestPointerLock();
            callback();
        }.bind(this));
    }

    /**
     * Initalize a new camera
     */
    init() {
        // create a canvas
        this.canvas = document.createElement('canvas');
        // get the web-gl context from it
        this.gl = this.canvas.getContext("webgl2");

        // check if the context is ok 
        if(!this.gl){
            console.error("Can't get the web-gl context");
            return;
        }

        // assign values
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitPointerLockElement;
        this.canvas.exitPointerLock = this.canvas.exitPointerLock || this.canvas.mozExitPointerLock || this.canvas.webkitExitPointerLock;
        this.gl.enable(this.gl.DEPTH_TEST);

        // add the canvas to body
        document.body.appendChild(this.canvas); 
        document.body.style.margin = "0px";
        document.body.style.overflow = "hidden";

        // resize & resize event
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
    }

    /**
     * Resize the canvas & the web-gl context
     */
    resize(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        this.onResize();
    }

    /**
     * Clear the canvas
     */
    clear(){
        this.gl.clearColor(...this.clearColor);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT | this.gl.ACCUM_BUFFER_BIT);
    }

    /**
     * Render the scene -> quadratic time algorithm x²
     * @param {Scene} scene
     */
    render(scene){
        // clear the old frame
        this.clear();

        // draw objects to render
        scene.content.forEach(function(gameObject){

            // the gameObject must have a material & a mesh
            const material = gameObject.getComponent(Material);
            const mesh = gameObject.getComponent(Mesh);

            if(!material || !mesh){
                return;
            }

            // Web-gl program
            const program = this.getProgram(material, mesh) || this.createProgram(material, mesh);
            this.gl.useProgram(program);

            // fill vertex shader attributes & uniforms
            // default attribute(s)
            this.fillShaderAttribute(mesh.vertexShaderAttributeVertexPositionName, new Float32Array(mesh.vertices), 3, program);
            this.fillShaderAttribute(mesh.vertexShaderAttributeVertexNormalName, new Float32Array(mesh.verticesNormal), 3, program);

            mesh.vertexShaderAttributes.forEach(function(element){
                this.fillShaderAttribute(element.attribute, element.value, element.dimension, program);
            }, this);

            // default uniform(s)
            this.fillShaderUniform(mesh.vertexShaderUniformObjectMatrixName, new Float32Array(gameObject.transform), 4, program);
            this.fillShaderUniform(mesh.vertexShaderUniformViewMatrixName, new Float32Array(this.transform), 4, program);
            this.fillShaderUniform(mesh.vertexShaderUniformProjectionMatrixName, new Float32Array(this.projectionMatrix), 4, program);

            mesh.vertexShaderUniforms.forEach(function(element){
                this.fillShaderUniform(element.uniform, element.value, element.dimension, program);
            }, this);

            // fill fragment shader attributes & uniforms
            material.fragmentShaderAttributes.forEach(function(element){
                this.fillShaderAttribute(element.attribute, element.value, element.dimension, program);
            }, this);

            // default uniform(s)
            this.fillShaderUniform("resolution", new Float32Array([this.canvas.width, this.canvas.height]), 2, program);

            // default (lights)
            const directionalLightsNumber = scene.directionLights.length;
            this.fillShaderUniform("numberOfDirectionalLights", new Float32Array([directionalLightsNumber]), 1, program, true);
            for(let i = 0; i < directionalLightsNumber; i++){
                const directionalLightGameObject = scene.directionLights[i];
                const down = directionalLightGameObject.up.scaled(-1);
                const directionalLight = scene.directionLights[i].getComponent(DirectionLight);
                this.fillShaderUniform("directionalLight[" + i + "].intensity", new Float32Array([directionalLight.intensity]), 1, program);
                this.fillShaderUniform("directionalLight[" + i + "].color", new Float32Array(directionalLight.color), 3, program);
                this.fillShaderUniform("directionalLight[" + i + "].ambientStrength", new Float32Array([directionalLight.ambientStrength]), 1, program);
                this.fillShaderUniform("directionalLight[" + i + "].direction", new Float32Array([down.x, down.y, down.z]), 3, program);
            }

            const lightsNumber = scene.lights.length;
            this.fillShaderUniform("numberOfLights", new Float32Array([lightsNumber]), 1, program, true);
            for(let i = 0; i < lightsNumber; i++){
                const lightGameObject = scene.lights[i];
                const light = scene.lights[i].getComponent(Light);
                this.fillShaderUniform("light[" + i + "].intensity", new Float32Array([light.intensity]), 1, program);
                this.fillShaderUniform("light[" + i + "].color", new Float32Array(light.color), 3, program);
                this.fillShaderUniform("light[" + i + "].position", new Float32Array([lightGameObject.position.x, lightGameObject.position.y, lightGameObject.position.z]), 3, program);
                this.fillShaderUniform("light[" + i + "].constant", new Float32Array([light.constent]), 1, program);
                this.fillShaderUniform("light[" + i + "].linear", new Float32Array([light.linear]), 1, program);
                this.fillShaderUniform("light[" + i + "].quadratic", new Float32Array([light.quadratic]), 1, program);
            }

            material.fragmentShaderUniforms.forEach(function(element){
                this.fillShaderUniform(element.uniform, element.value, element.dimension, program);
            }, this);

            // draw
            this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.vertices.length / mesh.dimension /** Merci à mon frère Pierru-sama pour son aide sur le "/ mesh.dimension" :D */);

        }, this);
    }

    /**
     * Get a program for this material
     * @param {Material} material 
     * @param {Mesh} mesh  
     */
    getProgram(material, mesh) {

        let program;

        this.programMaterials.forEach(function(programMaterial){
            if(programMaterial.material == material && programMaterial.mesh == mesh) {
                program = programMaterial.program;
            }
        }, this);

        return program;
    }                                
    /**
     * Create a new Program
     * @param {Material} material 
     * @param {Mesh} mesh  
     */
    createProgram(material, mesh){

        const vertexShaderSource = mesh.vertexShaderSource;
        const fragmentShaderSource = material.fragmentShaderSource;

        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader, vertexShaderSource);

        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader, fragmentShaderSource);

        // compile the shaders & log possible errors
        this.gl.compileShader(vertexShader);
        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(vertexShader));
            return;
        }

        this.gl.compileShader(fragmentShader);
        if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(fragmentShader));
            return;
        }

        // create the program & attach the shader on it
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(program));
            return;
        }

        // add the program to the program list
        this.programMaterials.push({program: program, material: material, mesh: mesh});

        return program;
    }

    /**
     * Fill an attribute of shader
     * @param {String} attribute 
     * @param {*} value 
     */
    fillShaderAttribute(attribute, value, dimension, program) {
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, value, this.gl.STATIC_DRAW);

        const attributeLocation = this.gl.getAttribLocation(program, attribute);
        this.gl.vertexAttribPointer(attributeLocation, dimension, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(attributeLocation);
    }

    /**
     * Fill an uniform of shader
     * @param {String} uniform 
     * @param {*} value 
     */
    fillShaderUniform(uniform, value, dimension, program, isInt = false) {
        const uniformLocation = this.gl.getUniformLocation(program, uniform);
        //this.gl.uniform4fv(uniformLocation, value);
        if(!isInt){
            if(dimension == 4){
                this.gl.uniformMatrix4fv(uniformLocation, this.gl.FALSE, value);
            }
            if(dimension == 3){
                this.gl.uniform3fv(uniformLocation, value);
            }
            if(dimension == 2){
                this.gl.uniform2fv(uniformLocation, value);
            }
            if(dimension == 1){
                this.gl.uniform1fv(uniformLocation, value);
            }

            return;
        }

        if(dimension == 1){
            this.gl.uniform1iv(uniformLocation, value);
        }

    }
}