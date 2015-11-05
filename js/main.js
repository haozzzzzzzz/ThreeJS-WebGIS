/*
	author : luo hao
	date : 2013/12/20
	copyright : luo hao
	url : http://haozi.freetzi.com
*/
$(document).ready(function(){

	//viewer
	var webGIS3DViewer = new WebGIS3DViewer();
	var viewport = document.getElementById("viewport");
	webGIS3DViewer.init({container:viewport});
	webGIS3DViewer.render();

	//file loader
	var loader = new FileLoader(webGIS3DViewer);

	//UI control
	controlWindowUI();
	controlMenuUI();
	controlToolbarUI();
	controlSidebarUI();

	function controlWindowUI()
	{
		$(window).resize(function(event){
			updateUI();
		});
	}
	
	function controlMenuUI()
	{
		$('.menu').hover(function(){
			$(this).children(".options").css({display:"block"});
		},function(){
			$(this).children(".options").css({display:"none"});
		});

		$('#import').click(function(){
			var input = document.createElement('input');
			input.type='file';
			input.addEventListener('change',function(event){
				try
				{
					showLoading(true);
					loader.loadFile(input.files[0],sceneLoadedCallback);
					$('#loadTexture').css({display:'block'});
				}
				catch(error)
				{
					showLoading(false);
					alert('load failed');
				}
			});
			input.click();
		});

		$('#loadTexture').click(function(){
			var input2 = document.createElement('input');
			input2.type='file';
			input2.addEventListener('change',function(event){
				var url = location.href+'texture/'+input2.files[0].name;
				showLoading(true);
				loader.loadTexture(0,url,function(){
					$('#loadTexture').css({display:'none'});
					showLoading(false);
				});
			});
			input2.click();
		});

		$('#reload').click(function(){
			window.location.reload();
		});

		$("#exit").click(function(){
			exit();
		});

		$('#info').click(function(){
			$('#sidebar').css({display:'block'});
			$('#viewport').css({right:"300px"});
			updateUI();
		});

		$('#about').click(function(){
			$('#aboutpage').fadeIn("slow");
		});
		$('#aboutpage').click(function(){
			$(this).fadeOut("slow");
		});

		loadExample();
		updateUI();
	}

	function controlToolbarUI()
	{
		$('#fullscreen').click(function(){
			if(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen)
			{
				if(document.cancelFullScreen)
					document.cancelFullScreen();
				else if(document.webkitCancelFullScreen)
					document.webkitCancelFullScreen();
				else if(document.mozCancelFullScreen)
					document.mozCancelFullScreen();
			}
			else
			{
				if(document.documentElement.requestFullScreen)
					document.documentElement.requestFullScreen();
				else if(document.documentElement.webkitRequestFullScreen)
					document.documentElement.webkitRequestFullScreen();
				else if(document.documentElement.mozRequestFullScreen)
					document.documentElement.mozRequestFullScreen();
			}
		});

		$('#meshSelect').change(function(){

			if (webGIS3DViewer.objects.children.length == 0) {
				return;
			}

			var choose = $(this).children('option:selected').val();
			webGIS3DViewer.objects.children[0].material.wireframe = false;
			switch(choose)
			{
				case '1'://线框
					webGIS3DViewer.objects.children[0].material.wireframe = true;
					break;
				case '2'://前面
					webGIS3DViewer.objects.children[0].material.side = THREE.FrontSide;
					break;
				case '3'://后面
					webGIS3DViewer.objects.children[0].material.side = THREE.BackSide;
					break;
				case '4'://双面
					webGIS3DViewer.objects.children[0].material.side = THREE.DoubleSide;
					break;
				default:
					break;
			}
		});
	}

	function controlSidebarUI()
	{
		$('#sidebar .close').click(function(){
			$('#sidebar').css({display:'none'});
			$('#viewport').css({right:'0px'});
			updateUI();
		});
	}

	function updateUI()
	{
		webGIS3DViewer.resize();


		var left = $(window).width() / 2 - $('#aboutpage').width() / 2;
		var top = $(window).height() / 2 - $('#aboutpage').height()/2;
		$('#aboutpage').css({top:top+'px',left:left+'px'});


		if(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen)
		{
			$('#fullscreen').attr({'src':'./img/normal.png'});
		}
		else
			$('#fullscreen').attr({'src':'./img/fullscreen.png'});
	}

	function loadExample()
	{
		$('#example-cube').click(function(){
			showLoading(true);
			try
			{
				loader.loadFileFromUrl('./model/cube.js',sceneLoadedCallback,'./texture/cool.jpg');
			}
			catch(error)
			{
				showLoading(false);
				alert('load failed');
			}
		});
		$('#example-terrain').click(function(){
			showLoading(true);
			try
			{
				loader.loadFileFromUrl('./model/terrain_tex.js',sceneLoadedCallback,'./texture/terrain.jpg');
			}
			catch(error)
			{
				showLoading(false);
				alert('load failed');
			}
		});
	}

	function sceneLoadedCallback()
	{
		disabledAddModel();
		$('#vertices').text(webGIS3DViewer.objects.children[0].geometry.vertices.length);
		$('#faces').text(webGIS3DViewer.objects.children[0].geometry.faces.length);
	}

	function disabledAddModel()
	{
		$('#import').css({display:'none'});
		$('#import').unbind('click');

		$('#example-cube').css({display:'none'});
		$('#example-cube').unbind('click');
		$('#example-terrain').css({display:'none'});
		$('#example-terrain').unbind('click');

		showLoading(false);
	}

	function showLoading(trueorfalse)
	{
		if (trueorfalse) 
		{
			$('#loading').css({display:'block'});
		}
		else
		{
			$('#loading').css({display:'none'});
		}
	}

	function exit(){
		if(require){
			var gui = require('nw.gui');
			var win = gui.Window.get();
			win.close(true);
		}
	}
});