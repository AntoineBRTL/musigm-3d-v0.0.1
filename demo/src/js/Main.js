// this is where I test all the new fonctionalities
// WARNING shitty code here, only for test haha

import { Scene } from "../../../../musigm-3d-v0.0.1/src/js/core/Scene.js";
import { Camera } from "../../../../musigm-3d-v0.0.1/src/js/core/Camera.js";
import { Material } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Material.js";
import { Mesh } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Mesh.js";
import { GameObject } from "../../../../musigm-3d-v0.0.1/src/js/core/GameObject.js";
import { Input } from "../../../../musigm-3d-v0.0.1/src/js/core/tool/Input.js";
import { CUBE_MESH, THEPOT_MESH } from "../../../../musigm-3d-v0.0.1/src/js/core/Constant.js";
import { Utils } from "../../../../musigm-3d-v0.0.1/src/js/core/Utils.js";
import { Vector3 } from "../../../../musigm-3d-v0.0.1/src/js/core/math/Vector3.js";
import { Light } from "../../../src/js/core/component/Light.js";

export class Main{
    constructor(){
        // scene
        const scene = new Scene();

        // camera
        const camera = new Camera();

        Utils.readFile("./shader/shader.vsh", function(data){
            let vsh = data;
            Utils.readFile("./shader/shader.fsh", function(data){
                let fsh = data;

                // gameObjects
                let myObject = new GameObject();
                let mySecondObject = new GameObject();
                let lampTest = new GameObject();
                scene.add(myObject);
                //scene.add(mySecondObject);
                scene.add(lampTest);

                // mesh + material
                let myMesh = myObject.addComponent(Mesh);
                let myMaterial = myObject.addComponent(Material);
                myObject.addComponent(Light);

                mySecondObject.addExistingComponent(myMesh);
                mySecondObject.addExistingComponent(myMaterial);

                let myMesh2 = lampTest.addComponent(Mesh);
                lampTest.addComponent(Material);

                /*myMesh.vertices = [
                    -1.0, -1.0, 1.0,
                    1.0, -1.0, -1.0,
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0, 1.0,
                    1.0, -1.0, 1.0,
                    1.0, -1.0, -1.0
                ];*/
                /*myMesh.vertices = [];
                const terWidth = 100;
                const terHeight = 100;
                for (var x = 0; x < terWidth; x += 2){
                    for (var z = 0; z < terHeight; z += 2){
                        this.addVertice(myMesh, x, 0, z);
                    }
                }*/

                //myMesh.vertices = THEPOT_MESH;
                myMesh.computeNormal(false);
                myMesh.vertexShaderSource = vsh;
                myMaterial.fragmentShaderSource = fsh;

                //myMesh2.vertices = THEPOT_MESH;
                //myMesh2.computeNormal(false);
                
                myObject.scale.x = 1.0;
                myObject.scale.z = 1.0;
                myObject.scale.y = 1.0;
                /*myObject.position.x = -50;
                myObject.position.z = -50;*/
                //myObject.position.y = 2.0;
                //myObject.rotation.x = 180;
                // transformations
                camera.position.z = -10;
                camera.position.y = 1.5;
                lampTest.position = new Vector3(4.0, -2.0, 4.0);
                lampTest.rotation = new Vector3(0.0, 90.0, 0.0);

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
                    myMaterial.addFragmentUniform("lightPosition", new Float32Array([lampTest.position.x, lampTest.position.y, lampTest.position.z]), 3);

                    myObject.rotation.x += 0.5;
                    myObject.rotation.y += 0.5;

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


                    if(Input.getKeyPress("ArrowUp")){
                        lampTest.position = lampTest.position.added(Vector3.forward.scaled(0.1));
                    }

                    if(Input.getKeyPress("ArrowDown")){
                        lampTest.position = lampTest.position.added(Vector3.backward.scaled(0.1));
                    }

                    if(Input.getKeyPress("ArrowLeft")){
                        lampTest.position = lampTest.position.added(Vector3.left.scaled(0.1));
                    }

                    if(Input.getKeyPress("ArrowRight")){
                        lampTest.position = lampTest.position.added(Vector3.right.scaled(0.1));
                    }

                    camera.render(scene);

                    requestAnimationFrame(loop.bind(this));
                }
                loop();
            }.bind(this));
        }.bind(this));
    }

    addVertice(mesh, x, y, z){
        mesh.vertices.push(...[
            -1.0 + x, -1.0 + y, 1.0 + z,
            1.0 + x, -1.0 + y, -1.0 + z,
            -1.0 + x, -1.0 + y, -1.0 + z,
            -1.0 + x, -1.0 + y, 1.0 + z,
            1.0 + x, -1.0 + y, 1.0 + z,
            1.0 + x, -1.0 + y, -1.0 + z
        ]);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

new Main();