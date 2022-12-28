let pics_list = [];
let delete_idx;
let pageToken;
let media_idx;
let show_photo_idx;
let video_extensions = ["mp4", "3gp", "ogg", "mpeg", "mov", "MOV"];
let photo_extensions = ["jpg", "gif", "png", "jpeg", "PNG", "heic", "HEIC", "Heic", "JPG", , "JPEG"]

const checkFileType = (file_name) => {
  let file_name_parts = file_name.split(".");
  let extension = file_name_parts[file_name_parts.length-1]

  if(photo_extensions.includes(extension)){
    return 'photo';
  } else if (video_extensions.includes(extension)) {
    return 'video';
  }
  return ''
}

const activateDeleteButtons = () => {
  $(".delete").click((e) => {
    let id = e.target.id;
    if(id.includes("delete-photo-")){
      let index = parseInt(id.replace("delete-photo-", ""));
      $.ajax({
        url: `${window.location.origin}/log-btn-click`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({
          "place_id":localStorage["place_id"],
          "route":window.location.pathname,
          "email":localStorage["email"],
          "btn":"photo-delete-btn"
        }),
        dataType: 'json'
      }).catch((e) => {
        console.log(e)
      });
      delete_idx = index;

      $("#exampleModal").modal();
    }
  })
}

const activateMediaClick = () => {
  $(".img_cont").click((e) => {
    let id = e.target.id;
    $("#loader_photo_modal").removeClass("d-none")
    $("#modal-photo-img").addClass("d-none")
    $("#modal-video").addClass("d-none")
    if(id.includes("img-cont-")){
      setTimeout(() => {
        $("#loader_photo_modal").addClass("d-none")

        let index = parseInt(id.replace("img-cont-", ""));

        if(pics_list[index]['mediaFormat']=='PHOTO'){
          $("#modal-photo-img").removeClass("d-none")
          $("#modal-photo-img").attr("src",pics_list[index]['sourceUrl']);
          $("#modal-photo-img").attr("alt",`${pics_list[index]['sourceUrl']}`);
        } else if(pics_list[index]['mediaFormat']=='VIDEO'){
          $("#modal-video").removeClass("d-none")
          let link = pics_list[index]['sourceUrl']
          link = link.replace("=s0","=dv")
          $("#modal-video").attr("src",link);
          $("#modal-video").html("alt",link);
        }
        
        media_idx = index;
        $("#photoModal").modal();
      }, 500)
    }
  })
}

$("#next").click(()=>{
  if(media_idx < pics_list.length){
    let index = media_idx++;
    index++;
    $("#loader_photo_modal").removeClass("d-none")
    $("#modal-photo-img").addClass("d-none")
    $("#modal-video").addClass("d-none")
    setTimeout(() => {
      $("#loader_photo_modal").addClass("d-none")

      if(pics_list[index]['mediaFormat']=='PHOTO'){
        $("#modal-photo-img").removeClass("d-none")
        $("#modal-photo-img").attr("src",pics_list[index]['sourceUrl']);
        $("#modal-photo-img").attr("alt",pics_list[index]['sourceUrl']);
      } else if(pics_list[index]['mediaFormat']=='VIDEO'){
        $("#modal-video").removeClass("d-none")
        let link = pics_list[index]['sourceUrl']
        link = link.replace("=s0","=dv")
        $("#modal-video").attr("src",link);
        $("#modal-video").html("alt",link);
      }
    }, 200)
  }
  else{
    console.log("last img reached")
  }
})

$("#prev").click(()=>{
  if(media_idx >= 0){
    let index = media_idx--;
    index--;
    $("#loader_photo_modal").removeClass("d-none")
    $("#modal-photo-img").addClass("d-none")
    $("#modal-video").addClass("d-none")
    setTimeout(() => {
      $("#loader_photo_modal").addClass("d-none")

      if(pics_list[index]['mediaFormat']=='PHOTO'){
        $("#modal-photo-img").removeClass("d-none")
        $("#modal-photo-img").attr("src",pics_list[index]['sourceUrl']);
        $("#modal-photo-img").attr("alt",pics_list[index]['sourceUrl']);
      } else if(pics_list[index]['mediaFormat']=='VIDEO'){
        $("#modal-video").removeClass("d-none")
        let link = pics_list[index]['sourceUrl']
        link = link.replace("=s0","=dv")
        $("#modal-video").attr("src",link);
        $("#modal-video").html("alt",link);
      }
    }, 200)
  }
  else{
    console.log("first img reached")
  }
})

