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

var circle;
var radiusMarker;
var centerMarker;
var radiusInfo;
//var map;

var mapObj;

function initializeMap() {
	markerCache = {};
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
				var newFormattedAddress = '';
				if (data.results[0]!=undefined && data.results[0].formatted_address != undefined) {
					var splittedAddress = data.results[0].formatted_address.split(',');
					for (var i=0; i<splittedAddress.length-2; i++) {
						newFormattedAddress += splittedAddress[i] + ',';
					}
					newFormattedAddress = newFormattedAddress.substr(0,newFormattedAddress.length-1);
				}
				document.getElementById('header-select-locality').value=newFormattedAddress;
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
					var newFormattedAddress =  '';
					for (var i=0; i<splittedAddress.length-2; i++) {
						newFormattedAddress += splittedAddress[i] + ',';
					}
					newFormattedAddress = newFormattedAddress.substr(0,newFormattedAddress.length-1);
					document.getElementById('header-select-locality').value=newFormattedAddress;
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

	var imageMarker = new google.maps.MarkerImage("images/loc.png",
        new google.maps.Size(32, 52), 
        new google.maps.Point(0,0),
        new google.maps.Point(0, 52)
    );
	var imageMarkerSelected = new google.maps.MarkerImage("images/loc.png",
        new google.maps.Size(32, 52), 
        new google.maps.Point(0,0),
        new google.maps.Point(0, 55)
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
	
	var circleOptions = {
      strokeColor: '#888888',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#Fefefe',
      fillOpacity: 0.25,
      map: map,
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
		infoBox.setContent('<div class="map-infobox"><span class="map-infobox-highlight">'+ centerMarker.getPosition().toString() +'</span><BR>Drag to move circle</div>');
		infoBox.open(map, centerMarker);
	});
	google.maps.event.addListener(centerMarker, 'mouseup', function(event) {
		infoBox.setContent('<div class="map-infobox"><span class="map-infobox-highlight">'+ centerMarker.getPosition().toString() +'</span><BR>Drag to move circle</div>');
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
					animation: google.maps.Animation.DROP,
					title: data.title + '-' + data.adId
				});
				google.maps.event.addListener(marker, 'mouseover', function(event) {
					this.setIcon(imageMarkerSelected);
				});
				google.maps.event.addListener(marker, 'mouseout', function(event) {
					this.setIcon(imageMarker);
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
		highlightMarker: function(id) {
			markerCache[id].setIcon(imageMarkerSelected);
		},
		unhighlightMarker: function(id) {
			markerCache[id].setIcon(imageMarker);
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
		get('short-list-tab').className="tab left";
		
		get('main-list-wrapper').style.display = "block";
		get('main-list-tab').className="tab active left";
		get('sort-wrapper').style.display = "block";
	});
	get('short-list-tab').addEventListener("mousedown", function(){
		get('main-list-wrapper').style.display = "none";
		get('main-list-tab').className="tab left";

		get('short-list').style.display = "block";
		get('short-list-tab').className="tab active left";
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
		get('shortlist-'+data.adId).addEventListener("mouseover", function(){ 
			mapObj.highlightMarker(data.adId);
		});
		get('shortlist-'+data.adId).addEventListener("mouseout", function(){ 
			mapObj.unhighlightMarker(data.adId);
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
				if (xcess.shortlistedCount==0) {
					var template = document.getElementById('short_list_empty_el').innerHTML;
					get('short-list').innerHTML+=Mustache.render(template, {message: 'Shortlist is empty'});
				}
			});
		} else {
			get('short-list').removeChild(get('shortlist-' + adId));
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
		var i;
		for (i in data) {
			function inner(d) {
				// format posted date time
				d.displaypostedDateTime = getAgo(d.postedDateTime);

				var template = document.getElementById('main_list_el').innerHTML;
				get('main-list').insertAdjacentHTML('beforeend', Mustache.render(template, d));

				var shortListIcon = get('mainlist-action-'+d.adId);
				shortListIcon.addEventListener("mousedown", function(){ 
					if (shortListIcon.dataset.value == "0") {
						shortlist(d);
					} else {
						unShortlist(d.adId, false)
					}
				});
				get('mainlist-'+d.adId).addEventListener("mouseover", function(){ 
					mapObj.highlightMarker(d.adId);
				});
				get('mainlist-'+d.adId).addEventListener("mouseout", function(){ 
					mapObj.unhighlightMarker(d.adId);
				});
			};
			inner(data[i]);
		}

	}
	
	function appendToMainList2(data) {
		var i;
		for (i in data) {
		function inner(d) {
			var listEl = get('main-list');
			
			var wrapper = document.createElement('div');
			wrapper.className="list-item-main";
			wrapper.addEventListener("mouseover", function(){ 
				mapObj.highlightMarker(d.adId);
			});
			wrapper.addEventListener("mouseout", function(){ 
				mapObj.unhighlightMarker(d.adId);
			});
			
			
				var image = document.createElement('div');
				image.className="list-item-pic";
				image.style.backgroundImage = "url("+d.coverPhoto.url+")";
				wrapper.appendChild(image);
				
				var content = document.createElement('div');
				content.className="list-item-content";
				wrapper.appendChild(content);
					var iconsWrapper = document.createElement('div');
					iconsWrapper.className="list-item-icons";
					content.appendChild(iconsWrapper);
						//var icon = document.createElement('div');
						//icon.className="icon left";
						//icon.dataset.icon = "\uE00e";
						//iconsWrapper.appendChild(icon);
						var icon = document.createElement('div');
						icon.className="shortlist-action-icon icon left";
						icon.dataset.icon = "\uE016";
						icon.dataset.value = "0";
						icon.addEventListener("mousedown", function(){ 
							if (icon.dataset.value == "0") {
								icon.dataset.value = "1";
								icon.dataset.icon = "\uE015";
								icon.className = "shortlist-action-icon selected icon left";
								shortlist(d, wrapper);
							} else {
								icon.dataset.value = "0";
								icon.dataset.icon = "\uE016";
								icon.className = "shortlist-action-icon icon left";
								unShortlist(d.adId)
							}
						});

						iconsWrapper.appendChild(icon);

					var title = document.createElement('div');
					title.className="list-item-title";
					title.innerHTML = d.title;
					content.appendChild(title);

					var location = document.createElement('div');
					location.className="list-item-location";
					location.innerHTML = "<div class='icon left' data-icon='&#xe006;'></div>"+d.location.area;
					content.appendChild(location);

					var conditionWrapper = document.createElement('div');
					conditionWrapper.className="list-item-conditionWrapper";
					conditionWrapper.innerHTML = "<div class='list-item-location left'>Used For <span class='list-item-highlight'>2 years</span></div>";
					conditionWrapper.innerHTML += "<div class='list-item-location left' style='margin-left:15px;'>Condition <span class='list-item-highlight'>Bad</span></div>";
					content.appendChild(conditionWrapper);

					var price = document.createElement('div');
					price.className="list-item-price";
					price.innerHTML = '<div class="list-item-price-currency icon left" data-icon="&#xe017;"></div>' + d.price;
					content.appendChild(price);

					var postedDateTime = document.createElement('div');
					postedDateTime.className="list-item-time";
					postedDateTime.innerHTML = getAgo(d.postedDateTime);
					content.appendChild(postedDateTime);
					
			listEl.appendChild(wrapper);
			
			}
			inner(data[i]);
		}
		
		if (document.getElementById('list-load-more'))
			document.getElementById('main-list-wrapper').removeChild(document.getElementById('list-load-more'));
		
		var loadMoreButton = document.createElement('div');
		loadMoreButton.className="list-load-more";
		loadMoreButton.innerHTML = "<span>Show More</span>";
		loadMoreButton.id = "list-load-more";
		loadMoreButton.addEventListener("mousedown", function(){
			loadMore();
		});		
		document.getElementById('main-list-wrapper').appendChild(loadMoreButton);
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
	google.maps.event.addDomListener(window, 'load', mapObj=initializeMap());
	console.log(mapObj);
	listBoxClosure();
}