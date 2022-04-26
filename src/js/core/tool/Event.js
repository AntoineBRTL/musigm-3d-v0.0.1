import { Input } from "./Input.js";

export function initEvent(){

    window.addEventListener("keydown", function(event){
        if(!event.repeat){
            Input.add(Input.KEY_DOWN, event.key);
        }else{
            Input.remove(Input.KEY_DOWN, event.key);
        }

        Input.add(Input.KEY_PRESSED, event.key);
    
        return;
    });

    window.addEventListener("keyup", function(event){
        Input.removeFromAllInput(event.key);

        Input.add(Input.KEY_UP, event.key);
        

        return;
    });

}