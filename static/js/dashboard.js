var impressionsData;
var impressionsOptions;
var share_report_link = "";
var review_url;
var target;

if (jQuery) {
  console.log("jquery is loaded");
} else {
  console.log("Not loaded");
}




// if(localStorage["email"]==undefined){
//   // window.location.href = `${window.location.origin}/login`;
// } else{
  var parentElem = $(".container-scroller")[0];
  parentElem.classList.remove('d-none');
// }

const isNullUndefEmptyStr = (objec) => Object.values(objec).every(value => {
  if (value === '') {
    return true;
  }
  return false;
});

// $.ajax({
//   url: `${window.location.origin}/check_user?email=${localStorage["email"]}`
// }).then((res) => {
//   if(res['res']=="nouser"){
//     console.log("not a user")
//     // localStorage.clear();
//     // location.href = `${window.location.origin}/login`;
//   }else{
//     console.log("user");
//     if(localStorage["place_id"]!=res["place_id"] || localStorage["biz_name"]!=res["biz_name"]){
//       // localStorage["place_id"] = res["place_id"];
//       // localStorage["biz_name"] = res["biz_name"];

//       // location.reload();
//     }
//   }
// });


(function($) {
  'use strict';

  $.ajax({
    url: `${window.location.origin}/google/gmb-posts?email=${localStorage["email"]}&place_id=${localStorage["place_id"]}`
  }).then((res) => {
    console.log("post list res",res)
    const post = res["localPosts"].filter((e) => e["state"]=='LIVE')[0];

    const date = post['updateTime']
    const full_date = date.split("T")[0]

    var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const year = full_date.split("-")[0]
    const month = full_date.split("-")[1]
    const day = full_date.split("-")[2]

    const display_date = `${mS[month-1]} ${day}, ${year}`;
    const post_html = `<div class="m-3 d-flex flex-column align-items-center" style="border-radius: 15px;border: 1px solid gray; overflow: hidden;">
      <div class="d-flex flex-column align-items-center" style="width:100%">
          ${Object.keys(post).includes("media") ? `<img src="${post["media"][0]["googleUrl"]}" alt="GBP post image" style="object-fit: contain; width: 100%" />` : '' }
          <div style="width: 90%">
              <div class="date_cont" style="display: inline-block; text-align: right; width: 100%">
                <small class="mt-2 mb-0" style="font-size: 12px;">${display_date}</small>
              </div>
                <p align="center" style="width:100%; padding:20px;margin: 0; font-size: 1rem;">${post["summary"]}</p>
          </div>
        </div>
      </div>
    </div>`;
    $("#posts-list").html(post_html);
    $("#loader_posts").addClass("d-none");
    $("#posts_home_tab").removeClass("d-none");
  }).catch((e)=>{
    console.log("ERROR : ",e);
    $("#recent-post").addClass("d-none");
    $("#loader_posts").addClass("d-none");
    $("#posts_home_tab").removeClass("d-none");
  })

  // $.ajax({
  //   url: `${window.location.origin}/biz_profile_completion_formdata?place_id=${localStorage["place_id"]}&email=${localStorage["email"]}`,
  //   type: "post",
  //   contentType: 'application/json',
  //   data: JSON.stringify({
  //     "phone":"7987215728",
  //     "description":"New description updated from profile data.",
  //     "state":"Maharashtra",
  //     "zipcode":"411032",
  //   }),
  //   dataType: 'json'
  // }).then((res)=>{
  //   console.log(res)
  // });

  // $.ajax({
  //   url: `${window.location.origin}/biz_profile_completion?place_id=${localStorage["place_id"]}&email=${localStorage["email"]}`
  // }).then((res)=>{
  //   console.log("incomplete field",res)
  //   let showProfileCompletion = false;

  //   Object.keys(res).map((key) => {
  //     if (res[key]=="" || res[key]==null){
  //       showProfileCompletion = true;
  //       $(`#${key}`).removeClass("d-none");
  //     }
  //     // else{
  //     //   $(`#${key}`).value(res[key]);
  //     // }
  //   })

  //   if(showProfileCompletion) {
  //     $("#profile_comp_div").removeClass("d-none");
  //   }

  // })

  $("#update_profile_completion").click( () => {
    console.log("update_profile_completion clicked")
    var update_vals = {
      "phone": $("#sp_phone").val(),
      "personalPhone": $("#sp_personal_phone").val(),
      "website" : $("#sp_website").val(),
      "appointmentLink" : $("#sp_appointment_link").val(),
      "facebookLink" : $("#sp_facebook_link").val(),
      "instagramLink" : $("#sp_instagram_link").val(),
      "tiktokLink" : $("#sp_tiktok_link").val(),
      "openDate" : $("#sp_open_date").val(),
      "description" : $("#sp_description").val(),
      "zipcode" : $("#sp_zip").val(),
      "city" : $('#sp_city').val(),
      "address" : $('#sp_address').val()
    }
    // if($("#state").hasClass("d-none")){
    //   update_vals.state = ''
    // }
    // else{
    //   update_vals.state = $('#sp_state').find(":selected").text()
    // }
    // if($("#regularHours").hasClass("d-none")){
    //     update_vals=update_vals;
    // }
    // else{
    //     const regularHours = {}
    //     const rh_days = ['mon','tue','wed','thu','fri','sat','sun']
    //     rh_days.map((day)=>{
    //         if($(`#${day}_rh_chk`).is(":checked")){
    //             console.log("checkBox val : ",$(`#${day}_rh_chk`).val())
    //             const input_val = $(`#${day}_rh_chk`).val()
    //             const day_full = $(`#${day}_rh_chk`).attr("name")
    //             const obj = {
    //                 'startTime' : $(`#${input_val}_start`).val(),
    //                 'endTime' : $(`#${input_val}_end`).val()
    //             }
    //             regularHours[day_full] = obj
    //         }
    //     })
    //     console.log(regularHours)
    //     if(Object.keys(regularHours).length === 0){
    //       update_vals = update_vals
    //     }
    //     else{
    //       console.log(regularHours)
    //       update_vals.regularHours = regularHours
    //     }
    // }
    // if($("#specialHours").hasClass("d-none")){
    //   update_vals=update_vals;
    // }
    // else{
    //   const specialHours = {}
    //   const rh_days = ['mon','tue','wed','thu','fri','sat','sun']
    //   rh_days.map((day)=>{
    //       if($(`#${day}_sh_chk`).is(":checked")){
    //           console.log("checkBox val : ",$(`#${day}_sh_chk`).val())
    //           const input_val = $(`#${day}_sh_chk`).val()
    //           const day_full = $(`#${day}_sh_chk`).attr("name")
    //           const obj = {
    //               'startTime' : $(`#${input_val}_start`).val(),
    //               'endTime' : $(`#${input_val}_end`).val()
    //           }
    //           specialHours[day_full] = obj
    //       }
    //   })
    //   if(Object.keys(specialHours).length === 0){
    //     update_vals = update_vals
    //   }
    //   else{
    //     console.log(specialHours)
    //     update_vals.specialHours = specialHours
    //   }
    // }
    console.log(update_vals)
    $.ajax({
      url: `${window.location.origin}/biz_profile_completion_formdata?place_id=${localStorage["place_id"]}&email=${localStorage["email"]}`,
      type: "post",
      contentType: 'application/json',
      data: JSON.stringify(update_vals),
      dataType: 'json'
    }).then((res)=>{
      console.log(res)
    });

  })

  const updateGoalReviewsData = () => {
    $("#current-reviews").html(reviews.length);

    var bar = new ProgressBar.Circle(circleProgress, {
      color: '#001737',
      strokeWidth: 10,
      trailWidth: 10,
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },
      from: {
        color: '#aaa',
        width: 10
      },
      to: {
        color: '#2617c9',
        width: 10
      },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = '<p class="text-center mb-0">Progress</p>' + Math.round(circle.value() * 100) + "%";
        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(value);
        }

      }
    });

    bar.text.style.fontSize = '1.875rem';
    bar.text.style.fontWeight = '700';
    bar.animate(reviews.length/parseInt(target["review_target"]));
  }

  $("#share-btn").click((e) => {
    $.ajax({
      url: `${window.location.origin}/share_report_link?email=${localStorage["email"]}`
    }).then(function (response){
      $("#share-btn").html("Link Copied");
      navigator.clipboard.writeText(`${window.location.origin}/report/${response}`);
      setTimeout(() => {
        $("#share-btn").html("Share Report");
      }, 1500);
    })
    $("#share-btn").html("..");
  })

  var invites_count;
  var invite_target;

  $.ajax({
    url: `${window.location.origin}/biz-review-target?place_id=${localStorage["place_id"]}&email=${localStorage["email"]}`
  }).then(function (response){
    target = response;
    $("#goal-reviews").html(response["review_target"]);
    $("#goal-invites").html(response["invite_target"]);
    invite_target = response["invite_target"];

    if(reviews){
      updateGoalReviewsData();
    }

    $("#progress-invites").html(`-/${response["invite_target"]}`);

    if(invites_count!=undefined){
      $("#percent-invites").html(`${parseInt(invites_count*100/response["invite_target"])}%`);
      $("#progress-invites").html(`${invites_count}/${response["invite_target"]}`);

      $("#percent-invites-width").attr("style", `height:24px;text-align:center;width:${invites_count*100/response["invite_target"]}%;`)
    }
  })


  $.ajax({
    url: `${window.location.origin}/get_invites_count/${localStorage["email"]}`
  }).then(function (response){
    invites_count = response;
    if(target){
      $("#percent-invites").html(`${parseInt(invites_count*100/target["invite_target"])}%`);
      $("#progress-invites").html(`${invites_count}/${target["invite_target"]}`);

      $("#percent-invites-width").attr("style", `height:24px;text-align:center;width:${invites_count*100/target["invite_target"]}%;`)
    }
  })

  $("#connect_square").click((e)=>{
    console.log("connect square clicked")
    var sq_url
    $.ajax({
      url: `${window.location.origin}/get_square_oauth_url`
    }).then((res)=>{
      console.log(res)
      console.log(res.url)
      sq_url = res.url
      window.location.href = sq_url
    })
  })

  // $("#review_copy_link").click((e) => {
  //   $("#review_copy_link").html("Link Copied");
  //   $("#review_copy_link").removeClass("btn-info")
  //   $("#review_copy_link").addClass("btn-success")
  //   $("#review_copy_link").addClass("disabled")
  //   navigator.clipboard.writeText(`${review_url}?uid=copy_${(new Date()).toISOString()}`);
  //   setTimeout(() => {
  //     $("#review_copy_link").removeClass("btn-success")
  //     $("#review_copy_link").removeClass("disabled")
  //     $("#review_copy_link").addClass("btn-info")
  //     $("#review_copy_link").html("Copy Link");
  //   }, 1500);
  // })

