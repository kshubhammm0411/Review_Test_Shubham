var impressionsData;
var impressionsOptions;
var share_report_link = "";
var review_url;
var target;

// if(localStorage["email"]==undefined){
//   window.location.href = `${window.location.origin}/login`;
// }

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
          <div class="d-flex d-sm-none flex-column mt-2">
            <div class="d-flex flex-row">
              <input type="text" class="form-control reply-container-${index}" placeholder="Reply message">
            </div>
            <div class="d-flex flex-row ml-0 mt-1">
              <button type="${index}" class="reply btn btn-primary">Reply</button>
            </div>
          </div>
        `;

        let edit_form = '';
        if(Object.keys(review).includes("reviewReply")){
          edit_form = `
          <div class="d-sm-flex d-none flex-row ml-sm-3 mt-sm-2">
            <i class="mdi mdi-reply" style="display: inline-block;font-size: 20px;text-align: left;color: #f2125e;"></i>
            <h5 class="m-sm-2 w-100 m-0" for="exampleInputPassword1">${review['reviewReply']['comment']}</h5>
            <button type="${index}" class="reply-edit btn btn-primary">Edit Reply</button>
            <button type="${index}" class="reply-delete btn btn-light">Delete Reply</button>
          </div>
          <div class="d-flex d-sm-none flex-column ml-2 mt-2">
            <div class="d-flex flex-row">
              <i class="mdi mdi-reply" style="display: inline-block;font-size: 20px;text-align: left;color: #f2125e; align-self: center;"></i>
              <h5 class="m-sm-2 w-100 m-0" style="align-self: center;" for="exampleInputPassword1">${review['reviewReply']['comment']}</h5>
            </div>
            <div class="d-flex flex-row mt-1">
              <button type="${index}" class="reply-edit btn btn-primary mr-2">Edit Reply</button>
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
              <button type="${index}" class="reply-discard-editing btn btn-light mr-2">Discard</button>
              <button type="${index}" class="reply-update btn btn-primary">Update Reply</button>
            </div>
          </div>
          `;
        }

        for(let i=0; i<rate_map[review["starRating"]]; i++){
          stars += `<svg width="18pt" height="18pt" version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
          <path d="m375.58 177.32c-3.957 0.16797-7.3984 2.7812-8.6133 6.5547l-44.609 138.26-145.23-0.28516h-0.003906c-4.1133-0.007812-7.7578 2.6328-9.0273 6.543-1.2695 3.9102 0.125 8.1953 3.457 10.605l117.68 85.16-45.188 138.12c-1.2773 3.9062 0.11328 8.1914 3.4375 10.605 3.3242 2.418 7.8281 2.4141 11.148-0.007812l117.35-85.641 117.4 85.641h-0.003906c3.3242 2.4219 7.8242 2.4258 11.148 0.007812 3.3242-2.418 4.7109-6.6992 3.4336-10.605l-45.188-138.12 117.68-85.16h0.003906c3.3281-2.4102 4.7266-6.6914 3.4531-10.602-1.2695-3.9102-4.9141-6.5547-9.0234-6.5469l-145.24 0.28516-44.66-138.26c-1.3086-4.0469-5.1562-6.7266-9.4102-6.5508z" fill="#ffb258" fill-rule="evenodd"/>
          </svg>`;
        }

        for(let i=5; i>rate_map[review["starRating"]]; i--){
          stars += `<svg width="18pt" height="18pt" version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
          <path d="m374.76 172.45c-1.543 0.41797-2.7695 1.5859-3.2617 3.1055l-48.633 146.07h-155.69c-2.0391 0.007812-3.8477 1.3242-4.4844 3.2656-0.63281 1.9414 0.046875 4.0703 1.6914 5.2812l126.48 92.461-48.633 150.89c-0.63672 1.957 0.0625 4.0977 1.7266 5.3008 1.6641 1.2031 3.918 1.1992 5.5742-0.015624l126.48-92.461 126.48 92.461h0.003907c1.6562 1.2148 3.9062 1.2188 5.5703 0.015624 1.668-1.2031 2.3633-3.3438 1.7305-5.3008l-48.633-150.89 126.48-92.461c1.6445-1.2109 2.3242-3.3398 1.6875-5.2812-0.63281-1.9414-2.4414-3.2578-4.4844-3.2656h-155.69l-48.633-146.07c-0.78125-2.4023-3.3125-3.7695-5.75-3.1055zm1.2422 19.734 45.215 135.66c0.69141 1.8867 2.5 3.1328 4.5078 3.1055h144.66l-117.62 85.934c-1.6484 1.207-2.3398 3.3398-1.7109 5.2852l45.215 140.32-117.46-85.934c-1.6641-1.2188-3.9258-1.2188-5.5938 0l-117.46 85.934 45.215-140.32c0.63281-1.9453-0.058594-4.0781-1.707-5.2852l-117.62-85.934h144.66c2.0078 0.027343 3.8164-1.2188 4.5039-3.1055z" fill="#ffb258" fill-rule="evenodd"/>
        </svg>`;
        }

        reviews_html += `
        <tr>
        <td class="px-0">
          <div class="d-flex d-sm-none flex-row mb-2">
            <div class="d-flex flex-row" style="flex:1;">
              <img class="img-sm rounded-circle mb-md-0 mr-2" src="${review['reviewer']['profilePhotoUrl']}" alt="profile image">
              <div class="d-flex flex-column w-100">
                <div class="font-weight-bold ml-2 mt-1 w-100">${review['reviewer']['displayName']}</div>
                <div class="ratings w-100">
                  ${stars}
                </div>
              </div>
            </div>
            <small style="white-space: nowrap;padding: 5px 0px;">${review["updateTime"]}</small>
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
      $("#loader_div_review").addClass("d-none")
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
          url: `${window.location.origin}/log-btn-click`,
          type: "post",
          contentType: 'application/json',
          data: JSON.stringify({
            "place_id":localStorage["place_id"],
            "route":window.location.pathname,
            "email":localStorage["email"],
            "btn":"review-reply-reply"
          }),
          dataType: 'json'
        }).catch((e) => {
          console.log(e)
        });

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
        $.ajax({
          url: `${window.location.origin}/log-btn-click`,
          type: "post",
          contentType: 'application/json',
          data: JSON.stringify({
            "place_id":localStorage["place_id"],
            "route":window.location.pathname,
            "email":localStorage["email"],
            "btn":"review-reply-edit"
          }),
          dataType: 'json'
        }).catch((e) => {
          console.log(e)
        });
        editing_review_index = parseInt(e.target.getAttribute("type"));
        updateReviews(reviews);
      })

      $(".reply-discard-editing").click((e) => {
        $.ajax({
          url: `${window.location.origin}/log-btn-click`,
          type: "post",
          contentType: 'application/json',
          data: JSON.stringify({
            "place_id":localStorage["place_id"],
            "route":window.location.pathname,
            "email":localStorage["email"],
            "btn":"review-reply-discard-edit"
          }),
          dataType: 'json'
        }).catch((e) => {
          console.log(e)
        });
        let clickIndex = e.target.getAttribute("type");
        editing_review_index = undefined;
        updateReviews(reviews);
      })

      $(".reply-delete").click((e) => {
        $.ajax({
          url: `${window.location.origin}/log-btn-click`,
          type: "post",
          contentType: 'application/json',
          data: JSON.stringify({
            "place_id":localStorage["place_id"],
            "route":window.location.pathname,
            "email":localStorage["email"],
            "btn":"review-reply-delete"
          }),
          dataType: 'json'
        }).catch((e) => {
          console.log(e)
        });
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

      // $(`*[id*='reply-container-']`).change((e) => {
      //   e.currentTarget.setAttribute('value', e.target.value);
      // })

      $(".reply-update").click((e) => {
        $.ajax({
          url: `${window.location.origin}/log-btn-click`,
          type: "post",
          contentType: 'application/json',
          data: JSON.stringify({
            "place_id":localStorage["place_id"],
            "route":window.location.pathname,
            "email":localStorage["email"],
            "btn":"review-reply-update"
          }),
          dataType: 'json'
        }).catch((e) => {
          console.log(e)
        });
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

    const getReviews = () => {
      var curr_url = window.location.href;
      var curr_split = curr_url.split('?')
      var url = `${window.location.origin}/get-reviews?email=${localStorage["email"]}`
      if(curr_split.length>1){
        if(curr_split[1].includes('noReplyFilter=1')){
          url = `${url}&noReplyFilter=1`
        }
      }
      $.ajax(
        {
          url: url
        }
      ).then(function (response) {
        console.log("review reply", response)
        if(response['reviews'].length === 0){
          console.log("no unreplied reviews")
          $("#loader_div_review").addClass("d-none")
          $('.table > tbody').html("No un-replied review.")
        }
        else{
          $("#loader_div_review").addClass("d-none")
          reviews = response['reviews']
          rating = response['rating']
          review_count = response['review_count']
          updateReviews(reviews);
        }
      })
    }
    
    getReviews();


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

    $('#filter_change').on('change', function() {
      if(this.value=="non-reply"){
        window.location.href += '?noReplyFilter=1' 
      } else {
        window.location.href = window.location.href.split('?')[0]
      }
    });

    const set_dropdown_val = () => {
      var curr_url = window.location.href;
      var curr_split = curr_url.split('?')
      if(curr_split.length>1){
        document.getElementById("filter_change").selectedIndex = 1;
      } else {
        document.getElementById("filter_change").selectedIndex = 0;
      }
    }

    set_dropdown_val();
  }
})

