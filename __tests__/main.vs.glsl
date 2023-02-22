attribute vec4 a_position;

#include <jsfx.uniforms>;

void main () {
  vec3 position = u_transform_matrix * vec3 (a_position.xy, 1);
  gl_Position = vec4 (position.xyz, 1);
}