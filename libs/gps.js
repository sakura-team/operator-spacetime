<!--Code started by Michael Ortega for the LIG-->
<!--Started on: June 19th, 2017-->



function radians(degrees) {
    return degrees * Math.PI / 180;
}


function mercator(lat, lon) {
    var r_major = 6378137.000;
    var x = r_major * radians(lon);
    var scale = x/lon;
    var y = 180.0/Math.PI * Math.log(Math.tan(Math.PI/4.0 + lat * (Math.PI/180.0)/2.0)) * scale;
    return {'lon': x, 'lat':y}
}


//http://129.206.228.72/cached/osm?LAYERS=osm_auto:all&SRS=EPSG:900913&FORMAT=image/png&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&BBOX=642032.9367603894,5651469.115874138,658852.9778607808,5670179.593138174&WIDTH=1024&HEIGHT=1024

function gps_read(event) {
    
    gps_paths = [];
    var null_point = {'latitude': 0, 'longitude': 0, 'elevation': 0};
    
    for (var i = 0; i< event.target.files.length; i++) {
        
        var reader  = new FileReader();
        
        reader.onloadend = function (file) {
            
            var vals    = [];
            var lines   = file.target.result.split(/\r?\n/);
            var mins    = [Infinity, Infinity, Infinity];
            var maxes   = [-Infinity, -Infinity, -Infinity];
            
            for (var i =0 ; i<lines.length; i++) {
                if (lines[i].indexOf('<trkpt') != -1) {
                    
                    //VALUES
                    var tab = lines[i].split('lat="');
                    var lat = parseFloat(tab[1].split('"')[0]);
                    
                    tab = lines[i].split('lon="');
                    var lon = parseFloat(tab[1].split('"')[0]);
                    
                    
                    tab = lines[i+1].split('<ele>');
                    var ele = parseFloat(tab[1].split('</ele>')[0]);
                    
                    //console.log(lat, lon, ll2tile(lat, lon, 19));
                    
                    if (vals.length == 0 && gps_paths.length == 0) {
                        null_point = {'latitude': lat, 'longitude': lon, 'elevation': ele};
                    }
                    
                    
                    res = mercator(lat, lon);   //getXYpos(null_point, {'latitude': lat, 'longitude':lon});
                    //console.log(res, mercator(lat, lon));
                    lat = res.lat;
                    lon = res.lon;
                    
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
                    vals.push({'time': time, 'lon': lon, 'lat':lat, 'ele':ele});
                }
                else if (lines[i].indexOf('<name>') != -1) {
                    var tab = lines[i].split('<name>');
                    var name = tab[1].split('</name>')[0];
                }
            }
            gps_paths.push({'name': name, 'file_name': file.target.file_name, 'vals': vals, 'mins': mins, 'maxes': maxes, 'color':[Math.random(), Math.random(), Math.random(), 1.0]});
            
            if (gps_paths.length == file.target.nb_paths)
                update_shader();
        };
        
        reader.file_name    = event.target.files[i].name;
        reader.nb_paths     = event.target.files.length;
        reader.readAsText(event.target.files[i], "UTF-8");
    };
}

function update_shader() {
    gl.useProgram(paths.sh);
    
    paths.data[0].vals = [];
    paths.data[1].vals = []
    
    ///Compute global center
    var maxes   = [-10000000,   -10000000,  -10000000];
    var mins    = [10000000,    10000000,   10000000];
    gps_paths.forEach( function(path) {
        for (var i =0;i<3;i++) {
            maxes[i] = Math.max(maxes[i], path.maxes[i]);
            mins[i] = Math.min(mins[i], path.mins[i]);
        }
    });
    
    var center = [  (maxes[0] + mins[0]) /2.0,
                    (maxes[1] + mins[1]) /2.0,
                    (maxes[2] + mins[2]) /2.0   ];
    
    gps_paths.forEach( function(path) {
        paths.data[0].vals.push([   path.vals[0].lon - center[0],
                                    1,//path.vals[0].ele - mins[2],
                                    -(path.vals[0].lat - center[1])    ]);
        paths.data[1].vals.push([0, 0, 0, 0]);
        
        path.vals.forEach( function(v) {
            paths.data[0].vals.push([   v.lon - center[0], 
                                        1,//v.ele - mins[2],
                                        -(v.lat - center[1]) ]);
            paths.data[1].vals.push(path.color);
        });
        paths.data[0].vals.push(paths.data[0].vals[paths.data[0].vals.length - 1]);
        paths.data[1].vals.push([0, 0, 0, 0]);
    });
    
    paths.data[0].loc   = gl.getAttribLocation(paths.sh, "position");
    gl.enableVertexAttribArray(paths.data[0].loc);
    
    paths.data[0].vals  = [].concat.apply([], paths.data[0].vals);
    paths.data[0].buf     = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paths.data[0].buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paths.data[0].vals), gl.DYNAMIC_DRAW);
    
    
    paths.data[1].loc   = gl.getAttribLocation(paths.sh, "color");
    gl.enableVertexAttribArray(paths.data[1].loc);
    
    paths.data[1].vals         = [].concat.apply([], paths.data[1].vals);
    paths.data[1].buf     = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paths.data[1].buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paths.data[1].vals), gl.DYNAMIC_DRAW);
    
    var z = Math.max(maxes[0]-center[0], Math.max(maxes[1]-center[1], maxes[2]-center[2]));
    console.log(z);
    camera = new Camera(pos = [0, 0, 2*z]);
    camera.projection = m_perspective(45, gl.drawingBufferWidth/gl.drawingBufferHeight, 1, 1000000);
    
    floor.data[0].vals      = o_floor_p(size = [(maxes[0]-mins[0]), (maxes[1]-mins[1])], pos = [0, - 1, 0]);
    var cube_h = Math.min((maxes[0]-mins[0]), (maxes[1]-mins[1]))/2;
    cube.data[0].vals       = o_wire_cube_p(size = [(maxes[0]-mins[0]), cube_h, (maxes[1]-mins[1])], pos = [0, cube_h/2.0 + maxes[2], 0]);
    
    floor.image.pic.crossOrigin = "anonymous";
    floor.shade.pic.crossOrigin = "anonymous";
    
    floor.image.pic.src = 'http://129.206.228.72/cached/osm?LAYERS=osm_auto:all&SRS=EPSG:900913&FORMAT=image/png&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&BBOX='+mins[0]+','+mins[1]+','+maxes[0]+','+maxes[1]+'&WIDTH=1024&HEIGHT=1024';
    floor.shade.pic.src = 'http://129.206.228.72/cached/hillshade?LAYERS=europe_wms:hs_srtm_europa&SRS=EPSG:900913&FORMAT=image/png&TRANSPARENT=true&NUMZOOMLEVELS=19&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&BBOX='+mins[0]+','+mins[1]+','+maxes[0]+','+maxes[1]+'&WIDTH=1024&HEIGHT=1024'
    
    floor.image.pic.onload = function() {
        handleTextureLoaded(floor.image.pic, floor.image.texture, 0);
        requestAnimationFrame(display);
    };
    
    floor.shade.pic.onload = function() {
        handleTextureLoaded(floor.shade.pic, floor.shade.texture, 1);
        requestAnimationFrame(display);
    };
    
    //var img = request_image(mins, maxes);
    requestAnimationFrame(display);
}