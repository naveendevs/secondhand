function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}
var transitionEvent = whichTransitionEvent();

var global;
var map;

function init() {

	var dataCache = {};

	var get = function(x) {
		return document.getElementById(x);
	}
	var formatDate = function(dateTimeMS){
		var d = new Date(dateTimeMS);
		return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
	};
	var getAgo = function(dateTimeMS) {
		var t = new Date().getTime() - dateTimeMS;
		var minutes = (t / 1000) / 60;
		var hours = minutes / 60;
		var days = hours / 24;
		
		if(days > 6) {
			return 'on ' + formatDate(dateTimeMS);
		}
		if(Math.floor(days) == 1) {
			return '1 day ago';
		}
		if(!(days < 1)) {
			return Math.floor(days) + ' days ago';
		}
		if(Math.floor(hours) == 1) {
			return '1 hour ago';
		}
		if (!(hours < 1)) {
			return Math.floor(hours) + ' hours ago';
		}
		if(Math.floor(minutes) == 1) {
			return '1 minute ago';
		}
		if (!(minutes < 1)) {
			return Math.floor(minutes) + ' minutes ago';
		} else {
			return 'just now';
		}
	}

$('#filter-invoice, #filter-warranty').click(function() {
	if ($(this).data("value") == "0") {
		$(this).data("value", "1");
		$(this).find('.filter-content > .filter-icon')[0].dataset['icon'] = "\uE047";
	} else {
		$(this).data("value", "0");
		$(this).find('.filter-content > .filter-icon')[0].dataset['icon'] = "\uE046";
	}
});

$('#filter-used, #filter-price').click(function(e) {
	e.stopPropagation();
	e.preventDefault();

	if ($(this).find('.filter-options.active').length) {
		$(this).find('.filter-options').removeClass('active');
		return false;
	}
	$(".dropdown.active").removeClass('active');
	$(this).find('.filter-options').toggleClass('active');
});

$('#filter-used, #filter-price').on("click", 'li', function(e) {
	e.stopPropagation();
	e.preventDefault();
	
	if ($(this).data("toggle") == "0") {
		$(this).data("toggle", "1");
		$(this).find('.filter-option-icon')[0].dataset['icon'] = "\uE047";
	} else {
		$(this).data("toggle", "0");
		$(this).find('.filter-option-icon')[0].dataset['icon'] = "\uE046";
	}
});

//hide any active dropdown - filters
$(document).click(function(){
	$(".dropdown.active").removeClass('active');
});

var circle;
var radiusMarker;
var centerMarker;
var radiusInfo;
//var map;

var mapObj;

function initializeMap() {
	var markerCache = {};
	var centerAddress = "";
	
	function relocate() {
		//ajax call to get loaction name and city and country
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp=new XMLHttpRequest();
		}
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				//setMask(false);
				var get = function(el) { return document.getElementById(el) };
				var data = JSON.parse(xmlhttp.responseText);
				centerAddress = '';
				if (data.results[0]!=undefined && data.results[0].formatted_address != undefined) {
					var splittedAddress = data.results[0].formatted_address.split(',');
					for (var i=0; i<splittedAddress.length-2; i++) {
						centerAddress += splittedAddress[i] + ',';
					}
					centerAddress = centerAddress.substr(0,centerAddress.length-1);
				}
				document.getElementById('header-select-locality').value=centerAddress;
			}
		}
		xmlhttp.open("GET","https://maps.googleapis.com/maps/api/geocode/json?latlng="+ map.getCenter().lat() + "," + map.getCenter().lng() +"&result_type=sublocality_level_1&key=AIzaSyDy_hwukpPRvw24Tr0J2sAM6iofOHQEThk",true);
		xmlhttp.send();
	}

	var mapOptions = {
          center: { lat: 19.075736, lng: 72.877507},
		  disableDefaultUI: true,
          zoom: 14
    };
	
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos){
			mapOptions.center.lat = pos.coords.latitude;
			mapOptions.center.lng = pos.coords.longitude;
			map.setCenter(mapOptions.center);
			centerMarker.setPosition(mapOptions.center);
			circle.setCenter(mapOptions.center);
			radiusMarker.setPosition({lat: circle.getCenter().lat() - ((circle.getRadius()/6378137)*180/3.14), lng: d=circle.getCenter().lng()});

			//ajax call to get loaction name and city and country
			var xmlhttp;
			if (window.XMLHttpRequest) {
				xmlhttp=new XMLHttpRequest();
			}
			xmlhttp.onreadystatechange=function() {
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					//setMask(false);
					var get = function(el) { return document.getElementById(el) };
					var data = JSON.parse(xmlhttp.responseText);
					var splittedAddress = data.results[0].formatted_address.split(',');
					centerAddress =  '';
					for (var i=0; i<splittedAddress.length-2; i++) {
						centerAddress += splittedAddress[i] + ',';
					}
					centerAddress = centerAddress.substr(0,centerAddress.length-1);
					document.getElementById('header-select-locality').value=centerAddress;
				}
			}
			xmlhttp.open("GET","https://maps.googleapis.com/maps/api/geocode/json?latlng="+ map.getCenter().lat() + "," + map.getCenter().lng() +"&result_type=sublocality_level_1	&key=AIzaSyDy_hwukpPRvw24Tr0J2sAM6iofOHQEThk",true);
			xmlhttp.send();
		});
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
	
    map = new google.maps.Map(document.getElementById('map-content'), mapOptions);

	var imageCenterMarker = new google.maps.MarkerImage("images/move_marker.png",
        new google.maps.Size(32, 32), 
        new google.maps.Point(0,0),
        new google.maps.Point(16, 16)
    );
	var imageRadiusMarker = new google.maps.MarkerImage("images/radius_marker.png",
        new google.maps.Size(32, 32), 
        new google.maps.Point(0,0),
        new google.maps.Point(16, 16)
    );

	var imageMarker = new google.maps.MarkerImage("images/loc-new.png",
        new google.maps.Size(32, 42), 
        new google.maps.Point(0,0),
        new google.maps.Point(16, 42)
    );
	var imageMarkerSelected = new google.maps.MarkerImage("images/loc-new.png",
        new google.maps.Size(32, 42), 
        new google.maps.Point(0,0),
        new google.maps.Point(16, 42)
    );
	
    infoBox = new InfoBox({
         content: '',
         disableAutoPan: false,
         pixelOffset: new google.maps.Size(-100, 20),
         zIndex: null,
         boxStyle: {
            background: "",
            opacity: .9,
            width: "200px"
        },
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1)
    });
	
    var selectMarkerInfoBox = new InfoBox({
		disableAutoPan: true,
		pixelOffset: new google.maps.Size(-110, -120),
		zIndex: 10,
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1)
    });

	var circleOptions = {
      strokeColor: '#005387',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#Fefefe',
      fillOpacity: 0.25,
      map: map,
	  cursor: 'hand',
      center: map.center,
      radius: 1500
    };
    circle = new google.maps.Circle(circleOptions);

	radiusMarker = new google.maps.Marker({
      position: {lat: circle.getCenter().lat() - ((circle.getRadius()/6378137)*180/3.14), lng: d=circle.getCenter().lng()},
      map: map,
	  icon: imageRadiusMarker,
  	  draggable: true
	});
	
	centerMarker = new google.maps.Marker({
      position: circle.getCenter(),
      map: map,
	  icon: imageCenterMarker,
	  getEl: function() {return this;},
	  draggable: true
	});

	//center marker events
	google.maps.event.addListener(centerMarker, 'drag', function(event) {
		circle.setCenter(event.latLng);
		radiusMarker.setPosition({lat: circle.getCenter().lat() - ((Math.abs(circle.getRadius())/6378137)*180/3.14), lng: circle.getCenter().lng()});
	});
	google.maps.event.addListener(centerMarker, 'mouseout', function(event) {
		infoBox.close();
	});
	google.maps.event.addListener(centerMarker, 'mousedown', function(event) {
		infoBox.close();
	});
	google.maps.event.addListener(centerMarker, 'mouseover', function(event) {
		infoBox.setContent('<div class="map-infobox"><span class="map-infobox-highlight">'+ centerAddress +'</span><BR>Drag to move circle</div>');
		infoBox.open(map, centerMarker);
	});
	google.maps.event.addListener(centerMarker, 'mouseup', function(event) {
		infoBox.setContent('<div class="map-infobox"><span class="map-infobox-highlight">'+ centerAddress +'</span><BR>Drag to move circle</div>');
		infoBox.open(map, centerMarker);
		map.panTo(circle.getCenter());
		relocate();
	});
	

	//radius marker events
	google.maps.event.addListener(radiusMarker, 'mousedown', function(event) {
		infoBox.setContent('<div class="map-infobox">Showing results within <span class="map-infobox-highlight">'+ Math.abs(Math.round(circle.getRadius())) +' m</span><BR>Drag to change radius</div>');
		infoBox.open(map, radiusMarker);
	});
	google.maps.event.addListener(radiusMarker, 'mouseover', function(event) {
		infoBox.setContent('<div class="map-infobox">Showing results within <span class="map-infobox-highlight">'+ Math.abs(Math.round(circle.getRadius())) +' m</span><BR>Drag to change radius</div>');
		infoBox.open(map, radiusMarker);
	});
	google.maps.event.addListener(radiusMarker, 'mouseout', function(event) {
		infoBox.close();
	});
	google.maps.event.addListener(radiusMarker, 'mouseup', function(event) {
		//infoBox.close();
	});
	google.maps.event.addListener(radiusMarker, 'dragend', function(event) {
		//infoBox.close();
	});
	google.maps.event.addListener(radiusMarker, 'drag', function(event) {
		//if(event.latLng.lat() >= circle.getCenter().lat() - ((100/6378137)*180/3.14)){
			//radiusMarker.setPosition({lat: circle.getCenter().lat() - ((1000/6378137)*180/3.14), lng: circle.getCenter().lng()});
		//} else if (event.latLng.lat() <= circle.getCenter().lat() - ((5000/6378137)*180/3.14)) {
			//radiusMarker.setPosition({lat: circle.getCenter().lat() - ((5000/6378137)*180/3.14), lng: circle.getCenter().lng()});
		//} else {
			radiusMarker.setPosition({lat: event.latLng.lat(), lng: circle.getCenter().lng()});
			//if (Math.abs(circle.getRadius()) <=5000) {
			circle.setRadius((event.latLng.lat()-circle.getCenter().lat())*6378137*3.14/180);
			//}
		//}
		infoBox.setContent('<div class="map-infobox">Showing results within <span class="map-infobox-highlight">'+ Math.abs(Math.round(circle.getRadius())) +' m</span><BR>Drag to change radius</div>');
	});

	//bounds = circle.getBounds();
	
	function drawResultsOnMap(json) {
		for (var i = 0, length = json.length; i < length; i++) {
		function inner(data) {
			//var data = json[i];
			//console.log(data);
			latLng = new google.maps.LatLng(data.location.lat, data.location.lng);
			//if(circle.getBounds().contains(latLng)) {
			if(true) {
				// Creating a marker and putting it on the map
				var marker = new google.maps.Marker({
					position: latLng,
					map: map,
					icon: imageMarker,
					animation: google.maps.Animation.DROP
				});
				google.maps.event.addListener(marker, 'mouseover', function(event) {
					//this.setIcon(imageMarkerSelected);
					mapObj.highlightMarker(data);
					//alert('het');
				});
				google.maps.event.addListener(marker, 'mouseout', function(event) {
					//this.setIcon(imageMarker);
					mapObj.unhighlightMarker(data.adId);
				});
				google.maps.event.addListener(marker, 'click', function(event) {
					this.setIcon(imageMarkerSelected);
				});
				markerCache[data.adId] = marker;
			}
		}
		inner(json[i]);
		}
	}

	var zoomInBtn = document.createElement('div');
	zoomInBtn.className= 'map-ui-zoomin';
	zoomInBtn.onclick=function(){
		map.setZoom(map.zoom+1);
	};
	map.getDiv().appendChild(zoomInBtn);

	var zoomOutBtn = document.createElement('div');
	zoomOutBtn.className= 'map-ui-zoomout';
	zoomOutBtn.onclick=function(){
		map.setZoom(map.zoom-1);
	};
	map.getDiv().appendChild(zoomOutBtn);
	
	return {
		redrawResults : function(data) {
			drawResultsOnMap(data);
		},
		highlightMarker: function(_data) {
			//change icon of selected marker
			markerCache[_data.adId].setIcon(imageMarkerSelected);
			
			//render infobox for selected marker
			var selectMarkerContent = Mustache.render(get('map_marker_selected_el').innerHTML, _data);
			selectMarkerInfoBox.setContent(selectMarkerContent);
			selectMarkerInfoBox.open(map, markerCache[_data.adId]);
		},
		unhighlightMarker: function(_id) {
			markerCache[_id].setIcon(imageMarker);
			selectMarkerInfoBox.close();
		}
	}
}

