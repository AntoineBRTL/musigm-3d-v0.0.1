precision mediump float;

attribute vec3 coordinates;
attribute vec3 coordinatesNormal;

uniform mat4 mObject;
uniform mat4 mView;
uniform mat4 mProj;

varying vec3 fragNormal;
varying vec3 fragPosition;

void main()
{
   fragNormal = vec3(mObject * vec4(coordinatesNormal, 1.0));
   fragPosition = vec3(mObject * vec4(coordinates, 1.0));

   gl_Position = mProj * mView * mObject * vec4(coordinates, 1.0);
}