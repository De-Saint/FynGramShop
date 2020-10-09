/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var shopsessionid, sessiontype;
$(document).ready(function () {
    cashoutFunctions();
});

function cashoutFunctions() {
    cashoutBtnEvents();
    shopsessionid = verifyUser();
    if (!shopsessionid || shopsessionid === 0) {
        returnToTimeOutPage(extension);
    }
    cashoutPageFunctions();
    cashoutSetLink();
}

function cashoutBtnEvents() {
    $("form[name=cashoutForm]").submit(function (e) {
        var Amount = $("#cashoutAmount").val();
        if (Amount.includes(",")) {
            Amount = Amount.replace(",", "");
        }
        var Pin = $("#cashoutPin").val();
        $(".mini_cart_close").click();
        var data = [Amount, Pin, shopsessionid];
        showLoading();
        GetData("CashOut", "NewCashoutRequest", "LoadCashOutOptions", data);
        e.preventDefault();
    });
}

function cashoutSetLink() {
    $("#collapseThree").addClass("show");
    $(".id-cashout").addClass("active");

}
function cashoutPageFunctions() {
    showLoading();
    GetData("CashOut", "GetCashoutRequests", "LoadCashoutRequests", shopsessionid);
}

function DisplayCashoutRequests(data, parent) {
    hideLoading();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var result = data[1];
        var count = 0;
        var childclone = parent.find(".cashoutlist-clone");
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            var newchild = childclone.clone();
            newchild.removeClass("cashoutlist-clone");
            newchild.removeClass("d-none");
            newchild.addClass("newclone");
            newchild.find(".cashout-sn").text(count);
            newchild.find(".cashout-bank").text(details["bankName"]);
            newchild.find(".cashout-acctnumber").text(details["account_number"]);
            newchild.find(".cashout-amount").text(PriceFormat(details["amount"]));
            newchild.find(".cashout-date").text(details["request_date"]);
            newchild.find(".cashout-time").text(details["request_time"]);
            var deletebtn = newchild.find(".btn-delete-cashout");

            var status = details["status"];
            if (status === "Pending") {
                newchild.find(".cashout-status").text(details["status"]).addClass("badge badge-primary badge-pill");
            } else if (status === "Approved") {
                newchild.find(".cashout-status").text(details["status"]).addClass("badge badge-success badge-pill");
                newchild.find(".btn-delete-cashout").removeClass("d-none");
            } else if (status === "Rejected") {
                newchild.find(".cashout-status").text(details["status"]).addClass("badge badge-danger badge-pill");
                newchild.find(".btn-delete-cashout").removeClass("d-none");
            }
            DisplayToolTip(deletebtn);
            deletebtn.click(function () {
                showLoading();
                ShowNotification("Deleting Cashout Request", "primary");
                var data = ["Deleted", details["CashOutID"], shopsessionid];
                GetData("CashOut", "ProcessCashOut", "LoadCashOutOptions", data);
            });

            newchild.appendTo(parent).show();
        });
        childclone.hide();

    } else {
         var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "ml-9 text-center newclone text-primary", text: "No Result Found", colspan:"7"}).appendTo(row);

    }
}

function DisplayCashOutOptions(data, parent) {
    var response = data[2];
    ShowNotification(response.msg, response.status);
    if (response.status === "success") {
        DisplayCashoutRequests(data, parent);
    } else {
        hideLoading();
    }
}