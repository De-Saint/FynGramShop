/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "";
$(document).ready(function () {
    IndexFunctions();
});

function IndexFunctions() {
    IndexBtnEvents();
    IndexPageFunctions();

}

function IndexBtnEvents() {
    $(".b-close").click(function () {
        if ($("#newsletter_popup_dont_show_again").is(':checked')) {
            sessionStorage.setItem("newscheck", "No");
        } else {
            sessionStorage.setItem("newscheck", "Yes");
        }
    });


    $("form[name=mc-mail]").submit(function (e) {
        var newsletterEmail = $(".mc-email").val();
        var sessionid = $("#sessionid").val();
        if (newsletterEmail !== "") {
            var data = [newsletterEmail, sessionid];
            GetData("User", "SubcribeNewletter", "LoadSubcribeNewletter", data, extension);
        }
        e.preventDefault();
    });
}

function DisplaySubcribeNewletter(resp) {
    if (resp.status === "success") {
        $('.mailchimp-success').addClass('active');
        $('.mailchimp-success').html('' + resp.msg).fadeIn(900);
        $('.mailchimp-error').fadeOut(400);
    } else if (resp.status === "error") {
        $('.mailchimp-error').html('' + resp.msg).fadeIn(900);
    }
}

function IndexPageFunctions() {
   
}


