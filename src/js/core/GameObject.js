import { Component } from "./component/Component.js";
import { Matrix4 } from "./math/Matrix4.js";
import { Vector3 } from "./math/Vector3.js";

/// COMPONENTS ///
import { Material } from "./component/Material.js";
import { Mesh } from "./component/Mesh.js";

export class GameObject{
    constructor(){

        /**
         * @type {Array<Component>}
         */
        this.behaviors = new Array();

        /**
         * @type {Vector3}
         */
        this.position = new Vector3();

        /**
         * @type {Vector3}
         */
        this.rotation = new Vector3();

        /**
         * @type {Vector3}
         */
        this.scale = new Vector3(1, 1, 1);
    }

    /**
     * Transformation matrix
     * @return {Matrix3} Transformation matrix
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
            Math.cos(this.rotation.z * Math.PI / 180) * Math.sin(-this.rotation.y * Math.PI / 180),
            Math.sin(this.rotation.z * Math.PI / 180),
            Math.cos(this.rotation.z * Math.PI / 180) * Math.cos(-this.rotation.y * Math.PI / 180) 
        ).normalized;
    }

    /**
     * Right normalized vector
     * @return {Vector3} Right vect 
     */
    get right(){
        return new Vector3(
            Math.cos(-this.rotation.y * Math.PI / 180),
            0,
            -Math.sin(-this.rotation.y * Math.PI / 180)
        ).scaled(-1.0).normalized;
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
     * @return {Material | Mesh }
     */
    addComponent(component){
        const comp = eval("new " + component.name + "();");
        this.behaviors.push(comp);
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
     */
    getComponent(component){

        let componentToReturn;

        this.behaviors.forEach(function(comp){
            if(comp.constructor.name == component.name){
                componentToReturn = comp;
                return;
            }
        });

        return componentToReturn;
    }

    /**
     * Return if a game object has the specified component
     * @param {Function} component 
     */
    hasComponent(component){

        let has = false;

        this.behaviors.forEach(function(comp){
            if(comp.constructor.name == component.name){
                has = true;
            }
        }, this);

        return has;
    }
}