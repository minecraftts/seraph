#version 330 core

out vec4 frag_color;

in vec4 vertex_color;
in vec2 uv;

uniform int tex_bound;
uniform sampler2D tex;

uniform vec4 color;

void main() {
    if (tex_bound == 1) {
        frag_color = vertex_color * texture(tex, uv) * color;
    } else {
        frag_color = vertex_color * color;
    }
}