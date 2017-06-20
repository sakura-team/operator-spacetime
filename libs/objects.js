<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 20th, 2017-->


function o_cube_p(size = [1.0, 1.0, 1.0], pos = [0, 0, 0]) {
    return [
    // top face
    -size[0]/2. + pos[0],  size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0], size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0],  size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    -size[0]/2. + pos[0], size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0],  size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    -size[0]/2. + pos[0],  size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    
    //front facsize[2]/2. + pos[2]
    -size[0]/2. + pos[0], size[1]/2. + pos[1],  size[2]/2. + pos[2],
    -size[0]/2. + pos[0],  -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0],  size[1]/2. + pos[1],  size[2]/2. + pos[2],
    -size[0]/2. + pos[0],  -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0], -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0],  size[1]/2. + pos[1],  size[2]/2. + pos[2],
     
    //bottom facsize[2]/2. + pos[2]
    -size[0]/2. + pos[0],  -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0],  -size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    size[0]/2. + pos[0], -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    -size[0]/2. + pos[0], -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    -size[0]/2. + pos[0],  -size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    size[0]/2. + pos[0],  -size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    
    // right facsize[2]/2. + pos[2]
    size[0]/2. + pos[0], size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0], -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0], size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    
    size[0]/2. + pos[0], -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    size[0]/2. + pos[0], -size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    size[0]/2. + pos[0], size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    
    // lsize[2]/2. + pos[2]ft facsize[2]/2. + pos[2]
    -size[0]/2. + pos[0], size[1]/2. + pos[1],  size[2]/2. + pos[2],
    -size[0]/2. + pos[0], size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    -size[0]/2. + pos[0], -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    
    -size[0]/2. + pos[0], -size[1]/2. + pos[1],  size[2]/2. + pos[2],
    -size[0]/2. + pos[0], size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    -size[0]/2. + pos[0], -size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    
    //back facsize[2]/2. + pos[2]
    -size[0]/2. + pos[0], size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    size[0]/2. + pos[0],  size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    -size[0]/2. + pos[0],  -size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    -size[0]/2. + pos[0],  -size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    size[0]/2. + pos[0],  size[1]/2. + pos[1],  -size[2]/2. + pos[2],
    size[0]/2. + pos[0], -size[1]/2. + pos[1],  -size[2]/2. + pos[2]
    
  ];
}

function o_cube_n() {
    return [
    // Front face
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    
    0.0, 0.0,  1.0,
    0.0, 0.0,  1.0,
    0.0, 0.0,  1.0,
    0.0, 0.0,  1.0,
    0.0, 0.0,  1.0,
    0.0, 0.0,  1.0,
    
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    
    0.0, 0.0,  -1.0,
    0.0, 0.0,  -1.0,
    0.0, 0.0,  -1.0,
    0.0, 0.0,  -1.0,
    0.0, 0.0,  -1.0,
    0.0, 0.0,  -1.0
    ]
}

function o_wire_cube_p(size = [1.0, 1.0, 1.0], pos = [0, 0, 0]) {
    return [
    // top face
    -size[0]/2. + pos[0],   -size[1]/2. + pos[1],   size[2]/2. + pos[2],
    size[0]/2. + pos[0],    -size[1]/2. + pos[1],   size[2]/2. + pos[2],
    size[0]/2. + pos[0],    size[1]/2. + pos[1],    size[2]/2. + pos[2],
    -size[0]/2. + pos[0],   size[1]/2. + pos[1],    size[2]/2. + pos[2],
    -size[0]/2. + pos[0],   -size[1]/2. + pos[1],   size[2]/2. + pos[2],
    
    -size[0]/2. + pos[0],   -size[1]/2. + pos[1],   -size[2]/2. + pos[2],
    size[0]/2. + pos[0],   -size[1]/2. + pos[1],   -size[2]/2. + pos[2],
    size[0]/2. + pos[0],   size[1]/2. + pos[1],   -size[2]/2. + pos[2],
    -size[0]/2. + pos[0],   size[1]/2. + pos[1],   -size[2]/2. + pos[2],
    -size[0]/2. + pos[0],   -size[1]/2. + pos[1],   -size[2]/2. + pos[2],
    
    -size[0]/2. + pos[0],   size[1]/2. + pos[1],   -size[2]/2. + pos[2],
    -size[0]/2. + pos[0],   size[1]/2. + pos[1],   size[2]/2. + pos[2],
    size[0]/2. + pos[0],    size[1]/2. + pos[1],    size[2]/2. + pos[2],
    size[0]/2. + pos[0],   size[1]/2. + pos[1],   -size[2]/2. + pos[2],
    
    size[0]/2. + pos[0],   -size[1]/2. + pos[1],   -size[2]/2. + pos[2],
    size[0]/2. + pos[0],   -size[1]/2. + pos[1],   size[2]/2. + pos[2]
  ];
}
