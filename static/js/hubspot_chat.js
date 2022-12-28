function onConversationsAPIReady() {
  console.log(`HubSpot Conversations API: ${window.HubSpotConversations}`);
}
/*
  configure window.hsConversationsSettings if needed.
*/
window.hsConversationsSettings = {
    loadImmediately: false
};
/*
 If external API methods are already available, use them.
*/
if (window.HubSpotConversations) {
  onConversationsAPIReady();
} else {
  /*
    Otherwise, callbacks can be added to the hsConversationsOnReady on the window object.
    These callbacks will be called once the external API has been initialized.
  */
  window.hsConversationsOnReady = [onConversationsAPIReady];
}

$.ajax({
  type: "POST",
  url: `https://api.hubspot.com/conversations/v3/visitor-identification/tokens/create`,
  data: {
    "email": localStorage["email"],
    "firstName": localStorage["first_name"],
    "lastName": localStorage["last_name"]
  }
}).then((resp) => {
  console.log(resp);
  window.hsConversationsSettings = {
    identificationEmail: localStorage["email"],
    identificationToken: resp["token"]
  };
  window.HubSpotConversations.widget.load();
})


// success: success,
// dataType: dataType