//   $("#review_qrcode").click(() => {
//     console.log("qr code clicked")
//     $("#review_qrcode").html("Generated");
//     $("#review_qrcode").removeClass("btn-info")
//     $("#review_qrcode").addClass("btn-success")
//     $("#review_qrcode").addClass("disabled")
//     setTimeout(() => {
//     $("#review_qrcode").html("Generate QR Code");
//     $("#review_qrcode").addClass("btn-info")
//     $("#review_qrcode").removeClass("btn-success")
//     $("#review_qrcode").removeClass("disabled")
//   }, 1500);
// });

  $.ajax({
    url: `${window.location.origin}/get-review-url?email=${localStorage["email"]}`
  }).then(function (response){
    console.log(response)
    review_url = response;
    $("#review_copy_link").click((e) => {
      $("#review_copy_link").html("Link Copied");
      $("#review_copy_link").removeClass("btn-info")
      $("#review_copy_link").addClass("btn-success")
      $("#review_copy_link").addClass("disabled")
      navigator.clipboard.writeText(`${review_url}?uid=copy_${(new Date()).toISOString()}`);
      setTimeout(() => {
        $("#review_copy_link").removeClass("btn-success")
        $("#review_copy_link").removeClass("disabled")
        $("#review_copy_link").addClass("btn-info")
        $("#review_copy_link").html("Copy Link");
      }, 1500);
      $.ajax({
        url: `${window.location.origin}/log-btn-click`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({
          "place_id":localStorage["place_id"],
          "route":window.location.pathname,
          "email":localStorage["email"],
          "btn":'review_copy_link'
        }),
        dataType: 'json'
      }).catch((e) => {
        console.log(e)
      });
    });

    $("#review_qrcode").click(() => {
      $("#review_qrcode").html("Generated");
      $("#review_qrcode").removeClass("btn-info")
      $("#review_qrcode").addClass("btn-success")
      $("#review_qrcode").addClass("disabled")
      setTimeout(() => {
        $("#review_qrcode").html("Generate QR Code");
        $("#review_qrcode").addClass("btn-info")
        $("#review_qrcode").removeClass("btn-success")
        $("#review_qrcode").removeClass("disabled")
      }, 1500);
      $("#big-qr-code").attr("src", `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${review_url}?uid=qr_${(new Date()).toISOString()}`);
      $.ajax({
        url: `${window.location.origin}/log-btn-click`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({
          "place_id":localStorage["place_id"],
          "route":window.location.pathname,
          "email":localStorage["email"],
          "btn":'review_qrcode'
        }),
        dataType: 'json'

      }).then((res)=>{
      }).catch((e) => {
        console.log(e)
      });
    })

    $("#review_share_link").click(() => {
      $.ajax({
        url: `${window.location.origin}/log-btn-click`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({
          "place_id":localStorage["place_id"],
          "route":window.location.pathname,
          "email":localStorage["email"],
          "btn":'review_share_link'
        }),
        dataType: 'json'
      }).catch((e) => {
        console.log(e)
      });
    })

    $("#review_qrcode").attr("src", `https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${review_url}?`);
    $("#big-qr-code").attr("src", `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${review_url}?uid=qr_${(new Date()).toISOString()}`);
    $("#text_msg").val(`Hi there, thanks for visiting ${localStorage["biz_name"]}. If you liked my service, please leave me a 5-star review using the link below. Do mention the service.\n${review_url}`)
  })

  $("#send_text_msg").click(()=>{
    var msg = $("#text_msg").val()
    console.log("on click send : ",msg)

    $.ajax({
      url: `${window.location.origin}/log-btn-click`,
      type: "post",
      contentType: 'application/json',
      data: JSON.stringify({
        "place_id":localStorage["place_id"],
        "route":window.location.pathname,
        "email":localStorage["email"],
        "btn":'send_text_msg'
      }),
      dataType: 'json'

    }).catch((e) => {
      console.log(e)
    });

    console.log(navigator.userAgent)
    if(navigator.userAgent.match('Android')){
      window.open('sms:?body='+encodeURIComponent(msg.replaceAll("&", "and").replaceAll(review_url, review_url+" ")),'_blank')
    }
    if(navigator.userAgent.match('iPhone')){
      window.open('sms:?&body='+encodeURIComponent(msg.replaceAll("&", "and")),'_blank')
    }
  })

  $("#customer_send_sms").click(() => {
    var name = $("#customer_name")[0].value;
    var phone = $("#customer_phone")[0].value;
    var country_code = $("#country_code")[0].value;

    $("#customer_send_sms").html("Sending..")
    $.ajax({
      url: `${window.location.origin}/send-sms`,
      type: "post",
      contentType: 'application/json',
      data: JSON.stringify({
        "biz_name":localStorage["biz_name"],
        "message":`Hi ${name}, thanks for visiting ${localStorage["biz_name"]}. If you liked my service, please leave me a 5-star review using the link below. Do mention the service you availed and what you liked about it.`,
        "recipient":`${country_code}${phone}`,
        "url":review_url,
        "email":localStorage["email"],
      }),
      dataType: 'json',
      success: function (response) {
        $("#customer_send_sms").html("Sent")
        if(invites_count!=undefined){
          invites_count = parseInt(invites_count);
          $("#percent-invites").html(`${parseInt((parseInt(invites_count)+1)*100/invite_target)}%`);
          $("#progress-invites").html(`${parseInt(invites_count)+1}/${invite_target}`);
    
          $("#percent-invites-width").attr("style", `height:24px;text-align:center;width:${(parseInt(invites_count)+1)*100/invite_target}%;`)
          invites_count += 1;
        }
        setInterval(() => {
          $("#customer_send_sms").html("Send Again")
        }, 1000)
      },
    });

    $.ajax({
      url: `${window.location.origin}/log-btn-click`,
      type: "post",
      contentType: 'application/json',
      data: JSON.stringify({
        "place_id":localStorage["place_id"],
        "route":window.location.pathname,
        "email":localStorage["email"],
        "btn":'customer_send_sms'
      }),
      dataType: 'json'
    }).catch((e) => {
      console.log(e)
    });
  })

  // $('#sp_open_date').datepicker({
  //   format: "yyyy-mm-dd",
  //   startDate: new Date('2000-01-01'),
  //   endDate: new Date().toJSON().slice(0,10),
  // });

})(jQuery);

