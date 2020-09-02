/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../";

$(document).ready(function () {
    trackOrderFunctions();

});


function trackOrderFunctions() {
    trackOrderBtnEvents();

}

function trackOrderBtnEvents() {
    $("#TrackOrder").click(function () {
        var reference = $("#OrderRef").val();
        if (reference) {
            showLoading();
            GetData("Order", "TrackOrder", "LoadTrackOrder", reference);
        } else {
            $(".mini_cart_close").click();
            ShowNotification("Please, provide the Order Reference Number.", 'error');
        }
    });


}




function DisplayTrackOrder(data) {
    hideLoading();
    var mainPar = $(".trackOrder_list");
    var parent = mainPar.find("#TrackOrderList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var count = 0;
        var childclone = parent.find(".track-order-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("order-clone");
            newchild.addClass("newclone");
            newchild.find(".order-sn").text(count);
            newchild.find(".order-reference").text(result["reference"]);
            newchild.find(".order-amount").text(PriceFormat(parseFloat(result["seller_amount"])));
            newchild.find(".order-payment").text(result["PaymentDetails"].payment_method);
            newchild.find(".order-status").text(result["StatusDetails"].name).addClass("badge-" + result["StatusDetails"].color);
            newchild.find(".order-bookeddate-time").text(result["booking_date"] + " " + result["booking_time"]);
            newchild.find(".order-product_count").text(result["product_count"]);
            var p = newchild.find(".trackorderstatus");
            newchild.find(".btn-view").click(function () {
                DisplayStatusHistoryDetails(result["StatusHistoryDetails"], p);
            });

            newchild.appendTo(parent).show();
        });
        $(".order-count").text(totalcount);
        childclone.hide();

    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "text-center newclone text-success", colspan: "9", text: "No Result Found"}).appendTo(row);

    }


}

function DisplayStatusHistoryDetails(data, parent) {
    console.log(data);

    parent.find(".new-clone").remove();
    if (data === "none") {
//        parent.text("No Result");
    } else {
        var childclone = parent.find(".trackorder-status-clone");
        var count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("trackorder-status-clone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".status-name").text(details.name).addClass("badge-" + details.color);
            newchild.find(".status-date").text(details.date + " " + details.time);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
    }
}
