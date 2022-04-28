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
    
    let moved = false;

    window.addEventListener("mousemove", function(event){
        moved = true;
        Input.MOUSE_MOVEMENT.x = event.movementX;
        Input.MOUSE_MOVEMENT.y = event.movementY;
    });

    movement();
    function movement(){
        if(!moved){
            Input.MOUSE_MOVEMENT.x = 0;
            Input.MOUSE_MOVEMENT.y = 0;
        }
        
        moved = false;

        requestAnimationFrame(movement);
 
    }
}