const reloadUploadedPhotos = () => {
  let pics_html = '';

  pics_list.map((pic, idx) => {
    if(pic["uploaded"]){
      const create_time = new Date(pic["createTime"])
      const today = new Date()
      const diff = parseInt((today-create_time)/(1000*3600*24))
      var view = 0;

      if(jQuery.isEmptyObject(pic["insights"])){
        console.log("insights is empty");
      }
      else{
        view = pic["insights"]["viewCount"]
      }
      
      
      pics_html +=`
      <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center w-auto">
        <div class="img_cont mt-3 d-flex flex-column align-items-center" id="img-cont-${idx}">
          <div class="${picStatusColor(pic)}"><p>${picStatus(pic)}</p></div>
          ${
            checkFileType(pic['mediaFormat'])=='PHOTO' ?
            `<img src="${pic['sourceUrl']}" alt="media" id="img-cont-${idx}" loading="lazy" style="object-fit: contain;" />` :
            checkFileType(pic['mediaFormat'])=='VIDEO' ?
            `<video autoplay src="${pic['sourceUrl']}" style="object-fit: contain; height: 100%; width: 100%;">Your browser does not support the video tag.</video>` :
            `<img src="${pic['sourceUrl']}" alt="Unknown media type" id="img-cont-${idx}" loading="lazy" style="object-fit: contain;" />`
          }
          <button class="delete del"><i id="delete-photo-${idx}" class="icon_del fa fa-trash"></i></button>
          <div class="grad" id="img-cont-${idx}">
            ${pic["live"] ? `<button class="rev"><i class="fa fa-eye"></i>&nbsp;${view}</button>` : ''}
            <button class="time">${diff}d</button>
          </div>
        </div>
      </div>`
    }
  })
  $("#pics-list").html(pics_html);
  $("#gmb_uploaded").addClass("active")
  $("#gmb_not_uploaded").removeClass("active")
  $("#gmb_all").removeClass("active")
  activateDeleteButtons();
  activateMediaClick()
}

const reloadNotUploadedPhotos = () =>{
  let pics_html = '';

  pics_list.map((pic, idx) => {
    if(pic["failed"] && pic["reason"]!="Duplicate"){
      const create_time = new Date(pic["createTime"])
      const today = new Date()
      const diff = parseInt((today-create_time)/(1000*3600*24))
      var view = 0;

      if(jQuery.isEmptyObject(pic["insights"])){
        console.log("insights is empty");
      }
      else{
        view = pic["insights"]["viewCount"]
      }
      
      pics_html +=`
      <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center w-auto">
        <div class="img_cont mt-3 d-flex flex-column align-items-center" id="img-cont-${idx}">
          <div class="${picStatusColor(pic)}"><p>${picStatus(pic)}</p></div>
          ${
            checkFileType(pic['mediaFormat'])=='PHOTO' ?
            `<img src="${pic['sourceUrl']}" alt="media" id="img-cont-${idx}" loading="lazy" style="object-fit: contain;" />` :
            checkFileType(pic['mediaFormat'])=='VIDEO' ?
            `<video autoplay src="${pic['sourceUrl']}" style="object-fit: contain; height: 100%; width: 100%;">Your browser does not support the video tag.</video>` :
            `<img src="${pic['sourceUrl']}" alt="Unknown media type" id="img-cont-${idx}" loading="lazy" style="object-fit: contain;" />`
          }
          <button class="delete del"><i id="delete-photo-${idx}" class="icon_del fa fa-trash"></i></button>
          <div class="grad" id="img-cont-${idx}">
            ${pic["live"] ? `<button class="rev"><i class="fa fa-eye"></i>&nbsp;${view}</button>` : ''}
            <button class="time">${diff}d</button>
          </div>
        </div>
      </div>`
    }
  })
  $("#pics-list").html(pics_html);
  $("#gmb_uploaded").removeClass("active")
  $("#gmb_not_uploaded").addClass("active")
  $("#gmb_all").removeClass("active")
  activateDeleteButtons();
  activateMediaClick()
}

const picStatus = (data) => {
  if(data["live"]){
    return "Live";
  }
  if(data["failed"]){
    if(data["reason"]=="Duplicate"){
      return "Duplicate";
    }
    return "Rejected";
  }
  if(data["used"]==false){
    return "Uploaded";
  }
}


const picStatusColor = (data) => {
  if(data["live"]){
    return "live-pill";
  }
  if(data["failed"]){
    if(data["reason"]=="Duplicate"){
      return "duplicate-pill";
    }
    return "rejected-pill";
  }
  if(data["used"]==false){
    return "uploaded-pill";
  }
}


