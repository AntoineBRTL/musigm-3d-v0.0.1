precision mediump float;

struct DirectionalLight{
    float intensity;
    vec3 color;
    float ambientStrength;
    vec3 direction;
};

uniform DirectionalLight directionalLight[1];

uniform vec2 resolution;
uniform vec3 lightPosition;

varying vec3 fragPosition;
varying vec3 fragNormal;

vec3 computeDirectionLight(DirectionalLight dirLight){
    vec3 ambient = dirLight.ambientStrength * dirLight.color;
    // max() -> no reversed colors
    vec3 diffuse = abs(max(dot(fragNormal, dirLight.direction), 0.0)) * dirLight.intensity * dirLight.color;

    return (ambient + diffuse);
}

void main()
{
    // TODO : automatisate lightColor
    //vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 objectColor = vec3(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 1.0);

    /*float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    vec3 lightDirection = normalize(lightPosition - fragPosition);
    vec3 diffuse = abs(max(dot(fragNormal, lightDirection), 0.0)) * 0.5 * lightColor;

    vec3 result = (ambient + diffuse) * objectColor;
    gl_FragColor = vec4(result, 1.0);*/
    vec3 result = objectColor;
    
    for(int i = 0; i < 1; i++){
        result *= computeDirectionLight(directionalLight[i]);
    }
    
    gl_FragColor = vec4(result, 1.0);
}