/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "";
var shopsessionid = "";
$(document).ready(function () {
    complaintsFunctions();
});

function complaintsFunctions() {
    complaintsBtnEvents();
    shopsessionid = verifyUser();
    var UserType = shopsessionid.split("#")[1];
    if (UserType === "G") {
        window.location = extension + "LinksServlet?type=Login";
    }
    complaintsPageFunctions();
}

function complaintsBtnEvents() {
    $("form[name=complaintsForm]").submit(function (e) {
        var comSubject = $("#comSubject").val();
        var comBody = $("#comBody").val();
        shopsessionid = verifyUser();
        var data = [shopsessionid,comSubject, comBody];
        showLoading();
        GetData("User", "SaveComplaints", "LoadSaveComplaints", data);
        $("#comBody").val("");
        e.preventDefault();
    });
}

function complaintsPageFunctions() {

}

function DisplaySaveComplaints(resp) {
    hideLoading();
    ShowNotification(resp.msg, resp.status);
}