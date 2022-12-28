var initial_lat_lng = {lat: 39.8622355,lng: -98.7004741};
var local_lat_lng = {};
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: initial_lat_lng,
  });

}

window.initMap = initMap;

const colorSpitter = (rank) => {
  if(rank<5) {
    return "00FF00";
  } else if(rank<10) {
    return "40FF00";
  } else if(rank<20) {
    return "90FF00";
  } else if(rank<30) {
    return "D0FF00";
  } else if(rank<40) {
    return "FFE000";
  } else if(rank<60) {
    return "FF9000";
  } else if(rank<100) {
    return "FF4000";
  } else{
    return "FF0000";
  }
}

//${window.location.origin}
$.ajax({
  url: `${window.location.origin}/get-local-rank?place_id=${place_id}&keyword=${keyword}&ismax=${ismax}`
}).then(function (response){
  console.log(response);
  let lats = response['rank_data'].map((e) => e[0]).sort();
  let lngs = response['rank_data'].map((e) => e[1]).sort();
  let rank_data = response['rank_data']//.filter((e,i) => !(e[0]==lats[0] || e[0]==lats[48] || e[1]==lngs[0] || e[1]==lngs[48]));
  
  let location = {
    lat: parseFloat(response['lat']),
    lng: parseFloat(response['lng'])
  }

  map.setCenter(location);
  map.setZoom(12.5);

  rank_data.map((rank, index) => {
    let loc = {};
    loc['lat'] = rank[0];
    loc['lng'] = rank[1];

    new google.maps.Marker({
      position: loc,
      label: {
        text: `${rank[2]}`,
        color: "black"
      },
      icon: {
        url:'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg"><circle cx="110" cy="110" r="100" stroke="white" fill="#${colorSpitter(rank[2])}" fill-opacity="1.0" stroke-width="10" /></svg>`),
        size: new google.maps.Size(200, 200),
        scaledSize: new google.maps.Size(42, 42),
        anchor: new google.maps.Point(21, 21),
        labelOrigin: new google.maps.Point(21, 21)
      },
      map,
    });

  })

  new google.maps.Marker({
    position: location,
    icon: {
      url:'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 293.334 293.334" style="enable-background:new 0 0 293.334 293.334;" xml:space="preserve">
      <g>
        <g>
          <path style="fill:#010002;" d="M146.667,0C94.903,0,52.946,41.957,52.946,93.721c0,22.322,7.849,42.789,20.891,58.878    c4.204,5.178,11.237,13.331,14.903,18.906c21.109,32.069,48.19,78.643,56.082,116.864c1.354,6.527,2.986,6.641,4.743,0.212    c5.629-20.609,20.228-65.639,50.377-112.757c3.595-5.619,10.884-13.483,15.409-18.379c6.554-7.098,12.009-15.224,16.154-24.084    c5.651-12.086,8.882-25.466,8.882-39.629C240.387,41.962,198.43,0,146.667,0z M146.667,144.358    c-28.892,0-52.313-23.421-52.313-52.313c0-28.887,23.421-52.307,52.313-52.307s52.313,23.421,52.313,52.307    C198.98,120.938,175.559,144.358,146.667,144.358z"/>
          <circle style="fill:#010002;" cx="146.667" cy="90.196" r="21.756"/>
        </g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      </svg>`),
      size: new google.maps.Size(293.334, 293.334),
      scaledSize: new google.maps.Size(30, 30),
      anchor: new google.maps.Point(15, 35),
    },
    map,
  });
  
})

// $.ajax({
//   url: `${window.location.origin}/log-route-open`,
//   type: "post",
//   contentType: 'application/json',
//   data: JSON.stringify({
//     "place_id":localStorage["place_id"],
//     "biz_name":localStorage["biz_name"],
//     "email":localStorage["email"],
//     "route":window.location.pathname
//   }),
//   dataType: 'json'
// })

