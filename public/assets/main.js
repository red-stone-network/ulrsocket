var config = {}

$("#url-name").on("input", (e)=>{
    var test = RegExp("^[a-zA-Z0-9]*$", "gm").exec($("#url-name").val())
    if (!test) {
        $("#url-name-characters").css("display", "block")
    } else {
        $("#url-name-characters").css("display", "none")
    }
})

$("#shortened-url").on("input", (e)=>{
    var test = /^(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/gm.exec($("#shortened-url").val())
    if (!test) {
        $("#shortened-url-invalid").css("display", "block")
    } else {
        $("#shortened-url-invalid").css("display", "none")
    }
})

$("#password").on("input", (e)=>{
    $("#password-incorrect").css("display", "none")
})

$("#create-new-link").on("click", (e)=>{
    $("#url-created").css("display", "none")
    $("#create").css("display", "block")

    $("#shortened-url").val("")
    $("#url-name").val("")
})

$("#submit").on("click", (e)=>{
    $.ajax({
        type: "POST",
        url: "/create-url",
        data: {
            url: $("#shortened-url").val(),
            name: $("#url-name").val(),
            password: $("#password").val(),
        },
        success: function(data) {
            try {
                if (!data.success) {
                    if (data.error == "password-incorrect") {
                        $("#password-incorrect").css("display", "block")
                    }
                    return
                }
                var link = "https://" + document.location.host + "/" + data.name

                $("#url-created").css("display", "block")
                $("#create").css("display", "none")

                $("#new-url-link").attr("href", link)
                $("#new-url-link").text(link)

                //$("body").html(JSON.stringify(data));
            } catch(e) {
                alert(e)
            }
        }
    });
})

$.ajax({
    type: "GET",
    url: "/config.json",
    success: function(data) {
        try {
            config = data
            if (data.passwordProtected) {
                $("#password-box").css("display", "block")
            }
        } catch(e) {
            alert(e)
        }
    }
});