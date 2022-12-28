var impressionsData;
var impressionsOptions;
var share_report_link = "";
var review_url;
var target;
var upload_flag = true

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

var bucketName = "gmb-sp-image-bank";
var bucketRegion = "us-east-1";
var accessKeyId = "AKIASQ6IOBTRMCB3LP5W";
var secretAccessKey = "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";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: bucketRegion
});

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName }
});

$("#image-upload").click(() => {
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn":"image-upload"
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });
    $("#file-selected").click();
})

$("#image-rechoose").click(() => {
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn":"reselect-images"
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });

  removeFiles()
  if([...$("#image-rechoose")[0].classList].includes("btn-inverse-secondary")){
    $("#file-selected").click();
  }
})

$("input#file-selected").change((e) => {
  let files_text = ''
  let files_list = [...$("#file-selected")[0].files];
  let total_files = files_list.length;

  $("#image-upload-final").removeClass("d-none")

  if(total_files>20){
    alert("Only the first 20 images are selected for uploading.");
    files_list = files_list.slice(0,20);
    total_files = 20;
  }

  let alerted = false;
  files_list.map((f,index) => {
    var fr = new FileReader;
    fr.onload = function() {
        var img = new Image;
        
        img.onload = function() {
          if(img.width<250 || img.height<250){
            if(alerted==false){
              // alert("Some images has dimensions smaller than 250px. They will not get uploaded.");
              // files_list = [];
              alerted = true
              // $("#image-selected")[0].setAttribute("value", '');
              // $("#image-upload")[0].classList.add("btn-inverse-primary");
              // $("#image-upload")[0].innerHTML = "Choose Images";
              // $("#image-upload")[0].classList.remove("btn-primary");
              // $("#image-rechoose")[0].classList.add("d-none");
              // $('#files-upload-summary-wrap')[0].classList.add("d-none");
              // $('#files-upload-summary')[0].innerHTML = ``;
            }
          }
        };
        
        img.src = fr.result;
        file_type = fr.result.split(';')
        if(file_type[0].includes('image')){
          // console.log("image selected")
          addImage(fr.result,f.name)
        }
        if(file_type[0].includes('video')){
          addVideo(fr.result,f.name)
        }
    };
    
    fr.readAsDataURL(f);
  })



  files_list.map(f => {
    files_text += f["name"]+", ";
  });
  if(files_list.length){
    $("#image-selected")[0].setAttribute("value", files_text.slice(0, files_text.length-2));
    // $("#image-upload")[0].classList.remove("btn-inverse-primary");
    // $("#image-upload")[0].innerHTML = "Upload Selected Images";
    $("#image-upload")[0].classList.add("d-none");
    $("#image-rechoose")[0].classList.remove("d-none");
    $('#files-upload-summary-wrap')[0].classList.remove("d-none");
    $('#files-upload-summary')[0].innerHTML = `Total <b>${total_files} images</b> selected`;
    // $("#image-upload")[0].click();
    // setTimeout(() => {
    //   alert("Click on 'Upload Selected Images' button.");
    // }, 2000)
  }
})

const addImage = (f,name) =>{
  // console.log("add image")
  let disp_div = document.createElement("div")
  disp_div.className = "col-xs-4"
  disp_div.style.padding = "10px"
  disp_div.style.textAlign = "-webkit-center"
  let dis_img = document.createElement("img")
  dis_img.src = f
  dis_img.height = 100
  dis_img.width = 100
  dis_img.style.padding = "5px"
  let remove_btn = document.createElement("button")
  remove_btn.addEventListener("click",removeItem, false)
  remove_btn.innerHTML = "Remove"
  remove_btn.setAttribute("value",name)
  remove_btn.style.display = "flex"
  remove_btn.style.padding = "5px"
  remove_btn.setAttribute("class","btn btn-primary")
  let container = document.getElementById("uploaded_files")
  container.appendChild(disp_div)
  disp_div.appendChild(dis_img)
  disp_div.appendChild(remove_btn)
}

