import { Vector3 } from "../math/Vector3.js";
import { Component } from "./Component.js";

export class DirectionLight extends Component{
    constructor(){
        super();

        this.intensity = 1.0;
        this.color = Vector3.white;
        this.ambientStrength = 0.3;
    }
}