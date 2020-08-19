/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = "";
var productid = "", shopsessionid;
$(document).ready(function () {
    productDetailsFunctions();
});

function productDetailsFunctions() {
    productDetailsBtnEvents();
    productDetailsPageFunctions();

}

function GetProductID() {
    return categoryid = localStorage.getItem("productid");
}

function productDetailsBtnEvents() {

    $("#indexImage1").click(function () {
        loadProductPage(10);
    });

}
function productDetailsPageFunctions() {
    productid = GetProductID();
    if (productid) {
        showLoading();
        shopsessionid = verifyUser();
        GetData("Products", "GetProductDetails", "LoadShopProductDetails", productid);
        GetData("Products", "GetRelatedProducts", "LoadRelatedProducts", productid);
        GetData("Products", "GetRecentlyViewed", "LoadRecentlyViewed", shopsessionid);
        GetData("Products", "GetDetailedFeaturedProducts", "LoadDetailFeaturedList", "");
    } else {
        returnToTimeOutPage(extension);
    }

}


function DisplayShopProductDetails(data) {
    hideLoading();
    $(".shop-p-det-name").text(data.InfoDetails.name);
    $(".shop-p-det-desc").text(data.InfoDetails.description);
    $(".shop-p-det-selling-price").text(PriceFormat(data.PriceDetails.selling_price));
    $(".shop-p-det-cost-price").text(PriceFormat(data.PriceDetails.cost_price));
    $(".shop-p-det-root-category").text(data.RootCatName).click(function () {
        localStorage.setItem("categoryid", data.RootCatID);
        window.location = extension + "LinksServlet?type=Products";
    });
    $(".shop-p-det-ship-p-d").text(data.ShippingPackageDetails.package_depth + " CM");
    $(".shop-p-det-ship-p-h").text(data.ShippingPackageDetails.package_height + " CM");
    $(".shop-p-det-ship-p-w").text(data.ShippingPackageDetails.package_width + " CM");
    $(".shop-p-det-seller-name").text(data.SellerDetails.SellerUserName);
    $(".shop-p-det-ref-num").text(data.InfoDetails.reference_code);
    $(".shop-p-det-upc").text(data.InfoDetails.upc_barcode);

    $(".shop-p-det-unit-name").text(data.UnitDetails.UnitName);
    $(".shop-p-det-unit-value").text(data.UnitDetails.value);

    $(".shop-p-det-condition").text(data.CondionDetails.name);
    $(".shop-numberofratings").text(data.RatingDetails.NumberOfRatings);
    $(".shop-average-rates").text(data.RatingDetails.AverageRatings);


    $(".shop-p-det-addtoWishList").click(function () {
        shopsessionid = verifyUser();
        var UserType = shopsessionid.split("#")[1];
        if (UserType === "G") {
            localStorage.setItem("page_redirect", "saveditems");
            window.location = extension + "LinksServlet?type=Login";
        } else {
            ProcessProductOption("SavedItems", data.ProductID, data.PriceDetails.selling_price, 1, "Increase");
        }
    });

    $(".shop-p-det-addtocart").click(function () {
        var quantity = $("#shop-p-det-quantity").val();
        ProcessProductOption("Cart", data.ProductID, data.PriceDetails.selling_price, quantity, "Increase");
    });


    if (data.FirstImage === "0" || data.FirstImage === 0) {
        var image_url = extension + "assets/images/brand/logo.png";
        $(".shop-p-det-image11").attr("src", image_url);
        $(".shop-p-det-image11").attr("data-image", image_url);
        $(".shop-p-det-image11").attr("data-zoom-image", image_url);
        $(".shop-p-det-image1").attr("src", image_url);
        $(".shop-p-det-image1").attr("data-zoom-image", image_url);
    } else if (data.FirstImage !== "0" || data.FirstImage !== 0) {
        $(".shop-p-det-image1").attr("src", "data:image/png;base64," + data.FirstImage);
        $(".shop-p-det-image1").attr("data-zoom-image", "data:image/png;base64," + data.FirstImage);
        $(".shop-p-det-image11").attr("data-image", "data:image/png;base64," + data.FirstImage);
        $(".shop-p-det-image11").attr("data-zoom-image", "data:image/png;base64," + data.FirstImage);
        $(".shop-p-det-image11").attr("src", "data:image/png;base64," + data.FirstImage);
        $(".zoomWindow").attr("src", "data:image/png;base64," + data.FirstImage);
    }
    if (data.SecondImage) {
        $(".owl-carousel .s-p-det-img2").parent().addClass("owl-item").removeClass("d-none");
        if (data.SecondImage === "0" || data.SecondImage === 0) {
            var image_url = extension + "assets/images/brand/logo.png";
            $(".shop-p-det-image12").attr("src", image_url);
            $(".shop-p-det-image12").attr("data-image", image_url);
            $(".shop-p-det-image12").attr("data-zoom-image", image_url);
        } else if (data.SecondImage !== "0" || data.SecondImage !== 0) {
            $(".shop-p-det-image12").attr("data-image", "data:image/png;base64," + data.SecondImage);
            $(".shop-p-det-image12").attr("data-zoom-image", "data:image/png;base64," + data.SecondImage);
            $(".shop-p-det-image12").attr("src", "data:image/png;base64," + data.SecondImage);
            $(".zoomWindow").attr("src", "data:image/png;base64," + data.SecondImage);
        }
    } else {
        $(".owl-carousel .s-p-det-img2").parent().removeClass("owl-item cloned").addClass("d-none");
    }


    if (data.ImageDetails.ImageText3) {
        $(".owl-carousel .s-p-det-img3").parent().addClass("owl-item").removeClass("d-none");
        if (data.ImageDetails.ImageText3 === "0" || data.ImageDetails.ImageText3 === 0) {
            var image_url = extension + "assets/images/brand/logo.png";
            $(".shop-p-det-image13").attr("data-image", image_url);
            $(".shop-p-det-image13").attr("data-zoom-image", image_url);
            $(".shop-p-det-image13").attr("src", image_url);
        } else if (data.ImageDetails.ImageText3 !== "0" || data.ImageDetails.ImageText3 !== 0) {
            $(".shop-p-det-image13").attr("data-image", "data:image/png;base64," + data.ImageDetails.ImageText3);
            $(".shop-p-det-image13").attr("data-zoom-image", "data:image/png;base64," + data.ImageDetails.ImageText3);
            $(".shop-p-det-image13").attr("src", "data:image/png;base64," + data.ImageDetails.ImageText3);
            $(".zoomWindow").attr("src", "data:image/png;base64," + data.ImageDetails.ImageText3);
        }
    } else {
        $(".owl-carousel .s-p-det-img3").parent().removeClass("owl-item cloned").addClass("d-none");
    }
    if (data.ImageDetails.ImageText4) {
        $(".owl-carousel .s-qv-p-img4").parent().addClass("owl-item").removeClass("d-none");
        if (data.ImageDetails.ImageText4 === "0" || data.ImageDetails.ImageText4 === 0) {
            var image_url = extension + "assets/images/brand/logo.png";
            $(".shop-p-det-image14").attr("data-image", image_url);
            $(".shop-p-det-image14").attr("data-zoom-image", image_url);
            $(".shop-p-det-image14").attr("src", image_url);
        } else if (data.ImageDetails.ImageText4 !== "0" || data.ImageDetails.ImageText4 !== 0) {
            $(".shop-p-det-image14").attr("data-image", "data:image/png;base64," + data.ImageDetails.ImageText4);
            $(".shop-p-det-image14").attr("data-zoom-image", "data:image/png;base64," + data.ImageDetails.ImageText4);
            $(".shop-p-det-image14").attr("src", "data:image/png;base64," + data.ImageDetails.ImageText4);
            $(".zoomWindow").attr("src", "data:image/png;base64," + data.ImageDetails.ImageText4);
        }
    } else {
        $(".owl-carousel .s-p-det-img4").parent().removeClass("owl-item cloned").addClass("d-none");
    }
//

//   

    var catdata = data.CategoryDetails;
    var catParent = $("#shop-p-det-cat-list");
    catParent.find(".new-clone").remove();
    if (catdata === "none") {
        catParent.text("No Result");
    } else {
        var childclone = catParent.find(".shop-p-det-cat-clone");
        var count = 0;
        $.each(catdata, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("shop-p-det-cat-clone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".shop-p-det-cat-name").text(details["CategoryName"]).click(function () {
                localStorage.setItem("categoryid", details["categoryid"]);
                window.location = extension + "LinksServlet?type=Products";
            }).hover(function () {
                $(this).addClass("text-success");
            }, function () {
                $(this).removeClass("text-success");
            });
            newchild.appendTo(catParent).show();
        });
        childclone.hide();
    }

    var tagdata = data.TagDetails;
    var TagDetails = $("#shop-p-det-tag-list");
    if (data === "none") {
        TagDetails.text("No Result");
    } else {
        var childclone = TagDetails.find(".shop-p-det-tag-clone");
        var count = 0;
        $.each(tagdata, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("shop-p-det-tag-clone");
            newchild.removeClass("d-none");
            newchild.find(".shop-p-det-tag-name").text(details["name"]);
            newchild.appendTo(TagDetails).show();
        });
        childclone.hide();
    }


    var reviewdata = data.ReviewDetails;
    var reviewParent = $("#shop-product-reviews");
    reviewParent.find(".new-clone").remove();
    console.log(reviewdata);
    if (reviewdata === "none") {
        reviewParent.text("No Result");
    } else {
        var childclone = reviewParent.find(".shop-product-review-clone");
        var count = 0;
        $.each(reviewdata, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("shop-p-det-prop-clone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
                newchild.find(".shop-product-review-date-time").text(details["date"] + " " + details["time"]);
                newchild.find(".shop-product-review-comment").text(details["comment"]);
                newchild.find(".shop-product-review-name").text(details["reviewUsername"]);
                newchild.find(".shop-product-review-rate_value").text(details["rate_value"]);
            newchild.appendTo(reviewParent).show();
        });
        childclone.hide();
    }

}


