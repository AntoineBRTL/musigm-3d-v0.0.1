import { Vector3 } from "./Vector3.js";

/**
 * @extends {Array<number>}
 */
export class Matrix4 extends Array{
    constructor(){
        super();

        this.length = 16;

        this.identity();
    }

    /**
     * Identity version of this matrix
     */
    get identity(){
        const Im = new Matrix4();

        Im[0] = 1;
        Im[1] = 0;
        Im[2] = 0;
        Im[3] = 0;

        Im[4] = 0;
        Im[5] = 1;
        Im[6] = 0;
        Im[7] = 0;

        Im[8] = 0; 
        Im[9] = 0;
        Im[10] = 1;
        Im[11] = 0;

        Im[12] = 0;
        Im[13] = 0;
        Im[14] = 0;
        Im[15] = 1;

        return Im;
    }

    /**
     * Do not use this, it may broke everything, use Matrix4.identity instead.
     * @returns 
     */
    identity(){

        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;

        this[4] = 0;
        this[5] = 1;
        this[6] = 0;
        this[7] = 0;

        this[8] = 0; 
        this[9] = 0;
        this[10] = 1;
        this[11] = 0;

        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;

        return this;
    }

    /**
     * Rotation matrix
     * @param {Vector3} vector 
     */
    rotated(vector) {
        const Rx = new Matrix4();
        Rx[ 5 ] = Math.cos(vector.x * Math.PI / 180);
        Rx[ 6 ] = -Math.sin(vector.x * Math.PI / 180);
        Rx[ 9 ] = Math.sin(vector.x * Math.PI / 180);
        Rx[10 ] = Math.cos(vector.x * Math.PI / 180);

        const Ry = new Matrix4();
        Ry[ 0 ] = Math.cos(vector.y * Math.PI / 180);
        Ry[ 2 ] = Math.sin(vector.y * Math.PI / 180);
        Ry[ 8 ] = -Math.sin(vector.y * Math.PI / 180);
        Ry[10 ] = Math.cos(vector.y * Math.PI / 180);

        const Rz = new Matrix4();
        Rz[ 0 ] = Math.cos(vector.z * Math.PI / 180);
        Rz[ 1 ] = -Math.sin(vector.z * Math.PI / 180);
        Rz[ 4 ] = Math.sin(vector.z * Math.PI / 180);
        Rz[ 5 ] = Math.cos(vector.z * Math.PI / 180);

        const Rm = this.product(Rz).product(Ry).product(Rx);
        // -> used by rotation
        //Rm[0] = this[0];
        //Rm[1] = this[1];
        //Rm[2] = this[2];
        Rm[3] = this[3];
        //Rm[4] = this[4];
        //Rm[5] = this[5];
        //Rm[6] = this[6];
        Rm[7] = this[7];
        //Rm[8] = this[8];
        //Rm[9] = this[9];
        //Rm[10] = this[10];
        Rm[11] = this[11];
        Rm[12] = this[12];
        Rm[13] = this[13];
        Rm[14] = this[14];
        Rm[15] = this[15];

        // multiply the 3 matrix
        return Rm;
    }

    /**
     * Scaling matrix
     * @param {Vector3} vector 
     */
    scaled(vector) {
        const Sm = new Matrix4();
        Sm[0] = this[0] * vector.x;
        Sm[1] = this[1] * vector.x;
        Sm[2] = this[2] * vector.x;
        Sm[3] = this[3] * vector.x;
        Sm[4] = this[4] * vector.y;
        Sm[5] = this[5] * vector.y;
        Sm[6] = this[6] * vector.y;
        Sm[7] = this[7] * vector.y;
        Sm[8] = this[8] * vector.z;
        Sm[9] = this[9] * vector.z;
        Sm[10] = this[10] * vector.z;
        Sm[11] = this[11] * vector.z;
        Sm[12] = this[12];
        Sm[13] = this[13];
        Sm[14] = this[14];
        Sm[15] = this[15];

        return Sm;
    }

