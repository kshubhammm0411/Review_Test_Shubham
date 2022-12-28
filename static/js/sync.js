$.ajax({
  url: `${window.location.origin}/get_sync_val?email=${localStorage["email"]}`
}).then((res) => {
  console.log(res);
  var data = res;
  var email = data["email"];
  var first_name = data["first_name"];
  var last_name = data["last_name"];
  var picture = data["picture"];
  var biz_name = data["biz_name"];
  var place_id = data["place_id"];
  localStorage.setItem("email", email);
  localStorage.setItem("first_name", first_name);
  localStorage.setItem("last_name", last_name);
  localStorage.setItem("picture", picture);
  localStorage.setItem("biz_name", biz_name);
  localStorage.setItem("place_id", place_id);

  var referrer = localStorage.getItem('referrer');
  console.log(referrer)
  console.log(referrer=='None')

  if(referrer!='None' && referrer!='null' && referrer!='https://accounts.google.com/'){
    localStorage.removeItem('referrer');
    window.location.href = referrer;
  } else{
    window.location.href = window.location.origin+"/dashboard"
  }
  
}).catch((e) => {
  console.log(e);
  if(localStorage["email"]==undefined || localStorage["place_id"]==undefined){
    window.location.href = `${window.location.origin}/login`;
  }
})