var services;

// if(localStorage["email"]==undefined){
//   window.location.href = `${window.location.origin}/login`;
// } else{
var parentElem = $(".container-scroller")[0];
parentElem.classList.remove('d-none');
// }

const displayServices = () => {
  services_html = '';
  services.map((service, index) => {
    console.log(service);
    let displayName = '', description = '', price = '', currencyCode = '';

    if(Object.keys(service).includes("freeFormServiceItem")) {
      if(Object.keys(service["freeFormServiceItem"]).includes("label")){
        if(Object.keys(service["freeFormServiceItem"]["label"]).includes("displayName")){
          displayName = service["freeFormServiceItem"]["label"]["displayName"];
        }
        if(Object.keys(service["freeFormServiceItem"]["label"]).includes("description")){
          description = service["freeFormServiceItem"]["label"]["description"];
        }
      }
    } else if(Object.keys(service).includes("structuredServiceItem")){
      displayName = service["structuredServiceItem"]["serviceTypeId"].split(":")[1].replaceAll("_"," ");
      if(Object.keys(service["structuredServiceItem"]).includes("description")){
        description = service["structuredServiceItem"]["description"];
      }
    }

    if(Object.keys(service).includes("price")){
      currencyCode = service["price"]["currencyCode"];
      price = service["price"]["units"]
      if(Object.keys(service["price"]).includes("nanos")) {
        price += service["price"]["nanos"]/1000000000;
      }
    }

    services_html += `
      <div >
        <h4 class="mt-3 mb-4"><u>Service ${index+1}</u></h4>
        <div class="form-group">
          <label>Service Name</label>
          ${Object.keys(service).includes("structuredServiceItem") ? "<br><small>Google defined service</small>" : ""}
          <input type="text" class="form-control" id="serviceName${index}" ${Object.keys(service).includes("structuredServiceItem") ? "disabled" : ""} placeholder="Service name" value="${displayName.replaceAll('"', '&quot;')}">
        </div>
        <div class="form-group">
          <label>Price (in $)</label>
          <input type="text" class="form-control" id="servicePrice${index}" placeholder="Price" value="${price}">
        </div>
        <div class="form-group">
          <label>Service Description</label>
          <input type="text" class="form-control" id="serviceDescription${index}" placeholder="Service description" value="${description.replaceAll('"', '&quot;')}">
        </div>
      </div>
    `;
    
  })

  $("#service-div").html(services_html);

  $('input[id*="serviceName"]').on('input', (e) => {
    index = parseInt(e.target.getAttribute("id").split("serviceName")[1]);
    services[index]["freeFormServiceItem"]["label"]["displayName"] = e.target.value;
    e.target.setAttribute("value", e.target.value);
  })

  $('input[id*="servicePrice"]').on('input', (e) => {
    index = parseInt(e.target.getAttribute("id").split("servicePrice")[1]);
    if(e.target.value==''){
      delete services[index]["price"];
    } else if($.isNumeric(e.target.value)){
      services[index] = {
        ...services[index],
        "price": {
          "units": parseInt(e.target.value),
          "nanos": parseInt((e.target.value - parseInt(e.target.value))*1000000000)
        }
      };
      e.target.setAttribute("value", e.target.value);
    } else{
      alert("Please enter only numbers or dot");
      let pp = '';
      if(Object.keys(services[index]).includes("price")){
        pp = services[index]["price"]["units"];
        if(Object.keys(services[index]["price"]).includes("nanos")) {
          pp += services[index]["price"]["nanos"]/1000000000;
        }
      }

      e.target.value = pp;
    }
    
  })

  $('input[id*="serviceDescription"]').on('input', (e) => {
    index = parseInt(e.target.getAttribute("id").split("serviceDescription")[1]);
    services[index]["freeFormServiceItem"]["label"]["description"] = e.target.value;
  })

  $(".form-control").on('input', (e) => {
    e.target.setAttribute("value", e.target.value);
  })
}

$.ajax({
  url: `${window.location.origin}/gmb_services_data?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`
}).then((res) => {
  if(Object.keys(res["serviceData"])===0){
    $("#service-div").html("No services are found");
    $("#submit-btn").css("display","none");
  }
  else{
    services = res["servicesData"];
    console.log(services);
    $("#submit-btn").css("display","none");
    displayServices();
  }
}).catch((e) => {
  $("#service-div").html("No services are found");
  $("#submit-btn").css("display","none");
})

$("#submit-btn").click((e) => {
  $("#submit-btn").html("Submitting..");
  var payload = {};
  payload["services"] = services;

  console.log(payload);

  $.ajax({
    url: `${window.location.origin}/gmb_services_data?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify(payload).replaceAll("'", "''"),
    dataType: 'json',
    success: function (response) {
      console.log(response);
      $("#submit-btn").html("Submitted");
      setTimeout(() => {
        $("#submit-btn").html("Submit");
      }, 1500);
    }
  });
})


$("*[id$='_tab']").click((e) => {
  var id = e.currentTarget.getAttribute('id');

  let tab_name = id.split("_")[0];
  
  if (tab_name=='home'){
    tab_name = "dashboard";
  }
  window.location.href = window.location.href.split('/google/')[0] + '/google/' + tab_name;

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
