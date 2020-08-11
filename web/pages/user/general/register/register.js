/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var shopsessionid;
$(document).ready(function () {
    RegisterFunctions();
});

function RegisterFunctions() {
    RegisterBtnEvents();

}

function RegisterBtnEvents() {
    $("form[name=registerForm]").submit(function (e) {
        var Gender = $("input[name=id_gender]:checked").val();
        var Frstname = $("#firstname").val();
        var Lastname = $("#lastname").val();
        var EmailAddress = $("#emial").val();
        var PhoneNumber = $("#phone").val();
        var Password = $("#password1").val();
        var password2 = $("#password2").val();
        var Newsletter = $("input[name=newsletter]:checked").val();
        var terms = $("input[name=terms]:checked").val();
        if (!Newsletter) {
            Newsletter = 0;
        }
        shopsessionid = verifyUser();
        if (Password === password2) {
            if (terms) {
                showLoading();
                var data = [Gender, Frstname, Lastname, EmailAddress, PhoneNumber, Password, Newsletter, shopsessionid];
                GetData("User", "RegisterCustomer", "LoadRegisterCustomer", data);
            } else {
                ShowNotification("Please, accept our terms and conditions by ticking the terms and condition box", 'error');
            }
        } else {
            ShowNotification("Your confirm password is not the same with your password. Please check and try again", 'error');
        }
        e.preventDefault();
    });

}


function DisplayRegisterCustomer(resp) {
    hideLoading();
    if (resp.status === "success") {
        SessionTokenManager(resp);
        ShowNotification(resp.msg, 'success');
        verifyUser();
        localStorage.setItem("shownewsletter", "No");
        cartcount = GetCartCount();
        $(".cart_count").text(cartcount);
        var pageredirect = localStorage.getItem("page_redirect");
        if (pageredirect === "checkout") {
            window.location = extension + "LinksServlet?type=CheckOut";
        } else if (pageredirect === "saveitems") {
            window.location = extension + "LinksServlet?type=WishList";
        } else {
            window.location = extension + "LinksServlet?type=DashBoard";
        }
    } else if (resp.status === "error") {
        ShowNotification(resp.msg, 'error');
    }

}

