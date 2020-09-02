/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var shopsessionid;
$(document).ready(function () {
    RecoveryFunctions();
});

function RecoveryFunctions() {
    recoveryBtnEvents();

}

function recoveryBtnEvents() {
    $("form[name=resetForm]").submit(function (e) {
        var EmailAddress = $("#resetEmail").val();
        showLoading();
        GetData("User", "ResetPassword", "LoadResetPassword", EmailAddress);
        e.preventDefault();
    });
    $("form[name=recoveryForm]").submit(function (e) {
        var recoveryCode = $("#recoveryCode").val();
        var recoveryPassword1 = $("#recoveryPassword1").val();
        var recoveryPassword2 = $("#recoveryPassword2").val();
        if (recoveryPassword1 === recoveryPassword2) {
            var data = [recoveryCode, recoveryPassword1];
            showLoading();
            GetData("User", "PasswordRecovery", "LoadPasswordRecovery", data);
        } else {
            ShowNotification("Password Mismatch.", 'error');
        }
        e.preventDefault();
    });


}


function DisplayResetPassword(resp) {
    hideLoading();
    if (resp.status === "success") {
        ShowNotification(resp.msg, 'success');
        $(".resetpwd").addClass("d-none");
        $(".recoverypwd").removeClass("d-none");
    } else if (resp.status === "error") {
        ShowNotification(resp.msg, 'error');
    }
}
function DisplayPasswordRecovery(resp) {
    hideLoading();
    if (resp.status === "success") {
        ShowNotification(resp.msg, 'success');
        window.location = extension + "LinksServlet?type=Login";
    } else if (resp.status === "error") {
        ShowNotification(resp.msg, 'error');
    }
}

