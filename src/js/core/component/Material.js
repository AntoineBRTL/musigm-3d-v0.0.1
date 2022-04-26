import { DEFAULT_FRAGMENT__SHADER_SOURCE } from "../Constant.js";
import { Component } from "./Component.js";

export class Material extends Component {
    constructor(){
        super();

        this.fragmentShaderSource = DEFAULT_FRAGMENT__SHADER_SOURCE;

        /**
         * @type {Array<Object>}
         */
        this.fragmentShaderAttributes = new Array();

        /**
         * @type {Array<Object>}
         */
        this.fragmentShaderUniforms = new Array();
    }

    addFragmentAttribute(attribute, value, dimension = 3) {

        let alreadyExist = false;

        this.fragmentShaderAttributes.forEach(function(element){
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
            this.fragmentShaderAttributes.push({
                attribute: attribute,
                value: value,
                dimension: dimension
            });
        }
    }

    addFragmentUniform(uniform, value, dimension = 4) {
        let alreadyExist = false;

        this.fragmentShaderUniforms.forEach(function(element){
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
            this.fragmentShaderUniforms.push({
                uniform: uniform,
                value: value,
                dimension: dimension
            });
        }
    }
}