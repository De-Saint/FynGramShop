/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid;
var extension = "";
$(document).ready(function () {
//    $(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function (e) {
//        if (e.keyCode === 13) {
//            $('#collapse-checkout-option #button-login').trigger('click');
//        }
//    });
    checkOutFunctions();
});


function checkOutFunctions() {
    checkOutBtnEvents();
    checkOutPageFunctions();
    sessionid = verifyUser();
    var UserType = sessionid.split("#")[1];
    if (UserType === "G") {
        localStorage.setItem("page_redirect", "checkout");
        window.location = extension + "LinksServlet?type=Login";
    }

}


function checkOutBtnEvents() {
    controlCheckOutAccordion();



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
        $("#collapseTwo").removeClass("show");
        $(".DeliveryMethodText").addClass("text-success").removeClass("text-muted");
        $(".EditDeliveryMethodBtn").removeClass("d-none");

        $("#collapseThree").addClass("show");

        var shippingfeesid = $(".shippingFeesID").text();
        alert(shippingfeesid);
    });

    $(".EditDeliveryMethodBtn").click(function () {
        $("#collapseTwo").addClass("show");

        $("#collapseThree").removeClass("show");
        $("#collapseOne").removeClass("show");
        $("#collapseFour").removeClass("show");
        $("#collapseFive").removeClass("show");
    });


    $(".ShippingDetailsBtn").click(function () {
        $("#collapseThree").removeClass("show");
        $(".ShippingDetailsText").addClass("text-success").removeClass("text-muted");
        $(".EditShippingDetailsBtn").removeClass("d-none");

        $("#collapseFour").addClass("show");
    });

    $(".EditShippingDetailsBtn").click(function () {
        $("#collapseThree").addClass("show");

        $("#collapseFour").removeClass("show");
        $("#collapseOne").removeClass("show");
        $("#collapseTwo").removeClass("show");
        $("#collapseFive").removeClass("show");
    });


    $(".ConfirmOrderBtn").click(function () {
        $("#collapseFour").removeClass("show");
        $(".ConfirmOrderText").addClass("text-success").removeClass("text-muted");
        $(".PaymentMethodText").addClass("text-success").removeClass("text-muted");
        $(".EditConfirmOrderBtn").removeClass("d-none");

        $("#collapseFive").addClass("show");
        $(".PaymentMethodText").addClass("text-success").removeClass("text-muted");
        $(".EditPaymentMethodBtn").removeClass("d-none");
    });

    $(".EditConfirmOrderBtn").click(function () {
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
    GetData("Address", "GetDefaultAddress", "LoadDefaultAddress", sessionid);

    GetData("Cart", "GetShopCart", "LoadGetShopCart", sessionid);


}


function DisplayDefaultAddress(data) {
    hideLoading();
    if (data.full_address) {
        $(".no_address_list").addClass("d-none");
        $(".address_list").removeClass("d-none");
        $(".address_fulladdress").text(data.full_address);
        $(".address_type").text(data.addresstypename);
        $(".address_name").text(data.addressusername);
        $(".address_name").text(data.addressusername);
        $(".address_phone").text(data.phone);
        $(".address_phone").text(data.phone);
    } else {
        $(".address_list").addClass("d-none");
        $(".no_address_list").removeClass("d-none");
    }

}

function DisplayGetShopCart(data, parent) {
    if (data.product_count) {
        $(".cart_total_amount").text(PriceNumberFormat(data.total_amount));
        GetDeliveryFees(data.total_amount);
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

    if (data.product_count) {
        var parent = $("#shippingDetailList");
        var cartproddata = data.CartProductDetails;
        console.log(cartproddata);
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
                newchild.find(".total_ship-p-count").text(data.product_count);
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
    GetData("Address", "GetShippingFees", "LoadShippingFees", cartamount);

}

function DisplayShippingFees(data) {
    var amount = data.split("#")[0];
    var shippingfeesid = data.split("#")[1];
    $(".shippingFeesAmount").text(PriceFormat(parseFloat(amount)));
    $(".shippingFeesID").text(shippingfeesid);
}