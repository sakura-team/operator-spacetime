<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 19th, 2017-->

class path {
    constructor(name, vals) {
        this.name   = name;
        this.vals   = vals;
    }
}


function gps_read(event) {
    
    paths = [];
    
    for (var i = 0; i< event.target.files.length; i++) {
        
        var reader  = new FileReader();
        
        reader.onloadend = function (file) {
            
            var vals    = [];
            var lines   = file.target.result.split(/\r?\n/);
            var mins    = [1000000, 1000000, 1000000];
            var maxes   = [-1000000, -1000000, -1000000];
            
            for (var i =0 ; i<lines.length; i++) {
                if (lines[i].indexOf('<trkpt') != -1) {
                
                    //VALUES
                    var tab = lines[i].split('lat="');
                    var lat = 1000*parseFloat(tab[1].split('"')[0]);
                    
                    tab = lines[i].split('lon="');
                    var lon = 1000*parseFloat(tab[1].split('"')[0]);
                    
                    tab = lines[i+1].split('<ele>');
                    var ele = parseFloat(tab[1].split('</ele>')[0]);
                    
                    tab = lines[i+2].split('<time>');
                    var time = Date.parse(tab[1].split('</time>')[0]);
                    
                    
                    //MIN MAX
                    if (lat < mins[0])  mins[0] = lat;
                    else if (lat > maxes[0])  maxes[0] = lat;
                    
                    if (lon < mins[1])  mins[1] = lon;
                    else if (lon > maxes[1])  maxes[1] = lon;

                    if (ele < mins[2])  mins[2] = ele;
                    else if (ele > maxes[2])  maxes[2] = ele;
                    
                    // PUSH
                    vals.push({'time': time, 'pos': [lat, lon, ele]});
                }
                else if (lines[i].indexOf('<name>') != -1) {
                    var tab = lines[i].split('<name>');
                    var name = tab[1].split('</name>')[0];
                }
            }
            paths.push({'name': name, 'file_name': file.target.file_name, 'vals': vals, 'mins': mins, 'maxes': maxes});
            
            if (paths.length == file.target.nb_paths)
                update_shader();
        };
        
        reader.file_name    = event.target.files[i].name;
        reader.nb_paths     = event.target.files.length;
        reader.readAsText(event.target.files[i], "UTF-8");
    };
}

function update_shader() {
    gl.useProgram(paths_sh);
    paths_p = [];
    var center = [  (paths[0].maxes[0] + paths[0].mins[0]) /2.0,
                    (paths[0].maxes[1] + paths[0].mins[1]) /2.0,
                    (paths[0].maxes[2] + paths[0].mins[2]) /2.0   ];
    console.log(center);
    
    paths[0].vals.forEach( function(v) {
        paths_p.push([  v.pos[0] - center[0], 
                        0, //v.pos[2] - center[2],
                        v.pos[1] - center[1] ]);
    });
    
    paths_p_loc   = gl.getAttribLocation(paths_sh, "position");
    gl.enableVertexAttribArray(paths_p_loc);
    
    paths_p         = [].concat.apply([], paths_p);
    console.log(paths_p)
    paths_p_buf     = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paths_p_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paths_p), gl.DYNAMIC_DRAW);
    
    camera = new Camera(pos = [0, 0, 100]);
    camera.projection = m_perspective(45, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.01, 1000);
    
    requestAnimationFrame(display);
}