// console.log("function called")


$.ajax({
  url: `${window.location.origin}/get-call-direction-metrics?email=${localStorage["email"]}`
}).then(function (response){
  $('#call-click').html(response['call_clicks'])
  $('#direction-req').html(response['direction'])
})

var impressions;
var dates;
$.ajax({
  url: `${window.location.origin}/get-impressions?email=${localStorage["email"]}`
}).then(function (response){
  impressions = response['impressions'];

  max_imp = 0;
  impressions.map((e) => {
    max_imp = Math.max(e, max_imp)
  })

  step_size = Math.ceil(max_imp/4);

  dates = response['dates'];

  impressionsData = {
    labels: dates,
    datasets: [{
            label: 'Impression',
            data: impressions,
            borderColor: [
                '#3022cb'
            ],
            borderWidth: 3,
            fill: false,
        }
    ],
  };
  impressionsOptions = {
      scales: {
          yAxes: [{
              display: true,
              gridLines: {
                drawBorder: false,
                display: true,
            },
              ticks: {
                display: true,
                beginAtZero: false,
                stepSize: step_size,
                font: {
                  size: window.innerWidth < 600 ? 8 : 12
                }
              }
          }],
          xAxes: [{
            display: true,
              position: 'bottom',
              gridLines: {
                  drawBorder: false,
                  display: false,
              },
              ticks: {
                display: true,
                beginAtZero: true,
                stepSize: 1,
                font: {
                  size: window.innerWidth < 600 ? 10 : 14
                }
              }
          }],

      },
      legend: {
          display: false,
          labels: {
            boxWidth: 0,
          }
      },
      elements: {
          point: {
              radius: 2
          },
          line: {
            tension: .4,
        },
      },
      tooltips: {
          backgroundColor: 'rgba(2, 171, 254, 1)',
      },
  };

  var lineChartCanvas = $("#impressions").get(0).getContext("2d");
  var saleschart = new Chart(lineChartCanvas, {
      type: 'line',
      data: impressionsData,
      options: impressionsOptions
  });

})

