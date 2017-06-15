<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 27th, 2017-->

var vertex_source = " \
    attribute vec3 aVertexPosition; \
    uniform mat4 PMatrix; \
    uniform mat4 MVMatrix; \
    \
    void main(void) { \
        gl_Position = PMatrix * MVMatrix * vec4(aVertexPosition, 1.0); \
    } \
"
var fragment_source = " \
    void main(void) { \
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); \
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


function init_shaders(_gl) {
    var shader_program = _gl.createProgram();
    
    //shaders
    var fragment_shader = get_and_compile_shader(_gl, 'fragment', fragment_source);
    var vertex_shader   = get_and_compile_shader(_gl, 'vertex', vertex_source);
    
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