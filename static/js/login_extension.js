error_msg = window.location.search;

if(error_msg!=''){
  console.log(error_msg.split("error=")[1].replaceAll("+", " "));
  $("#errorMsg").html(error_msg.split("error=")[1].replaceAll("+", " "));
  $("#exampleModal").modal();
}