$.ajax({
  url: `${window.location.origin}/get-website-conversation-metrics?email=${localStorage["email"]}`
}).then(function (response) {
  $('#conversation_count').html(response['conversations'])
  $('#website-click').html(response['website_clicks']) 
});

var reviews_html = '';
var recent_reviews_header_html = `<div class="d-flex justify-content-between mb-4">
<div class="font-weight-medium">Reviewer</div>
<div class="font-weight-medium">Rating</div>
</div>`;
var recent_reviews_html = '';
var editing_review_index;
var reviews;


var rating;
var review_count;
let rate_map = {"FIVE":5,"FOUR":4,"THREE":3,"TWO":2,"ONE":1};


const updateRatingReviewCount = (rating, review_count) => {
  const starTotal = 5
  const starPercentage = (rating / starTotal) * 100;

  $('#rating').html(rating)
  $('#review-count').html(`\u00A0(${review_count})`)
  $("#overall-rating").html(`${parseFloat(rating)} (${review_count})`)
}

const updateRecentReviews = (reviews) => {
  recent_reviews_html = recent_reviews_header_html;
  reviews.map((review, index) => {
    recent_reviews_html += `
    <div class="d-flex justify-content-between mb-4">
      <div class="text-secondary font-weight-medium d-flex align-self-center">
        <img class="img-sm rounded-circle" src="${review['reviewer']['profilePhotoUrl']}" alt="profile image">
        <div class="font-weight-bold ml-2 mt-1 w-100">${review['reviewer']['displayName']}</div>
      </div>
      <div class="stars-outer-${index}">
        <div class="stars-inner-${index}"></div>
      </div>
    </div>
    `;
  })

  $("#recent-reviews").html(recent_reviews_html);

  reviews.map((review, index) => {
    const starTotal = 5
    const starPercentage = (rate_map[review["starRating"]] / starTotal) * 100;
    document.querySelector(`.stars-inner-${index}`).style.width = `${starPercentage}%`;
  })
}

