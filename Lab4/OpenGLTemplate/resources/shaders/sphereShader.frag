#version 400 core

in vec3 vColour;			// Note: colour is smoothly interpolated (default)
in float fIntensity;
out vec4 vOutputColour;
uniform int iLevel;
int iL;

void main()
{	
	iL = 3;
	//vOutputColour = vec4(vColour, 1.0);
	vec3 quantisedColour = floor(vColour * iLevel) / iLevel;
	vOutputColour = vec4(quantisedColour, 0.5);
}
