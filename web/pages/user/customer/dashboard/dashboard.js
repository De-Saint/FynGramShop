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

function dashboardSetLink() {
    $("#collapseOne").addClass("show");
    $(".id-dashboard").addClass("active");

}
function dashboardPageFunctions() {
    showLoading();
    GetData("Report", "GetCustomerStats", "LoadCustomerStats", shopsessionid);
}

function DisplayCustomerStats(data) {
    hideLoading();
    console.log(data);
    $(".address_count").text(data.address_count);
    $(".review_count").text(data.review_count);
    $(".discount_count").text(data.discount_count);
    $(".payment_count").text(data.payment_count);
    $(".wallet_balance").text(PriceNumberFormat(data.wallet_balance));
    $(".message_count").text(data.message_count);
    $(".transaction_count").text(data.transaction_count);
    $(".wishlist_count").text(data.wishlist_count);
    $(".order_count").text(data.order_count);
}