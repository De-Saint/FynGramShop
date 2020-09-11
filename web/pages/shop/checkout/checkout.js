/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../";
var shopsessionid;
$(document).ready(function () {
    checkOutFunctions();
});


function checkOutFunctions() {
    checkOutBtnEvents();
    checkOutPageFunctions();
    shopsessionid = verifyUser();
    var UserType = shopsessionid.split("#")[1];
    if (UserType === "G") {
        localStorage.setItem("page_redirect", "checkout");
        window.location = extension + "LinksServlet?type=Login";
    }

}


function checkOutBtnEvents() {
    controlCheckOutAccordion();
    $(".btn_add_discount_code").click(function () {
        var discountCodeValue = $("#discountCodeValue").val();
        var data = [shopsessionid, discountCodeValue];
        showLoading();
        GetData("Cart", "CartDiscountCode", "LoadUpdateDiscountCode", data);
        $("#discountCodeValue").val("");
    });


    $(".PlaceOrder").click(function () {
        var email = localStorage.getItem("uEmail");
        var pay_method = $("input[name=pay_method]:checked").val();
        var note = $("#order_note").val();
        var TotalAmount = $.trim($(".checkout_cart_total_amount").text().replace("₦", ""));
        if (TotalAmount.includes(",")) {
            TotalAmount = TotalAmount.replace(/,/g, "");
        }

        if (pay_method === "wallet") {
            var data = [shopsessionid, "FynPay", note];
            showLoading();
            localStorage.setItem("cartcount", 0);
            GetData("Order", "PlaceOrder", "LoadPlaceOrder", data);
        } else if (pay_method === "paystack") {
            var newPaymentAmount = CalculatePercentage(TotalAmount);
            CheckoutWithPaystack(newPaymentAmount, email, TotalAmount, "CheckOut Payment", note);
        } else {
            ShowNotification("Please, select a payment option.", "error");
        }


    });


    $("#ViewWalletBalance").click(function () {
        var pin = $("#walletPin").val();
        if (pin) {
            var data = [shopsessionid, pin];
            showLoading();
            GetData("Cart", "ViewWalletBalance", "LoadWalletBalance", data);
        } else {
            ShowNotification("Please, enter your wallet pin.", "error");
        }

    })

}


function CheckoutWithPaystack(paymentamount, email, actualamount, PaymentType, Note) {
    var userDetail = localStorage.getItem("uUserName");
    var handler = PaystackPop.setup({
        key: 'pk_test_c819ab617f5085772d511e6e5cafc3785367cb78',
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
            var data = [shopsessionid, actualamount, response.reference, response.trans, PaymentType, Note];
            showLoading();
            GetData("Payment", "ValidatePaystackPayment", "LoadPlaceOrder", data);
        },
        onClose: function () {
            ShowNotification("CheckOut closed, transaction terminated", "error");
        }
    });
    handler.openIframe();
}


function controlCheckOutAccordion() {
    $(".AddressDetailsBtn").click(function () {
        $("#collapseOne").removeClass("show");
        $(".AddressDetailsText").addClass("text-success").removeClass("text-muted");
        $(".EditAddressDetailsBtn").removeClass("d-none");

        $("#collapseTwo").addClass("show");
    });

    $(".EditAddressDetailsBtn").click(function () {
        $("#collapseOne").addClass("show");

        $("#collapseTwo").removeClass("show");
        $("#collapseThree").removeClass("show");
        $("#collapseFour").removeClass("show");
        $("#collapseFive").removeClass("show");
    });


    $(".DeliveryMethodBtn").click(function () {
        var shippingfees = $.trim($(".shippingFeesAmount").text().replace("₦", ""));
        var shippingaddressid = $(".address_id").text();
        var shippingtypeid = $("input[name=check_method]:checked").val();
        var data = [shopsessionid, shippingtypeid, shippingaddressid, shippingfees];
        showLoading();
        GetData("Cart", "CartShippingAddress", "LoadCartShippingAddress", data);
    });

    $(".EditDeliveryMethodBtn").click(function () {
        $("#collapseTwo").addClass("show");

        $("#collapseThree").removeClass("show");
        $("#collapseOne").removeClass("show");
        $("#collapseFour").removeClass("show");
        $("#collapseFive").removeClass("show");
    });


    $(".ConfirmOrderBtn").click(function () {
        $("#collapseThree").removeClass("show");
        $(".ConfirmOrderText").addClass("text-success").removeClass("text-muted");
        $(".EditConfirmOrderBtn").removeClass("d-none");

        $("#collapseFour").addClass("show");
    });

    $(".EditConfirmOrderBtn").click(function () {
        $("#collapseThree").addClass("show");

        $("#collapseFour").removeClass("show");
        $("#collapseOne").removeClass("show");
        $("#collapseTwo").removeClass("show");
        $("#collapseFive").removeClass("show");
    });


    $(".ShippingDetailsBtn").click(function () {
        $("#collapseFour").removeClass("show");
        $(".ShippingDetailsText").addClass("text-success").removeClass("text-muted");
        $(".PaymentMethodText").addClass("text-success").removeClass("text-muted");
        $(".EditShippingDetailsBtn").removeClass("d-none");

        $("#collapseFive").addClass("show");
        $(".PaymentMethodText").addClass("text-success").removeClass("text-muted");
        $(".EditPaymentMethodBtn").removeClass("d-none");
    });

    $(".EditShippingDetailsBtn").click(function () {
        $("#collapseFour").addClass("show");

        $("#collapseFive").removeClass("show");
        $("#collapseThree").removeClass("show");
        $("#collapseOne").removeClass("show");
        $("#collapseTwo").removeClass("show");
    });

    $(".EditPaymentMethodBtn").click(function () {
        $("#collapseFive").addClass("show");

        $("#collapseFour").removeClass("show");
        $("#collapseThree").removeClass("show");
        $("#collapseOne").removeClass("show");
        $("#collapseTwo").removeClass("show");
    });



}

