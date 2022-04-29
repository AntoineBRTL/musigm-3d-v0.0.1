import { CUBE_MESH, DEFAULT_VERTEX_SHADER_SOURCE } from "../Constant.js";
import { Vector3 } from "../math/Vector3.js";
import { Component } from "./Component.js";

export class Mesh extends Component{
    constructor(){

        super();

        /**
         * @type {Array<number>}
         */
        this.vertices = CUBE_MESH;

        /**
         * @type {number}
         */
        this.dimension = 3;

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

    get normalVertices(){

        let normalVertices = new Array();

        for(var i = 0; i < this.vertices.length; i += 3){

            const P1x = this.vertices[i];
            const P1y = this.vertices[(i + 1) % this.vertices.length];
            const P1z = this.vertices[(i + 2) % this.vertices.length];

            const P2x = this.vertices[(i + 3) % this.vertices.length];
            const P2y = this.vertices[(i + 4) % this.vertices.length];
            const P2z = this.vertices[(i + 5) % this.vertices.length];

            const P3x = this.vertices[(i + 6) % this.vertices.length];
            const P3y = this.vertices[(i + 7) % this.vertices.length];
            const P3z = this.vertices[(i + 8) % this.vertices.length];

            const A = new Vector3(P2x - P1x, P2y - P1y, P2z - P1z);
            const B = new Vector3(P3x - P2x, P3y - P2y, P3z - P2z);

            const cross = A.cross(B);

            normalVertices.push(...[cross.x, cross.y, cross.z]);
        }

        return normalVertices;
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