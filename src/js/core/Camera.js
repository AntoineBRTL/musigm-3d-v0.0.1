import { Material } from "./component/Material.js";
import { Mesh } from "./component/Mesh.js";
import { GameObject } from "./GameObject.js";
import { Matrix4 } from "./math/Matrix4.js";
import { Vector3 } from "./math/Vector3.js";
import { Scene } from "./Scene.js";

export class Camera extends GameObject{

    /**
     * Web-gl camera
     */
    constructor(){
        super();

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
        this.clearColor = [0.0, 0.0, 0.0, 1.0];

        /**
         * @type {Array<Object>}
         */
        this.programMaterials = new Array();

        /**
         * @type {number}
         */
        this.fov = 60;

        /**
         * @type {Function}
         */
        this.onResize = function(){}

        // init the camera
        this.init();
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
     * Initalize a new camera
     */
    init() {
        // create a canvas
        const canvas = document.createElement('canvas');
        // get the web-gl context from it
        const gl = canvas.getContext("webgl2");

        // check if the context is ok 
        if(!gl){
            console.error("Can't get the web-gl context");
            return;
        }

        // assign values
        this.canvas = canvas;
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitPointerLockElement;
        this.canvas.exitPointerLock = this.canvas.exitPointerLock || this.canvas.mozExitPointerLock || this.canvas.webkitExitPointerLock;
        this.gl = gl;
        this.gl.enable(this.gl.DEPTH_TEST);

        // add the canvas to body
        document.body.appendChild(canvas); 
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
     * Render the scene
     * @param {Scene} scene
     */
    render(scene){

        // clear the old frame
        this.clear();

        const gameObjetsToRender = scene.content;
        gameObjetsToRender.forEach(function(gameObject){

            // check if the gameObject has a material
            if(!gameObject.hasComponent(Material)){
                return;
            }

            const material = gameObject.getComponent(Material);
            const mesh = gameObject.getComponent(Mesh);

            // Web-gl program
            const programPreStatus = this.getProgram(material, mesh);
            const program = programPreStatus || this.createProgram(material, mesh);
            
            this.gl.useProgram(program);

            // fill vertex shader attributes & uniforms
            // default attribute(s)
            this.fillShaderAttribute("coordinates", new Float32Array(mesh.vertices), 3, program);

            mesh.vertexShaderAttributes.forEach(function(element){
                this.fillShaderAttribute(element.attribute, element.value, element.dimension, program);
            }, this);

            // default uniform(s)
            this.fillShaderUniform(mesh.vertexShaderUniformWorldMatrixName, new Float32Array(gameObject.transform), 4, program);
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

            material.fragmentShaderUniforms.forEach(function(element){
                this.fillShaderUniform(element.uniform, element.value, element.dimension, program);
            }, this);

            // draw
            this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, mesh.vertices.length);

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
    fillShaderUniform(uniform, value, dimension, program) {
        const uniformLocation = this.gl.getUniformLocation(program, uniform);
        //this.gl.uniform4fv(uniformLocation, value);
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
    }
}