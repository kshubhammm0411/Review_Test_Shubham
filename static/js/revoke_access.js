$("button").click((e) => {
  console.log(e);
  $.ajax({
    url: `${window.location.origin}/revoke-access-api`,
    type: "get",
    contentType: 'application/json',
    success: function (response) {
      $("button").html("Revoked");
    },
  });
  localStorage.clear();
})