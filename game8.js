function initialize() {
  var req = new XMLHttpRequest();
  req.open('GET', 'http://people.rit.edu/cjl8505/rochester.json', false); // todo: make asynchronous
  req.send();
  console.log(req.status);
  console.log(req.responseText);
  var game = JSON.parse(req.responseText);
  game.mapOptions.center = new google.maps.LatLng(
    game.mapOptions.center.lat,
    game.mapOptions.center.long
  );
  var map = new google.maps.Map(document.getElementById('map-canvas'),
    game.mapOptions);
  window.map = map;
  window.game = game;
  newDest(game.points[0].position.lat, game.points[0].position.long);
  document.getElementById('story').innerHTML = game.points[game.current].text;
}
google.maps.event.addDomListener(window, 'load', initialize);
console.log('z');
setTimeout(function(){if (!window.map){initialize();}}, 3000);
setInterval(function(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      document.getElementById('pos').innerHTML = degreeString(position.coords.latitude, position.coords.longitude);
    });
  }
}, 2000);

function centerOnUser(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);
    });
  } else {
    alert('Geolocation failed');
  }
}
function checkCode(){
  code = document.getElementById('secretCode').value.toLowerCase();
  next = game.points[game.current].next; // dict of possible next points
  if (code in next){
    game.current = next[code];
    newDest(game.points[game.current].position.lat, game.points[game.current].position.long);
	document.getElementById('story').innerHTML = game.points[game.current].text;
  } else {
    alert('Try again');
  }
  document.getElementById('secretCode').value = '';
}
hintPin = (function (){
  var marker;
  var hide=true;
  
  return function (){
    hide = !hide;
	console.log(hide);
	if (hide && marker){
	  return marker.setMap(null);
	} else {
	  marker = new google.maps.Marker({
        position: game.dest,
        map: map,
        title:"Hello World!"
      });
	}
  };
})();
function newDest(lat, lon){
  document.getElementById('coords').innerHTML = degreeString(lat, lon);
  window.game.dest = new google.maps.LatLng(lat, lon)
}
function degreeString(lat, lng){
  return lat.toFixed(6) + ' N, ' + lng.toFixed(6) + ' W';
}