import { Scene } from "../../../../musigm-3d-v0.0.1/src/js/core/Scene.js";
import { Camera, OrbitCamera } from "../../../../musigm-3d-v0.0.1/src/js/core/Camera.js";
import { GameObject } from "../../../../musigm-3d-v0.0.1/src/js/core/GameObject.js";
import { DirectionLight } from "../../../src/js/core/component/DirectionLight.js";
import { Material } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Material.js";
import { Mesh } from "../../../../musigm-3d-v0.0.1/src/js/core/component/Mesh.js";
import { PointLight } from "../../../src/js/core/component/PointLight.js";
import { CUBE_MESH, DEFAULT_FRAGMENT_SHADER_SOURCE, DEFAULT_OLD_FRAGMENT_SHADER_SOURCE, PLANE_MESH, THEPOT_MESH } from "../../../src/js/core/Constant.js";
import { Input } from "../../../../musigm-3d-v0.0.1/src/js/core/tool/Input.js";
import { Vector3 } from "../../../src/js/core/math/Vector3.js";
import { GUI } from "./lib/datGUI/dat.gui.module.js";
import { Utils } from "../../../src/js/core/Utils.js";
import { OBJLoader } from "../../../src/js/core/tool/OBJLoader.js";

export class Main{
    constructor(){
        let scene = new Scene();
        let camera = new OrbitCamera();

        let object = new GameObject();
        object.rotation.z = 180.0;
        object.addComponent(Material);

        OBJLoader.load("./model/donnus.obj", function(mesh){

            object.addExistingComponent(mesh);
            object.scale = object.scale.scaled(1);

            scene.add(object, GameObject.generateDirectionLight());
            
            loop();

            function loop(){

                camera.render(scene);

                object.rotation.x += 0.1;
                object.rotation.z += 0.1;
                if(Input.getKeyPress("c")){
                    object.rotation.x = 0.0;
                    object.rotation.z = 0.0;
                }

                requestAnimationFrame(loop);
            }

        });
    }
}

new Main();