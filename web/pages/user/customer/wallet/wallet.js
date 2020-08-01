/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    walletsFunctions();
});

function walletsFunctions() {
    walletsBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    walletsPageFunctions();
    walletsSetLink();
}

function walletsBtnEvents() {
    $("form[name=fundwalletForm]").submit(function (e) {
        var fundwalletAmount = $("#fundwalletAmount").val();
        if (fundwalletAmount.includes(",")) {
            fundwalletAmount = fundwalletAmount.replace(/,/g, "");
        }
        var newPaymentAmount = CalculatePercentage(fundwalletAmount);
        $("#fund_wallet").modal("hide");
        var email = localStorage.getItem("uEmail");
        payWithPaystack(newPaymentAmount, email, fundwalletAmount, "Fund Wallet");
        e.preventDefault();
    });
}


function payWithPaystack(paymentamount, email, actualamount, PaymentType) {
    var userDetail = localStorage.getItem("uUserName");
    var handler = PaystackPop.setup({
        key: 'pk_test_b3685f824518679567d6356e2636fc184878e833',
        email: email,
        amount: paymentamount + "00",
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "Customer Name",
                    value: userDetail
                },
                {
                    display_name: "Payment Type",
                    variable_name: "Payment Type",
                    value: PaymentType
                }
            ]
        },
        callback: function (response) {
            var data = [sessionid, actualamount, response.reference, response.trans, PaymentType];
            showLoading();
            GetData("Payment", "ValidatePaystackPayment", "LoadValidatePaystackPayment", data);
        },
        onClose: function () {
            ShowNotification("CheckOut closed, transaction terminated", "error");
        }
    });
    handler.openIframe();
}


function walletsSetLink() {
    $("#collapseThree").addClass("show");
    $(".id-wallets").addClass("active");

}
function walletsPageFunctions() {
    showLoading();
    GetData("Wallet", "GetWalletDetails", "LoadGetWalletDetails", sessionid);
}

function DisplayGetWalletDetails(resp) {
    hideLoading();
    if (resp) {
        $(".walletNumber").val(resp.wallet_number);
        $(".MainBalance").text(PriceNumberFormat(resp.MainBalance));
        $(".PendingBalance").text(PriceNumberFormat(resp.PendingBalance));
        $(".walletPin").text(resp.wallet_pin);
    }
}

function DisplayValidatePaystackPayment(data) {
    console.log(data);
    var resp = data.result;
    if (resp.status === "success") {
        var paymentdata = data.paymentdata;
        ShowNotification(resp.msg, resp.status);
        DisplayGetWalletDetails(paymentdata);
    } else {
        ShowNotification(resp.msg, resp.status);
        hideLoading();
    }

}