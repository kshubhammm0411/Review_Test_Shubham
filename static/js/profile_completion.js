var regularHours, initialRegularHours;

let day_open = {
  "SUNDAY": false,
  "MONDAY": false,
  "TUESDAY": false,
  "WEDNESDAY": false,
  "THURSDAY": false,
  "FRIDAY": false,
  "SATURDAY": false
};

let days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
];

const reloadRegularHours = () => {
  let regularHoursDiv = '';

  days.map((day, index) => {
    let dayopentime, dayclosetime;
    try{
      dayopentime = getTime(regularHours["periods"][index]["openTime"]);
      dayclosetime = getTime(regularHours["periods"][index]["closeTime"]);
    } catch(e){
      regularHours["periods"][index] = {
        'openTime': {"hours": 9},
        'closeTime': {"hours": 17},
        'openDay': day,
        'closeDay': day
      }
    }

    let openOptions = '';
    let closeOptions = '';

    Array(24).fill(0).map((_, i) => i).map((hour) => {
      openOptions += `<option ${dayopentime==hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+':00' ? "selected" : ""} value="${day}_open_${hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}:00">${hour}:00</option>`;
      openOptions += `<option ${dayopentime==hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+':30' ? "selected" : ""} value="${day}_open_${hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}:30">${hour}:30</option>`;
    })

    Array(24).fill(0).map((_, i) => i).map((hour) => {
      closeOptions += `<option ${dayclosetime==hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+':00' ? "selected" : ""} value="${day}_close_${hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}:00">${hour}:00</option>`;
      closeOptions += `<option ${dayclosetime==hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+':30' ? "selected" : ""} value="${day}_close_${hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}:30">${hour}:30</option>`;
    })

    let dayDiv = `
      <div class="form-group d-flex my-2 align-items-center">
        <input type="checkbox" class="day-check-box" name="${day}" ${day_open[day] ? "checked" : ""}>
        <h3 class="mx-2">${day}</h3>
        <div class="form-group d-flex mx-1 align-items-center" style="margin: 0;">
          <label class="mx-2">Start</label>
          <select name="countryCode" class="form-control" id="account-dropdown ${day}_open_select" ${day_open[day] ? "" : "disabled"}>
            ${openOptions}
          </select>
        </div>
        <div class="form-group d-flex mx-1 align-items-center" style="margin: 0;">
          <label class="mx-2">End</label>
          <select name="countryCode" class="form-control" id="account-dropdown ${day}_open_select" ${day_open[day] ? "" : "disabled"}>
            ${closeOptions}
          </select>
        </div>
      </div>
    `;

    regularHoursDiv += dayDiv;
  })

  $("#regularhours-wrap").html(regularHoursDiv);

  $("select").on('change', (e) => {
    let id = e.target.value;
    let day = id.split("_")[0];
    let cs = id.split("_")[1];
    let time = id.split("_")[2];

    regularHours["periods"].map(period => {
      period[`${cs}Day`] = time;
    })
    $(`#${day}_${cs}_select`).setAttribute("value") = id;
  })

  $(".day-check-box").on('change', (e) => {
    let day = e.target.name;

    regularHours["periods"].map((period) => {
      if(period["openDay"]==day){
        day_open[day] = e.target.checked;
      }
    })

    reloadRegularHours();
  })
}

const getTime = (time) => {
  let timeStr = '';
  if(time["hours"]!=undefined){
    timeStr += time["hours"].toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
  }
  timeStr += ':';
  if(time["minutes"]!=undefined){
    timeStr += time["minutes"].toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
  } else{
    timeStr += '00';
  }

  return timeStr;
}

const formValidation = () => {
  try {
    let valid = true;

    let mandatory_fields_list = [
      "first_name",
      "last_name",
      "personal_number",
      "name",
      "address",
      "zipcode",
      "city",
      "state",
      "phone"
    ]

    let empty_fields = mandatory_fields_list.map((field) => {
      let val = $(`#${field}`)[0].value;
      if(val=="" || val==null || val==undefined){
        valid = false;
        return field;
      }
      return false;
    });

    if(!valid){
      alert(`Please fill all the mandatory fields (Red * marked).`)
      return false
    }
    return true;
  } catch (e) {
    return true;
  }
}