const addVideo = (f,name) =>{
  // console.log("add video")
  let disp_div = document.createElement("div")
  disp_div.className = "col-xs-4"
  disp_div.style.padding = "10px"
  disp_div.style.textAlign = "-webkit-center"
  let dis_vid = document.createElement("video")
  dis_vid.src = f
  dis_vid.height = 100
  dis_vid.width = 100
  dis_vid.style.padding = "5px"
  dis_vid.autoplay = true
  dis_vid.muted = true
  let remove_btn = document.createElement("button")
  remove_btn.addEventListener("click",removeItem, false)
  remove_btn.innerHTML = "Remove"
  remove_btn.setAttribute("value",name)
  remove_btn.style.display = "flex"
  remove_btn.style.padding = "5px"
  remove_btn.setAttribute("class","btn btn-primary")
  let container = document.getElementById("uploaded_files")
  container.appendChild(disp_div)
  disp_div.appendChild(dis_vid)
  disp_div.appendChild(remove_btn)
}

const removeItem = (e) => {
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn":"remove-selected-image"
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });
  // console.log("element value",e.target.value)
  let files = Array.from($("#file-selected")[0].files)
  files = files.filter((item) =>{
    // console.log(item.name)
    // console.log(e.target.value)
    return item.name !== e.target.value 
  })
  files_text = ''
  // console.log(files)
  let file_selected = document.getElementById("file-selected")
  const dataTransfer = new DataTransfer()
  files.map(f=>
    dataTransfer.items.add(f)
  )
  file_selected.files = dataTransfer.files
  let files_list = [...$("#file-selected")[0].files];
  files_list.map(f => {
      files_text += f["name"]+", ";
  });
  // console.log($("#file-selected")[0].files)
  let total_files = files_list.length;
  console.log("Total files",total_files)
  if(total_files === 0){
    console.log("total files is 0")
    $("#image-rechoose").addClass("d-none")
    $("#image-upload").removeClass("btn-primary")
    $("#image-upload").removeClass("d-none")
    $('#files-upload-summary')[0].innerHTML = "";
    $('#files-upload-summary').addClass("d-none");
    $("#files-upload-summary-wrap").addClass("d-none");
    $("#image-upload").addClass("btn-inverse-primary")
    $("#image-upload").html("Choose Image")
    $("#image-upload-final").addClass("d-none")
  }

  $('#files-upload-summary')[0].innerHTML = `Total <b>${total_files} images</b> selected`;
  $("#image-selected")[0].setAttribute("value", files_text.slice(0, files_text.length-2));
  var parent = e.target.parentElement;
  let container = document.getElementById("uploaded_files")
  container.removeChild(parent)

}

const removeFiles = () => {
  $("#image-selected")[0].setAttribute("value", '');
  $('#files-upload-summary')[0].innerHTML = "";
  $("#image-upload-final").addClass("d-none");
  $("#files-upload-summary-wrap").addClass("d-none");
  $("#image-upload").removeClass("d-none");
  let container = document.getElementById("uploaded_files")
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

// const uploadPhoto = async (f,name) => {
//   // console.log(name)
//   return new Promise((res, rej) => {
//     var filename = f['name'];
//     var place_id = localStorage['place_id'];

//     let storagePath = `gmb/${place_id}/${filename}`;
//     var storageRef = firebase.storage().ref(storagePath);
//     var task = storageRef.put(f);
//     task.on('state_changed',
//     function progress(snapshot){
//       var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
//         $(`button[value="${name}"]`).text(`${parseInt(percentage)}%`)
//     },
//     function error(err){

//     },
//     function complete(){
//         res(`https://firebasestorage.googleapis.com/v0/b/timelyai-314916.appspot.com/o/gmb%2f${place_id}%2f${filename}?alt=media`);
//     }
//   );
//   })
// }

async function addPhoto(f,name) {
  return new Promise((res, rej) => {
    var file = f;
    var fileName = name;
    var albumPhotosKey = `${localStorage["place_id"]}/`;

    var photoKey = albumPhotosKey + fileName;

    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: bucketName,
        Key: photoKey,
        Body: file
      }
    });

    upload.on('httpUploadProgress', function(evt) {
      var uploaded = Math.round(evt.loaded / evt.total * 100);
      $(`button[value="${name}"]`).text(`${parseInt(uploaded)}%`)
    });

    var promise = upload.promise();

    promise.then(
      function(data) {
        res(`https://gmb-sp-image-bank.s3.amazonaws.com/${albumPhotosKey}`)
      },
      function(err) {
        res("")
      }
    );
  })
}

