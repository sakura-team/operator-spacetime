<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 15th, 2017-->

var floor_vertex_source = " \
    attribute vec3  position; \
    attribute vec3  normal; \
    attribute vec2  texture_coords; \
    uniform mat4    PMatrix; \
    uniform mat4    MVMatrix; \
    \
    varying float   v_light; \
    varying highp vec2    v_texture_coords; \
    \
    vec3 light_pos = vec3(0, 1000, 1000);\
    \
    void main(void) { \
        vec4 p = MVMatrix * vec4(position, 1.0); \
        vec4 p_normal = MVMatrix * vec4(position+normal, 1.0); \
        vec3 v_normal = (p_normal - p).xyz; \
        vec4 l_pos = vec4(light_pos, 1.0); \
        \
        vec3 light_inv_ray = normalize(l_pos.xyz - gl_Position.xyz);\
        v_light = max(dot(v_normal, light_inv_ray), 0.0); \
        \
        gl_Position = PMatrix * p; \
        v_texture_coords = texture_coords; \
    } \
"
var floor_fragment_source = " \
    precision highp float;\
     \
    varying float   v_light; \
    varying highp vec2 v_texture_coords; \
    uniform sampler2D picture; \
    uniform sampler2D shading; \
    \
    void main(void) { \
        gl_FragColor = texture2D(picture, vec2(v_texture_coords.s, v_texture_coords.t)); \
        float s = texture2D(shading, vec2(v_texture_coords.s, v_texture_coords.t)).s; \
        gl_FragColor.rgb *= (s/4.0+0.75); \
    } \
"

var paths_vertex_source = " \
    attribute vec3 position; \
    attribute vec4 color; \
    uniform mat4 PMatrix; \
    uniform mat4 MVMatrix; \
    \
    varying vec4 v_color; \
    \
    void main(void) { \
        gl_Position = PMatrix * MVMatrix * vec4(position, 1.0); \
        v_color = color; \
    } \
"

var paths_fragment_source = " \
    precision highp float;\
    \
    varying vec4 v_color; \
    \
    void main(void) { \
        gl_FragColor = v_color;\
    } \
"

var cube_vertex_source = " \
    attribute vec3 position; \
    uniform mat4 PMatrix; \
    uniform mat4 MVMatrix; \
    \
    void main(void) { \
        gl_Position = PMatrix * MVMatrix * vec4(position, 1.0); \
    } \
"

var cube_fragment_source = " \
    precision highp float;\
    \
    void main(void) { \
        gl_FragColor = vec4(0., 0., 0., 1.0);\
    } \
"

function get_and_compile_shader(_gl, type, source) {
    
    if (type == 'fragment')
        var shader = _gl.createShader(_gl.FRAGMENT_SHADER);
    else if (type == 'vertex')
        var shader = _gl.createShader(_gl.VERTEX_SHADER);
    _gl.shaderSource(shader, source);
    _gl.compileShader(shader);
    
    // Vérifie si la compilation s'est bien déroulée
    if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) { 
        console.log(name, "shader not ok!!", _gl.getShaderInfoLog(shader));
        alert("Une erreur est survenue au cours de la compilation des shaders: " + _gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}


function init_shader(_gl, f_source, v_source) {
    var shader_program = _gl.createProgram();
    
    //shaders
    var fragment_shader = get_and_compile_shader(_gl, 'fragment', f_source);
    var vertex_shader   = get_and_compile_shader(_gl, 'vertex', v_source);
    
    //shader program
    _gl.attachShader(shader_program, vertex_shader);
    _gl.attachShader(shader_program, fragment_shader);
    _gl.linkProgram(shader_program);
    
    if (!_gl.getProgramParameter(shader_program, _gl.LINK_STATUS)) {
        console.log("Impossible d'initialiser le shader.");
        return null;
    }
    _gl.useProgram(shader_program);
    
    return shader_program;
}