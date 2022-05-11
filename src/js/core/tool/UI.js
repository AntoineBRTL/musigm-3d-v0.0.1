export class UI extends HTMLElement{
    constructor(){
        super();

        this.style.position = "absolute";
        document.body.appendChild(this);
    }
}