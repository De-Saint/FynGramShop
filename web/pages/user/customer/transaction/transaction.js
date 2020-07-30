/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    transactionsFunctions();
});

function transactionsFunctions() {
    transactionsBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    transactionsPageFunctions();
    transactionsSetLink();
}

function transactionsBtnEvents() {

}

function transactionsSetLink() {
    $("#collapseThree").addClass("show");
    $(".id-transactions").addClass("active");

}
function transactionsPageFunctions() {
    showLoading();
    GetData("Transaction", "GetRecentTransactions", "LoadRecentTransactions", sessionid);
}

function DisplayRecentTransactions(data, parent) {
    hideLoading();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var count = 0;
        var childclone = parent.find(".transactionlist-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("transactionlist-clone");
            newchild.addClass("newclone");
            var type = result["OtherTransactionType"];
            newchild.find(".trans-sn").text(count);
            newchild.find(".trans-name").text(result["NameOfTransaction"]);
            newchild.find(".trans-date-time").text(result["date"] + " " + result["time"]);
            newchild.find(".trans-ref").text(result["reference"]);
            newchild.find(".trans-desc").text(result["description"]);
            newchild.find(".trans-desc").attr("title", result["description"]);
            var btndelete = newchild.find(".delete-transaction-btn");
            if (type === "Debit") {
                newchild.find(".trans-type").text(result["OtherTransactionType"]).addClass("text-danger");
                newchild.find(".trans-amount").text(PriceFormat(result["amount"])).addClass("text-danger");
            } else if (type === "Credit") {
                newchild.find(".trans-type").text(result["OtherTransactionType"]).addClass("text-success");
                newchild.find(".trans-amount").text(PriceFormat(result["amount"])).addClass("text-success");
            }

            btndelete.click(function () {
                showLoading();
                var data = [sessionid, result["id"]];
                GetData("Transaction", "DeleteTransaction", "LoadDeleteTransaction", data);
            });
            DisplayToolTip(btndelete);
            newchild.appendTo(parent).show();
        });
        childclone.hide();

    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 text-center newclone text-primary", text: "No Result Found"}).appendTo(row);

    }
}

function DisplayDeleteTransaction(data, parent) {
    console.log(data);
    var resp = data[2];
    ShowNotification(resp.msg, resp.status);
    if (resp.status === "success") {
        DisplayRecentTransactions(data, parent);
    } else {
        hideLoading();
    }
}