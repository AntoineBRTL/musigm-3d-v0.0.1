import { Vector3 } from "../math/Vector3.js";
import { initEvent } from "./Event.js";

export class Input{

    /**
     * @type {Array}
     */
    static KEY_PRESSED = new Array();

    /**
     * @type {Array}
     */
    static KEY_DOWN = new Array();

    /**
     * @type {Vector3}
     */
    static MOUSE_MOVEMENT = new Vector3();

    /**
     * @type {Array}
     */
    static KEY_UP = new Array();

    static getKeyPress(keyValue){
        return hasValue(Input.KEY_PRESSED, keyValue);
    }

    static getKeyDown(keyValue){
        return hasValue(Input.KEY_DOWN, keyValue);
    }

    static getKeyUp(keyValue){
        return hasValue(Input.KEY_UP, keyValue);
    }

    /**
     * @param {String} axisName 
     */
    static getAxis(axisName){
        if(axisName == "MouseX"){
            return Input.MOUSE_MOVEMENT.x;
        }

        if(axisName == "MouseY"){
            return Input.MOUSE_MOVEMENT.y;
        }
    }

    /**
     * 
     * @param {Array} array 
     * @param {String} key 
     */
    static add(array, keyValue){
        if(hasValue(array, keyValue)){
            return false;
        }

        array.push(keyValue);

        return true;
    }

    /**
     * 
     * @param {Array} array 
     * @param {String} key 
     */
    static remove(array, keyValue){
        if(!hasValue(array, keyValue)){
            return false;
        }

        array.splice(getValueIndex(array, keyValue), 1);

        return true;
    }

    /**
     * 
     * @param {Array} array 
     * @param {String} key 
     */
    static removeAll(array){

        if(array.length <= 0){
            return false;
        }

        array.splice(0, array.length);

        return true;
    }

    static removeFromAllInput(keyValue){
        Input.remove(Input.KEY_DOWN, keyValue);
        Input.remove(Input.KEY_PRESSED, keyValue);
        Input.removeAll(Input.KEY_UP);
    }
}

initEvent();

function hasValue(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i] == value){
            return true;
        }
    }

    return false;
}

function getValueIndex(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i] == value){
            return i;
        }
    }

    return;
}