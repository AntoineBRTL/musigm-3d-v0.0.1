import { GameObject } from "./GameObject.js";

export class Scene extends GameObject{
    constructor(){
        super();
        
        /**
         * The gameObjects in the scene
         * @type {Array<GameObject>}
         */
        this.content = new Array();
    }

    /**
     * Add gameObject(s) to the scene
     * @param  {...GameObject} gameObjects 
     */
    add(...gameObjects){
        gameObjects.forEach(function(gameObject){
            this.content.push(gameObject);
        }, this);
    }
}