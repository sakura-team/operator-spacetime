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
}