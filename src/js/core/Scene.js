import { GameObject } from "./GameObject.js";

export class Scene{
    constructor(){

        /**
         * The gameObjects in the scene
         * @type {Array<GameObject>}
         */
        this.content = new Array();

        /**
         * Light on the scene
         * @type {Array<GameObject>}
         */
        this.lights = new Array();

        /**
         * Light on the scene
         * @type {Array<GameObject>}
         */
        this.directionLights = new Array();
    }

    /**
     * Add gameObject(s) to the scene
     * @param  {...GameObject} gameObjects 
     */
    add(...gameObjects){
        gameObjects.forEach(function(gameObject){
            this.content.push(gameObject);
            gameObject.scenesAttached.push(this);
            gameObject.loadComponentInScene(this);
        }, this);
    }
}