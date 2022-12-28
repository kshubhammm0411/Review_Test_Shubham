// if(localStorage["email"]==undefined){
//   window.location.href = `${window.location.origin}/login`;
// } else{
var parentElem = $(".container-scroller")[0];
parentElem.classList.remove('d-none');
// }

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
  
$.ajax({
    url: `${window.location.origin}/show-profile?email=${localStorage["email"]}`
}).then((res) => {
    console.log(res)
    console.log(res['data']['biz_name'])
    $("#main").removeClass("d-none")
    $("#biz_name").html(res['data']['biz_name'])

    if(res['data']['description'] === ""){
      $("#biz_desc").text("Could not gather description")
    }
    else{
      $("#biz_desc").text(res['data']['description'])
    }

    if(res['data']['phone'] === ""){
      $("#phone_number").text("Could not find phone number")
    }
    else{
      $("#phone_number").text(res['data']['phone'])
    }

    if(res['data']['address'] === ""){
      $("#addr_div").addClass("d-none")
    }
    else{
      let addr=""
      res['data']['address']['addressLines'].map((add)=>{
        addr=addr+add+", "
      })
      $("#locality").text(res['data']['address']['locality'])
      $("#state").text(res['data']['address']['administrativeArea'])
      $("#postal_code").text(res['data']['address']['postalCode'])
      $("#addr_line").text(addr)
    }
    if(res['data']['website']===""){
      $("#website").text("Not available")
    }
    else{
      $("#website").text(res['data']['website'])
      $("#website_url").attr("href",res['data']['website'])
    }
});

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
      <div>
        <div class="form-group">
          <p id="serviceName${index}" style="font-size:1rem;"><b>${displayName.replaceAll('"', '&quot;')}</b></p>
          <p id="serviceDescription${index}" placeholder="Service description">${description.replaceAll('"', '&quot;')}</p>
          ${price=='' ? "" : `<p type="text" id="servicePrice${index}" placeholder="Price"><b>$${price}</b></p>`}
        </div>
      </div>
    `;
    
  })

  $("#service-div").html(services_html);

  // $('input[id*="serviceName"]').on('input', (e) => {
  //   index = parseInt(e.target.getAttribute("id").split("serviceName")[1]);
  //   services[index]["freeFormServiceItem"]["label"]["displayName"] = e.target.value;
  //   e.target.setAttribute("value", e.target.value);
  // })

  // $('input[id*="servicePrice"]').on('input', (e) => {
  //   index = parseInt(e.target.getAttribute("id").split("servicePrice")[1]);
  //   if(e.target.value==''){
  //     delete services[index]["price"];
  //   } else if($.isNumeric(e.target.value)){
  //     services[index] = {
  //       ...services[index],
  //       "price": {
  //         "units": parseInt(e.target.value),
  //         "nanos": parseInt((e.target.value - parseInt(e.target.value))*1000000000)
  //       }
  //     };
  //     e.target.setAttribute("value", e.target.value);
  //   } else{
  //     alert("Please enter only numbers or dot");
  //     let pp = '';
  //     if(Object.keys(services[index]).includes("price")){
  //       pp = services[index]["price"]["units"];
  //       if(Object.keys(services[index]["price"]).includes("nanos")) {
  //         pp += services[index]["price"]["nanos"]/1000000000;
  //       }
  //     }

  //     e.target.value = pp;
  //   }
    
  // })

  // $('input[id*="serviceDescription"]').on('input', (e) => {
  //   index = parseInt(e.target.getAttribute("id").split("serviceDescription")[1]);
  //   services[index]["freeFormServiceItem"]["label"]["description"] = e.target.value;
  // })

  // $(".form-control").on('input', (e) => {
  //   e.target.setAttribute("value", e.target.value);
  // })
}

$.ajax({
  url: `${window.location.origin}/gmb_services_data?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`
}).then((res) => {
  services = res["servicesData"];
  console.log(services);
  $("#submit-btn").css("display","none");
  displayServices();
}).catch((e) => {
  $("#service-div").html("No services are found");
  $("#submit-btn").css("display","none");
})

$("*[id$='_tab']").click((e) => {
  var id = e.currentTarget.getAttribute('id');

  let tab_name = id.split("_")[0];

  if (tab_name=='home'){
    tab_name = "dashboard";
  }
  window.location.href = window.location.href.split('/google/')[0] + '/google/' + tab_name;
})
  