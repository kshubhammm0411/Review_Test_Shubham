professions = ["Hair", "Skincare", "Nails", "Lashes", "Braids", "Tattoos", "Others"];
var locations = [];

var professions_html = '';
var chosen_profession = '';
var chosen_location = '';
var chosen_biz_name, chosen_place_id;
var locations_html = '';
var submitted = false;


const getAddress = (data) => {
  if(data==undefined){
    return "City wide";
  }

  let address = '';
  if(Object.keys(data).includes("addressLines")){
    address += data["addressLines"]+", ";
  }
  if(Object.keys(data).includes("postalCode")){
    address += data["postalCode"]+". ";
  }
  if(Object.keys(data).includes("administrativeArea")){
    address += data["administrativeArea"];
  }

  return address
}

const paintOnboardingScreen = () => {
  for(var i=0; i<professions.length; i++) {
    professions_html += `
    <div class="my-1 mx-2">
      <label class="form-check-label">
      <input type="radio" class="form-check-input" name="professionRadios" value="${professions[i]}" id="profession-${i}">
      <span>${professions[i]}</span>
      <i class="input-helper"></i></label>
    </div>
    `;
  }
  
  $('#professions').html(professions_html);
  
  $.ajax({
    type: "GET",
    url: `${window.location.origin}/get_biz_locations?email=${localStorage["email"]}`
  }).then((resp) => {
    locations = resp;
    locations["locations"].map((e,i) => {
      locations_html += `
      <div class="my-1 mx-2">
        <label class="form-check-label">
        <input type="radio" class="form-check-input" name="locationRadios" value="${e["name"]}" id="profession-${i}">
        <div class="d-flex flex-column mb-2">
          <h3>${e["title"]}</h3>
          <span>${getAddress(e["storefrontAddress"])}</span>
        </div>
        <i class="input-helper"></i></label>
      </div>
      `;
    })
  
    $('#biz_profile').html(locations_html);
  
    $("[name=locationRadios]").click((e) => {
      chosen_location = e.target.value.split('/')[1];
      chosen_biz_name = locations["locations"].filter((ele) => ele["name"]==e.target.value)[0]["title"];
      chosen_place_id = locations["locations"].filter((ele) => ele["name"]==e.target.value)[0]["metadata"]["placeId"];
    })
  }).catch((e) => {
    alert("No Google businesses found linked to this email, Please try the correct gmail account.");
    localStorage.clear();
    window.location.href = `${window.location.origin}/login`;
  })
  
  $("[name=professionRadios]").click((e) => {
    chosen_profession = e.target.value;
  })
  
  $("#submit-onboard").click(() => {
    $("#submit-onboard").html($("#submit-onboard").html()+'<div class="mx-2 loader" style="width: 18px; height: 18px"></div>')
    $.ajax({
      url: `${window.location.origin}/log-btn-click`,
      type: "post",
      contentType: 'application/json',
      data: JSON.stringify({
        "place_id":localStorage["place_id"],
        "route":window.location.pathname,
        "email":localStorage["email"],
        "btn":"onboarding-submit"
      }),
      dataType: 'json'
    }).catch((e) => {
      console.log(e)
    });
    if(submitted){
      return;
    }
    if(chosen_location!='' && chosen_profession!=''){
      submitted = true;
      $.ajax({
        url: `${window.location.origin}/save-biz-details?email=${email}&profession=${chosen_profession}&location=${chosen_location}`,
      }).then(function (response){
        if("place_id" in response){
          localStorage.setItem('place_id', chosen_place_id);
          localStorage.setItem('biz_name', chosen_biz_name);
        }
      }).then(async () => {
        localStorage["biz_name"] = locations["locations"].filter(ele => ele["name"]==`locations/${chosen_location}`)[0]["title"];
        let p1 = $.ajax({
          url: `${window.location.origin}/set-profile-details?email=${email}&place_id=${chosen_place_id}&location=${chosen_location}`,
        })

        let p2 = $.ajax({
          url: `${window.location.origin}/set_profession?email=${email}&profession=${chosen_profession}&location=${chosen_location}`,
        })

        await Promise.all([p1, p2]);

        var email_payload = {email}

        $.ajax({
          url: `${window.location.origin}/gmb_onboarding_mail`,
          type: "post",
          contentType: 'application/json',
          data: JSON.stringify(email_payload),
          dataType: 'json',
          success: function (response) {
            console.log(response)
          },
        });

        var sms_payload = {email, location: chosen_location}

        $.ajax({
          url: `${window.location.origin}/gmb_onboarding_sms`,
          type: "post",
          contentType: 'application/json',
          data: JSON.stringify(sms_payload),
          dataType: 'json',
          success: function (response) {
            console.log(response)
          },
        });
        
        window.location.href = window.location.origin+"/account-complete"
      }).catch((e) => {
        localStorage.setItem('place_id', locations["locations"][0]["metadata"]["placeId"]);
        localStorage.setItem('biz_name', locations["locations"][0]["title"]);
        window.location.href = window.location.origin+"/dashboard"
        // var referrer = localStorage.getItem('referrer');
        // if(referrer){
        //   localStorage.removeItem('referrer');
        //   window.location.href = referrer;
        // } else{
        //   window.location.href = window.location.origin+"/dashboard"
        // }
      })
    } else{
      alert("Please select both of your biz location and service category")
    }
    
  })
}

paintOnboardingScreen();

$.ajax({
  url: `${window.location.origin}/log-route-open`,
  type: "post",
  contentType: 'application/json',
  data: JSON.stringify({
    "place_id":'',
    "biz_name":'',
    "email":localStorage["email"],
    "route":window.location.pathname
  }),
  dataType: 'json'
})
