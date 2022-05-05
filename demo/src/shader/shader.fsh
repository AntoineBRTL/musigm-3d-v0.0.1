precision mediump float;

struct DirectionalLight{
    float intensity;

    vec3 direction;
};

struct PointLight{
    float intensity;
};

uniform vec2 resolution;
uniform vec3 lightPosition;

uniform PointLight pointLights[1];

varying vec3 fragPosition;
varying vec3 fragNormal;

void main()
{
    // TODO : automatisate lightColor
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 objectColor = vec3(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 1.0);

    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    vec3 lightDirection = normalize(lightPosition - fragPosition);
    vec3 diffuse = abs(max(dot(fragNormal, lightDirection), 0.0)) * 0.5 * lightColor;

    vec3 result = (ambient + diffuse) * objectColor;
    gl_FragColor = vec4(result, 1.0);
}