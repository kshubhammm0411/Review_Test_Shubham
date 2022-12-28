

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
    console.log("image upload clicked")
    if([...$("#image-upload")[0].classList].includes("btn-inverse-primary")){
        $("#file-selected").click();
    }
})


$("input#file-selected").change((e) => {
    let files_text = ''
    let files_list = [...$("#file-selected")[0].files];
    let total_files = files_list.length;
  
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
    //   $("#image-selected")[0].setAttribute("value", files_text.slice(0, files_text.length-2));
      $("#image-upload")[0].classList.remove("btn-inverse-primary");
      $("#image-upload")[0].classList.add("d-none");
      $("#image-upload")[0].classList.add("btn-primary");
      $("#image-rechoose")[0].classList.remove("d-none");
    //   $('#files-upload-summary-wrap')[0].classList.remove("d-none");
    //   $('#files-upload-summary')[0].innerHTML = `Total <b>${total_files} images</b> selected`;
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

if(total_files === 0){
    $("#image-rechoose").addClass("d-none")
    $("#image-upload").removeClass("btn-primary")
    $("#image-upload").removeClass("d-none")
    $("#image-upload").addClass("btn-inverse-primary")
    $("#image-upload").html("Choose Image")
}

// $('#files-upload-summary')[0].innerHTML = `Total <b>${total_files} images</b> selected`;
// $("#image-selected")[0].setAttribute("value", files_text.slice(0, files_text.length-2));
var parent = e.target.parentElement;
let container = document.getElementById("uploaded_files")
container.removeChild(parent)

}
  
const removeFiles = () => {
//   $("#image-selected")[0].setAttribute("value", '');
//   $('#files-upload-summary')[0].innerHTML = "";
  $("#image-upload")[0].classList.remove("d-none");
  let container = document.getElementById("uploaded_files")
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

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
    // if([...$("#image-rechoose")[0].classList].includes("btn-inverse-secondary")){
        $("#file-selected").click();
    // }
})

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
          console.log("res from addPhoto func",data)
          res(data['Location'])
        },
        function(err) {
          res("")
        }
      );
    })
  }

$("#create_new_post").click(async ()=>{
    desc = $("#text_desc").val()

    if(desc===""){
        alert("Please enter description for post.");
        return;
    }
    $("#loader_div_newpost").removeClass("d-none")
    $("#create_new_post").addClass("d-none")
    let files_list = [...$("#file-selected")[0].files];
    if(files_list.length > 1){
        alert("Please select only 1 photo.")
        console.log("more than 1 photo selected");
        $("#loader_div_newpost").addClass("d-none")
        $("#create_new_post").removeClass("d-none")
        $("#image-rechoose").click()
        return 
    }

    let links = [];

    let promises = [];

    files_list.map((f) => {
      promises.push(addPhoto(f,f.name));
    })

    links = await Promise.all(promises);
    links = links.filter((e) => e!="");

    console.log("description => ", desc)
    console.log("media => ", links)


    let post_content = {
        "media":links,
        "summary":desc
    }

    $.ajax({
        url: `${window.location.origin}/google/new-gmb-post?place_id=${localStorage["place_id"]}&email=${localStorage["email"]}`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(post_content),
        dataType: 'json'
    }).then((res)=>{
        if(res['res']==="done"){
            $("#loader_div_newpost").addClass("d-none")
            $("#loader_div_newpost").addClass("disable")
            $("#create_new_post").removeClass("d-none")
            $("#create_new_post").html("New Post created.")

            setTimeout(() => {
                window.location.href = `${window.location.origin}/google/posts`
            }, 2500)
        }
        else{
            $("#loader_div_newpost").addClass("d-none")
            $("#loader_div_newpost").addClass("disable")
            $("#create_new_post").removeClass("d-none")
            $("#create_new_post").html("Error creating new post.")
        }
        console.log(res);
    }).catch((e) => {
        console.log(e);
    })
})