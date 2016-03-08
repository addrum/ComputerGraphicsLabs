#version 400 core 

// Structure for matrices
uniform struct Matrices
{
	mat4 projMatrix;
	mat4 modelViewMatrix; 
	mat3 normalMatrix;
} matrices;

struct LightInfo
{
	vec4 position;
	vec3 La;
	vec3 Ld;

	vec3 Ls;
	vec3 direction;
	float exponent;
	float cutoff;
};

struct MaterialInfo
{
	vec3 Ma;
	vec3 Md;
	vec3 Ms;
	float shininess;
};

uniform LightInfo light1; 
uniform MaterialInfo material1; 

in vec4 p;
in vec3 n;

out vec4 vOutputColour;

// This function implements the Phong shading model
// The code is based on the OpenGL 4.0 Shading Language Cookbook, pp. 67 - 68, with a few tweaks. 
// Please see Chapter 2 of the book for a detailed discussion.
vec3 PhongModel(vec4 p, vec3 n)
{
	vec3 s = normalize(vec3(light1.position - p));
	vec3 v = normalize(-p.xyz);
	vec3 r = reflect(-s, n);
	vec3 ambient = light1.La * material1.Ma;
	float sDotN = max(dot(s, n), 0.0);
	vec3 diffuse = light1.Ld * material1.Md * sDotN;
	vec3 specular = vec3(0.0);
	if (sDotN > 0.0)
		specular = light1.Ls * material1.Ms * pow(max(dot(r, v), 0.0), material1.shininess);
	
	return ambient + diffuse + specular;

}

vec3 BlinnPhongModel(vec4 p, vec3 n)
{
	vec3 s = normalize(vec3(light1.position - p));
	vec3 v = normalize(-p.xyz);
	vec3 r = reflect(-s, n);
	vec3 h = normalize(v + s);	vec3 ambient = light1.La * material1.Ma;
	float sDotN = max(dot(s, n), 0.0);
	vec3 diffuse = light1.Ld * material1.Md * sDotN;
	vec3 specular = vec3(0.0);
	if (sDotN > 0.0)
		specular = light1.Ls * material1.Ms * pow(max(dot(h, n), 0.0), material1.shininess);
	
	return ambient + diffuse + specular;

}

vec3 BlinnPhongSpotlightModel(vec4 p, vec3 n)
{
	vec3 s = normalize(vec3(light1.position - p));
	float angle = acos(dot(-s, light1.direction));
	float cutoff = radians(clamp(light1.cutoff, 0.0, 90.0));
	vec3 ambient = light1.La * material1.Ma;
	if (angle < cutoff) {
	float spotFactor = pow(dot(-s, light1.direction), light1.exponent);
	vec3 v = normalize(-p.xyz);
	vec3 h = normalize(v + s);
	float sDotN = max(dot(s, n), 0.0);
	vec3 diffuse = light1.Ld * material1.Md * sDotN;
	vec3 specular = vec3(0.0);
	if (sDotN > 0.0)
		specular = light1.Ls * material1.Ms * pow(max(dot(h, n), 0.0),
		material1.shininess);
		return ambient + spotFactor * (diffuse + specular);
	} else
		return ambient;
}

void main()
{	
	vec3 vColour = BlinnPhongSpotlightModel(p, normalize(n));
	vOutputColour = vec4(vColour, 1.0);
}

