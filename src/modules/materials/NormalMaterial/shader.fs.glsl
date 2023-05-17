precision mediump float;

varying vec3 v_normal;

void main () {
   vec3 normal = normalize (v_normal);
   gl_FragColor = vec4 (normal, 1);
}