const updateReviews = (reviews) => {
  reviews_html = '';

  display_reviews = reviews;

  display_reviews.map((review, index) => {
    let stars = '';

    let reply_form = `
      <div class="d-sm-flex d-none flex-row ml-sm-3 mt-sm-2">
        <input type="text" class="form-control reply-container-${index}" placeholder="Reply message">
        <button type="${index}" class="reply btn btn-primary mx-2">Reply</button>
      </div>
      <div class="d-flex d-sm-none flex-column ml-2 mt-2">
        <div class="d-flex flex-row">
          <input type="text" class="form-control reply-container-${index}" placeholder="Reply message">
        </div>
        <div class="d-flex flex-row mt-1">
          <button type="${index}" class="reply btn btn-primary mx-2">Reply</button>
        </div>
      </div>
    `;

    let edit_form = '';
    if(Object.keys(review).includes("reviewReply")){
      edit_form = `
      <div class="d-sm-flex d-none flex-row ml-sm-3 mt-sm-2">
        <i class="mdi mdi-reply" style="display: inline-block;font-size: 20px;text-align: left;color: #f2125e;"></i>
        <h5 class="m-sm-2 w-100 m-0" for="exampleInputPassword1">${review['reviewReply']['comment']}</h5>
        <button type="${index}" class="reply-edit btn btn-primary mx-2">Edit Reply</button>
        <button type="${index}" class="reply-delete btn btn-light">Delete Reply</button>
      </div>
      <div class="d-flex d-sm-none flex-column ml-2 mt-2">
        <div class="d-flex flex-row">
          <i class="mdi mdi-reply" style="display: inline-block;font-size: 20px;text-align: left;color: #f2125e;"></i>
          <h5 class="m-sm-2 w-100 m-0" for="exampleInputPassword1">${review['reviewReply']['comment']}</h5>
        </div>
        <div class="d-flex flex-row mt-1">
          <button type="${index}" class="reply-edit btn btn-primary mx-2">Edit Reply</button>
          <button type="${index}" class="reply-delete btn btn-light">Delete Reply</button>
        </div>
      </div>
      `;
    }

    let editing_form = '';
    if(Object.keys(review).includes("reviewReply")){
      editing_form = `
      <div class="d-sm-flex d-none flex-row ml-sm-3 mt-sm-2">
        <input type="text" class="form-control reply-container-${index}" value="${review['reviewReply']['comment']}" placeholder="Reply message">
        <button type="${index}" class="reply-discard-editing btn btn-light mx-2">Discard</button>
        <button type="${index}" class="reply-update btn btn-primary">Update Reply</button>
      </div>
      <div class="d-flex d-sm-none flex-column ml-2 mt-2">
        <div class="d-flex flex-row">
          <input type="text" class="form-control reply-container-${index}" value="${review['reviewReply']['comment']}" placeholder="Reply message">
        </div>
        <div class="d-flex flex-row mt-1">
          <button type="${index}" class="reply-discard-editing btn btn-light mx-2">Discard</button>
          <button type="${index}" class="reply-update btn btn-primary">Update Reply</button>
        </div>
      </div>
      `;
    }

    for(let i=0; i<rate_map[review["starRating"]]; i++){
      stars += `<svg width="25pt" height="25pt" version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
      <path d="m375.58 177.32c-3.957 0.16797-7.3984 2.7812-8.6133 6.5547l-44.609 138.26-145.23-0.28516h-0.003906c-4.1133-0.007812-7.7578 2.6328-9.0273 6.543-1.2695 3.9102 0.125 8.1953 3.457 10.605l117.68 85.16-45.188 138.12c-1.2773 3.9062 0.11328 8.1914 3.4375 10.605 3.3242 2.418 7.8281 2.4141 11.148-0.007812l117.35-85.641 117.4 85.641h-0.003906c3.3242 2.4219 7.8242 2.4258 11.148 0.007812 3.3242-2.418 4.7109-6.6992 3.4336-10.605l-45.188-138.12 117.68-85.16h0.003906c3.3281-2.4102 4.7266-6.6914 3.4531-10.602-1.2695-3.9102-4.9141-6.5547-9.0234-6.5469l-145.24 0.28516-44.66-138.26c-1.3086-4.0469-5.1562-6.7266-9.4102-6.5508z" fill="#ffb258" fill-rule="evenodd"/>
      </svg>`;
    }

    for(let i=5; i>rate_map[review["starRating"]]; i--){
      stars += `<svg width="25pt" height="25pt" version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
      <path d="m374.76 172.45c-1.543 0.41797-2.7695 1.5859-3.2617 3.1055l-48.633 146.07h-155.69c-2.0391 0.007812-3.8477 1.3242-4.4844 3.2656-0.63281 1.9414 0.046875 4.0703 1.6914 5.2812l126.48 92.461-48.633 150.89c-0.63672 1.957 0.0625 4.0977 1.7266 5.3008 1.6641 1.2031 3.918 1.1992 5.5742-0.015624l126.48-92.461 126.48 92.461h0.003907c1.6562 1.2148 3.9062 1.2188 5.5703 0.015624 1.668-1.2031 2.3633-3.3438 1.7305-5.3008l-48.633-150.89 126.48-92.461c1.6445-1.2109 2.3242-3.3398 1.6875-5.2812-0.63281-1.9414-2.4414-3.2578-4.4844-3.2656h-155.69l-48.633-146.07c-0.78125-2.4023-3.3125-3.7695-5.75-3.1055zm1.2422 19.734 45.215 135.66c0.69141 1.8867 2.5 3.1328 4.5078 3.1055h144.66l-117.62 85.934c-1.6484 1.207-2.3398 3.3398-1.7109 5.2852l45.215 140.32-117.46-85.934c-1.6641-1.2188-3.9258-1.2188-5.5938 0l-117.46 85.934 45.215-140.32c0.63281-1.9453-0.058594-4.0781-1.707-5.2852l-117.62-85.934h144.66c2.0078 0.027343 3.8164-1.2188 4.5039-3.1055z" fill="#ffb258" fill-rule="evenodd"/>
    </svg>`;
    }

    reviews_html += `
    <tr>
    <td class="px-0">
      <div class="d-flex d-sm-none flex-column mb-2">
        <div class="d-flex flex-row">
          <img class="img-sm rounded-circle mb-md-0 mr-2" src="${review['reviewer']['profilePhotoUrl']}" alt="profile image">
          <div class="d-flex flex-column w-100">
            <div class="font-weight-bold ml-2 mt-1 w-100">${review['reviewer']['displayName']}</div>
            <div class="ratings w-100">
              ${stars}
            </div>
          </div>
        </div>
        <small style="white-space: nowrap; align-self: end;">${review["updateTime"]}</small>
      </div>
      <div class="d-none d-sm-flex flex-sm-row">
        <img class="img-sm rounded-circle mb-md-0 mr-2" src="${review['reviewer']['profilePhotoUrl']}" alt="profile image">
        <div class="d-flex flex-column w-100">
          <div class="font-weight-bold ml-2 mt-1 w-100">${review['reviewer']['displayName']}</div>
          <div class="ratings w-100">
            ${stars}
          </div>
        </div>
        <small style="white-space: nowrap;">${review["updateTime"]}</small>
      </div>
      <h4 class="m-sm-2">${Object.keys(review).includes("comment") ? review['comment'] : ""}</h4>
      ${Object.keys(review).includes("reviewReply") ?
        (editing_review_index!=undefined && editing_review_index==index) ?
          editing_form :
        edit_form :
      reply_form}
    </td>
    </tr>
    `
  })

  $('.table > tbody').html(reviews_html)

  $(".reply").click((e) => {
    let clickIndex = e.target.getAttribute("type");
    let width = window.innerWidth;
    let reply;
    if(width<=425){
      reply = $(`.reply-container-${clickIndex}`)[1].value;
    } else{
      reply = $(`.reply-container-${clickIndex}`)[0].value;
    }
    console.log(reply);

    $.ajax({
      type: "GET",
      url: `${window.location.origin}/review_reply?name=${reviews[clickIndex]["name"]}&reply=${reply}&email=${localStorage["email"]}`
    }).then((resp) => {
      reviews[clickIndex]["reviewReply"] = resp
      updateReviews(reviews);
    }).catch((e) => {
      alert("Unable to reply on this review");
      updateReviews(reviews);
    })
  })

  $(".reply-edit").click((e) => {
    editing_review_index = parseInt(e.target.getAttribute("type"));
    updateReviews(reviews);
  })

  $(".reply-discard-editing").click((e) => {
    let clickIndex = e.target.getAttribute("type");
    editing_review_index = undefined;
    updateReviews(reviews);
  })

  $(".reply-delete").click((e) => {
    let clickIndex = e.target.getAttribute("type");
    $.ajax({
      type: "GET",
      url: `${window.location.origin}/review_reply_delete?name=${reviews[clickIndex]["name"]}&email=${localStorage["email"]}`
    }).then((resp) => {
      delete reviews[clickIndex]["reviewReply"];
      updateReviews(reviews);
    }).catch((e) => {
      alert("Unable to delete this reply");
      updateReviews(reviews);
    })
  })

  $(".reply-update").click((e) => {
    let clickIndex = e.target.getAttribute("type");
    let width = window.innerWidth;
    let reply;
    if(width<=425){
      reply = $(`.reply-container-${clickIndex}`)[1].value;
    } else{
      reply = $(`.reply-container-${clickIndex}`)[0].value;
    }
    
    console.log(reply);

    $.ajax({
      type: "GET",
      url: `${window.location.origin}/review_reply_update?name=${reviews[clickIndex]["name"]}&reply=${reply}&email=${localStorage["email"]}`
    }).then((resp) => {
      reviews[clickIndex]["reviewReply"] = resp;
      editing_review_index = undefined;
      updateReviews(reviews);
    }).catch((e) => {
      alert("Unable to update this reply");
      updateReviews(reviews);
    })
  })
}