let uploading = false;
$("#image-upload-final").click(async () => {
  if (upload_flag === true){
      upload_flag=false
      $.ajax({
        url: `${window.location.origin}/log-btn-click`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({
          "place_id":localStorage["place_id"],
          "route":window.location.pathname,
          "email":localStorage["email"],
          "btn":"selected-image-upload"
        }),
        dataType: 'json'
      }).catch((e) => {
        console.log(e)
      });

      upload_div = document.getElementById("uploaded_files");
      remove_btns = upload_div.getElementsByTagName("button");
      for(let btn of remove_btns){
        btn.disabled = true
        btn.innerHTML = 0
      }
  
      $("#image-rechoose")[0].classList.add("d-none");
      var files = new FormData();
      let files_list = [...$("#file-selected")[0].files].slice(0, 20);

      files_list.map(f => files.append("file", f))
      
      $("#image-upload")[0].innerHTML = "Uploading";

      let links = [];

      let promises = [];

      files_list.map((f) => {
        promises.push(addPhoto(f,f.name));
      })

      links = await Promise.all(promises);
      links = links.filter((e) => e!="");
      
      let total_files = files_list.length;

      try{
        var uploaded_by_user = ""
        files_list.map((f,index) => {
          uploaded_by_user += `||${f["name"]}`;
        });
        console.log("brefore slack noti")
        $.ajax({
          url: `${window.location.origin}/send_slack_notification_pics?place_id=${localStorage["place_id"]}&email=${localStorage["email"]}&biz_name=${localStorage["biz_name"]}`,
          type: "post",
          contentType:"application/json",
          dataType:"json",
          data: JSON.stringify({
            "message":`${uploaded_by_user}`,
            "source": "webapp"
          })
        })
        }
        catch(e){
          console.log(e)
        }
      
        $("#image-upload-final")[0].innerHTML = "All Uploaded";
        alert(`${total_files} files have been uploaded. Some media file can take time to get uploaded as Google verifies the media content for quality purposes.`)

        removeFiles()
        $("#image-selected")[0].setAttribute("value", "");
        $('#files-upload-summary-wrap')[0].classList.add("d-none");
        $('#files-upload-summary-wrap')[0].classList.add("d-none");
        // $('#files-upload-summary')[0].innerHTML = `Total <b>${total_files} images</b> uploaded`;
        $("#image-upload")[0].innerHTML = "Chose Images";
        $("#image-upload")[0].classList.add("btn-inverse-primary");
        $("#image-upload")[0].classList.remove("btn-primary");
        $("#image-upload")[0].classList.remove("btn-primary");
        $("#image-upload")[0].classList.remove("d-none");
    
        $.ajax({
          url: `${window.location.origin}/upload_image`,
          type: "post",
          contentType: 'application/json',
          data: JSON.stringify({
            "email":localStorage["email"],
            "file_type":`PHOTO`,
            "urls":links,
          }),
          dataType: 'json'
        }).then(()=>{
          upload_flag=true
          $('#files-upload-summary-wrap')[0].classList.add("d-none")
          $("#image-upload-final")[0].classList.remove("disabled")
          $("#image-upload-final")[0].innerHTML = "Upload Photos";
        }).catch((e) => {
          console.log(e)
          upload_flag=true
          $('#files-upload-summary-wrap')[0].classList.add("d-none")
          $("#image-upload-final")[0].classList.remove("disabled")
          $("#image-upload-final")[0].innerHTML = "Upload Photos";
        });
    } 
})

$("*[id$='_tab']").click((e) => {
  var id = e.currentTarget.getAttribute('id');

  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn":id
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });

  let tab_name = id.split("_")[0];

  if (tab_name=='home'){
    tab_name = "dashboard";
  }
  window.location.href = window.location.href.split('/google/')[0] + '/google/' + tab_name;
})