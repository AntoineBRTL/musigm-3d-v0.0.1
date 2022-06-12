import { Scene } from "../../../../musigm-3d-v0.0.1/src/js/core/Scene.js";
import { Camera } from "../../../../musigm-3d-v0.0.1/src/js/core/Camera.js";
import { GameObject } from "../../../../musigm-3d-v0.0.1/src/js/core/GameObject.js";
import { DirectionLight } from "../../../src/js/core/component/DirectionLight.js";
import { Material } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Material.js";
import { Mesh } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Mesh.js";
import { Light } from "../../../src/js/core/component/Light.js";
import { CUBE_MESH, DEFAULT_FRAGMENT_SHADER_SOURCE, DEFAULT_OLD_FRAGMENT_SHADER_SOURCE, PLANE_MESH, THEPOT_MESH } from "../../../src/js/core/Constant.js";
import { Input } from "../../../../musigm-3d-v0.0.1/src/js/core/tool/Input.js";
import { Vector3 } from "../../../src/js/core/math/Vector3.js";

export class DeprecatedMain{
    constructor(){
        // scene
        let scene = new Scene();

        // camera
        let camera = new Camera();
        camera.position.z = -10.0;
        camera.position.y = 10;

        // direction light
        let directionLight = new GameObject();
        directionLight.addComponent(DirectionLight);

        // cube
        let cube = new GameObject();
        let mesh = cube.addComponent(Mesh);
        let material = cube.addComponent(Material);
        material.useShader(DEFAULT_FRAGMENT_SHADER_SOURCE);

        mesh.vertices = [
            -1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, -1.0, -1.0
        ].reverse();

        mesh.computeFlatShadingNormals();
        cube.scale.x = 10.0;
        cube.scale.z = 10.0;
        cube.position.y = -3.0;

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
        light2Compo.color = [1.0, 0.0, 0.0];
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

        window.addEventListener("wheel", function(event){
            cube.position.y -= event.wheelDelta * 0.01;
        });
        
        // add all your objects to the scene
        scene.add(directionLight, cube, light);

        const speed = 0.1;
        function loop() {

            // rotate the cube
            /*cube.rotation.x += 0.5;
            cube.rotation.y += 0.5;*/

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

            if(Input.getKeyPress("Shift")){
                camera.position = camera.position.added(Vector3.down.scaled(speed));
            }

            if(Input.getKeyPress(" ")){
                camera.position = camera.position.added(Vector3.up.scaled(speed));
            }

            // render
            camera.render(scene);

            requestAnimationFrame(loop.bind(this));
        }
        loop();
    }
}

export class Main{
    constructor(){
        let scene = new Scene();

        let camera = new Camera();
        camera.position.z = -20.0;
        camera.position.y = 10.0;

        let object1 = new GameObject();
        object1.scale.x = 1000.0;
        object1.scale.z = 1000.0;

        let cube = new GameObject();
        cube.position.y = -2.0;

        let light = new GameObject();

        let mat = object1.addComponent(Material);
        let mesh = object1.addComponent(Mesh);
        cube.addComponent(Material);
        cube.addComponent(Mesh);

        light.addComponent(DirectionLight);

        mesh.vertices = PLANE_MESH;
        mesh.computeFlatShadingNormals();
        // TODO: auto compute normals

        scene.add(object1, cube, light);

        let loopIndex = 0;

        loop();
        function loop(){

            camera.render(scene);

            cube.rotation.x -= Math.sin(loopIndex) * 10.0;
            cube.rotation.y += Math.sin(loopIndex) * 10.0;

            cube.position.y = Math.sin(loopIndex) * 2.0 - 10.0;

            loopIndex += 0.05;

            requestAnimationFrame(loop);
        }
    }
}

new Main();