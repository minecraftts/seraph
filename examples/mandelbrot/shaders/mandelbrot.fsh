#version 330 core

/*
* https://gpfault.net/posts/mandelbrot-webgl.txt.html was used as a reference for most of this
*/

out vec4 frag_color;

uniform vec2 u_resolution;
uniform vec2 u_zoom_center;
uniform float u_zoom;

vec2 f(vec2 z, vec2 c) {
    return mat2(z, -z.y, z.x) * z + c;
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xx;
  
    vec2 c = u_zoom_center + (uv * 4.0 - vec2(2.0)) * (u_zoom / 4.0);
  
    vec2 z = vec2(0.0);
    bool escaped = false;

    int iterations = 0;
    
    for (int i = 0; i < 100; i++) {
        z = f(z, c);

        if (length(z) > 2.0) {
            escaped = true;
            break;
        }

        iterations++;
    }

    frag_color = escaped ? vec4(
        palette(
            float(iterations) / 100.0,
            vec3(0.02, 0.02, 0.03),
            vec3(0.1, 0.2, 0.3),
            vec3(0.0, 0.3, 0.2),
            vec3(0.0, 0.5, 0.8)), 1.0) : vec4(vec3(1.0), 1.0);
}