import { Scene } from "../../../../musigm-3d-v0.0.1/src/js/core/Scene.js";
import { Camera } from "../../../../musigm-3d-v0.0.1/src/js/core/Camera.js";
import { GameObject } from "../../../../musigm-3d-v0.0.1/src/js/core/GameObject.js";
import { DirectionLight } from "../../../src/js/core/component/DirectionLight.js";
import { Material } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Material.js";
import { Mesh } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Mesh.js";
import { Light } from "../../../src/js/core/component/Light.js";
import { DEFAULT_FRAGMENT_SHADER_SOURCE, DEFAULT_OLD_FRAGMENT_SHADER_SOURCE } from "../../../src/js/core/Constant.js";
import { Input } from "../../../../musigm-3d-v0.0.1/src/js/core/tool/Input.js";

export class Main{
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
        let material = cube.addComponent(Material);
        material.useShader(DEFAULT_FRAGMENT_SHADER_SOURCE);

        let light = new GameObject();
        let lightCompo = light.addComponent(Light);
        lightCompo.color = [0.0, 0.0, 1.0];
        light.addComponent(Mesh);
        light.addComponent(Material).useShader(DEFAULT_OLD_FRAGMENT_SHADER_SOURCE);
        light.scale = light.scale.scaled(0.2);

        light.position.x = 5;
        light.position.z = -5;
        light.position.y = -5;

        let light2 = new GameObject();
        let light2Compo = light2.addComponent(Light);
        light2Compo.color = [0.0, 0.0, 1.0];
        light2.addComponent(Mesh);
        light2.addComponent(Material).useShader(DEFAULT_OLD_FRAGMENT_SHADER_SOURCE);
        light2.scale = light2.scale.scaled(0.2);

        light2.position.x = -5;
        light2.position.z = 5;
        light2.position.y = -5;

        camera.lockCursor(function(){
            window.addEventListener("mousemove", function(event){
                camera.rotation.y += event.movementX * 0.1;
                camera.rotation.x += event.movementY * 0.1;
            });
        }.bind(this));
        
        // add all your objects to the scene
        scene.add(directionLight, cube, light, light2);

        const speed = 0.1;

        function loop() {

            // rotate the cube
            cube.rotation.x += 0.5;
            cube.rotation.y += 0.5;

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

            // render
            camera.render(scene);

            requestAnimationFrame(loop.bind(this));
        }
        loop();
    }
}

new Main();