function listBoxClosure() {
	var isShortlistActive = false;
	var xcess = {
		searchResultCount: 0,
		shortlistedCount: 0,
		contactedCount: 0
	};
	var selectedCache = {};

	
	get('main-list-tab').addEventListener("mousedown", function(){
		get('short-list').style.display = "none";
		$('#short-list-tab').removeClass("active");
		
		get('main-list-wrapper').style.display = "block";
		$('#main-list-tab').addClass("active");
		get('sort-wrapper').style.display = "block";
	});
	get('short-list-tab').addEventListener("mousedown", function(){
		get('main-list-wrapper').style.display = "none";
		$('#main-list-tab').removeClass("active");

		get('short-list').style.display = "block";
		$('#short-list-tab').addClass("active");
		get('sort-wrapper').style.display = "none";
	});

	function shortlist(data) {
		selectedCache[data.adId] = data;
		xcess.shortlistedCount++;
		get('short-list-shortlisted-count').innerHTML = xcess.shortlistedCount;

		// remove EMPTY message on first short-list
		if (xcess.shortlistedCount==1) {
			get('short-list').innerHTML = '';
		}

		// format posted date time
		data.displaypostedDateTime = getAgo(data.postedDateTime);

		//render template for shortlisted item AND APPEND to list
		var template = document.getElementById('short_list_el').innerHTML;
		var output = Mustache.render(template, data);
		get('short-list').insertAdjacentHTML('beforeend',output);

		//attach event
		var mainListIcon = get('mainlist-action-'+data.adId);
		mainListIcon.dataset.value = "1";
		mainListIcon.dataset.icon = "\uE015";
		mainListIcon.className = "shortlist-action-icon selected icon left";
		
		get('shortlist-action-'+data.adId).addEventListener("mousedown", function(){ 
			unShortlist(data.adId, true);
		});
		$('#shortlist-'+data.adId).on("mouseenter", function(){ 
			mapObj.highlightMarker(data);
		});
		$('#shortlist-'+data.adId).on("mouseleave", function(){ 
			mapObj.unhighlightMarker(data.adId);
		});
		$('#shortlist-'+data.adId).on("click", function(e){ 
			if($(e.target).is(".shortlist-action-icon")) return;
			detailBox.show(dataCache[d.adId]);
		});
	}

	function unShortlist(adId, waitForTransitionEvent) {
		delete selectedCache[adId];
		xcess.shortlistedCount--;
		get('short-list-shortlisted-count').innerHTML = xcess.shortlistedCount;

		get('shortlist-'+adId).className = "list-item-main unshortlist";
		
		if(transitionEvent && waitForTransitionEvent) {
			get('shortlist-'+adId).addEventListener(transitionEvent, function() {
				get('short-list').removeChild(get('shortlist-' + adId));
				mapObj.unhighlightMarker(adId);
				if (xcess.shortlistedCount==0) {
					var template = document.getElementById('short_list_empty_el').innerHTML;
					get('short-list').innerHTML+=Mustache.render(template, {message: 'Shortlist is empty'});
				}
			});
		} else {
			get('short-list').removeChild(get('shortlist-' + adId));
			mapObj.unhighlightMarker(adId);
			if (xcess.shortlistedCount==0) {
				var template = document.getElementById('short_list_empty_el').innerHTML;
				get('short-list').innerHTML+=Mustache.render(template, {message: 'Shortlist is empty'});
			}
		}

		var shortListIcon = get('mainlist-action-'+adId);
		shortListIcon.dataset.value = "0";
		shortListIcon.dataset.icon = "\uE016";
		shortListIcon.className = "shortlist-action-icon icon left";
	}

	function appendToMainList(data) {
		for (var i in data) {
			function inner(d) {
				//append in dataCache
				dataCache[d.adId] = d;
				
				// format posted date time
				d.displaypostedDateTime = getAgo(d.postedDateTime);

				var template = get('main_list_el').innerHTML;
				get('main-list').insertAdjacentHTML('beforeend', Mustache.render(template, d));

				var shortListIcon = get('mainlist-action-'+d.adId);
				shortListIcon.addEventListener("mousedown", function(){ 
					if (shortListIcon.dataset.value == "0") {
						shortlist(d);
					} else {
						unShortlist(d.adId, false)
					}
				});
				$('#mainlist-'+d.adId).on("click", function(e){ 
					if($(e.target).is(".shortlist-action-icon")) return;
					
					$(".list-item-main").removeClass("active");
					$('#mainlist-'+d.adId).addClass('active');
					detailBox.show(dataCache[d.adId]);
				});
				$('#mainlist-'+d.adId).on("mouseenter", function(){ 
					mapObj.highlightMarker(d);
				});
				$('#mainlist-'+d.adId).on("mouseleave", function(){ 
					mapObj.unhighlightMarker(d.adId);
				});
			};
			inner(data[i]);
		}
		
		if (xcess.shortlistedCount==0) {
			var template = document.getElementById('short_list_empty_el').innerHTML;
			get('short-list').innerHTML+=Mustache.render(template, {message: 'Shortlist is empty'});
		}
	}
	
	function loadFirst() {
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp=new XMLHttpRequest();
		}
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				//setMask(false);
				var get = function(el) { return document.getElementById(el) };
				var data = JSON.parse(xmlhttp.responseText);
				appendToMainList(data);
				mapObj.redrawResults(data);
			}
		}
		xmlhttp.open("GET","list_json.json",true);
		xmlhttp.send();
	}		

	function loadMore() {
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp=new XMLHttpRequest();
		}
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				//setMask(false);
				var get = function(el) { return document.getElementById(el) };
				var data = JSON.parse(xmlhttp.responseText);
				appendToMainList(data);
			}
		}
		xmlhttp.open("GET","list_json.json",true);
		xmlhttp.send();
	}

	loadFirst();
	
	return {
		first : function() {
		}		
	}
}


