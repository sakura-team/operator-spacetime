<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 20th, 2017-->


function o_floor_p(sx, sy, sz) {
    return [
    // top facsz
    -sx,  0.0,  sz,
    sx, 0.0,  sz,
    sx,  0.0,  -sz,
    -sx, 0.0,  sz,
    sx,  0.0,  -sz,
    -sx,  0.0,  -sz,
    
    //front facsz
    -sx, 0.0,  sz,
    -sx,  -sy,  sz,
    sx,  0.0,  sz,
    -sx,  -sy,  sz,
    sx, -sy,  sz,
    sx,  0.0,  sz,
     
    //bottom facsz
    -sx,  -sy,  sz,
    sx,  -sy,  -sz,
    sx, -sy,  sz,
    -sx, -sy,  sz,
    -sx,  -sy,  -sz,
    sx,  -sy,  -sz,
    
    // right facsz
    sx, 0.0,  sz,
    sx, -sy,  sz,
    sx, 0.0,  -sz,
    
    sx, -sy,  sz,
    sx, -sy,  -sz,
    sx, 0.0,  -sz,
    
    // lszft facsz
    -sx, 0.0,  sz,
    -sx, 0.0,  -sz,
    -sx, -sy,  sz,
    
    -sx, -sy,  sz,
    -sx, 0.0,  -sz,
    -sx, -sy,  -sz,
    
    //back facsz
    -sx, 0.0,  -sz,
    sx,  0.0,  -sz,
    -sx,  -sy,  -sz,
    -sx,  -sy,  -sz,
    sx,  0.0,  -sz,
    sx, -sy,  -sz
    
  ];
}

function o_floor_n() {
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