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
            $("body").html(JSON.stringify(data));
        }
    });
})