<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 15th, 2017-->



function m_quaternion( theta = 0, u = (1., 0., 0.) ) {
    var w = Math.cos(theta/2.);
    var x = u[0]*Math.sin(theta/2.);
    var y = u[1]*Math.sin(theta/2.);
    var z = u[2]*Math.sin(theta/2.);
    return [w, x, y, z];
}

function m_perspective(fov, aspect, near, far) {

    var d = 1/Math.tan(fov/2.)
    var mat = m_identity();
    
    mat[0] = d/aspect;
    mat[5] = d;
    mat[10] = (near + far)/(near - far);
    mat[14] = 2*near*far/(near-far);
    mat[11] = -1;
    mat[15] = 0;
    
    return mat;
}


function m_setMatrixUniforms(sh, pm, mvm) {
    var PMatrix = gl.getUniformLocation(sh, "PMatrix");
    gl.uniformMatrix4fv(PMatrix, false, pm);
    
    var MVMatrix = gl.getUniformLocation(sh, "MVMatrix");
    gl.uniformMatrix4fv(MVMatrix, false, mvm);
}


function m_identity() {
    return [1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1];
}


function m_mult(a, b) {
    if (a.length == b.length && a.length == 16) {
        M = m_identity();
        for (var i=0; i<4; i++)
            for (var j=0; j<4; j++)
                M[i*4 + j] = a[i*4]*b[j] + a[i*4+1]*b[j+4] + a[i*4+2]*b[j+8] + a[i*4+3]*b[j+12];
        return M;
    }
    else if (a.length == 16  && b.length == 4) {
        M = [0, 0, 0, 0];
        for (var i=0; i<4; i++)
            M[i*4] = a[i*4]*b[0] + a[i*4+1]*b[1] + a[i*4+2]*b[2] + a[i*4+3]*b[3];
        return M;
    }
    else if (a.length == 16  && b.length == 3) {
        M = [0, 0, 0, 0];
        for (var i=0; i<4; i++)
            M[i] = a[i*4]*b[0] + a[i*4+1]*b[1] + a[i*4+2]*b[2] + a[i*4+3];
        return M;
    }

}


function m_vector(a, b) {
    //Vector AB
    return [ b[0]-a[0], b[1]-a[1], b[2]-a[2] ];
}


function m_normalize(v) {
    var n = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return [v[0]/n, v[1]/n, v[2]/n];
}


function m_cross(u, v) {
    return [    u[1]*v[2]- u[2]*v[1],
                u[2]*v[0]- u[0]*v[2],
                u[0]*v[1]- u[1]*v[0]     ];
}


function m_lookAt(eye, center, up) {

    var f = m_normalize(m_vector(eye, center));
    var _up = m_normalize(up);
    var s = m_cross(f, _up);
    var u = m_cross(m_normalize(s), f);
    var R = [   s[0],   u[0],   -f[0],  0,
                s[1],   u[1],   -f[1],  0,
                s[2],   u[2],   -f[2],  0,
                0,      0,      0,      1   ];
    
    var T = [   1,      0,      0,      0,
                0,      1,      0,      0,
                0,      0,      1,      0,
                -eye[0],-eye[1],-eye[2], 1 ];
    return m_mult(T, R);
}


function matrixFromQuaternion( Q ) {
    var w = Q[0];
    var x = Q[1];
    var y = Q[2];
    var z = Q[3];
    
    return [1.-2.*(y*y+z*z), 2.*(x*y+w*z),    2.*(x*z-w*y),    0.,
            2.*(x*y-w*z),    1.-2.*(x*x+z*z), 2.*(y*z+w*x),    0.,
            2.*(x*z+w*y),    2.*(y*z-w*x),    1.-2.*(x*x+y*y), 0.,
            0.,              0.,              0.,              1.];
}


function rotatePointWithPivot(pos, q, pivot) {
    
    var M = matrixFromQuaternion(q);
    var center = m_mult(M, m_vector(pivot, pos));
    return [center[0] + pivot[0], 
            center[1] + pivot[1], 
            center[2] + pivot[2]    ];
}