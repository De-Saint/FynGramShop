/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var page_redirect, sessionid;
$(document).ready(function () {
    LoginFunctions();
});

function LoginFunctions() {
    LoginBtnEvents();
}

function LoginBtnEvents() {
    $("form[name=loginForm]").submit(function (e) {
        var EmailAddress = $("#fgemail").val();
        var Password = $("#fgpass").val();
        sessionid = verifyUser();
        var data = [EmailAddress, Password, sessionid];
        GetData("User", "Login", "LoadLoginCustomer", data);
        e.preventDefault();
    });
}

function DisplayLoginCustomer(resp) {
    SessionTokenManager(resp);
    sessionid = verifyUser();
    if (resp.status === "success") {
        ShowNotification(resp.msg, 'success');
        localStorage.setItem("shownewsletter", "No");
        cartcount = GetCartCount();
        $(".cart_count").text(cartcount);
        var pageredirect = localStorage.getItem("page_redirect");
        if (pageredirect === "checkout") {
            window.location = extension + "LinksServlet?type=CheckOut";
        } else if (pageredirect === "saveditems") {
            window.location = extension + "LinksServlet?type=WishList";
        } else {
            window.location = extension + "LinksServlet?type=DashBoard";
        }
    } else if (resp.status === "error") {
        ShowNotification(resp.msg, 'error');
    }

}