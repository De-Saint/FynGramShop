/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    discountsFunctions();
});

function discountsFunctions() {
    discountsBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    discountsPageFunctions();
    discountsSetLink();
}

function discountsBtnEvents() {

}

function discountsSetLink() {
    $("#collapseFive").addClass("show");
    $(".id-discounts").addClass("active");

}
function discountsPageFunctions() {
    showLoading();
    GetData("Discount", "GetCustomerDiscountCodes", "LoadCustomerDiscountCodes", sessionid);

}

function DisplayCustomerDiscountCodes(data, parent) {
    hideLoading();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var result = data[1];
        var count = 0;
        var childclone = parent.find(".dcode-clone");
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            console.log(details);
            var newchild = childclone.clone();
            newchild.removeClass("dcode-clone");
            newchild.removeClass("d-none");
            newchild.addClass("newclone");
            newchild.find(".dcode-sn").text(count);
            newchild.find(".dcode-code").text(details["DiscountCodeData"].code);
            newchild.find(".dcode-totalavail").text(details["total_available"]);
            if (details["DiscountCodeData"].DiscountDeductionTypeName === "Amount") {
                newchild.find(".dcode-type").text("Would deduct " + PriceFormat(details["DiscountCodeData"].deduction_value) + " from order amount");
            } else {
                newchild.find(".dcode-type").text("Would deduct " + details["DiscountCodeData"].deduction_value + "% from order amount");

            }
            newchild.find(".dcode-expirydate").text(details["DiscountCodeData"].expiry_date);
            var deletebtn = newchild.find(".delete_dcode_btn");

            var status = details["status"];
            if (status === "Unused") {
                newchild.find(".dcode-status").text(details["status"]).addClass("badge badge-primary badge-pill");
            } else if (status === "Used") {
                newchild.find(".dcode-status").text(details["status"]).addClass("badge badge-success badge-pill");
//                newchild.find(".delete_dcode_btn").removeClass("d-none");
            }
            var status = details["DiscountCodeData"].Status;
            if (status === "Active") {
                newchild.find(".dcode-active").text(status).addClass("badge badge-success");
            } else if (status === "InActive") {
                newchild.find(".dcode-active").text(status).addClass("badge badge-primary");
            } else if (status === "Expired") {
                newchild.find(".dcode-active").text(status).addClass("badge badge-danger");
//                newchild.find(".delete_dcode_btn").removeClass("d-none");
            }
            DisplayToolTip(deletebtn);
            deletebtn.click(function () {
//                showLoading();
//                ShowNotification("Deleting Cashout Request", "primary");
//                var data = ["Delete", details["DiscountCodeData"].id];
//            GetData("Discount", "ProcessDiscount", "LoadDiscountCodeInfo", data);
            });

            newchild.appendTo(parent).show();
        });
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", text: "No Result Found", colspan:"7"}).appendTo(row);

    }
}