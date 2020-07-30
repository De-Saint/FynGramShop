/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    returnsFunctions();
});

function returnsFunctions() {
    returnsBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    returnsPageFunctions();
    returnsSetLink();
}

function returnsBtnEvents() {

}

function returnsSetLink(){
    $("#collapseFour").addClass("show");
    $(".id-returns").addClass("active");
    
}
function returnsPageFunctions() {

}