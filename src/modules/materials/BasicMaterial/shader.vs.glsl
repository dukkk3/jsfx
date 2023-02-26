#include <jsfx.vs.vars>;

attribute vec4 a_color;
varying vec4 v_color;

void main () {
   gl_Position = uvTransform * position;
   v_color = a_color;
}