function detailBoxClosure() {
	var isActive = false;
    var photoIndex = 0;

	var requestObj = {
		message: ''
	};
	
		
	var setMask = function(flag) {
		if(flag) {
		} else {
		}
	};

	var init = function () {
		$("#detail-box-close-btn").click(function(){
			_hide();
		});
	}
	
	var _hide = function() {
		$('#detail-box').css('right', '-600px');
	}
	
	var _show = function() {
		$('#detail-box').css('right', '0px');
	}
	
	var _loadData = function(data) {
		var template = $('#detail-box-tmpl').html();
		$('#detail-box-content').html(Mustache.render(template, data));
	}
	
	init();
	
	return {
		reset: function() {
			document.getElementById('detail-box-content').scrollTop = 0;
		},
		open: function() {
			setMask(true);
			this.reset();
		},
		init: function() {
		},
		hide: function() {
			_hide();
		},
		show: function(data) {
			if(data) {
				_loadData(data);
			}
			_show();
		},
		getIsActive: function() {
			return isActive;
		},
		nextPhoto:function(){
			if(isActive && photoIndex < document.getElementsByClassName('detail-box-content-photo').length-1) {
				document.getElementsByClassName('detail-box-content-photo')[photoIndex].style.webkitTransform='translate(-445px, 0px)';
				document.getElementsByClassName('detail-box-content-photo')[photoIndex].style.transform='translate(-445px, 0px)';

				document.getElementsByClassName('detail-box-content-photo')[photoIndex+1].style.webkitTransform='translate(0px, 0px)';
				document.getElementsByClassName('detail-box-content-photo')[photoIndex+1].style.transform='translate(0px, 0px)';

				photoIndex++;
				document.getElementById('detail-box-gallery-counter').innerHTML = (photoIndex+1)+" of "+ document.getElementsByClassName('detail-box-content-photo').length;
			}
			return photoIndex;
		},
		prevPhoto:function(){
			if(isActive && photoIndex>0) {
				document.getElementsByClassName('detail-box-content-photo')[photoIndex].style.webkitTransform='translate(445px, 0px)';
				document.getElementsByClassName('detail-box-content-photo')[photoIndex].style.transform='translate(445px, 0px)';

				document.getElementsByClassName('detail-box-content-photo')[photoIndex-1].style.webkitTransform='translate(0px, 0px)';
				document.getElementsByClassName('detail-box-content-photo')[photoIndex-1].style.transform='translate(0px, 0px)';

				photoIndex--;
				document.getElementById('detail-box-gallery-counter').innerHTML = (photoIndex+1)+" of "+ document.getElementsByClassName('detail-box-content-photo').length;
			}
			return photoIndex;
		}
	}
};


	google.maps.event.addDomListener(window, 'load', mapObj=initializeMap());
	//console.log(mapObj);
	var listBox = listBoxClosure();
	var detailBox = detailBoxClosure();
	
	document.addEventListener("keydown", function(e) {
		if(e.keyCode==37) {
			//detailBox.prev();
		} else if(e.keyCode==39) {
			//detailBox.next();
		} else if(e.keyCode==27) {
			detailBox.hide();
		}
	}, true);

}