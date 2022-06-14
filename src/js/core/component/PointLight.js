import { Vector3 } from "../math/Vector3.js";
import { Component } from "./Component.js";

export class PointLight extends Component{
    constructor(){
        super();

        this.intensity = 1.0;
        this.color = Vector3.white;

        // basic settings
        this.constent = 1.0;
        this.linear = 0.022;
        this.quadratic = 0.0019;
    }
}