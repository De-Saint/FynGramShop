/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    ordersFunctions();
});

function ordersFunctions() {
    ordersBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    ordersPageFunctions();
    ordersSetLink();
}

function ordersBtnEvents() {

}

function ordersSetLink(){
    $("#collapseFour").addClass("show");
    $(".id-orders").addClass("active");
    
}
function ordersPageFunctions() {

}