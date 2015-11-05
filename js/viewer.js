/*
	author : luohao
	date : 2013/12/20
	url : http://haozi.freetzi.com
*/


WebGIS3DViewer = function()
{
	this.renderer = null;
	this.scene = null;
	this.objects = null;
	this.camera = null;
	this.container = null;
	this.controller = null;
}

WebGIS3DViewer.prototype.init = function(param)
{
	param = param || {};
	var container = param.container;

	var renderer = new THREE.WebGLRenderer({antialias:true});

	container.appendChild(renderer.domElement);

	var scene = new THREE.Scene();
	var objects = new THREE.Object3D();
	var camera = new THREE.PerspectiveCamera(45,container.offsetWidth/container.offsetHeight,1,400000);
	camera.position.set(0,0,400);
	scene.add(objects);
	scene.add(camera);

	var controller = new THREE.TrackballControls(camera,renderer.domElement);
	controller.rotateSpeed = 5.0;
	controller.zoomSpeed = 5;
	controller.panSpeed = 2;
	controller.noZoom = false;
	controller.noPan = false;
	controller.staticMoving = true;
	controller.cynamicDampingFactor = 0.3;

	this.container = container;
	this.renderer = renderer;
	this.scene = scene;
	this.objects = objects;
	this.camera = camera;
	this.controller = controller;

	this.resize();
}

WebGIS3DViewer.prototype.render = function()
{
	this.renderer.render(this.scene,this.camera);
	this.controller.update();
	var context = this;
	requestAnimationFrame(function(){context.render();});
}

WebGIS3DViewer.prototype.addObject = function(obj)
{
	this.objects.add(obj);
}

WebGIS3DViewer.prototype.removeObject = function(obj)
{
	this.objects.remove(obj);
}

WebGIS3DViewer.prototype.resize = function()
{
	this.renderer.setSize(this.container.offsetWidth,this.container.offsetHeight);

	//update projection matrix
	this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
	this.camera.updateProjectionMatrix();
}