const reloadPhotos = () => {
  let pics_html = '';

  pics_list.map((pic, idx) => {
    const create_time = new Date(pic["createTime"])
    const today = new Date()
    const diff = parseInt((today-create_time)/(1000*3600*24))
    var view = 0;

    if(jQuery.isEmptyObject(pic["insights"])){
      console.log("insights is empty");
    }
    else{
      view = pic["insights"]["viewCount"]
    }
    
    
    pics_html +=`
    <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center w-auto">
      <div class="img_cont mt-3 d-flex flex-column align-items-center" id="img-cont-${idx}">
        <div class="${picStatusColor(pic)}"><p>${picStatus(pic)}</p></div>
        ${
          checkFileType(pic['mediaFormat'])=='PHOTO' ?
          `<img src="${pic['sourceUrl']}" alt="media" id="img-cont-${idx}" loading="lazy" style="object-fit: contain;" />` :
          checkFileType(pic['mediaFormat'])=='VIDEO' ?
          `<video autoplay src="${pic['sourceUrl']}" style="object-fit: contain; height: 100%; width: 100%;">Your browser does not support the video tag.</video>` :
          `<img src="${pic['sourceUrl']}" alt="Unknown media type" id="img-cont-${idx}" loading="lazy" style="object-fit: contain;" />`
        }
        <button class="delete del"><i id="delete-photo-${idx}" class="icon_del fa fa-trash"></i></button>
        <div class="grad" id="img-cont-${idx}">
          ${pic["live"] ? `<button class="rev"><i class="fa fa-eye"></i>&nbsp;${view}</button>` : ''}
          <button class="time">${diff}d</button>
        </div>
      </div>
    </div>`
  })
  $("#pics-list").html(pics_html);
  $("#gmb_all").addClass("active")
  $("#gmb_uploaded").removeClass("active")
  $("#gmb_not_uploaded").removeClass("active")
  activateDeleteButtons();
  activateMediaClick()
}

$("*[id^='gmb']").click((e) => {
  console.log("button clicked")
  var id = e.currentTarget.getAttribute('id');
  console.log("btn clicked : ",id)
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

  let tab_name = id.split("_")[1];

  if (tab_name=='uploaded'){
    reloadUploadedPhotos();
  }

  if (tab_name=='not'){
    reloadNotUploadedPhotos();
  }

  if (tab_name=='all'){
    reloadPhotos();
  }
})


$("#close").click(() => {
  delete_idx = undefined;
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn":"photo-delete-modal-not-confirmed"
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });
})


$("#delete").click(() => {
  let pic = pics_list[delete_idx];
  console.log(pic);

  $("#loader_div").removeClass("d-none")
  $("#delete_content").html("")
  $("#modal-photo-img").addClass("d-none")
  $("#modal-video").addClass("d-none")

  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn":"photo-delete-modal-confirmed"
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });

  console.log("delete media",pic)

  $.ajax({
    url: `${window.location.origin}/google/delete-gmb-profile-images?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "email":localStorage["email"],
      "media":pic
    }),
    dataType: 'json'
  }).then(function () {
    pics_list.splice(delete_idx, 1);
    $("#loader_div").addClass("d-none")
    $("#delete_content").html("Photo deleted successfully.")
    setTimeout(() => {
      // $("#modal-photo-img").removeClass("d-none")
      // $("#modal-video").removeClass("d-none")
      
      $("#close_delete_modal").click()
      reloadPhotos();
      $("#delete_content").html("Are you sure you want to delete this image?")
    }, 1500)
    
  })
})


$.ajax({
  url: `${window.location.origin}/google/gmb-profile-images?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`
}).then((res) => {
  console.log(res)

  if(Object.keys(res).length === 0){
    console.log("no photos")
    $("#pics-list").html(`<p class="m-2">No Photos</p>`);
  }
  else{
    if(res["res"].length){
      console.log("rendering... photos")
      pics_list.push(...res["res"]);
      $("#loader_div_photos").addClass("d-none")
      reloadPhotos();
    } else{
      $("#loader_div_photos").addClass("d-none")
      $("#pics-list").html(`<p class="m-2">No Photos</p>`);
    }
  }
  pageToken = res["nextPageToken"];
}).catch((e)=>{
  console.log("no photos")
  $("#loader_div_photos").addClass("d-none")
  $("#pics-list").html(`<p class="m-2">No Photos</p>`);
})

$(window).scroll(() => {
  if(($(window).scrollTop() + $(window).height() >= $(document).height() - 100) && pageToken){
    $("#loader_div_photos").removeClass("d-none")
    $.ajax({
      url: `${window.location.origin}/google/gmb-profile-images?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}&pageToken=${pageToken}`
    }).then((res) => {
      console.log(res)
      if(Object.keys(res).length === 0){
        console.log("no photos")
        $("#loader_div_photos").addClass("d-none")
        $("#pics-list").html(`<p class="m-2">No Photos</p>`);
      }
      else{
        if(res["files"].length){
          console.log("rendering... photos")
          pics_list.push(...res["files"]);
          $("#loader_div_photos").addClass("d-none")
          reloadPhotos();
        } else{
          $("#loader_div_photos").addClass("d-none")
          $("#pics-list").html(`<p class="m-2">No Photos</p>`);
        }
      }
      pageToken = res["nextPageToken"];
    })
    pageToken = undefined;
  }
})

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