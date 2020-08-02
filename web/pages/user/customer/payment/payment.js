/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    paymentsFunctions();
});

function paymentsFunctions() {
    paymentsBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    paymentsPageFunctions();
    paymentsSetLink();
}

function paymentsBtnEvents() {

}

function paymentsSetLink() {
    $("#collapseThree").addClass("show");
    $(".id-payments").addClass("active");

}
function paymentsPageFunctions() {
    showLoading();
    GetData("Payment", "GetPayments", "LoadGetPayments", sessionid);

}

function DisplayGetPayments(data, parent) {
    hideLoading();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var count = 0;
        var childclone = parent.find(".paymentlist-clone");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("paymentlist-clone");
            newchild.addClass("newclone");
            newchild.removeClass("d-none");
            newchild.find(".pay-sn").text(count);
            newchild.find(".pay-paytype").text(result["payment_type"]);
            newchild.find(".pay-tcode").text(result["reference_code"]);
            newchild.find(".pay-amount").text(PriceNumberFormat(result["amount"]));
            newchild.find(".pay-date-time").text(result["date"] + " " + result["time"]);
            var deletebtn = newchild.find(".pay-delete-btn");
            DisplayToolTip(deletebtn);

            deletebtn.click(function () {
                showLoading();
                var data = [sessionid, result["id"]];
                GetData("Payment", "DeletePayment", "LoadPaymentsInfo", data);
            });
            newchild.appendTo(parent).show();
        });
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "ml-9 text-center newclone text-primary", text: "No Result Found", colspan:"5"}).appendTo(row);

    }

}

function DisplayPaymentsInfo(data, parent) {
    var resp = data[2];
    ShowNotification(resp.msg, resp.status);
    if (resp.status === "success") {
        DisplayGetPayments(data, parent);
    } else {
        hideLoading();
    }
}