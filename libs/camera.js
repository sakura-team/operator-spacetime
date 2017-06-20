<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 19th, 2017-->

class Camera {
    constructor(pos = [0, 0, 1], 
                vp = [0, 0, 0], 
                up = [0, 1, 0], 
                p = m_perspective(45, 4.0/3.0, 0.01, 1000)) {
        this.init_pos   = pos;
        this.pos        = pos;
        this.init_vp    = vp;
        this.vp         = vp;
        this.init_up    = up;
        this.up         = up;
        this.projection = p;
    }
    
    rotate(rot_angle) {
        var cam_dir = m_normalize(m_vector(camera.pos, camera.vp))
        var right   = m_normalize(m_cross(cam_dir, camera.up));
        var qy    = m_quaternion(rot_angle[1], right);
        camera.pos = rotatePointWithPivot(camera.pos, qy, camera.vp);
        
        var qx = m_quaternion(rot_angle[0], [0, 1, 0]);
        camera.pos = rotatePointWithPivot(camera.pos, qx, camera.vp);
        
        cam_dir = m_normalize(m_vector(camera.pos, camera.vp))
        right   = m_normalize(m_cross(cam_dir, [0, 1, 0]));
        camera.up = m_normalize(m_cross(right, cam_dir));
    }
}