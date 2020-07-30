/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = "../../../../";
var sessionid;
$(document).ready(function () {
    wishListFunctions();
});

function wishListFunctions() {
    WishListBtnEvents();

    WishListPageFunctions();
}

function WishListBtnEvents() {

}

function WishListPageFunctions() {
    sessionid = verifyUser();
    if (sessionid) {
        GetData("Cart", "GetShopSavedItems", "LoadShopSavedItems", sessionid);
    } else {
        $(".emptyshopsaveditems").removeClass("d-none");
        $(".fullshopsaveditems").addClass("d-none");
    }
}


function DisplayShopSavedItems(data) {
    if (parseInt(data.product_count)) {
        $(".emptyshopsaveditems").addClass("d-none");
        $(".fullshopsaveditems").removeClass("d-none");

        var parent = $("#ShopSavedItemList");
        var SaveItemsID = data.id;
        var saveditemsproddata = data.WishListProductDetails;
        parent.find(".new-clone").remove();
        if (saveditemsproddata === "none") {
            parent.text("No Result");
        } else {
            var childclone = parent.find(".shop-saveditems-clone");
            var count = 0;
            $(".shop-saveditem-p-count").text(data.product_count);
            $(".shop-saveditem-p-total-amount").text(PriceNumberFormat(data.amount));
            $.each(saveditemsproddata, function (index, details) {
                var newchild = childclone.clone();
                count++;
                newchild.removeClass("shop-saveditems-clone");
                newchild.removeClass("d-none");
                newchild.addClass("new-clone");
                newchild.find(".shop-saveditem-sn").text("#" + count);
                newchild.find(".shop-saveditem-p-name").text(details.ProductDetails.InfoDetails.name).click(function () {
                    localStorage.setItem("productid", details.ProductDetails.ProductID);
                    window.location = extension + "LinksServlet?type=ProductDetails";
                });
                var ProductID = details.ProductDetails.ProductID;
                newchild.find(".shop-saveditem-p-price").text(PriceNumberFormat(details.ProductDetails.PriceDetails.selling_price));

                var ProductQty = details.ProductDetails.QuantityDetails.total_quantity;
                if (parseInt(ProductQty) > 2) {
                    newchild.find(".shop-saveditem-p-stock").text("In-Stock").addClass("text-success");
                    newchild.find(".shop-saveditem-buynow").click(function () {
                        var data = [sessionid, SaveItemsID, ProductID];
                        localStorage.setItem("savedtimepage", true);
                        GetData("Cart", "AddWishListProductToCart", "LoadAddOption", data);
                    });
                } else {
                    newchild.find(".shop-saveditem-p-stock").text("Out-of-Stock");
                    newchild.find(".shop-saveditem-buynow").prop("disabled", true);
                }
                if (details.ProductDetails.FirstImage === "0" || details.ProductDetails.FirstImage === 0) {
                    var image_url = extension + "assets/images/no-image.png";
                    newchild.find(".shop-saveditem-p-image").attr("src", image_url);
                } else if (details.ProductDetails.FirstImage !== "0" || details.ProductDetails.FirstImage !== 0) {
                    newchild.find(".shop-saveditem-p-image").attr("src", "data:image/png;base64," + details.ProductDetails.FirstImage);
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

                var deletebtn = newchild.find(".shop-saveditem-btn-delete-item");
                deletebtn.click(function () {
                    var ProductID = details.ProductDetails.ProductID;
                    var data = [sessionid, "SavedItems", SaveItemsID, ProductID];
                    GetData("Cart", "DeleteOptions", "LoadDeleteOptions", data);
                });
                DisplayToolTip(deletebtn);
                newchild.appendTo(parent).show();
            });
            childclone.hide();
        }

        $(".shop-saveditem-buyall").click(function () {
            GetData("Cart", "BuyAllSavedItems", "LoadBuyAllSavedItems", sessionid);
        });
        $(".shop-saveditem-empty").click(function () {
            var data = [SaveItemsID, "SavedItems"];
            GetData("Cart", "EmptyOptions", "LoadEmptyOptions", data);
        });
    } else {
        $(".emptyshopsaveditems").removeClass("d-none");
        $(".fullshopsaveditems").addClass("d-none");
    }

}

function DisplayUpdateSavedItemsOptions(data) {
    var cartData = data[1];
    DisplayShopSavedItems(cartData);
    var respData = data[0];
    ShowNotification(respData.msg, respData.status);

}

function DisplayEmptySavedItemsOptions(resp) {
    ShowNotification(resp.msg, resp.status);
    GetData("Cart", "GetShopSavedItems", "LoadShopSavedItems", sessionid);
}

function DisplayBuyAllSavedItems(resp) {
    var cartdata = resp.CartDetails;
    var resultdata = resp.result;
    ShowNotification(resultdata.msg, resultdata.status);
    localStorage.removeItem("cartcount");
    localStorage.setItem("cartcount", cartdata.product_count);
    var cartcount = GetCartCount();
    $(".cart_count").text(cartcount);
    GetData("Cart", "GetShopSavedItems", "LoadShopSavedItems", sessionid);
}