/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var shopsessionid, sessiontype;
$(document).ready(function () {
    dashboardFunctions();
});

function dashboardFunctions() {
    dashboardBtnEvents();
    shopsessionid = verifyUser();
    if (!shopsessionid || shopsessionid === 0) {
        returnToTimeOutPage(extension);
    }
    dashboardPageFunctions();
    dashboardSetLink();
}

function dashboardBtnEvents() {

}

function dashboardSetLink(){
    $("#collapseOne").addClass("show");
    $(".id-dashboard").addClass("active");
    
}
function dashboardPageFunctions() {

}