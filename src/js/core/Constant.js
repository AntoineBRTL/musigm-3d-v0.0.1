export const DEFAULT_VERTEX_SHADER_SOURCE = [
'precision mediump float;',
'',
'attribute vec3 coordinates;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'   gl_Position = mProj * mView * mWorld * vec4(coordinates, 1.0);',
'}'
].join('\n');

export const DEFAULT_FRAGMENT__SHADER_SOURCE = [
'precision mediump float;',
'uniform vec2 resolution;',
'',
'void main()',
'{',
'   gl_FragColor = vec4(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 1.0, 1.0);',
'}'
].join('\n');

export const CUBE_MESH = [
    // Top
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Left
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,

    // Right
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,

    // Front
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,

    // Bottom
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, -1.0, -1.0
];