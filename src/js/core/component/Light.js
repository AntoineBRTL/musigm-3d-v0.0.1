import { Component } from "./Component.js";

export class Light extends Component{
    constructor(){
        super();

        this.intensity = 2.0;
        this.color = [1.0, 1.0, 1.0];

        // basic settings
        this.constent = 1.0;
        this.linear = 0.022;
        this.quadratic = 0.0019;
    }
}