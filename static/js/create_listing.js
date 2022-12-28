// var firebaseConfig = {
//   apiKey: "AIzaSyAu7nMq5SJrSC2OmYnish8yHQ-fpW0qLQU",
//   authDomain: "timelyai-314916.firebaseapp.com",
//   databaseURL: "https://timelyai-314916-default-rtdb.firebaseio.com",
//   projectId: "timelyai-314916",
//   storageBucket: "timelyai-314916.appspot.com",
//   messagingSenderId: "396419005169",
//   appId: "1:396419005169:web:45843f3ec296cf74200750",
//   measurementId: "G-5VGF97DNMJ"
// };
// firebase.initializeApp(firebaseConfig);

// var post_photo_url = '', offer_photo_url = '';


$(".form-control").on('input', (e) => {
  e.target.setAttribute("value", e.target.value);
})

$("#submit-btn").click((e) => {
  var payload = {};
  payload["name"] = $("#name")[0].getAttribute("value");
  payload["address"] = $("#address")[0].getAttribute("value");
  payload["phone"] = $("#phone")[0].getAttribute("value");
  payload["description"] = $("#description")[0].getAttribute("value");
  payload["categories"] = $("#categories")[0].getAttribute("value");
  payload["serviceName"] = $("#serviceName")[0].getAttribute("value");
  payload["servicePrice"] = $("#servicePrice")[0].getAttribute("value");
  payload["serviceDescription"] = $("#serviceDescription")[0].getAttribute("value");
  payload["postDate"] = $("#postDate")[0].getAttribute("value");
  payload["postBody"] = $("#postBody")[0].getAttribute("value");
  payload["postPhoto"] = post_photo_url;
  payload["postButton"] = $("#postButton")[0].getAttribute("value");
  payload["offer"] = $("#offer")[0].getAttribute("value");
  payload["offerPhoto"] = offer_photo_url;
  payload["offerButton"] = $("#offerButton")[0].getAttribute("value");

  console.log(payload);

  $.ajax({
    url: `${window.location.origin}/gmb_profile_data?place_id=${window.location.pathname.split("/profile/")[1]}`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify(payload),
    dataType: 'json',
    success: function (response) {
      console.log("done");
    },
  });
})

// Uploading post image
$("#post-image-upload").click(() => {
  if([...$("#post-image-upload")[0].classList].includes("btn-inverse-primary")){
    $("#post-file-selected").click();
  }
})

$("input#post-file-selected").change((e) => {
  $("#post-image-selected")[0].setAttribute("value", e.target.files[0]['name']);
  $("#post-image-upload")[0].classList.remove("btn-inverse-primary");
  $("#post-image-upload")[0].innerHTML = "Upload";
  $("#post-image-upload")[0].classList.add("btn-primary");
})

$("#post-image-upload").click(async () => {
  if([...$("#post-image-upload")[0].classList].includes("btn-primary")){
    if($("#post-file-selected")[0].files.length==0){
      alert("Please select an image.");
    } else{
      var files = new FormData();
      files.append("file", $("#post-file-selected")[0].files[0]);
      $("#post-image-upload")[0].innerHTML = "Uploading";
  
      var filename = $("#post-file-selected")[0].files[0]['name'];
      var place_id = window.location.pathname.split("/profile/")[1];
  
      let soragePath = `gmb/${place_id}/post/${filename}`;
      var storageRef = firebase.storage().ref(soragePath);
      storageRef.put($("#post-file-selected")[0].files[0]).then((e) => {
        post_photo_url = `https://firebasestorage.googleapis.com/v0/b/timelyai-314916.appspot.com/o/gmb%2f${place_id}%2fpost%2f${filename}?alt=media`;
        setInterval(() => {
          $("#post-image-upload")[0].classList.remove("btn-primary");
          $("#post-image-upload")[0].innerHTML = "Chose";
          $("#post-image-upload")[0].classList.add("btn-inverse-primary");
        }, 1500);
        $("#post-image-upload")[0].innerHTML = "Uploaded";
        $("#post-image-selected")[0].setAttribute("value", "");
      })
    }
  }
})


// Uploading offer image
$("#offer-image-upload").click(() => {
  if([...$("#offer-image-upload")[0].classList].includes("btn-inverse-primary")){
    $("#offer-file-selected").click();
  }
})

$("input#offer-file-selected").change((e) => {
  $("#offer-image-selected")[0].setAttribute("value", e.target.files[0]['name']);
  $("#offer-image-upload")[0].classList.remove("btn-inverse-primary");
  $("#offer-image-upload")[0].innerHTML = "Upload";
  $("#offer-image-upload")[0].classList.add("btn-primary");
})

$("#offer-image-upload").click(async () => {
  if([...$("#offer-image-upload")[0].classList].includes("btn-primary")){
    if($("#offer-file-selected")[0].files.length==0){
      alert("Please select an image.");
    } else{
      var files = new FormData();
      files.append("file", $("#offer-file-selected")[0].files[0]);
      $("#offer-image-upload")[0].innerHTML = "Uploading";
  
      var filename = $("#offer-file-selected")[0].files[0]['name'];
      var place_id = window.location.pathname.split("/profile/")[1];
  
      let soragePath = `gmb/${place_id}/offer/${filename}`;
      var storageRef = firebase.storage().ref(soragePath);
      storageRef.put($("#offer-file-selected")[0].files[0]).then((e) => {
        offer_photo_url = `https://firebasestorage.googleapis.com/v0/b/timelyai-314916.appspot.com/o/gmb%2f${place_id}%2foffer%2f${filename}?alt=media`;
        setInterval(() => {
          $("#offer-image-upload")[0].classList.remove("btn-primary");
          $("#offer-image-upload")[0].innerHTML = "Chose";
          $("#offer-image-upload")[0].classList.add("btn-inverse-primary");
        }, 1500);
        $("#offer-image-upload")[0].innerHTML = "Uploaded";
        $("#offer-image-selected")[0].setAttribute("value", "");
      })
    }
  }
})


