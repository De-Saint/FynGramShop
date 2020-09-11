/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../";
var shopsessionid, sessiontype;
$(document).ready(function () {
    profileFunctions();
});

function profileFunctions() {
    profileBtnEvents();
    shopsessionid = verifyUser();
    if (!shopsessionid || shopsessionid === 0) {
        returnToTimeOutPage(extension);
    }
    profilePageFunctions();
    profileSetLink();
}

function profileBtnEvents() {
    $("#bkBankID").select2({

    });
    $("#bkAcctType").select2({

    });
    $(".change_bank_details").click(function () {
        var acctnumber = $(".uAccoutNumber").val();
        $("#bkAcctNumber").val(acctnumber);
        var ubkdetid = $(".ubkdetid").val();
        $("#bkdetid").val(ubkdetid);
        $("#option").val("edit");
    });

    $("form[name=newBankDetailsForm]").submit(function (e) {
        var bankid = $("#bkBankID").val();
        var bkaccttype = $("#bkAcctType").val();
        var bkAcctNumber = $("#bkAcctNumber").val();
        var option = $("#option").val();
        var bkdetid = $("#bkdetid").val();
        if (bankid === 0 || bankid === "0") {
            ShowNotification("Please select a bank or select an account type", "error");
        } else {
            if (bkaccttype === 0 || bkaccttype === "0") {
                ShowNotification("Please select a bank or select an account type", "error");
            } else {
                showLoading();
                $(".mini_cart_close").click();
                if (option === "add") {
                    var data = [shopsessionid, bankid, bkaccttype, bkAcctNumber];
                    showLoading();
                    GetData("CashOut", "CreateBankDetails", "LoadAddBankDetails", data);
                } else {
                    var data = [bankid, bkaccttype, bkAcctNumber, bkdetid];
                    showLoading();
                    GetData("CashOut", "EditBankDetails", "LoadAddBankDetails", data);
                }

            }
        }
        e.preventDefault();
    });
    $("#UpdateProfile").click(function () {
        var uLastName = $(".uLastName").val();
        var uFirstName = $(".uFirstName").val();
        var uNewsletter = $("input[name=newsletter]:checked").val();
        if (!uNewsletter) {
            uNewsletter = 0;
        }
        var uPhone = $(".uPhone").val();
        var uOldPass = $(".uOldPass").val();
        var uNewPass = $(".uNewPass").val();
        if (uLastName) {
            if (uFirstName) {
                if (uPhone) {
                    if (uOldPass) {
                        if (uNewPass) {
                            var data = [shopsessionid, uLastName, uFirstName, uNewsletter, uPhone, uOldPass, uNewPass];
                            showLoading();
                            GetData("User", "UpdateProfile", "LoadAddBankDetails", data);
                        } else {
                            ShowNotification("Please, enter the new password", "error");
                        }
                    } else {
                        ShowNotification("Please, provide your current password", "error", );
                    }
                } else {
                    ShowNotification("Please, enter your new phone number", "error", );
                }

            } else {
                ShowNotification("Please, provide your firstname", "error", );
            }

        } else {
            ShowNotification("Please, provide your lastname", "error", );
        }



    });


}

function profileSetLink() {
    $("#collapseTwo").addClass("show");
    $(".id-profile").addClass("active");

}
function profilePageFunctions() {
    showLoading();
    GetData("CashOut", "GetBanks", "LoadBanks", "");
}




function DisplayBanks(data) {
    hideLoading();
    var parent = $("#bkBankID");
    parent.empty();
    if (data === "empty") {
    } else {
        parent.append($('<option/>').val(0).text("Select Bank"));
        $.each(data, function (key, value) {
            parent.append($('<option/>').val(key).text(value["name"]));
        });
    }
}

function DisplayAddBankDetails(resp) {
    ShowNotification(resp.msg, resp.status);
    hideLoading();
    if (resp.status === "success") {
        GetData("User", "GetUserDetails", "LoadUserDetails", shopsessionid);
        window.location.reload();
    }

}