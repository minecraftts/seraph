#version 330 core

layout (location = 0) in vec2 a_pos;
layout (location = 1) in vec3 a_color;
layout (location = 2) in vec2 a_uv;

out vec3 vertex_color;
out vec2 uv;

void main() {
    vertex_color = a_color;
    uv = a_uv;

    gl_Position = vec4(a_pos, 0.0, 1.0);
}