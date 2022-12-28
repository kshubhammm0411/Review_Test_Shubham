if(
  localStorage['email']!=undefined &&
  localStorage['biz_name']!=undefined &&
  localStorage['place_id']!=undefined &&
  localStorage['first_name']!=undefined &&
  localStorage['last_name']!=undefined &&
  localStorage['picture']!=undefined
) {
  window.location.href = `${window.location.origin}/dashboard`;
}

