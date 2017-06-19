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
    
    for (var i = 0; i< event.target.files.length; i++) {
        
        var reader  = new FileReader();
        
        reader.onloadend = function (file) {
            
            var vals    = [];
            var lines   = file.target.result.split(/\r?\n/);
            var mins    = [1000000, 1000000, 1000000];
            var maxes   = [-1000000, -1000000, -1000000];
            
            var null_point = {'latitude': 0, 'longitude': 0, 'elevation': 0};
            for (var i =0 ; i<lines.length; i++) {
                if (lines[i].indexOf('<trkpt') != -1) {
                    
                    //VALUES
                    var tab = lines[i].split('lat="');
                    var lat = parseFloat(tab[1].split('"')[0]);
                    
                    tab = lines[i].split('lon="');
                    var lon = parseFloat(tab[1].split('"')[0]);
                    
                    
                    tab = lines[i+1].split('<ele>');
                    var ele = parseFloat(tab[1].split('</ele>')[0]);
                    
                    if (vals.length == 0) {
                        null_point = {'latitude': lat, 'longitude': lon, 'elevation': ele};
                    }
                    res = getXYpos(null_point, {'latitude': lat, 'longitude':lon});
                    lat = res[0]/1000;
                    lon = res[1]/1000;
                    ele = (ele - null_point.elevation)/100;
                    
                    tab = lines[i+2].split('<time>');
                    var time = Date.parse(tab[1].split('</time>')[0]);
                    
                    //MIN MAX
                    if (lon < mins[0])  mins[0] = lon;
                    else if (lon > maxes[0])  maxes[0] = lon;
                    
                    if (lat < mins[1])  mins[1] = lat;
                    else if (lat > maxes[1])  maxes[1] = lat;
                    
                    if (ele < mins[2])  mins[2] = ele;
                    else if (ele > maxes[2])  maxes[2] = ele;
                    
                    // PUSH
                    vals.push({'time': time, 'pos': [lon, lat, ele]});
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
    
    paths[0].vals.forEach( function(v) {
        paths_p.push([  v.pos[1] - center[1], 
                        v.pos[2] - paths[0].mins[1],
                        -(v.pos[0] - center[0]) ]);
    });
    
    paths_p_loc   = gl.getAttribLocation(paths_sh, "position");
    gl.enableVertexAttribArray(paths_p_loc);
    
    paths_p         = [].concat.apply([], paths_p);
    paths_p_buf     = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paths_p_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paths_p), gl.DYNAMIC_DRAW);
    
    var z = Math.max(paths[0].maxes[0], Math.max(paths[0].maxes[1], paths[0].maxes[2]));
    camera = new Camera(pos = [0, 0, z]);
    camera.projection = m_perspective(45, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.01, 1000);
    
    requestAnimationFrame(display);
}