    /**
     * Translating matrix
     * @param {Vector3} vector 
     */
    translated(vector){
        const Tm = new Matrix4();
        Tm[0] = this[0];
        Tm[1] = this[1];
        Tm[2] = this[2];
        Tm[3] = this[3];
        Tm[4] = this[4];
        Tm[5] = this[5];
        Tm[6] = this[6];
        Tm[7] = this[7];
        Tm[8] = this[8];
        Tm[9] = this[9];
        Tm[10] = this[10];
        Tm[11] = this[11];
        Tm[12] = this[0] * vector.x + this[4] * vector.y + this[8] * vector.z + this[12];
        Tm[13] = this[1] * vector.x + this[5] * vector.y + this[9] * vector.z + this[13];
        Tm[14] = this[2] * vector.x + this[6] * vector.y + this[10] * vector.z + this[14];
        Tm[15] = this[3] * vector.x + this[7] * vector.y + this[11] * vector.z + this[15];

        return Tm;
    }

    /**
     * 
     * @param {Matrix4} matrix 
     */
    product(matrix){

        const productMatrix = new Matrix4();
        productMatrix.identity();
        
        productMatrix[0] = this[0] * matrix[0] + this[1] * matrix[4] + this[2] * matrix[8] + this[3] * matrix[12];
        productMatrix[1] = this[0] * matrix[1] + this[1] * matrix[5] + this[2] * matrix[9] + this[3] * matrix[13];
        productMatrix[2] = this[0] * matrix[2] + this[1] * matrix[6] + this[2] * matrix[10] + this[3] * matrix[14];
        productMatrix[3] = this[0] * matrix[3] + this[1] * matrix[7] + this[2] * matrix[11] + this[3] * matrix[15];

        productMatrix[4] = this[4] * matrix[0] + this[5] * matrix[4] + this[6] * matrix[8] + this[7] * matrix[12];
        productMatrix[5] = this[4] * matrix[1] + this[5] * matrix[5] + this[6] * matrix[9] + this[7] * matrix[13];
        productMatrix[6] = this[4] * matrix[2] + this[5] * matrix[6] + this[6] * matrix[10] + this[7] * matrix[14];
        productMatrix[7] = this[4] * matrix[3] + this[5] * matrix[7] + this[6] * matrix[11] + this[7] * matrix[15];

        productMatrix[8] = this[8] * matrix[0] + this[9] * matrix[4] + this[10] * matrix[8] + this[11] * matrix[12];
        productMatrix[9] = this[8] * matrix[1] + this[9] * matrix[5] + this[10] * matrix[9] + this[11] * matrix[13];
        productMatrix[10] = this[8] * matrix[2] + this[9] * matrix[6] + this[10] * matrix[10] + this[11] * matrix[14];
        productMatrix[11] = this[8] * matrix[3] + this[9] * matrix[7] + this[10] * matrix[11] + this[11] * matrix[15];

        productMatrix[12] = this[12] * matrix[0] + this[13] * matrix[4] + this[14] * matrix[8] + this[15] * matrix[12];
        productMatrix[13] = this[12] * matrix[1] + this[13] * matrix[5] + this[14] * matrix[9] + this[15] * matrix[13];
        productMatrix[14] = this[12] * matrix[2] + this[13] * matrix[6] + this[14] * matrix[10] + this[15] * matrix[14];
        productMatrix[15] = this[12] * matrix[3] + this[13] * matrix[7] + this[14] * matrix[11] + this[15] * matrix[15];

        return productMatrix;
    }

    /**
	 * Perspective projection matrix
	 * @param {number} fovy 
	 * @param {number} aspect 
	 * @param {number} near 
	 * @param {number} far 
	 */
	perspective(fovy, aspect, near, far) {
        const Pm = new Matrix4();

	    let f = 1.0 / Math.tan(fovy / 2)
	    let nf = 1.0 / (near - far);

	    Pm[0] = -f / aspect;
	    Pm[1] = 0;
	    Pm[2] = 0;
	    Pm[3] = 0;
	    Pm[4] = 0;
	    Pm[5] = -f;
	    Pm[6] = 0;
	    Pm[7] = 0;
	    Pm[8] = 0;
	    Pm[9] = 0;
	    Pm[10] = (far + near) * nf;
	    Pm[11] = -1;
	    Pm[12] = 0;
	    Pm[13] = 0;
	    Pm[14] = (2 * far * near) * nf;
	    Pm[15] = 0;

	    return Pm;
	}
}