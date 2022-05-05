import { Matrix4 } from "./Matrix4.js";

export class Vector3{
    constructor(x = 0, y = 0, z = 0){
        this.x = x; this.y = y; this.z = z;
    }

    /**
     * Length of a vector
     * @returns {number}
     */
     get magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * A vector of manitude belonging to ]0, 1[
     * @returns {Vector3}
     */
    get normalized(){
        return new Vector3(this.x / this.magnitude, this.y / this.magnitude, this.z / this.magnitude);
    }

    /**
     * Additionate two vectors
     * @param {Vector3} vector 
     * @returns {Vector3}
     */
    added(vector) {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    /**
     * Subtract two vectors
     * @param {Vector3} vector 
     * @returns {Vector3}
     */
    subed(vector) {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    /**
     * Multiply a vector with a number
     * @param {number} number 
     * @returns {Vector3}
     */
    scaled(number) {
        return new Vector3(this.x * number, this.y * number, this.z * number);
    }

    /**
     * 
     * @param {Vector3} vector 
     * @returns {number}
     */
    scalar(vector){
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    /**
     * return the angle between 2 vectors
     * @param {Vector3} vector
     * @returns {number} 
     */
    getAngle(vector){

        //console.log(this.manitude);
        return Math.acos(this.scalar(vector) / (this.magnitude * vector.magnitude));
    }

    /**
     * vectorial manitude 
     * @param {Vector3} vector 
     * @returns {number}
     */
    vectorialManitude(vector){
        return vector.magnitude * this.magnitude * Math.sin(this.getAngle(vector));
    }

    /**
     * Cross product of two Vectors
     *
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    cross(vector) {
        return new Vector3(
            this.y * vector.z - this.z * vector.y, 
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }

    /**
     * Vector translation
     * @param {Matrix4} matrix 
     * @returns {Vector3}
     */
    translate(matrix){
        let transformedVector = Vector3.clone(this);

        transformedVector.x = matrix[0] * this.x + matrix[1] * this.y + matrix[2] * this.z;
        transformedVector.y = matrix[4] * this.x + matrix[5] * this.y + matrix[6] * this.z;
        transformedVector.y = matrix[8] * this.x + matrix[9] * this.y + matrix[10] * this.z;

        return transformedVector;
    }

    /**
     * Euclidean distance between two vectors
     * @param {Vector3} vector 
     * @returns {Vector3}
     */
    distance(vector){
        return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2 + (this.z - vector.z) ** 2);
    }

    isZero(){
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    /**
     * shortcut for : new Vector(0, 0)
     * @returns {Vector3}
     */
    static get zero() {
        return new Vector3(0, 0, 0);
    }

    /**
     * shortcut for : new Vector(0, 1)
     * @returns {Vector3}
     */
    static get up() {
        return new Vector3(0, 1, 0);
    }

    /**
     * shortcut for : new Vector(0, -1)
     * @returns {Vector3}
     */
    static get down() {
        return new Vector3(0, -1, 0);
    }

    /**
     * shortcut for : new Vector(1, 0)
     * @returns {Vector3}
     */
    static get right() {
        return new Vector3(1, 0, 0);
    }

    /**
     * shortcut for : new Vector(-1, 0)
     * @returns {Vector3}
     */
    static get left() {
        return new Vector3(-1, 0, 0);
    }

    /**
     * shortcut for : new Vector(0, 0, 1)
     * @returns {Vector3}
     */
     static get forward() {
        return new Vector3(0, 0, 1);
    }

    /**
     * shortcut for : new Vector(0, 0, -1)
     * @returns {Vector3}
     */
    static get backward() {
        return new Vector3(0, 0, -1);
    }

    /**
     * 
     * @param {Vector3} vector 
     */
    static clone(vector) {
        return new Vector3(vector.x, vector.y, vector.z); 
    }
}