$("#sp-name").html(localStorage["biz_name"])
$("#sp-email").html(localStorage["email"])
$("#sp-image").attr('src', localStorage["picture"])

$("#actionable_cta_review").click(() => {
  let actionable_link = 'google/reviews?noReplyFilter=1';
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "btn":"actionable-cta-review",
      "email":localStorage["email"],
      "route":window.location.pathname
    }),
    dataType: 'json'
  }).then(() => {
    window.location.href = window.location.origin+'/'+actionable_link;
    return false;
  }).catch((e)=>{
    window.location.href = window.location.origin+'/'+actionable_link;
  })
})

$("#actionable_cta_account").click(() => {
  let actionable_link = 'google/account';
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "btn":"actionable-cta-account",
      "email":localStorage["email"],
      "route":window.location.pathname
    }),
    dataType: 'json'
  }).then(() => {
    window.location.href = window.location.origin+'/'+actionable_link;
    return false;
  }).catch((e)=>{
    window.location.href = window.location.origin+'/'+actionable_link;
  })
})

$("#actionable_cta_upload_photo").click(() => {
  let actionable_link = 'google/upload-pics';
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "btn":"actionable-cta-upload-photo",
      "email":localStorage["email"],
      "route":window.location.pathname
    }),
    dataType: 'json'
  }).then(() => {
    window.location.href = window.location.origin+'/'+actionable_link;
    return false;
  }).catch((e)=>{
    window.location.href = window.location.origin+'/'+actionable_link;
  })
})