function DisplayDetailsProducts(data, parent) {
    parent.find(".new-clone").remove();
    if (data !== "none") {
        var childclone = parent.find(".product-clone").removeClass("d-none");
        var count = 0;
        var ids = data[0];
        var result = data[1];
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            var newchild = childclone.clone();
            newchild.removeClass("product-clone");
            newchild.addClass("new-clone");
            newchild.find(".prod-sn").text(count);
            var ProductID = details["id"];
            newchild.find(".prod-id").val(ProductID);
            newchild.find(".shop-p-name").text(details["InfoDetails"].name);
            newchild.find(".shop-p-desc").text(details["InfoDetails"].description);

            newchild.find(".shop-prod-rootcategory").text(details["RootCatName"]);

            newchild.find(".shop-p-selling-price").text(PriceFormat(details["PriceDetails"].selling_price));
            newchild.find(".shop-p-cost-price").text(PriceFormat(details["PriceDetails"].cost_price));
            var show_condition = details["show_condition"];
            if (show_condition === "1" || show_condition === 1) {
                newchild.find(".shop-p-condition").text(details["CondionDetails"].name);
            } else if (show_condition === "0" || show_condition === 0) {
                newchild.find(".shop-p-condition").addClass("d-none");
            }

            if (details["FirstImage"] === "0" || details["FirstImage"] === 0) {
                var image_url = extension + "assets/images/brand/logo.png";
                newchild.find(".shop-p-image1").attr("src", image_url);
            } else if (details["FirstImage"] !== "0" || details["FirstImage"] !== 0) {
                newchild.find(".shop-p-image1").attr("src", "data:image/png;base64," + details["FirstImage"]);
            }
            if (details["SecondImage"]) {
                if (details["SecondImage"] === "0" || details["SecondImage"] === 0) {
                    var image_url = extension + "assets/images/brand/logo.png";
                    newchild.find(".shop-p-image2").attr("src", image_url);
                } else if (details["SecondImage"] !== "0" || details["SecondImage"] !== 0) {
                    newchild.find(".shop-p-image2").attr("src", "data:image/png;base64," + details["SecondImage"]);
                }
            }
            var btndetails = newchild.find(".btn-shop-p-details").click(function () {
                localStorage.setItem("productid", ProductID);
                window.location = extension + "LinksServlet?type=ProductDetails";
                shopsessionid = verifyUser();
                var data = [shopsessionid, ProductID];
                GetData("Products", "ComputeUserProductViewed", "LoadComputeUserProductViewed", data);
            });
            DisplayToolTip(btndetails);
            var btnquick = newchild.find(".btn-shop-p-quick-view").click(function () {
                var modalParent = $("#modal_box");
                QuickView(modalParent, details);
            });
            DisplayToolTip(btnquick);

            var btndaddtocart = newchild.find(".btn-shop-p-add-to-cart").click(function () {
                
                ProcessProductOption("Cart", ProductID, details["PriceDetails"].selling_price, 1, "Increase");
            });
            DisplayToolTip(btndaddtocart);
            var btnsaved = newchild.find(".btn-shop-p-wishlist").click(function () {
                shopsessionid = verifyUser();
                var UserType = shopsessionid.split("#")[1];
                if (UserType === "G") {
                    localStorage.setItem("page_redirect", "saveditems");
                    window.location = extension + "LinksServlet?type=Login";
                } else {
                    ProcessProductOption("SavedItems", ProductID, details["PriceDetails"].selling_price, 1, "Increase");
                }
            });
            DisplayToolTip(btnsaved);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
    }
}