function checkOutPageFunctions() {
    showLoading();
    GetData("Cart", "GetCartDefaultAddress", "LoadDefaultAddress", shopsessionid);
    GetData("Cart", "GetShopCart", "LoadGetShopCart", shopsessionid);
}


function DisplayDefaultAddress(data) {
    if (data.full_address) {
        $(".no_address_list").addClass("d-none");
        $(".address_list").removeClass("d-none");
        $(".address_fulladdress").text(data.full_address);
        $(".address_type").text(data.addresstypename);
        $(".address_name").text(data.addressusername);
        $(".address_phone").text(data.phone);
        $(".address_id").text(data.id);
    } else {
        $(".address_list").addClass("d-none");
        $(".no_address_list").removeClass("d-none");
    }

}

function DisplayGetShopCart(data, parent) {
    hideLoading();
    if (data.product_count) {
        GetDeliveryFees(data.total_amount);
        $(".cart_amount").text(PriceNumberFormat(data.amount));
        $(".checkout_cart_sub_total").text(PriceNumberFormat(data.amount));
        $(".checkout_discount_amount").text(PriceNumberFormat(data.discount_amount));
        $(".cart_status").text(data.status + " Cart").addClass("text-danger");
        $(".cart_date").text(data.date).addClass("text-primary");
        var CartID = data.id;
        var cartproddata = data.CartProductDetails;
        parent.find(".new-clone").remove();
        if (cartproddata === "none") {
            parent.text("No Result");
        } else {
            var childclone = parent.find(".shopcart-clone");
            var count = 0;
            $.each(cartproddata, function (index, details) {
                var newchild = childclone.clone();
                count++;
                newchild.removeClass("shopcart-clone");
                newchild.removeClass("d-none");
                newchild.addClass("new-clone");
                newchild.find(".shop-cart-sn").text("#" + count);
                newchild.find(".shop-cart-p-name").text(details.ProductDetails.InfoDetails.name).click(function () {
                    localStorage.setItem("productid", details.ProductDetails.ProductID);
                    window.location = extension + "LinksServlet?type=ProductDetails";
                });
                newchild.find(".shop-cart-p-price").text(PriceNumberFormat(details.ProductDetails.PriceDetails.selling_price));
                newchild.find(".shop-cart-p-cart-quantity").text(details.product_quantity);
                newchild.find(".shop-cart-p-cart-price").text(PriceNumberFormat(details.product_price));
                newchild.find(".shop-cart-p-seller").text("Seller: " + details.ProductDetails.SellerDetails.SellerUserName);

                if (details.ProductDetails.FirstImage === "0" || details.ProductDetails.FirstImage === 0) {
                    var image_url = extension + "assets/images/no-image.png";
                    newchild.find(".shop-cart-p-image").attr("src", image_url);
                } else if (details.ProductDetails.FirstImage !== "0" || details.ProductDetails.FirstImage !== 0) {
                    newchild.find(".shop-cart-p-image").attr("src", "data:image/png;base64," + details.ProductDetails.FirstImage);
                }

                newchild.appendTo(parent).show();
            });
            childclone.hide();
        }
    } else {

    }
}