const getReviews = () => {
  $.ajax(
    {
      url: `${window.location.origin}/get-reviews?email=${localStorage["email"]}`
    }
  ).then(function (response) {
    let updateGoalReviewsData = () => {
      $("#current-reviews").html(reviews.length);
    
      var bar = new ProgressBar.Circle(circleProgress, {
        color: '#001737',
        strokeWidth: 10,
        trailWidth: 10,
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: {
          color: '#aaa',
          width: 10
        },
        to: {
          color: '#2617c9',
          width: 10
        },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
    
          var value = '<p class="text-center mb-0">Progress</p>' + Math.round(circle.value() * 100) + "%";
          if (value === 0) {
            circle.setText('');
          } else {
            circle.setText(value);
          }
    
        }
      });
    
      bar.text.style.fontSize = '1.875rem';
      bar.text.style.fontWeight = '700';
      bar.animate(reviews.length/parseInt(target["review_target"]));
    }

    reviews = response['reviews']
    rating = response['rating']
    review_count = response['review_count']

    updateRatingReviewCount(rating, review_count);
    
    if(target){
      updateGoalReviewsData();
    }
    updateRecentReviews(reviews.slice(0, 5));
  })
}

getReviews();

const getRank = () =>{
  let date_today = new Date()
  let date = date_today.toISOString().split('T')[0]
  let place_id = localStorage['place_id']
  let payload = {
    place_id:place_id,
    date:date
  }

  console.log(payload);
  $.ajax({
    url: `${window.location.origin}/get-rank`,
    data: payload
  }).then(function (response){
    let html_body = '';
    for(res of JSON.parse(response)){
      html_body += `
        <li>
          <div>${res['keyword']}</div>
          <div>${res['search_volume']}</div>
        </li>
      `
    }
    // document.getElementById('rank_list').innerHTML = html_body;
  });
}

$(".profile-completion-modal-close").click((e) => {
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn":'profile-completion-modal-close'
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });
})

$(".qr-code-modal-close").click((e) => {
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn":'qr-code-modal-close'
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });
})

$("#menu_dropdown").click(() => {
  $.ajax({
    url: `${window.location.origin}/log-btn-click`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      "place_id":localStorage["place_id"],
      "route":window.location.pathname,
      "email":localStorage["email"],
      "btn": e.currentTarget.getAttribute('id')
    }),
    dataType: 'json'
  }).catch((e) => {
    console.log(e)
  });
})

$("*[id$='_tab']").click((e) => {
  var id = e.currentTarget.getAttribute('id');
  console.log("clicked : ",id)
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


// getRank();
document.getElementById("welcome_msg").innerHTML = `Welcome <b>${localStorage["biz_name"]}</b>!`;

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
