import { Vector3 } from "./Vector3.js";

/**
 * @extends {Array<number>}
 * 
 * This is not 100% my code, it use the lib gl-matrix.js
 * 
 */
export class Matrix4 extends Array{
    constructor(){
        super();

        this.length = 16;
    }

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
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param {Matrix4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Vector3} axis the axis to rotate around
     * @returns {Matrix4}
     */
    rotate(a, rad, axis) {
        let x = axis.x;
        let y = axis.y;
        let z = axis.z;

        let len = Math.hypot(x, y, z);

        let s, c, t;

        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;

        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;
    
        if (len < 0.000001) {
            return null;
        }
    
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
    
        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;
    
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
    
        // Construct the elements of the rotation matrix
        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;
    
        // Perform rotation-specific matrix multiplication
        this[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this[11] = a03 * b20 + a13 * b21 + a23 * b22;
    
        if (a !== this) {
            // If the source and destination differ, copy the unchanged last row
            this[12] = a[12];
            this[13] = a[13];
            this[14] = a[14];
            this[15] = a[15];
        }

        return this;
    }

    /**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {Matrix4} out
	 */
	perspective(fovy, aspect, near, far) {
	    let f = 1.0 / Math.tan(fovy / 2)
	    let nf = 1 / (near - far);

	    this[0] = f / aspect;
	    this[1] = 0;
	    this[2] = 0;
	    this[3] = 0;
	    this[4] = 0;
	    this[5] = f;
	    this[6] = 0;
	    this[7] = 0;
	    this[8] = 0;
	    this[9] = 0;
	    this[10] = (far + near) * nf;
	    this[11] = -1;
	    this[12] = 0;
	    this[13] = 0;
	    this[14] = (2 * far * near) * nf;
	    this[15] = 0;

	    return this;
	}

    /**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis
	 *
	 * @param {Vector3} eye Position of the viewer
	 * @param {Vector3} center Point the viewer is looking at
	 * @param {Vector3} up vec3 pointing up
	 * @returns {Matrix4} out
	 */
	lookAt(eye, center, up) {
	    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
	        eyex = eye.x,
	        eyey = eye.y,
	        eyez = eye.z,
	        upx = up.x,
	        upy = up.y,
	        upz = up.z,
	        centerx = center.x,
	        centery = center.y,
	        centerz = center.z;

	    if (Math.abs(eyex - centerx) < 0.000001 &&
	        Math.abs(eyey - centery) < 0.000001 &&
	        Math.abs(eyez - centerz) < 0.000001) {

	        return this.identity();
	    }

	    z0 = eyex - centerx;
	    z1 = eyey - centery;
	    z2 = eyez - centerz;

	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;

	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }

	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;

	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }

	    this[0] = x0;
	    this[1] = y0;
	    this[2] = z0;
	    this[3] = 0;
	    this[4] = x1;
	    this[5] = y1;
	    this[6] = z1;
	    this[7] = 0;
	    this[8] = x2;
	    this[9] = y2;
	    this[10] = z2;
	    this[11] = 0;
	    this[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	    this[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	    this[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	    this[15] = 1;

	    return this;
	}

    /**
     * Translate a mat4 by the given vector
     * @param {Vector3} vector vector to translate by
     * @returns {Matrix4} out
     */
    translate(vector) {
        let x = vector.x;
        let y = vector.y;
        let z = vector.z;
    
        this[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
        this[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
        this[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
        this[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
    
        return this;
    }

    /**
     * Scales the mat4 by the dimensions in the given vec3 not using vectorization
     *
     * @param {Vector3} vector the vec3 to scale the matrix by
     * @returns {Matrix4} out
     **/
    scale(vector) {
        let x = vector.x;
        let y = vector.y;
        let z = vector.z;
    
        this[0] *= x;
        this[1] *= x;
        this[2] *= x;
        this[3] *= x;
        this[4] *= y;
        this[5] *= y;
        this[6] *= y;
        this[7] *= y;
        this[8] *= z;
        this[9] *= z;
        this[10] *= z;
        this[11] *= z;

        return this;
    }
}