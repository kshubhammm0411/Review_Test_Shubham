const getPlatformSpecificURL = () => {
    if(navigator.platform=='iPhone') {
        return link.replaceAll("amp;", '').replaceAll("https://", "comgooglemapsurl://")
    } else{
        return fallback_link.replaceAll("amp;", '');
    }
}

let clicked = false;
let navigated = false;

$("#map-link-cta").click((e) => {
    if(!clicked && !navigated) {
        $.ajax({
            url: `${window.location.origin}/log-btn-click`,
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify({
                "place_id":biz_place_id,
                "route":window.location.pathname,
                "email":biz_email,
                "btn":"no-gmaps-available"
            }),
            dataType: 'json'
        }).catch((e) => {
            console.log(e)
        });

        $(".main").addClass("d-none");
        $(".redirect").removeClass("d-none");
    
        window.location.href = fallback_link.replaceAll("amp;", '');
    }
    $.ajax({
        url: `${window.location.origin}/log-btn-click`,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({
            "place_id":biz_place_id,
            "route":window.location.pathname,
            "email":biz_email,
            "btn":"map-link-cta-clicked"
        }),
        dataType: 'json'
    }).catch((e) => {
        console.log(e)
    });

    setTimeout(() => {
        if(!navigated || navigator.platform=="iPhone"){
            $.ajax({
                url: `${window.location.origin}/log-btn-click`,
                type: "post",
                contentType: 'application/json',
                data: JSON.stringify({
                    "place_id":biz_place_id,
                    "route":window.location.pathname,
                    "email":biz_email,
                    "btn":"no-gmaps-available"
                }),
                dataType: 'json'
            }).catch((e) => {
                console.log(e)
            });

            $(".main").addClass("d-none");
            $(".redirect").removeClass("d-none");
        
            window.location.href = fallback_link.replaceAll("amp;", '');
        }
    }, 2000)

    clicked = true;

    try {
        window.location.href = getPlatformSpecificURL();
        navigated = true;
    } catch (error) {
        $.ajax({
            url: `${window.location.origin}/log-btn-click`,
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify({
                "place_id":biz_place_id,
                "route":window.location.pathname,
                "email":biz_email,
                "btn":"no-gmaps-available"
            }),
            dataType: 'json'
        }).catch((e) => {
            console.log(e)
        });

        $(".main").addClass("d-none");
        $(".redirect").removeClass("d-none");
    
        window.location.href = fallback_link.replaceAll("amp;", '');
    }
});

$.ajax({
    url: `${window.location.origin}/log-route-open`,
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
        "place_id":biz_place_id,
        "biz_name":biz_name,
        "email":biz_email,
        "route":window.location.pathname
    }),
    dataType: 'json'
})
