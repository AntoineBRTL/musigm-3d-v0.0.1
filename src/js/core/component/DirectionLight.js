import { Component } from "./Component.js";

export class DirectionLight extends Component{
    constructor(){
        super();

        this.intensity = 1.0;
        this.color = [1.0, 1.0, 1.0];
        this.ambientStrength = 0.1;
    }
}