uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;
uniform mat4 u_projection;
uniform mat4 u_world;
uniform mat4 u_view;

attribute vec4 a_position;
attribute vec3 a_normal;

varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;
varying vec3 v_normal;

void main () {
   gl_Position = u_projection * u_view * u_world * a_position;

   v_normal = mat3 (u_world) * a_normal;

   vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  // compute the vector of the surface to the light
  // and pass it to the fragment shader
   v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  // compute the vector of the surface to the view/camera
  // and pass it to the fragment shader
   v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}