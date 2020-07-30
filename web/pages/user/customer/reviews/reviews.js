/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    reviewsFunctions();
});

function reviewsFunctions() {
    reviewsBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    reviewsPageFunctions();
    reviewsSetLink();
}

function reviewsBtnEvents() {

}

function reviewsSetLink(){
    $("#collapseTwo").addClass("show");
    $(".id-reviews").addClass("active");
    
}
function reviewsPageFunctions() {

}