$.ajax({
  url: `${window.location.origin}/biz_profile_completion?place_id=${localStorage["place_id"]}&email=${localStorage["email"]}`
}).then((res)=>{
  Object.keys(res).map((key) => {
    if (res[key]=="" || res[key]==null){
      showProfileCompletion = true;
      $(`#${key}_form`).removeClass("d-none");
    }
    else{
      if(key=="biz_name"){
        $(`#name`).val(res[key]);
      } else{
        $(`#${key}`).val(res[key]);
      }
    }
  })
  $("#tiktok_link_form").addClass("d-none");
  $("#first_name_form").removeClass("d-none");
  $("#last_name_form").removeClass("d-none");

  if(Object.keys(res).length==0){
    window.location.href = window.location.origin+"/dashboard";
  } else{
    $(".main-panel").removeClass("d-none");
  }

})


$(".form-control").on('input', (e) => {
  e.target.setAttribute("value", e.target.value);
})

$('#booking_handels').on('change',()=>{
  console.log($('#booking_handels').find(":selected").val())
  if($('#booking_handels').find(":selected").val() === 'other'){
    $("#booking_handel_other").removeClass("d-none");
  }
});

$(".submit-btn").click((e) => {
  if(formValidation()){
    e.target.classList.add("disabled")

    var payload = {};
    // payload["place_id"]=localStorage["place_id"];
    payload["first_name"] = $("#first_name")[0].value;
    payload["last_name"] = $("#last_name")[0].value;
    payload["personal_number"] = $("#personal_number")[0].value;
    payload["instagram_link"] = $("#instagram_link")[0].value;
    payload["facebook_link"] = $("#facebook_link")[0].value;
    payload["tiktok_link"] = $("#tiktok_link")[0].value;
    payload["biz_name"] = $("#name")[0].value;
    payload["open_date"] = $("#open_date")[0].value;
    payload["address"] = $("#address").val();
    payload["zipcode"] = $("#zipcode")[0].value;
    payload["city"] = $("#city")[0].value;
    payload["state"] = $("#state")[0].value;
    payload["phone"] = $("#phone")[0].value;
    payload["description"] = $("#description").val();
    payload["website"] = $("#website")[0].value;
    payload["appointment_link"] = $('#appointment_link').val();
    payload["booking_platform"] = $('#booking_handels').find(":selected").val();

    if($('#booking_handels').find(":selected").val() === 'other'){
      payload["booking_platform"] = $$('#booking_handel_other').val();
    }

    const regularHours = {}
    // const rh_days = ['mon','tue','wed','thu','fri','sat','sun']
    // rh_days.map((day)=>{
    //     if($(`#${day}_rh_chk`).is(":checked")){
    //         console.log("checkBox val : ",$(`#${day}_rh_chk`).val())
    //         const input_val = $(`#${day}_rh_chk`).val()
    //         const day_full = $(`#${day}_rh_chk`).attr("name")
    //         const obj = {
    //             'startTime' : $(`#${input_val}_start`).val(),
    //             'endTime' : $(`#${input_val}_end`).val()
    //         }
    //         regularHours[day_full] = obj
    //     }
    // })
    // console.log(regularHours)
    
    payload.regular_hours = regularHours

    const specialHours = {}
    // const sh_days = ['mon','tue','wed','thu','fri','sat','sun']
    // sh_days.map((day)=>{
    //     if($(`#${day}_sh_chk`).is(":checked")){
    //         console.log("checkBox val : ",$(`#${day}_sh_chk`).val())
    //         const input_val = $(`#${day}_sh_chk`).val()
    //         const day_full = $(`#${day}_sh_chk`).attr("name")
    //         const obj = {
    //             'startTime' : $(`#${input_val}_start`).val(),
    //             'endTime' : $(`#${input_val}_end`).val()
    //         }
    //         specialHours[day_full] = obj
    //     }
    // })
    if(window.location.pathname === "/account-complete"){

      
      const update_data = {
        "biz_name":localStorage["biz_name"],
        "sp_name":$("#first_name")[0].value,
        "phone":$("#personal_number")[0].value,
        "email":localStorage["email"],
        "place_id":localStorage["place_id"]
      }

      console.log("ud:",update_data)

      console.log("request sent for updating the data in comms table")
      $.ajax({
        url: `${window.location.origin}/update_comms_table?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(update_data),
        dataType: 'json',
        }).then((res)=>{
          console.log(res)
        }).catch((err)=>{
          console.log(res)
        });
    }
    
    payload.special_hours = specialHours
    
    console.log(payload);

    $.ajax({
    url: `${window.location.origin}/gmb_update_profile_data?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify(payload),
    dataType: 'json',
    }).then((res)=>{
      window.location.href = window.location.origin+"/dashboard"
    }).catch((err)=>{
      window.location.href = window.location.origin+"/dashboard"
    });
  }
})

$(".log-btn").click((e) => {
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
