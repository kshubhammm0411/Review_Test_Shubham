
'use strict';

// $.ajax({
//     url: `${window.location.origin}/get_ss_category`,
// }).then((data) => {
//     let select_cat_html = ''
//     data.map((d) => {
//         select_cat_html+=`<option value="${d}">${d}</option>`
//     });
//     select_cat_html+=`<option value="others">others</option>`
//     console.log(select_cat_html);
//     $("#category").html(select_cat_html);
//     $("#loader_div_services").addClass("d-none");
// }).catch((e) => {
//     console.log(e);
// });

$('#category').on('change',()=>{
    console.log($('#category').find(":selected").val())
    $("#loader_div_services").removeClass("d-none");
    let val = $('#category').find(":selected").val();
    $.ajax({
        url: `${window.location.origin}/get_ss_services/${val}`,
    }).then((data) => {
        console.log(data)
        let select_srvc_html = ``
        data.map((d) => {
            select_srvc_html+=`<div id="${d}" class="service" style="margin:10px;padding:5px;border: 2px solid black;border-radius: 20px;">${d}</div>`
        });
        console.log(select_srvc_html);
        $("#select_srvc").html(select_srvc_html);
        $("#loader_div_services").addClass("d-none");
    }).catch((e) => {
        console.log(e);
    });

  });



$('#add_service').click(()=>{
    $('#serviceModal').modal('show');
});

$('#add_category').click(()=>{
    const cat = $("#category_input").val();
    if(cat === ""){
        $("#add_cat_error").text("Category cannot be blank!");
        return;
    }
    $("#add_cat_error").text("");
    // <label style="padding-right: 10px;">Add service </label>
    // <button type="button" class="btn btn-primary btn-fw" id="add_service_${cat}">+</button>
    // <button class="delete del" style="border: none;background: transparent; margin-bottom:10px"><i id="edit_cat_${cat}" class="icon_del fa fa-pencil" style="font-size:1rem;"></i></button>

    const srvc_html = `<div id="${cat}" class="category">
                            <div style="display:flex;flex-direction:row;">
                                <h4>${cat}</h4>
                                <button class="delete del" style="border: none;background: transparent; margin-bottom:10px"><i id="delete_cat_${cat}" class="icon_del fa fa-trash" style="font-size:1rem;"></i></button>
                            </div>
                            <div class="added_category" id="${cat}_services">
                                
                                <div class="service_form" style="display:flex;flex-direction:row;flex-wrap:wrap;">
                                    <input style="width: auto; margin: 10px;" type="text" class="form-control" id="service_name_${cat}" placeholder="Service Name">
                                    <input style="width: 60px; margin: 10px;" type="text" class="form-control" id="service_price_${cat}" placeholder="Price">
                                    <button type="button" class="btn btn-primary btn-fw" id="add_service_${cat}" style="margin: 10px;">Add</button>
                                    </div>
                                    <span id="add_srvc_error_${cat}" style="color:red;"></span>
                            </div>
                            </div>
                        `
    $("#services").append(srvc_html);
    $("#cat_name").text(cat);
    $('#select_srvc').removeClass('d-none');
    $("#category_input").val("");
    $('#category_input').attr('placeholder','Add category');
});

// $(function() {
//     $(document).on("click", "*[id^='add_service_']", function(e) {
//         var id = e.currentTarget.getAttribute('id');
//         console.log("button clicked")
//         var id = e.currentTarget.getAttribute('id');
//         // style="border: 1px solid;border-radius: 20px;margin-bottom: 10px;width: max-content;"
//         const srvc_html = `<div class="service_form" style="display:flex;flex-direction:row;">
//             <input style="width: auto; margin: 10px;" type="text" class="form-control" id="category_input" placeholder="Service Name">
//             <input style="width: auto; margin: 10px;" type="text" class="form-control" id="category_input" placeholder="Price">
//             <button type="button" class="btn btn-primary btn-fw" id="add_service" style="margin: 10px;">Add</button>
//         </div>`
//         id = id.replace("add_service_","");
//         $(`#${id}`).html(srvc_html);
//         console.log("button clicked")
//     });
// });

