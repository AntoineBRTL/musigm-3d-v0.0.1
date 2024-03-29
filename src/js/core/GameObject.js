import { Component } from "./component/Component.js";
import { Matrix4 } from "./math/Matrix4.js";
import { Vector3 } from "./math/Vector3.js";

/// COMPONENTS ///
import { Material } from "./component/Material.js";
import { Mesh } from "./component/Mesh.js";
import { Scene } from "./Scene.js";
import { PointLight } from "./component/PointLight.js";
import { DirectionLight } from "./component/DirectionLight.js";

export class GameObject{
    /**
     * 
     * @param {Object} args 
     */
    constructor(args){
        if(!args){
            args = new Object();
        }

        /**
         * @type {Array<Component>}
         */
        this.behaviors = new Array();

        /**
         * @type {Vector3}
         */
        this.position = new Vector3() || args.position;

        /**
         * @type {Vector3}
         */
        this.rotation = new Vector3() || args.rotation;

        /**
         * @type {Vector3}
         */
        this.scale = new Vector3(1, 1, 1) || args.scale;

        /**
         * @type {String}
         */
        this.name = "new GameObject" || args.name;

        /**
         * @type {String}
         */
        this.tag = "default" || args.tag;

        /**
         * @type {String}
         */
        this.layer = "default" || args.layer;
        
        /**
         * @type {Array<Scene>}
         */
        this.scenesAttached = new Array();
    }

    /**
     * 
     * @param {Scene} scene 
     */
    loadComponentInScene(scene){
        this.behaviors.forEach(function(behavior){
            if(behavior.constructor.name == DirectionLight.name){
                scene.directionLights.push(this);
            }

            if(behavior.constructor.name == PointLight.name){
                scene.pointLights.push(this);
            }
        }, this);
    }

    /**
     * Transformation matrix
     * @return {Matrix4} Transformation matrix
     */
    get transform() {
        const transformationMatrix = new Matrix4().translated(this.position).rotated(this.rotation).scaled(this.scale);
        return transformationMatrix;
    }

    /**
     * Forward normalized vector
     * @return {Vector3} Forward vect
     */
    get forward(){
        return new Vector3(
            Math.cos(this.rotation.z * Math.PI / 180) * Math.sin(this.rotation.y * Math.PI / 180),
            -Math.sin(this.rotation.z * Math.PI / 180),
            Math.cos(this.rotation.z * Math.PI / 180) * Math.cos(this.rotation.y * Math.PI / 180) 
        );
    }

    /**
     * Right normalized vector
     * @return {Vector3} Right vect 
     */
    get right(){
        return new Vector3(
            Math.cos(this.rotation.y * Math.PI / 180),
            0,
            -Math.sin(this.rotation.y * Math.PI / 180)
        );
    }

    /**
     * Up normalized vector
     * @return {Vector3} Up vect 
     */
    get up(){
        return this.forward.cross(this.right);
    }

    /**
     * @param {Function} component 
     * @return {Material | Mesh | PointLight | DirectionLight }
     */
    addComponent(component){

        // TODO: remove eval();
        const comp = eval("new " + component.name + "();");
        this.behaviors.push(comp);

        // Specials comps TODO : automatisate
        if(component == PointLight){
            this.scenesAttached.forEach(function(scene){
                scene.pointLights.push(this);
            }, this);
        }

        if(component == DirectionLight){
            this.scenesAttached.forEach(function(scene){
                scene.directionLights.push(this);
            }, this);
        }

        return comp;
    }

    /**
     * Add a component to the gameObject, use GameObject.addComponent() if you want to add a new component
     * @param {Component} component 
     */
    addExistingComponent(component){
        this.behaviors.push(component);
        return component;
    }

    /**
     * Return a component to the game object
     * @param {Function} component 
     * @return {Material | Mesh | PointLight | DirectionLight }
     */
    getComponent(component){
        for(let i = 0; i < this.behaviors.length; i++){
            if(this.behaviors[i].constructor.name == component.name){
                return this.behaviors[i];
            }
        }
    }

    /**
     * Return if a game object has the specified component
     * @param {Function} component 
     */
    hasComponent(component){
        for(let i = 0; i < this.behaviors.length; i++){
            if(this.behaviors[i].constructor.name == component.name){
                return true;
            }
        }

        return false;
    }

    /**
     * Get all the gameObjects with the given tag
     * @param {String} tag 
     * @param {Scene} scene 
     * @return {Array<GameObject>} 
     */
    static findGameObjectsWithTagInScene(tag, scene) {

        /**
         * @type {Array<GameObject>}
         */
        const gameObjects = new Array();

        scene.content.forEach(function(gameObject) {
            if(gameObject.tag == tag){
                gameObjects.push(gameObject);
            }
        });

        return gameObjects;
    }

    /**
     * Get all the gameObjects with the given name
     * @param {String} name 
     * @param {Scene} scene 
     * @return {Array<GameObject>} 
     */
    static findGameObjectsWithNameInScene(name, scene) {

        /**
         * @type {Array<GameObject>}
         */
        const gameObjects = new Array();

        scene.content.forEach(function(gameObject) {
            if(gameObject.name == name){
                gameObjects.push(gameObject);
            }
        });

        return gameObjects;
    }

    static generateDirectionLight(){
        let directionLight = new GameObject();
        directionLight.addComponent(DirectionLight);

        return directionLight;
    }
}