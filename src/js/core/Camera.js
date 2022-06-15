import { DirectionLight } from "./component/DirectionLight.js";
import { PointLight } from "./component/PointLight.js";
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
        this.clearColor = new Vector3(0.0, 0.0, 0.0) || args.clearColor;

        /**
         * @type {Array<Object>}
         */
        this.programMaterials = new Array();

        /**
         * @type {number}
         */
        this.fov = 60 || args.fov;

        /**
         * @type {number}
         */
        this.near = 0.1 || args.near;

        /**
         * @type {number}
         */
        this.far = 10000.0 || args.far;

        /**
         * @type {Function}
         */
        this.onResize = function(){}

        // init the camera
        this.init();
    }

    /**
     * Transformation matrix
     * @return {Matrix4} Transformation matrix
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
            this.near,
            this.far
        );
    }

    /**
     * lock the user cursor using the mousedown event
     * @param {Function} callback 
     */
    lockCursor(callback){
        this.canvas.addEventListener("mousedown", function(e){
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
        this.gl.clearColor(this.clearColor.x, this.clearColor.y, this.clearColor.z, 1.0);
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

            // constants replacement
            // prepare light shit
            const directionalLightsNumber = scene.directionLights.length;
            const pointLightsNumber = scene.pointLights.length;

            let fragmentLignes = (material.fragmentShaderSource).split('\n');
            fragmentLignes.forEach(function(line, index){
                if(line.includes("<<")){
                    if(line.includes('NUMBER_OF_DIRECTIONAL_LIGHT')){

                        if(directionalLightsNumber > 0){
                            fragmentLignes[index] = 'const int NUMBER_OF_DIRECTIONAL_LIGHT = ' + directionalLightsNumber + ';';
                        }else{
                            fragmentLignes[index] = 'const int NUMBER_OF_DIRECTIONAL_LIGHT = 1;';
                        }
                    }
    
                    if(line.includes('NUMBER_OF_POINT_LIGHT')){
    
                        if(pointLightsNumber > 0){
                            fragmentLignes[index] = 'const int NUMBER_OF_POINT_LIGHT = ' + pointLightsNumber + ';';
                        }else{
                            fragmentLignes[index] = 'const int NUMBER_OF_POINT_LIGHT = 1;';
                        }
                    }
                }
            });

            let fs = fragmentLignes.join('\n') + material.shaderFooter;
            let vs = mesh.vertexShaderSource;

            // Web-gl program
            const program = this.getProgram(fs, vs) || this.createProgram(fs, vs);
            this.gl.useProgram(program);

            // fill vertex shader attributes & uniforms
            // default attribute(s)
            this.fillShaderAttribute(mesh.vertexShaderAttributeVertexPositionName, new Float32Array(mesh.verticesPositions), 3, program);
            this.fillShaderAttribute(mesh.vertexShaderAttributeVertexNormalName, new Float32Array(mesh.verticesNormals), 3, program);

            mesh.vertexShaderAttributes.forEach(function(element){
                this.fillShaderAttribute(element.attribute, element.value, element.dimension, program);
            }, this);

            // default uniform(s)
            this.fillShaderUniform(mesh.vertexShaderUniformObjectMatrixName, new Float32Array(gameObject.transform), 4, program);
            // TODO : better system for matrices (ObjectRotationMatrix) 
            this.fillShaderUniform(mesh.vertexShaderUniformObjectRotationMatrixName, new Float32Array(new Matrix4().identity().rotated(gameObject.rotation)), 4, program);
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
            this.fillShaderUniform("material.color", new Float32Array([material.color.x, material.color.y, material.color.z]), 3, program);

            // default (lights)
            if(directionalLightsNumber > 0){
                this.fillShaderUniform("directionLightInScene", new Float32Array([1]), 1, program);

                for(let i = 0; i < directionalLightsNumber; i++){
                    const directionalLightGameObject = scene.directionLights[i];
                    const down = directionalLightGameObject.up.scaled(-1);
                    const directionalLight = scene.directionLights[i].getComponent(DirectionLight);
                    this.fillShaderUniform("directionalLight[" + i + "].intensity", new Float32Array([directionalLight.intensity]), 1, program);
                    this.fillShaderUniform("directionalLight[" + i + "].color", new Float32Array([directionalLight.color.x, directionalLight.color.y, directionalLight.color.z]), 3, program);
                    this.fillShaderUniform("directionalLight[" + i + "].ambientStrength", new Float32Array([directionalLight.ambientStrength]), 1, program);
                    this.fillShaderUniform("directionalLight[" + i + "].direction", new Float32Array([down.x, down.y, down.z]), 3, program);
                }
            }else{
                this.fillShaderUniform("directionLightInScene", new Float32Array([0]), 1, program);
            }
            
            if(pointLightsNumber > 0){
                this.fillShaderUniform("pointLightInScene", new Float32Array([1]), 1, program);
                
                for(let i = 0; i < pointLightsNumber; i++){
                    const pointLightGameObject = scene.pointLights[i];
                    const pointLight = scene.pointLights[i].getComponent(PointLight);
                    this.fillShaderUniform("pointLight[" + i + "].intensity", new Float32Array([pointLight.intensity]), 1, program);
                    this.fillShaderUniform("pointLight[" + i + "].color", new Float32Array([pointLight.color.x, pointLight.color.y, pointLight.color.z]), 3, program);
                    this.fillShaderUniform("pointLight[" + i + "].position", new Float32Array([pointLightGameObject.position.x, pointLightGameObject.position.y, pointLightGameObject.position.z]), 3, program);
                    this.fillShaderUniform("pointLight[" + i + "].constant", new Float32Array([pointLight.constent]), 1, program);
                    this.fillShaderUniform("pointLight[" + i + "].linear", new Float32Array([pointLight.linear]), 1, program);
                    this.fillShaderUniform("pointLight[" + i + "].quadratic", new Float32Array([pointLight.quadratic]), 1, program);
                }
            }else{
                this.fillShaderUniform("pointLightInScene", new Float32Array([0]), 1, program);
            }
            
            material.fragmentShaderUniforms.forEach(function(element){
                this.fillShaderUniform(element.uniform, element.value, element.dimension, program);
            }, this);

            if(mesh.verticesIndex){

                var indexBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.verticesIndex), this.gl.STATIC_DRAW);
                // draw geometry lines by indices
                this.gl.drawElements(this.gl.LINES, mesh.verticesIndex.length, this.gl.UNSIGNED_SHORT, indexBuffer);
            }else{
                // draw
                this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.verticesPositions.length / mesh.dimension /** Merci à mon frère Pierru-sama pour son aide sur le "/ mesh.dimension" :D */);
            }

        }, this);
    }

    /**
     * Get a program for this material
     * @param {String} fragmentShaderSource 
     * @param {String} vertexShaderSource  
     */
    getProgram(fragmentShaderSource, vertexShaderSource) {

        let program;

        this.programMaterials.forEach(function(programMaterial){
            if(programMaterial.fragmentShaderSource == fragmentShaderSource && programMaterial.vertexShaderSource == vertexShaderSource) {
                program = programMaterial.program;
            }
        }, this);

        return program;
    }                                
    /**
     * Create a new Program
     * @param {String} fragmentShaderSource 
     * @param {String} vertexShaderSource   
     */
    createProgram(fragmentShaderSource, vertexShaderSource){

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
        this.programMaterials.push({program, fragmentShaderSource, vertexShaderSource});

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

export class OrbitCamera extends Camera{
    constructor(args){
        super(args);

        this.position.z = -10.0;

        let down = false;

        window.addEventListener("mousemove", function(event){
            if(down){
                this.rotation.y += event.movementX * 0.5;
                this.rotation.x += event.movementY * 0.5;
            }
        }.bind(this));

        window.addEventListener("mousedown", function(){
            down = true;
        });

        window.addEventListener("mouseup", function(){
            down = false;
        });

        window.addEventListener("wheel", function(event){
            this.position.z += event.deltaY * -0.01
        }.bind(this));
    }

    /**
     * Transformation matrix
     * @return {Matrix4} Transformation matrix
     */
    get transform() {
        const transformationMatrix = new Matrix4().translated(this.position).rotated(this.rotation).scaled(this.scale);
        return transformationMatrix;
    }
}