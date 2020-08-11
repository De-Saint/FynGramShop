/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var shopsessionid, sessiontype;
$(document).ready(function () {
    ordersFunctions();
});

function ordersFunctions() {
    ordersBtnEvents();
    shopsessionid = verifyUser();
    if (!shopsessionid || shopsessionid === 0) {
        returnToTimeOutPage(extension);
    }
    ordersPageFunctions();
    ordersSetLink();
}

function ordersBtnEvents() {

}

function ordersSetLink() {
    $("#collapseFour").addClass("show");
    $(".id-orders").addClass("active");

}
function ordersPageFunctions() {
    showLoading();
    GetData("Order", "GetOrders", "LoadOrders", shopsessionid);
}

function DisplayOrders(data) {
    hideLoading();
    var parent = $("#OrderList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var count = 0;
        var childclone = parent.find(".order-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            console.log(result);
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

            var detailsbtn = newchild.find(".view_btn_order");
            detailsbtn.click(function () {
                localStorage.setItem("orderid", result["OrderID"]);
                window.location = extension + "LinksServlet?type=OrderDetails";
            });
            newchild.appendTo(parent).show();
        });
        $(".order-count").text(totalcount);
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "9", text: "No Result Found"}).appendTo(row);

    }
}
