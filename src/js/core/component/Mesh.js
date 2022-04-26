import { CUBE_MESH, DEFAULT_VERTEX_SHADER_SOURCE } from "../Constant.js";
import { Component } from "./Component.js";

export class Mesh extends Component{
    constructor(){

        super();

        /**
         * @type {Array<number>}
         */
        this.vertices = CUBE_MESH;

        /**
         * @type {Array<Object>}
         */
        this.vertexShaderAttributes = new Array();

        /**
         * @type {Array<Object>}
         */
        this.vertexShaderUniforms = new Array();

        /**
         * @type {String}
         */
        this.vertexShaderSource = DEFAULT_VERTEX_SHADER_SOURCE;

        /**
         * @type {String}
         */
        this.vertexShaderAttributeCoordinatesName = "coordinates";

        /**
         * @type {String}
         */
        this.vertexShaderUniformWorldMatrixName = "mWorld";

        /**
         * @type {String}
         */
        this.vertexShaderUniformViewMatrixName = "mView";

        /**
         * @type {String}
         */
        this.vertexShaderUniformProjectionMatrixName = "mProj";
    }

    addVertexAttribute(attribute, value, dimension = 3) {
        let alreadyExist = false;

        this.vertexShaderAttributes.forEach(function(element){
            if(element.attribute = attribute){
                element = {
                    attribute: attribute,
                    value: value,
                    dimension: dimension
                }

                alreadyExist = true;
            }
        }, this);

        if(!alreadyExist){
            this.vertexShaderAttributes.push({
                attribute: attribute,
                value: value,
                dimension: dimension
            });
        }
    }

    addVertexUniform(uniform, value, dimension = 4) {
        let alreadyExist = false;

        this.vertexShaderUniforms.forEach(function(element){
            if(element.uniform = uniform){
                element = {
                    uniform: uniform,
                    value: value,
                    dimension: dimension
                }

                alreadyExist = true;
            }
        }, this);

        if(!alreadyExist){
            this.vertexShaderUniforms.push({
                uniform: uniform,
                value: value,
                dimension: dimension
            });
        }
    }
}