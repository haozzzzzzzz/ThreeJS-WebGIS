/*
    author : luo hao
    date : 2013/12/20
    copyright : luo hao
    url : http://haozi.freetzi.com
*/

FileLoader = function(context)
{
    this.context = context;
}

FileLoader.prototype.loadFile = function(file,callback,textureUrl)
{
	var filename = file.name;
	var extension = filename.split('.').pop().toLowerCase();
    var texture = null;

    if(textureUrl !== undefined)
    {
        texture = THREE.ImageUtils.loadTexture(textureUrl);
    }
    else
    {
        texture = THREE.ImageUtils.loadTexture('./img/default.jpg');
    }

	var context = this.context;

	switch(extension)
	{
		case 'js':
		case 'json':
			var reader = new FileReader();

			reader.addEventListener('load',function(event){

				var contents = event.target.result;

				var data;
				try
				{
                    data = JSON.parse(contents);
                    var jsonloader = new THREE.JSONLoader();


                    try
                    {
                        var result =  jsonloader.parse(data);
                    }
                    catch(error)
                    {
                        alert(error);
                    }

                   	var geometry = result.geometry;
                    var material = null;
                    if(geometry.faceVertexUvs[0].length != 0)
                   	    material = new THREE.MeshBasicMaterial({map:texture});
                    else
                        material = new THREE.MeshBasicMaterial();

                   	var mesh = new THREE.Mesh(geometry,material);
                   	mesh.name = filename;
                   	context.addObject(mesh);

                    callback();
				}
				catch(error)
				{
					throw error;
				}

			});
			reader.readAsText(file);
			break;
		default:
			break;
	}
}

FileLoader.prototype.loadTexture = function(num,url,callback)
{
    var texture = THREE.ImageUtils.loadTexture(url);
    if(texture != null)
    {
        this.context.objects.children[0].material.map = texture;
        callback();
    }
}

FileLoader.prototype.loadFileFromUrl = function(url,callback,textureUrl)
{
    var context = this.context;
    var loader = new THREE.JSONLoader();
    var mesh = null;
    
    try
    {
        loader.load(url,function(data){
            if (data instanceof THREE.Geometry)
            {
                var geometry = data;
                var material = null;

                if(geometry.faceVertexUvs[0].length != 0)
                {
                    var texture = THREE.ImageUtils.loadTexture(textureUrl);
                    material = new THREE.MeshBasicMaterial({map:texture});
                }
                else
                {
                    material = new THREE.MeshBasicMaterial();
                }
                var mesh = new THREE.Mesh(geometry,material);
                context.addObject(mesh);
                callback();
            }
        },null);
    }
    catch(error)
    {
        throw error;
    }
}