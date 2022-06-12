import { DEFAULT_FRAGMENT_SHADER_SOURCE } from "../Constant.js";
import { Component } from "./Component.js";

export class Material extends Component {
    constructor(){
        super();

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
        void main()
        {
            // TODO : automatisate lightColor
            vec3 objectColor = vec3(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 1.0);
            vec3 result = vec3(1.0, 1.0, 1.0);
            
            if(numberOfDirectionalLights > 0){
                for(int i = 0; i < 1; i++){
                    result *= computeDirectionalLight(directionalLight[i]);
                }
            }

            if(numberOfLights > 0){
                for(int i = 0; i < 10; i++){
                    vec3 computedLight = computeLight(light[i]);
                    if(computedLight.x > 0.0 || computedLight.y > 0.0 || computedLight.z > 0.0){
                        result += computedLight;
                    }
                    
                }
            }

            result = computeDepthColor(result);
            
            gl_FragColor = vec4(result, 1.0);
        }
        `;
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
}