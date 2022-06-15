import { Mesh } from "../component/Mesh.js";
import { Utils } from "../Utils.js";

/**
 * A simple .obj loader
 */
export class OBJLoader{

    /**
     * Create a new Mesh using a .obj file
     * @param {String} path 
     * @param {Function} callback 
     */
    static load(path, callback){
        if(path.split(".").at(-1) != "obj"){
            throw new Error("File format not supported");
        }

        // read the file 
        Utils.readFile(path, function(objFileContent){

            let mesh = new Mesh();
            mesh.verticesPositions = new Array();
            mesh.verticesNormals = new Array();

            let geometryVerticesPositions = new Array();
            let geometryVerticesNormals = new Array();
            let geometryVerticesTextures = new Array();

            // read all the lines 
            let lines = objFileContent.split("\n");
            lines.forEach(function(line) {

                let splitedLine = line.replace("\r", "").split(" ");

                switch(splitedLine[0]){
                    case "v":

                        let vertexPosition = splitedLine.filter(function(element){
                            // remove the v
                            return element != "v";
                        });

                        geometryVerticesPositions.push(vertexPosition);

                        break; 

                    case "vn":

                        let vertexNormal = splitedLine.filter(function(element){
                            // remove the vn
                            return element != "vn";
                        });

                        geometryVerticesNormals.push(vertexNormal);

                        break; 

                    case "vt":

                        let vertexTexture = splitedLine.filter(function(element){
                            // remove the vt
                            return element != "vt";
                        });

                        geometryVerticesTextures.push(vertexTexture);

                        break; 

                    case "f":

                        let indicesList = splitedLine.filter(function(element){
                            return element != "f";
                        });

                        // f are quads, webgl support triangles
                        mesh.verticesPositions.push(...geometryVerticesPositions[indicesList[0].split("/")[0] - 1]);   // positions
                        mesh.verticesPositions.push(...geometryVerticesPositions[indicesList[1].split("/")[0] - 1]);   // positions
                        mesh.verticesPositions.push(...geometryVerticesPositions[indicesList[2].split("/")[0] - 1]);   // positions

                        mesh.verticesNormals.push(...geometryVerticesNormals[indicesList[0].split("/")[2] - 1]);   // normals
                        mesh.verticesNormals.push(...geometryVerticesNormals[indicesList[1].split("/")[2] - 1]);   // normals
                        mesh.verticesNormals.push(...geometryVerticesNormals[indicesList[2].split("/")[2] - 1]);   // normals

                        if(indicesList.length == 4){

                            mesh.verticesPositions.push(...geometryVerticesPositions[indicesList[2].split("/")[0] - 1]);   // positions
                            mesh.verticesPositions.push(...geometryVerticesPositions[indicesList[3].split("/")[0] - 1]);   // positions
                            mesh.verticesPositions.push(...geometryVerticesPositions[indicesList[0].split("/")[0] - 1]);   // positions

                            mesh.verticesNormals.push(...geometryVerticesNormals[indicesList[2].split("/")[2] - 1]);   // normals
                            mesh.verticesNormals.push(...geometryVerticesNormals[indicesList[3].split("/")[2] - 1]);   // normals
                            mesh.verticesNormals.push(...geometryVerticesNormals[indicesList[0].split("/")[2] - 1]);   // normals
                        }

                        break;
                }
            });

            callback(mesh);

        });
    }
}