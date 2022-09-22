#version 330 core

layout (location = 0) in vec3 a_pos;
layout (location = 1) in vec3 a_color;

uniform mat4 view_matrix;
uniform mat4 model_matrix;
uniform mat4 projection_matrix;

out vec3 vertex_color;

void main() {
    vertex_color = a_color;

    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(a_pos, 1);
}