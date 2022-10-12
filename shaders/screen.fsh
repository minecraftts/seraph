#version 330 core

out vec4 frag_color;

in vec3 vertex_color;
in vec2 uv;

uniform sampler2D tex;

void main() {
    frag_color = vec4(vertex_color, 1.0) * texture(tex, uv);
}