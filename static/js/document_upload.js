// if(localStorage["email"]==undefined){
//   window.location.href = `${window.location.origin}/login`;
// }

let id_file = '', ut_file = '';

$.ajax({
  url: `${window.location.origin}/check_user?email=${localStorage["email"]}`
}).then((res) => {
  if(res["res"]=="nouser"){
    window.location.href = `${window.location.origin}/login`;
  }else{
    var parentElem = $(".container-scroller")[0];
    parentElem.classList.remove('d-none');
    $.ajax({
      url: `${window.location.origin}/log-route-open`,
      type: "post",
      contentType: 'application/json',
      data: JSON.stringify({
        "place_id":localStorage["place_id"],
        "biz_name":localStorage["biz_name"],
        "email":localStorage["email"],
        "route":window.location.pathname
      }),
      dataType: 'json'
    })
    console.log("user");
    localStorage["place_id"] = res["place_id"];
    localStorage["biz_name"] = res["biz_name"];
  }
})


const log_upload_data = () => {
  $.ajax({
    url: `${window.location.origin}/upload_biz_docs`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "email":localStorage["email"],
      "biz_name":localStorage["biz_name"],
      "place_id":localStorage["place_id"],
      id_file,
      ut_file
    }),
    dataType: 'json'
  }).then(function () {
    setTimeout(() => {
      window.location.href = `${window.location.origin}/google/dashboard`;
    }, 5000);
    $("#exampleModal").modal('toggle');
    $("#submit-btn").html("Uploaded");
  });
}

var firebaseConfig = {
  apiKey: "AIzaSyAu7nMq5SJrSC2OmYnish8yHQ-fpW0qLQU",
  authDomain: "timelyai-314916.firebaseapp.com",
  databaseURL: "https://timelyai-314916-default-rtdb.firebaseio.com",
  projectId: "timelyai-314916",
  storageBucket: "timelyai-314916.appspot.com",
  messagingSenderId: "396419005169",
  appId: "1:396419005169:web:45843f3ec296cf74200750",
  measurementId: "G-5VGF97DNMJ"
};
firebase.initializeApp(firebaseConfig);

$("#id-file-upload").click(() => {
  $("#id-file-selected").click();
})

$("input#id-file-selected").change((e) => {
  $("#id-file-display")[0].setAttribute("value", e.target.files[0]['name']);
  $("#id-file-upload")[0].classList.remove("btn-inverse-primary");
  $("#id-file-upload")[0].classList.add("btn-primary");

  if([...$("#ut-file-upload")[0].classList].includes("btn-primary")){
    $("#submit-btn").removeAttr("disabled");
  }
})


$("#ut-file-upload").click(() => {
  $("#ut-file-selected").click();
})

$("input#ut-file-selected").change((e) => {
  $("#ut-file-display")[0].setAttribute("value", e.target.files[0]['name']);
  $("#ut-file-upload")[0].classList.remove("btn-inverse-primary");
  $("#ut-file-upload")[0].classList.add("btn-primary");

  if([...$("#id-file-upload")[0].classList].includes("btn-primary")){
    $("#submit-btn").removeAttr("disabled");
  }
})

$("#submit-btn").click(async () => {
  if([...$("#submit-btn")[0].classList].includes("btn-primary")){
    if($("#ut-file-selected")[0].files.length==0){
      alert("Please select any bill related to electricity, phone, gas, water, sewage, trash, recycling, TV, internet, etc");
    } else if($("#id-file-selected")[0].files.length==0){
      alert("Please select any ID related file like official business registration, business license, or tax certificates");
    } else{
      $("#submit-btn").html("Uploading..");
      $("#submit-btn").attr("disabled", "");
  
      var ut_filename = $("#ut-file-selected")[0].files[0]['name'];
      var id_filename = $("#id-file-selected")[0].files[0]['name'];
      var place_id = localStorage['place_id'];
      var email = localStorage['email'];
  
      let ut_storagePath = `gmb/${place_id}/${email}/ut/${ut_filename}`;
      var ut_storageRef = firebase.storage().ref(ut_storagePath);
      ut_storageRef.put($("#ut-file-selected")[0].files[0]).then((e) => {
        ut_file = `https://firebasestorage.googleapis.com/v0/b/timelyai-314916.appspot.com/o/gmb%2f${place_id}%2f${email}%2fut%2f${ut_filename}?alt=media`;

        let id_storagePath = `gmb/${place_id}/${email}/id/${id_filename}`;
        var id_storageRef = firebase.storage().ref(id_storagePath);
        id_storageRef.put($("#id-file-selected")[0].files[0]).then((e) => {
          id_file = `https://firebasestorage.googleapis.com/v0/b/timelyai-314916.appspot.com/o/gmb%2f${place_id}%2f${email}%2fid%2f${id_filename}?alt=media`;
  
          log_upload_data()
        })
      })
    }
  }
})

$("*[id$='_tab']").click((e) => {
  var id = e.currentTarget.getAttribute('id');

  let tab_name = id.split("_")[0];

  if (tab_name=='home'){
    tab_name = "dashboard";
  }
  window.location.href = window.location.href.split('/google/')[0] + '/google/' + tab_name;
})
