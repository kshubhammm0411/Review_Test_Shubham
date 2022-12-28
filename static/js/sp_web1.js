
if (jQuery) {
  console.log("jquery is loaded");
} else {
  console.log("Not loaded");
}

let menu_open=false;
//hide div on scroll down
window.onscroll = (()=>{
  if(menu_open){
  $("#w-nav-overlay-0").attr("style","display:none;height:0px")
  menu_open=false;
  }
})

function scrollToSection(event) {
  event.preventDefault();
  var element = document.getElementById(event.target.getAttribute('href').substring(1));
  window.scroll({
    behavior: 'smooth',
    left: 0,
    top: element.offsetTop
  });
}

// ---> to open form by default (?form=opem)
const modal = document.querySelector(".modal")
let searchParams = new URLSearchParams(window.location.search)
if(searchParams.has('form')){
  let form = searchParams.get('form')
  if(form==='open'){
    modal.style.display = "block"
  }
}

const images = document.querySelectorAll('.grid_images')
const testimonial = document.querySelector('.testimonial')
const services = document.querySelector('.service-content')

console.log(images)
function handleIntersection(entries) {
  entries.map((entry) => {
    if (entry.isIntersecting) {
      images.forEach((image)=>{
        image.src = image.dataset.src;
        image.classList.add('loaded')
        console.log("done")
      })
      observer.unobserve(entry.target);
    }
  });
}

showImage = () => {
  images.forEach(image=>handleIntersection(image))
}

// const modal = document.querySelector(".modal")

$(".reservationbtn").click(()=>{
  console.log("reservationbtn clicked")
  modal.style.display = "block"
})

$(".openmodal").click(()=>{
  console.log("reservationbtn clicked")
  modal.style.display = "block"
})

$(".close").click(()=>{
  console.log("reservationbtn clicked")
  modal.style.display = "none"
})

const observer = new IntersectionObserver(handleIntersection);
try{
  observer.observe(testimonial)
}
catch(e){
  observer.observe(services)
}
// images.forEach(image => observer.observe(image));

const isNullUndefEmptyStr = (objec) => Object.values(objec).every(value => {
  if (value === '') {
    return true;
  }
  return false;
});

removeNameError = (evt) =>{
  $("#phone_error").text('')
}

onlyNumberKey = (evt) =>{
  if ($("#phone").val().length > 9){
    $("#phone_error").text('Only 10 digits allowed!')
    return false
  }
  else{
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)){
      return false;
    }
    $("#phone_error").text('')
    return true;
  }
}

(function($) {
  'use strict';
  $("#menu_btn").click(()=>{
    console.log("menu btn clicked")
    if(!menu_open){
    $("#w-nav-overlay-0").attr("style","display:block;height:5596.58px")
    menu_open=true;
    }
    else{
    $("#w-nav-overlay-0").attr("style","display:none;height:0px")
    menu_open=false;
    }
  })

  $(".w--nav-link-open").click(()=>{
    $("#w-nav-overlay-0").attr("style","display:none;height:0px")
    menu_open=false;
  })

  var showChar = 240;
	var ellipsestext = "...";
	var moretext = "more";
	var lesstext = "less";
	$('.more').each(function() {
		var content = $(this).html();

		if(content.length > showChar) {

			var c = content.substr(0, showChar);
			var h = content.substr(showChar, content.length - showChar);
			var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span style="display: none;">' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

			$(this).html(html);
		}

  });

	$(".morelink").click(function(){
    console.log(this)
    console.log("more",moretext)
    console.log("less",lesstext)
		if($(this).hasClass("less")) {
			$(this).html(moretext);
			$(this).removeClass("less");
		} else {
			$(this).addClass("less");
			$(this).html(lesstext);
		}
		$(this).parent().prev().toggle();
		$(this).prev().toggle();
		return false;
	});

  $("input[name='cust_type']").click(()=>{
    $("#radio_error").text("")
  })

  $( "#submit" ).click((event)=>{
    event.preventDefault()
    const name = $("#name").val()
    const phone = $("#phone").val()
    var cust_type =  $("input[name='cust_type']:checked").val()
    const host = window.location.origin
    if($("#booking_link").attr('href') !== 'None'){
      window.open($("#booking_link").attr('href'), '_blank');
    }
    if($("#phone").val().length !== 10){
      $("#phone_error").text('Please enter a vaild number!')
      $("#radio_error").text("Please select a value!")
      return
    }
    if ($("#name").val().length <= 0){
      $("#name_error").text('Please enter your name!')
      return 
    }
    if ($("#phone").val().length !== 10){
      $("#phone_error").text('Please enter a vaild number!')
      return 
    }
    if(!cust_type){
      cust_type="Not Selected"
    }
    $("#submit").attr("value","Please Wait ...")
    const data = {
      "form_data":{
            "name":name,
            "phone":phone,
          },
          "repeat_customer":cust_type,
          "url":host
        }
        
    console.log("data : ",data)
    $.ajax({
        url: `https://chrone.work/send-lead-sms-landingpage`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json'
    }).then((res)=>{
      $("#resevation").hide()
      if($("#booking_link").attr('href') !== 'None'){
        $("#success-booking").show()
      }
      else{
        $("#success").show()
      }
      $("#submit").attr("value","Submit")
      console.log("success")
    }).catch((e)=>{
      $("#resevation").hide()
      $("#fail").show()
      $("#submit").attr("value","Submit")
      console.log("error")
    })
  });

  $("#book-now").click(()=>{
    console.log('book now clicked')
    window.location.href = $("#booking_link").attr('href')
  })

  $('#close-modal').click(()=>{
    $("#resevation").show()
    $("#success").hide()
    $('#myCheckbox').prop('checked', false)
    $("#name").val('');
    $("#phone").val('');

    $('input:radio[name=cust_type]:checked').prop('checked', false);
  })

})(jQuery);


