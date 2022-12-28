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
  payload["styleseat-link"] = $("#styleseat-link")[0].getAttribute("value");

  console.log(payload);

  $.ajax({
    url: `${window.location.origin}//google/create-gbp/listing`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify(payload),
    dataType: 'json',
    success: function (response) {
      $("#step1")[0].classList.add('d-none');
      $("#step2")[0].classList.remove('d-none');
    },
  });
})

$("#verify-btn").click((e) => {
  var payload = {};
  payload["otp"] = $("#google-otp")[0].getAttribute("value");
  payload["styleseat-link"] = $("#styleseat-link")[0].getAttribute("value");

  console.log(payload);

  $.ajax({
    url: `${window.location.origin}//google/verify-gbp/listing`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify(payload),
    dataType: 'json',
    success: function (response) {
      $("#step2")[0].classList.add('d-none');
      $("#step3")[0].classList.remove('d-none');
    },
  });
})

$("#skip-btn").click((e) => {
  $("#step3")[0].classList.add('d-none');
  $("#step4")[0].classList.remove('d-none');
})

$("#own-btn").click((e) => {
  var payload = {};
  payload["email"] = $("#email")[0].getAttribute("value");
  payload["styleseat-link"] = $("#styleseat-link")[0].getAttribute("value");

  console.log(payload);

  $.ajax({
    url: `${window.location.origin}//google/own-gbp/listing`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify(payload),
    dataType: 'json',
    success: function (response) {
      $("#step3")[0].classList.add('d-none');
      $("#step4")[0].classList.remove('d-none');
    },
  });
})


