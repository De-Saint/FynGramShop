/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = "";
var shopsessionid = "";
$(document).ready(function () {
    cartFunctions();
});

function cartFunctions() {
    cartBtnEvents();
    cartPageFunctions();
}


function cartBtnEvents() {
    $(".cart-proceed-to-checkout").click(function () {
        shopsessionid = verifyUser();
        var UserType = shopsessionid.split("#")[1];
        if (UserType === "G") {
            localStorage.setItem("page_redirect", "checkout");
            window.location = extension + "LinksServlet?type=Login";
        } else {
            window.location = extension + "LinksServlet?type=CheckOut";
        }
    });
}
function cartPageFunctions() {
    shopsessionid = verifyUser();
    if (shopsessionid) {
        var cartcount = GetCartCount();
        if (parseInt(cartcount) !== 0) {
            showLoading();
            GetData("Cart", "GetShopCart", "LoadShopCart", shopsessionid);
        } else {
            $(".emptyshopcart").removeClass("d-none");
            $(".fullshopcart").addClass("d-none");
        }
    } else {
        $(".emptyshopcart").removeClass("d-none");
        $(".fullshopcart").addClass("d-none");
    }

}


function DisplayShopCart(data, parent) {
    hideLoading();
    if (data.product_count) {
        $(".emptyshopcart").addClass("d-none");
        $(".fullshopcart").removeClass("d-none");

        localStorage.removeItem("cartcount");
        localStorage.setItem("cartcount", data.product_count);
        var cartcount = GetCartCount();
        $(".cart_count").text(cartcount);

        $(".cart_total_amount").text(PriceNumberFormat(data.total_amount));
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
                newchild.find(".shop-cart-p-cart-quantity").val(details.product_quantity);
                newchild.find(".shop-cart-p-cart-actualquantity").val(details.product_quantity);
                newchild.find(".shop-cart-p-cart-price").text(PriceNumberFormat(details.product_price));
                newchild.find(".shop-cart-p-seller").text("Seller: " + details.ProductDetails.SellerDetails.SellerUserName);

                if (details.ProductDetails.FirstImage === "0" || details.ProductDetails.FirstImage === 0) {
                    var image_url = extension + "assets/images/no-image.png";
                    newchild.find(".shop-cart-p-image").attr("src", image_url);
                } else if (details.ProductDetails.FirstImage !== "0" || details.ProductDetails.FirstImage !== 0) {
                    newchild.find(".shop-cart-p-image").attr("src", "data:image/png;base64," + details.ProductDetails.FirstImage);
                }
                var updatebtn = newchild.find(".shop-p-det-update");
                updatebtn.click(function () {
                    var newQuantity = newchild.find(".shop-cart-p-cart-quantity").val();
                    var OldQuantity = newchild.find(".shop-cart-p-cart-actualquantity").val();
                    var Quantity = 0;
                    if (parseInt(newQuantity) > parseInt(OldQuantity)) {
                        Quantity = parseInt(newQuantity) - parseInt(OldQuantity);
                        UpdateOption("Cart", details.ProductDetails.ProductID, details.ProductDetails.PriceDetails.selling_price, Quantity, "Increase");
                    } else if (parseInt(newQuantity) < parseInt(OldQuantity)) {
                        Quantity = parseInt(OldQuantity) - parseInt(newQuantity);
                        UpdateOption("Cart", details.ProductDetails.ProductID, details.ProductDetails.PriceDetails.selling_price, Quantity, "Decrease");
                    } else if (parseInt(newQuantity) === parseInt(OldQuantity)) {
                        return false;
                    }
                });
                DisplayToolTip(updatebtn);
                var wishlistbtn = newchild.find(".shop-p-det-add-to-wishlist");
                wishlistbtn.click(function () {
                    shopsessionid = verifyUser();
                    var UserType = shopsessionid.split("#")[1];
                    if (UserType === "G") {
                        localStorage.setItem("page_redirect", "saveditems");
                        window.location = extension + "LinksServlet?type=Login";
                    } else {
                        ProcessProductOption("SavedItems", details.ProductDetails.ProductID, details.ProductDetails.PriceDetails.selling_price, 1, "Increase");
                    }
                });
                DisplayToolTip(wishlistbtn);
                var deletebtn = newchild.find(".shop-p-det-delete-product-item");
                deletebtn.click(function () {
                    var ProductID = details.ProductDetails.ProductID;
                    DeleteOption("Cart", CartID, ProductID);
                });
                DisplayToolTip(deletebtn);
                newchild.appendTo(parent).show();
            });
            childclone.hide();
        }

        $(".shop-cart-p-empty-cart").click(function () {
            EmptyOption(data.id, "Cart");
        });

    } else {
        $(".emptyshopcart").removeClass("d-none");
        $(".fullshopcart").addClass("d-none");
        localStorage.removeItem("cartcount");
        localStorage.setItem("cartcount", 0);
        var cartcount = GetCartCount();
        $(".cart_count").text(cartcount);
    }
}

function UpdateOption(Option, ProductID, ProductPrice, ProductQuantity, Action) {
    showLoading();
    var data = [shopsessionid, Option, ProductID, ProductPrice, ProductQuantity, Action];
    GetData("Cart", "UpdateOptions", "LoadUpdateOptions", data);

}

function DeleteOption(Option, OptionID, ProductID) {
    showLoading();
    var data = [shopsessionid, Option, OptionID, ProductID];
    GetData("Cart", "DeleteOptions", "LoadDeleteOptions", data);

}
function EmptyOption(OptionID, Option) {
    showLoading();
    var data = [OptionID, Option];
    GetData("Cart", "EmptyOptions", "LoadEmptyOptions", data);

}

function DisplayUpdateOptions(data) {
    hideLoading();
    var parent = $(".ShopCartList");
    var cartData = data[1];
    DisplayShopCart(cartData, parent);
    var respData = data[0];
    ShowNotification(respData.msg, respData.status);

}
function DisplayUpdateCartOptions(data) {
    hideLoading();
    var parent = $(".ShopCartList");
    var cartData = data[1];
    DisplayShopCart(cartData, parent);
    var respData = data[0];
    ShowNotification(respData.msg, respData.status);

}

function DisplayEmptyCartOptions(resp) {
    hideLoading();
    ShowNotification(resp.msg, resp.status);
    GetData("Cart", "GetShopCart", "LoadShopCart", shopsessionid);
}