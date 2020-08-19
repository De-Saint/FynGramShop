/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var shopsessionid, sessiontype;
var orderid = 0;
$(document).ready(function () {
    orderDetailsFunctions();
});
function GetOrderID() {
    return orderid = localStorage.getItem("orderid");
}
function orderDetailsFunctions() {
    orderDetailsBtnEvents();
    shopsessionid = verifyUser();
    if (!shopsessionid || shopsessionid === 0) {
        returnToTimeOutPage(extension);
    }
    orderDetailsPageFunctions();
    orderDetailsSetLink();
}

function orderDetailsBtnEvents() {
    var options = {
        max_value: 5,
        step_size: 0.5,
        selected_symbol_type: 'utf8_star',
        initial_value: 3,
        update_input_field_name: $("#input2")

    };
    $(".rating").rate(options);

    $("form[name=productRatingForm]").submit(function (e) {
        var comment = $("#review_comment").val();
        var productid = $("#reviewProductlist").val();
        var ratevalue = $("#input2").val();
        shopsessionid = verifyUser();
        if (parseInt(productid) === 0) {
            ShowNotification("Please, select the product you would like to review.", "error");
            return false;
        }
        var data = [productid, ratevalue, shopsessionid, comment];
        showLoading();
        GetData("Review", "ReviewProduct", "LoadReviewProduct", data);
        $("#review_comment").val("");
        e.preventDefault();
    });
}

function orderDetailsSetLink() {
    $("#collapseFour").addClass("show");
    $(".id-orders").addClass("active");

}
function orderDetailsPageFunctions() {
    orderid = GetOrderID();
    showLoading();
    GetData("Order", "GetOrderDetails", "LoadOrderDetails", orderid);
}

function DisplayOrderDetails(data) {
    hideLoading();
    $(".order_seller_amount").text(PriceFormat(data.OrderDetails.seller_amount));
    $(".order_booked_date").text(data.OrderDetails.booking_date);
    $(".order_reference").text(data.OrderDetails.reference);
    $(".order_shipping_fees").text(PriceFormat(data.OrderDetails.delivery_fees));
    $(".order_status").text(data.OrderDetails.StatusDetails.name).addClass("badge-" + data.OrderDetails.StatusDetails.color);
    $(".order-ship-type").text(data.OrderDetails.ShippingTypeName);
    $(".order-ship-address").text(data.OrderDetails.ShippingAddressDetails.full_address);
    $(".order-ship-address-type").text(data.OrderDetails.ShippingAddressDetails.addresstypename);
    $(".order-ship-address-name").text(data.OrderDetails.ShippingAddressDetails.addressusername);
    $(".order-ship-address-phone").text(data.OrderDetails.ShippingAddressDetails.phone);
    $(".order-product_count").text(data.OrderDetails.product_count);
    $(".order-cart-amount").text(PriceFormat(data.OrderDetails.order_amount));
    $(".order-total-amount").text(PriceFormat(data.OrderDetails.total_paid));

    if (!$.isEmptyObject(data.OrderDetails.DiscountCode)) {
        $(".order_discount_code").text(data.OrderDetails.DiscountCode);
        $(".order_discount-deduction-type").text(data.OrderDetails.DiscountDeductionType);
        $(".order-discount-deduction-amount").text(PriceFormat(data.OrderDetails.discount_amount));
    } else {
        $(".order_discount_code").text("N/A");
        $(".order_discount-deduction-type").text("N/A");
        $(".order-discount-deduction-amount").text("N/A");
    }


    var historydata = data.OrderDetails.HistoryDetails;
    DisplayOrderHistoryProducts(historydata);



    var paymentdata = data.OrderDetails.PaymentDetails;
    DisplayPaymentDetails(paymentdata);


}
function DisplayPaymentDetails(data) {
    $(".order-payment-type").text(data.payment_method + " - " + data.reference_code);
}

function DisplayOrderHistoryProducts(data) {
    var parent = $(".history_productlist");
    parent.find(".new-clone").remove();
    if (data === "none") {
        parent.text("No Result");
    } else {
        var childclone = parent.find(".historyproductclone");
        var count = 0;
        var order_product_count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("historyproductclone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".order-p-sn").text("#" + count);
            var btndetails = newchild.find(".order-p-name").text(details.ProductDetails.InfoDetails.name);
            btndetails.click(function () {
                localStorage.setItem("productid", details.ProductDetails.InfoDetails.productid);
                window.location = extension + "LinksServlet?type=ProductDetails";
            });

            newchild.find(".order-p-desc").text(details.ProductDetails.InfoDetails.description);
            newchild.find(".order-p-price").text(PriceFormat(details.ProductDetails.PriceDetails.selling_price));
            newchild.find(".order-p-order-quantity").text(details.quantity);
            newchild.find(".order-p-unit-name").text(details.ProductDetails.UnitDetails.UnitName);
            newchild.find(".order-p-unit-value").text(details.ProductDetails.UnitDetails.value);
            order_product_count++;
            if (details.ProductDetails.FirstImage === "0" || details.ProductDetails.FirstImage === 0) {
                var image_url = extension + "assets/images/no-image.png";
                newchild.find(".order-p-image").attr("src", image_url);
            } else if (details.ProductDetails.FirstImage !== "0" || details.ProductDetails.FirstImage !== 0) {
                newchild.find(".order-p-image").attr("src", "data:image/png;base64," + details.ProductDetails.FirstImage);
            }
            newchild.appendTo(parent).show();
        });
        childclone.hide();



        var cs = $("#reviewProductlist");
        cs.empty();
        cs.append($('<option/>').val(0).text("Select a Product"));
        $.each(data, function (index, details) {
            cs.append($('<option/>').val(details["productid"]).text(details.ProductDetails.InfoDetails.name));
        });

    }
}


function DisplayReviewProduct(resp) {
    hideLoading();
    ShowNotification(resp.msg, resp.status);
}
