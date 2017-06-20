<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 19th, 2017-->


const RAD = 0.000008998719243599958;

function asRadians(degrees) {
    return degrees * Math.PI / 180;
}


function getXYpos(relativeNullPoint, p) {
    
    var deltaLatitude = p.latitude - relativeNullPoint.latitude;
    var deltaLongitude = p.longitude - relativeNullPoint.longitude;
    var latitudeCircumference = 40075160 * Math.cos(asRadians(relativeNullPoint.latitude));
    var resultX = deltaLongitude * latitudeCircumference / 360;
    var resultY = deltaLatitude * 40008000 / 360;
    return [resultX, resultY];
}


function gps_read(event) {
    
    paths = [];
    var null_point = {'latitude': 0, 'longitude': 0, 'elevation': 0};
    
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
                    var lat = parseFloat(tab[1].split('"')[0]);
                    
                    tab = lines[i].split('lon="');
                    var lon = parseFloat(tab[1].split('"')[0]);
                    
                    
                    tab = lines[i+1].split('<ele>');
                    var ele = parseFloat(tab[1].split('</ele>')[0]);
                    
                    if (vals.length == 0 && paths.length == 0) {
                        null_point = {'latitude': lat, 'longitude': lon, 'elevation': ele};
                    }
                    res = getXYpos(null_point, {'latitude': lat, 'longitude':lon});
                    lat = res[0]/1000;
                    lon = res[1]/1000;
                    ele = (ele - null_point.elevation)/1000;
                    
                    tab = lines[i+2].split('<time>');
                    var time = Date.parse(tab[1].split('</time>')[0]);
                    
                    //MIN MAX
                    mins[0] = Math.min(lon, mins[0]);
                    maxes[0]= Math.max(lon, maxes[0]);
                    
                    mins[1] = Math.min(lat, mins[1]);
                    maxes[1]= Math.max(lat, maxes[1]);
                    
                    mins[2] = Math.min(ele, mins[2]);
                    maxes[2]= Math.max(ele, maxes[2]);
                    
                    // PUSH
                    vals.push({'time': time, 'pos': [lon, lat, ele]});
                }
                else if (lines[i].indexOf('<name>') != -1) {
                    var tab = lines[i].split('<name>');
                    var name = tab[1].split('</name>')[0];
                }
            }
            paths.push({'name': name, 'file_name': file.target.file_name, 'vals': vals, 'mins': mins, 'maxes': maxes, 'color':[Math.random(), Math.random(), Math.random(), 1.0]});
            
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
    paths_c = []
    
    ///Compute global center
    var maxes   = [-10000000,   -10000000,  -10000000];
    var mins    = [10000000,    10000000,   10000000];
    paths.forEach( function(path) {
        for (var i =0;i<3;i++) {
            maxes[i] = Math.max(maxes[i], path.maxes[i]);
            mins[i] = Math.min(mins[i], path.mins[i]);
        }
    });
    
    var center = [  (maxes[0] + mins[0]) /2.0,
                    (maxes[1] + mins[1]) /2.0,
                    (maxes[2] + mins[2]) /2.0   ];
    
    paths.forEach( function(path) {
        paths_p.push([  path.vals[0].pos[1] - center[1],
                        path.vals[0].pos[2] - mins[2],
                        -(path.vals[0].pos[0] - center[0])    ]);
        paths_c.push([0, 0, 0, 0]);
        
        path.vals.forEach( function(v) {
            paths_p.push([  v.pos[1] - center[1], 
                            v.pos[2] - mins[2],
                            -(v.pos[0] - center[0]) ]);
            paths_c.push(path.color);
        });
        paths_p.push(paths_p[paths_p.length - 1]);
        paths_c.push([0, 0, 0, 0]);
    });
    
    paths_p_loc   = gl.getAttribLocation(paths_sh, "position");
    gl.enableVertexAttribArray(paths_p_loc);
    
    paths_p         = [].concat.apply([], paths_p);
    paths_p_buf     = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paths_p_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paths_p), gl.DYNAMIC_DRAW);
    
    
    paths_c_loc   = gl.getAttribLocation(paths_sh, "color");
    gl.enableVertexAttribArray(paths_c_loc);
    
    paths_c         = [].concat.apply([], paths_c);
    paths_c_buf     = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paths_c_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paths_c), gl.DYNAMIC_DRAW);
    
    
    var z = Math.max(maxes[0], Math.max(maxes[1], maxes[2]));
    camera = new Camera(pos = [0, 0, 2*z]);
    camera.projection = m_perspective(45, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.01, 1000);
    
    floor_p                = o_floor_p((maxes[0]-mins[0])/1.5, .05, (maxes[1]-mins[1])/1.5);
    
    requestAnimationFrame(display);
}