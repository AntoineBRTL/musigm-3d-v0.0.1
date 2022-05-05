# musigm-js

### What is this ? ####

I'm a young programmer how is learning at school.
I had an idea: create my own game engine to create my games, so I can say the game is 100% from me hahaha.

I'm glad I am able to show you my code.

Musigm is a 3D game engine exactly like THREE.js, but it's mine so it's better ;P.

### How to use musigm-js ? ###
Let's start doing our shit !

Create a simple .html file and a .js file :

index.html:
```html
<script type='module'>
    <!-- our code should be here -->
    <!-- but because I'm not a noob, let's create an other file -->
</script>
```

Main.js:
```javascript
// this is the best part ! 
// start by creating your Main class like this :

// these are the imports, vscode is making them by default so you don't have to worry about them :D
import { Scene } from "musigm-3d-v0.0.1/src/js/core/Scene.js";
import { Camera } from "musigm-3d-v0.0.1/src/js/core/Camera.js";
import { GameObject } from "musigm-3d-v0.0.1/src/js/core/GameObject.js";
import { Material } from "musigm-3d-v0.0.1/src/js/core/component/Material.js";
import { Mesh } from "musigm-3d-v0.0.1/src/js/core/component/Mesh.js";

export class Main{
    /**
     * Main class
     */
    constructor(){
        // create a scene
        const scene = new Scene();

        // create a camera
        const camera = new Camera();

        // create a gameObjects & add it the scene
        let myCube = new GameObject();
        scene.add(myCube);

        // add him a mesh and a material so we can render it
        let myMesh = myCube.addComponent(Mesh);
        let myMaterial = myCube.addComponent(Material);

        // apply shitty transformations to the object ahha
        camera.position.z = -10;
        myCube.rotation.y = 45;
        myCube.rotation.x = 45;
        
        function loop() {

            // other transformations so it looks nice 
            myCube.rotation.y += 0.5;
            myCube.rotation.x += 0.5;

            // ask the camera to render the scene
            camera.render(scene);

            requestAnimationFrame(loop.bind(this));
        }
        loop();
    }
}

```

#### Output ####
![alt text](./images/demo.PNG)

### FPS Demo ###

Main.js:
```javascript
import { Scene } from "musigm-3d-v0.0.1/src/js/core/Scene.js";
import { Camera } from "musigm-3d-v0.0.1/src/js/core/Camera.js";
import { Material } from "musigm-3d-v0.0.1/src/js/core/component/Material.js";
import { Mesh } from "musigm-3d-v0.0.1/src/js/core/component/Mesh.js";
import { GameObject } from "musigm-3d-v0.0.1/src/js/core/GameObject.js";
import { Input } from "musigm-3d-v0.0.1/src/js/core/tool/Input.js";

export class Main{
    constructor(){
        // scene
        const scene = new Scene();

        // camera
        const camera = new Camera();

        // gameObjects
        let myObject = new GameObject();
        scene.add(myObject);

        // mesh + material
        let myMesh = myObject.addComponent(Mesh);
        let myMaterial = myObject.addComponent(Material);

        // transformations
        camera.position.z = -10;
        myObject.rotation.y = 45;
        myObject.rotation.x = 45;

        // mouse event 
        // NB: the Input class does not support mouse events yet
        // Camera.lockCursor() take 1 argument which is the callback when the cursor is locked
        camera.lockCursor(function(){
            window.addEventListener("mousemove", function(event){
                camera.rotation.y += event.movementX * 0.1;
                camera.rotation.x += event.movementY * 0.1;
            });
        });
        
        const speed = 0.1;

        function loop() {

            myObject.rotation.y += 0.5;
            myObject.rotation.x += 0.5;

            // keyboard controls
            if(Input.getKeyPress("z")){
                camera.position = camera.position.added(camera.forward.scaled(speed));
            }

            if(Input.getKeyPress("s")){
                camera.position = camera.position.added(camera.forward.scaled(-speed));
            }

            if(Input.getKeyPress("d")){
                camera.position = camera.position.added(camera.right.scaled(speed));
            }

            if(Input.getKeyPress("q")){
                camera.position = camera.position.added(camera.right.scaled(-speed));
            }

            camera.render(scene);

            requestAnimationFrame(loop.bind(this));
        }
        loop();
    }
}

new Main();
```

### Advices ###
I strongly recommends you to use musigm to create small games for now, I'm still a beginner so my code is not 100% perfect and if something is marked as deprecaded, do not use it !

If you have any suggestions, please tell me and I would change the code :D.

### Patch Note ###
For those who are interested hehe, I'm working a lot on the default shaders, I making some lights for now : 
![alt text](./images/patch01.PNG)
![alt text](./images/patch02.gif)