import { DEFAULT_FRAGMENT_SHADER_SOURCE } from "../Constant.js";
import { Vector3 } from "../math/Vector3.js";
import { Component } from "./Component.js";

export class Material extends Component {
    constructor(){
        super();

        /**
         * @type {String}
         */
        this.fragmentShaderSource = DEFAULT_FRAGMENT_SHADER_SOURCE;

        /**
         * @type {Array<Object>}
         */
        this.fragmentShaderAttributes = new Array();

        /**
         * @type {Array<Object>}
         */
        this.fragmentShaderUniforms = new Array();

        /**
         * @type {String}
         */
        this.shaderFooter = `
        void main() {
            vec3 color = material.color;
        
            color = computeLight(color);
            color = computeDepthColor(color);
            
            gl_FragColor = vec4(color, 1.0);
        }
        `;

        this.color = new Vector3(1.0, 1.0, 1.0);
    }

    addFragmentAttribute(attribute, value, dimension = 3) {

        let alreadyExist = false;

        this.fragmentShaderAttributes.forEach(function(element, i){
            if(element.attribute == attribute){
                this.fragmentShaderAttributes[i] = {
                    attribute: attribute,
                    value: value,
                    dimension: dimension
                }

                alreadyExist = true;
            }
        }, this);

        if(!alreadyExist){
            this.fragmentShaderAttributes.push({
                attribute: attribute,
                value: value,
                dimension: dimension
            });
        }
    }

    addFragmentUniform(uniform, value, dimension = 3) {
        let alreadyExist = false;

        this.fragmentShaderUniforms.forEach(function(element, i){
            if(element.uniform == uniform){

                this.fragmentShaderUniforms[i] = {
                    uniform: uniform,
                    value: value,
                    dimension: dimension
                }

                alreadyExist = true;
            }
        }, this);

        if(!alreadyExist){
            this.fragmentShaderUniforms.push({
                uniform: uniform,
                value: value,
                dimension: dimension
            });
        }
    }

    useShader(fragmentShaderSource){
        this.shaderFooter = fragmentShaderSource;
    }

    addShader(fragmentShaderSource){
        this.fragmentShaderSource += fragmentShaderSource; 
    }
}