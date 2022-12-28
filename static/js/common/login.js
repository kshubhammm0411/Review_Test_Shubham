if(localStorage["email"]==undefined || localStorage["place_id"]==undefined){
  window.location.href = `${window.location.origin}/login`;
} else{
    console.log("email and place_id present")
}