$(function() {
    $(document).on("click", "*[id^='add_service_']", function(e) {
        console.log("button clicked")
        var id = e.currentTarget.getAttribute('id');
        console.log(id)
        id = id.replace("add_service_","");
        var service_name = $(`#service_name_${id}`).val();
        var service_price = $(`#service_price_${id}`).val();
        if(service_name === "" || service_price === ""){
            $("#add_srvc_error").text("Service name and price cannot be blank!");
            return;
        }
        $("#add_srvc_error").text("");
        const srvc_html = `
            <div class="added_srvc" style="display:flex;flex-direction:row;">
            <input style="width: auto; margin: 10px;" type="text" class="form-control service_name" placeholder="Service Name" value="${service_name}">
            <input style="width: 60px; margin: 10px;" type="text" class="form-control service_price" placeholder="Service Name" value="${service_price}">
            <button id="delete_srvc_${service_name}" class="delete del" style="border: none;background: transparent; margin-bottom:10px"><i class="icon_del fa fa-trash" style="font-size:1rem;"></i></button>
            </div>
        `
        const new_srvc_html = `<div class="service_form" style="display:flex;flex-direction:row;">
            <input style="width: auto; margin: 10px;" type="text" class="form-control" id="service_name" placeholder="Service Name">
            <input style="60px: auto; margin: 10px;" type="text" class="form-control" id="service_price" placeholder="Price">
            <button type="button" class="btn btn-primary btn-fw" id="add_service_${id}" style="margin: 10px;">Add</button>
        </div>`
        $(`#${id}_services`).prepend(srvc_html);
        $(`#service_name_${id}`).val("");
        $('#service_name').attr('placeholder','Service Name');
        $(`#service_price_${id}`).val("");
        $('#service_price').attr('placeholder','Price');
        console.log("button clicked")
    });
});

$(function() {
    $(document).on("click", "*[id^='delete_cat_']", function(e) {
        var id = e.currentTarget.getAttribute('id');
        id = id.replace("delete_cat_","");
        $(`#${id}`).remove();
        console.log(id)
        console.log("del cat button clicked")
    });
});

$(function() {
    $(document).on("click", "*[id^='delete_srvc_']", function(e) {
        var id = e.currentTarget.getAttribute('id'); 
        console.log(id); 
        $(`#${id}`).parent().remove();
        console.log(id)
        console.log("del srvc button clicked")
    });
});

$(function() {
    $(document).on("click", "*[id^='edit_cat_']", function(e) {
        var id = e.currentTarget.getAttribute('id'); 
        console.log(id); 
        $(`#${id}`).parent().remove();
        console.log("del button clicked")
    });
});
// $("*[id^='add_service_']").click((e)=>{
//     console.log("button clicked")
//     var id = e.currentTarget.getAttribute('id');
//     const srvc_html = `<div id=${id}>
//         <input style="width: auto; margin-right: 10px;" type="text" class="form-control" id="category_input" placeholder="Service Name">
//         <input style="width: auto; margin-right: 10px;" type="text" class="form-control" id="category_input" placeholder="Price">
//         <button type="button" class="btn btn-primary btn-fw" id="add_service">Add</button>
//     </div>`
//     $(`#${id}`).html(srvc_html);
// })

$("#submit").click((e) => {

var categories = document.getElementsByClassName("added_category");
    let place_id = localStorage.getItem("place_id");
    let biz_name = localStorage.getItem("biz_name");
    let services_data = []
    Array.from(categories).forEach(function(cat) {
        var srvc = cat.getElementsByClassName("added_srvc");
        Array.from(srvc).forEach(function(s) {
            console.log(s)
            var service_name = s.querySelector(".service_name").value;
            var service_price = s.querySelector(".service_price").value;
            services_data.push({
                "name":service_name,
                "description": "",
                "price":service_price,
                "category": cat.id.replace("_services",""),
                "place_id": place_id,
                "biz_name": biz_name
            });
        });
    console.log(services_data);
    });
    $.ajax({
        url: `${window.location.origin}/update_services?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`,
        type: "post",
        data: JSON.stringify(services_data),
        contentType: "application/json",
    }).then((data) => {
        alert("Services Updated");
        location.reload();
        console.log(data)
    }).catch((e) => {
        alert("Error Updating Services");
        location.reload();
        console.log(e);
    });
});

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