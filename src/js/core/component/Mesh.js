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
        this.vertexShaderUniformObjectMatrixName = "mObject";

        /**
         * @type {String}
         */
        this.vertexShaderUniformViewMatrixName = "mView";

        /**
         * @type {String}
         */
        this.vertexShaderUniformProjectionMatrixName = "mProj";

        /**
         * @type {Array<number>}
         */
        this.normalVertices = new Array();

        this.computeNormal(false);
    }

    computeNormal(smoothShading = true){

        let trianglesNormal;
        let verticesNormal;

        // compute triangle normals

        trianglesNormal = new Array();

        for(let i = 0; i < this.vertices.length; i+= this.dimension * 3){
            const A = new Vector3(this.vertices[i + 0], this.vertices[i + 1], this.vertices[i + 2]);
            const B = new Vector3(this.vertices[i + 3], this.vertices[i + 4], this.vertices[i + 5]);
            const C = new Vector3(this.vertices[i + 6], this.vertices[i + 7], this.vertices[i + 8]);

            const AB = new Vector3(B.x - A.x, B.y - A.y, B.z - A.z);
            const AC = new Vector3(C.x - A.x, C.y - A.y, C.z - A.z);

            const pmid = new Vector3((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3, (A.z + B.z + C.z) / 3).normalized;
            const centroid = new Vector3(0, 0, 0);

            let N = AB.cross(AC).normalized;

            // facing normal
            /*let distanceCentroid = pmid.subed(centroid).magnitude;
            let distanceNormal = pmid.added(N).scaled(distanceCentroid).subed(centroid).magnitude;

            if(distanceCentroid < distanceNormal){
                N = N.scaled(-1).normalized;
            }*/


            if(pmid.subed(centroid).scalar(N) < 0){
                N = N.scaled(-1).normalized;
            }

            for (let j = 0; j < this.dimension; j++) {
                trianglesNormal.push(...[N.x, N.y, N.z]);
            }
        }

        if(!smoothShading){
            this.normalVertices = trianglesNormal;
            return;
        }
        // compute vertices normal   
        verticesNormal = new Array();
        
        for (let i = 0; i < this.vertices.length; i += this.dimension) {
            let vertex = new Vector3(
                this.vertices[i], this.vertices[(i + 1) % this.vertices.length], this.vertices[(i + 2) % this.vertices.length]
            );

            let attachedTriangles = this.getAttachedTrianglesIndices(vertex);

            let vertexNormal = new Vector3();

            for (let j = 0; j < attachedTriangles.length; j += this.dimension){
                let curentTriangleNormal = new Vector3(trianglesNormal[attachedTriangles[j]], trianglesNormal[attachedTriangles[j + 1]], trianglesNormal[attachedTriangles[j + 2]]);
                vertexNormal = vertexNormal.added(curentTriangleNormal).normalized;
            }

            vertexNormal = vertexNormal.normalized;

            verticesNormal.push(...[vertexNormal.x, vertexNormal.y, vertexNormal.z]);
        }

        this.normalVertices = verticesNormal;
    }

    /**
     * @param {Vector3} vertex 
     */
    getAttachedTrianglesIndices(vertex){

        let triangles = new Array();

        for(let i = 0; i < this.vertices.length; i += this.dimension * 3 /** triangle */){

            // check if you have the same point in the current triangle
            let triangle = new Array();
            triangle.push(new Vector3(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]));
            triangle.push(new Vector3(this.vertices[i + 3], this.vertices[i + 4], this.vertices[i + 5]));
            triangle.push(new Vector3(this.vertices[i + 6], this.vertices[i + 7], this.vertices[i + 8]));

            for(let j = 0; j < 3; j++){
                if(vertex.subed(triangle[j]).isZero()){
                    triangles.push(
                        ...[
                            i, i + 1, i + 2
                        ]
                    );

                    break;
                }
            }
        }

        return triangles;
    }

    addVertexAttribute(attribute, value, dimension = 3) {
        let alreadyExist = false;

        this.vertexShaderAttributes.forEach(function(element, i){
            if(element.attribute == attribute){
                this.vertexShaderAttributes[i] = {
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

        this.vertexShaderUniforms.forEach(function(element, i){
            if(element.uniform == uniform){
                this.vertexShaderUniforms[i] = {
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