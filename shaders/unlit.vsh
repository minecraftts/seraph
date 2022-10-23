#version 330 core

layout (location = 0) in vec3 a_pos;
layout (location = 1) in vec4 a_color;
layout (location = 2) in vec2 a_uv;

uniform mat4 view_matrix;
uniform mat4 model_matrix;
uniform mat4 projection_matrix;

out vec4 vertex_color;
out vec2 uv;

void main() {
    vertex_color = a_color;
    uv = a_uv;

    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(a_pos, 1);
}