function DisplayShippingDetails(data) {
    hideLoading();
    if (data.product_count) {
        var parent = $("#shippingDetailList");
        var cartproddata = data.CartProductDetails;
        var objcount = ConvertObjectToArrayAndReturnLength(cartproddata);
        parent.find(".new-clone").remove();
        if (cartproddata === "none") {
            parent.text("No Result");
        } else {
            var childclone = parent.find(".shippingdetail-clone");
            var count = 0;
            $.each(cartproddata, function (index, details) {
                var newchild = childclone.clone();
                count++;
                newchild.removeClass("shippingdetail-clone");
                newchild.removeClass("d-none");
                newchild.addClass("new-clone");
                newchild.find(".ship-p-sn").text("#" + count);
                newchild.find(".total_ship-p-count").text(objcount);
                newchild.find(".ship-p-name").text(details.ProductDetails.InfoDetails.name);
                newchild.find(".ship-p-startdate").text(details.ProductDetails.SellerDetails.shipStartDate);
                newchild.find(".ship-p-enddate").text(details.ProductDetails.SellerDetails.shipEndDate);
                newchild.appendTo(parent).show();
            });
            childclone.hide();
        }
    } else {

    }
}


function GetDeliveryFees(cartamount) {
    GetData("Cart", "GetCartShippingFees", "LoadShippingFees", cartamount);

}

function ConvertObjectToArrayAndReturnLength(obj) {
    var res = Object.keys(obj).map((key) => [Number(key), obj[key]]);
    return res.length;
}


function DisplayShippingFees(data) {
    var shippingAmount = data.split("#")[0];
    var shippingfeesid = data.split("#")[1];
    $(".shippingFeesAmount").text(PriceNumberFormat(parseFloat(shippingAmount)));
    $(".shippingFeesID").text(shippingfeesid);

    var cartAmout = $.trim($(".cart_amount").text().replace("₦", "").replace(",", ""));
    var cartsubtotalamount = parseFloat(shippingAmount) + parseInt(cartAmout);
    $(".checkout_cart_sub_total_amount").text(PriceNumberFormat(parseFloat(cartsubtotalamount)));
    $(".checkout_delivey_fees").text(PriceNumberFormat(parseFloat(shippingAmount)));

    $(".checkout_cart_total_amount").text(PriceNumberFormat(cartsubtotalamount));
}

function DisplayCartShippingAddress(data) {
    hideLoading();
    $("#collapseTwo").removeClass("show");
    $(".DeliveryMethodText").addClass("text-success").removeClass("text-muted");
    $(".EditDeliveryMethodBtn").removeClass("d-none");
    $("#collapseThree").addClass("show");
}


function DisplayUpdateDiscountCode(resp) {
    hideLoading();
    if (resp.status === "success") {
        $('.dcode-success').removeClass("d-none");
        $('.dcode-success').addClass('active');
        $('.dcode-success').html('' + resp.msg).fadeIn(900);
        $(".dcode-success").fadeTo(2000, 500).slideUp(500, function () {
            $(".dcode-success").slideUp(500);
        });
        $(".checkout_discount_amount").text(PriceNumberFormat(parseFloat(resp.cartDiscountAmount)));
        $(".checkout_cart_total_amount").text(PriceNumberFormat(parseFloat(resp.cartTotalAmount)));
    } else if (resp.status === "error") {
        $('.dcode-error').html('' + resp.msg).fadeIn(900);
        $('.dcode-error').removeClass("d-none");
        $(".dcode-error").fadeTo(2000, 500).slideUp(500, function () {
            $(".dcode-error").slideUp(500);
        });
    }
}

function DisplayWalletBalance(resp) {
    hideLoading();
    if (resp.status === "error") {
        ShowNotification(resp.msg, resp.status);
    } else {
        $(".wBalance").removeClass("d-none");
        $(".wbal").text(PriceNumberFormat(parseFloat(resp.walletbalance)));
    }

}

function DisplayPlaceOrder(resp) {
    hideLoading();
    if (resp.status === "error") {
        ShowNotification(resp.msg, resp.status);
    } else {
        ShowNotification(resp.msg, resp.status);
        window.location = extension + "LinksServlet?type=OrderConfirmation";
    }
}