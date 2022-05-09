# musigm-js

### What is this ? ####

I'm a young programmer who is learning at school.
I had an idea: create my own game engine to create my games, so I can say the game is 100% from me hahaha.

I'm glad I am able to show you my code.

Musigm is a 3D game engine exactly like THREE.js, but it's mine so it's better ;P.

### How to use musigm-js ? ###
Let's start doing our shit !

Create a simple .html file and a .js file :

#### index.html: ####
```html
<script type='module'>
    <!-- our code should be here -->
    <!-- but because I'm not a noob, let's create an other file -->
</script>
```

#### Main.js: ####
```javascript
// this is the best part ! 
// start by creating your Main class like this :

// these are the imports, vscode is making them by default so you don't have to worry about them :D
import { Scene } from "../../../../musigm-3d-v0.0.1/src/js/core/Scene.js";
import { Camera } from "../../../../musigm-3d-v0.0.1/src/js/core/Camera.js";
import { GameObject } from "../../../../musigm-3d-v0.0.1/src/js/core/GameObject.js";
import { DirectionLight } from "../../../src/js/core/component/DirectionLight.js";
import { Material } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Material.js";
import { Mesh } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Mesh.js";

export class Main{
    /**
     * @Saumon-cru  
     */
    constructor(){
        // scene
        let scene = new Scene();

        // camera
        let camera = new Camera();
        camera.position.z = -10.0;

        // direction light
        let directionLight = new GameObject();
        directionLight.addComponent(DirectionLight);

        // cube
        let cube = new GameObject();
        cube.addComponent(Mesh);
        cube.addComponent(Material);
        
        // add all your objects to the scene
        scene.add(directionLight, cube);

        function loop() {

            // rotate the cube
            cube.rotation.x += 0.5;
            cube.rotation.y += 0.5;

            // render
            camera.render(scene);

            requestAnimationFrame(loop.bind(this));
        }
        loop();
    }
}

new Main();
```


#### Output ####
![alt text](./images/demo.gif)

### Patch Note ###

--------------------------------------------------------------------------------------------------------------------------------

#### 09/05/2022 ####
Yo ! Finally, there is one more light. 

![alt text](./images/patch03.gif)

So to be clear, there is two lights that you can use :

#### Main.js: ####
```javascript
let light = new GameObject();
light.addComponent(Light);

let directionLight = new GameObject();
directionLight.addComponent(DirectionLight);

myScene.add(light, directionLight);
```

Of course, you can simply create a scene without any lights so there will be no shadows etc...
For this new light, I've created 3 more parameters : 

```javascript
Light.constant;
Light.linear;
Light.quadratic;
```

These are used to calculate the attenuation of the light :

```javascript
// d = distance between the pixel and the center of the light
A = 1.0 / (Light.constant + Light.linear * d + Light.quadratic * (d ** 2));
```

Next update will be about shadows I think :D ! 

--------------------------------------------------------------------------------------------------------------------------------

#### 07/05/2022 ####
New types of lights (directional lights). The defaults shaders are now the ones with the light implementation !
By the way I re wrote the tutorial, there is no more the FPS demo but maybe I will re-write it in the future :D.

I made something cool with scenes and gameObjects, when you link a GameObject with any Scene, you can find that Scene in the current GameObject using GameObject.scenesAttached;

#### Main.js: ####
```javascript
let myScene = new Scene();
let myGameObject = new GameObject();

myScene.add(myGameObject);

console.log(myScene == myGameObject.scenesAttached[0]);
```
#### Output ####
```javascript
true
```

Scene is no more a GameObject, this was an error of mine ahhahah

For the next update, there will be more lights and I hope I will be able to implement cast shadows ...

--------------------------------------------------------------------------------------------------------------------------------

#### 05/05/2022 ####
For those who are interested hehe, I'm working a lot on the default shaders, I making some lights for now : 

![alt text](./images/patch02.gif)

I'm getting this light effect by calculating the dot product between the vector "light to face" and the normal from this same faces.
The problem I have is that my normals are not well calculated so the result is not really good.
