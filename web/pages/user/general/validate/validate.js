/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../";
var sessionid, sessiontype = "", cartcount;
$(document).ready(function () {
    validateFunctions();
});

function validateFunctions() {
    validateBtnEvents();

}

function validateBtnEvents() {
    $("form[name=verificationForm]").submit(function (e) {
        var verifyCode = $("#verifyCode").val();
        shopsessionid = verifyUser();
        var data = [verifyCode, shopsessionid];
        showLoading();
        GetData("User", "ValidateAccount", "LoadValidateAccount", data);
        e.preventDefault();
    });


}


function DisplayValidateAccount(resp) {
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


