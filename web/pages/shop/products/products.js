/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = "";
var categoryid = "", shopsessionid, searchtext;
$(document).ready(function () {
    productFunctions();
});

function productFunctions() {
    productBtnEvents();
    productPageFunctions();

}

function GetCategoryID() {
    return categoryid = localStorage.getItem("categoryid");
}

function GetSearchText() {
    return searchtext = localStorage.getItem("searchtext");
}

function productBtnEvents() {

    $(".product_thumb").addClass("threegridimage");
    $("#slider-range").slider({
        range: true,
        min: 10,
        max: 100,
        values: [0, 1000000],
        slide: function (event, ui) {
            $("#minamount").val(ui.values[ 0 ]);
            $("#maxamount").val(ui.values[ 1 ]);
        }
    });
    $("#minamount").val($("#slider-range").slider("values", 0));
    $("#maxamount").val($("#slider-range").slider("values", 1));



    $("form[name=filterPriceForm]").submit(function (e) {
        var minAmountString = $("#minamount").val();
        var maxAmountString = $("#maxamount").val();
        var minAmount = minAmountString.replace("₦", "").trim();
        var maxAmount = maxAmountString.replace("₦", "").trim();
        var data = [minAmount, maxAmount, categoryid];
        showLoading();
        GetData("Products", "GetShopProductsByPricesAndCategoryID", "LoadShopProductsByCategoryID", data);
        e.preventDefault();
    });

    $("#productbannerImage").click(function () {
        loadProductPage(10);
    });

    $("#short").change(function () {
        var sort_by = $(this).val();
        var data = [categoryid, sort_by];
        showLoading();
        GetData("Products", "GetShopProductsBySorting", "LoadShopProductsByCategoryID", data);
    });


}
function productPageFunctions() {
    categoryid = GetCategoryID();
    if (categoryid) {
        GetData("Category", "GetShopCategoriesByCategoryID", "LoadShopCategoriesByCategoryID", categoryid);
        GetData("Products", "GetShopCategoryPricesByCategoryID", "LoadShopCategoryPricesByCategoryID", categoryid);
        GetData("Category", "GetShopPropertiesByCategoryID", "LoadShopPropertiesByCategoryID", categoryid);
        GetData("Category", "GetShopTagsByCategoryID", "LoadShopTagsByCategoryID", categoryid);
        showLoading();
        GetData("Products", "GetShopProductsByCategoryID", "LoadShopProductsByCategoryID", categoryid);
    } else {
        window.location = extension + "LinksServlet?type=Index";
    }

}


function DisplayShopProductsByCategoryID(data) {

    hideLoading();
    var parent = $(".ShopProductList");
    parent.find(".new-clone").remove();
    if (data !== "none") {
        $(".noproduct-display").addClass("d-none");
        $(".product-display").removeClass("d-none");
        var childclone = parent.find(".prodlist-clone").removeClass("d-none");
        var count = 0;
        var ids = data[0];
        var result = data[1];
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            var newchild = childclone.clone();
            newchild.removeClass("prodlist-clone");
            newchild.addClass("new-clone");
            newchild.find(".prod-sn").text(count);
            var ProductID = details["ProductID"];
            newchild.find(".prod-id").val(ProductID);
            newchild.find(".shop-p-name").text(details["InfoDetails"].name);
            newchild.find(".shop-p-desc").text(details["InfoDetails"].description);

            newchild.find(".shop-prod-rootcategory").text(details["RootCatName"]);

            newchild.find(".shop-p-selling-price").text(PriceFormat(details["PriceDetails"].selling_price));
            if (parseInt(details["show_actual_price"]) === 1) {
                newchild.find(".shop-p-cost-price").text(PriceFormat(details["PriceDetails"].cost_price));
            } else {
                newchild.find(".shop-p-cost-price").text(PriceFormat(details["PriceDetails"].cost_price)).addClass("d-none");
            }
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
                shopsessionid = verifyUser();
                var data = [shopsessionid, ProductID];
                GetData("Products", "ComputeUserProductViewed", "LoadComputeUserProductViewed", data);
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
                    window.location = extension + "LinksServlet?type=Register";
                } else {
                    ProcessProductOption("SavedItems", ProductID, details["PriceDetails"].selling_price, 1, "Increase");
                }
            });
            DisplayToolTip(btnsaved);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
        $(".result_count").text("Showing " + count + " results");
    } else {
        $(".noproduct-display").removeClass("d-none");
        $(".product-display").addClass("d-none");
    }
}

function DisplayShopCategoriesByCategoryID(data) {
    var parent = $(".shop-list-cat-list");
    parent.find(".newclone").remove();
    if (data[0] === "none") {
        DisplayCategoryLinks(data);

    } else {
        var CatList = data[0];
        var TopCatSubs = data[1];
        var childclone = parent.find(".shop-list-cat-clone");
        $.each(TopCatSubs, function (id, subs) {
            var newchild = childclone.clone();
            newchild.removeClass("shop-list-cat-clone");
            newchild.removeClass("d-none");
            newchild.removeClass("newclone");
            var topdetails = CatList["root" + id];
            newchild.find(".shop-list-cat-name").text(topdetails["name"]).click(function () {
                localStorage.setItem("categoryid", topdetails["id"]);
                window.location = extension + "LinksServlet?type=Products";
            });
            var subParent = newchild.find(".shop-list-cat-sub-list");
            subParent.find(".pnewclone").remove();
            var subchildclone = subParent.find(".shop-list-cat-sub-clone");
            $.each(subs, function (id, subid) {
                var newsubchild = subchildclone.clone();
                newsubchild.removeClass("shop-list-cat-sub-clone");
                newsubchild.removeClass("d-none");
                newchild.removeClass("pnewclone");
                var subdetails = CatList["par" + subid];
                newsubchild.find(".shop-list-cat-sub-name").text(subdetails["name"]).click(function () {
                    localStorage.setItem("categoryid", subdetails["id"]);
                    window.location = extension + "LinksServlet?type=Products";
                });
                newsubchild.appendTo(subParent).show();
            });
            subchildclone.hide();

            newchild.appendTo(parent).show();
        });
        childclone.hide();

        DisplayCategoryLinks(data);
    }

}

function DisplayCategoryLinks(data) {
    var catData = data[2].toString();
    var parData = data[3].toString();
    var rootData = data[4].toString();
    var catname = "";
    var parcatname = "";
    var rootcatname = "";
    if (!catData.includes("none")) {
        var catid = catData.split("=")[1];
        catname = catData.split("=")[0];
        $(".shop-cat-name").removeClass("d-none");
        $(".shop-cat-name").text(catname).click(function () {
            localStorage.setItem("categoryid", catid);
            window.location = extension + "LinksServlet?type=Products";
        }).hover(function () {
            $(this).addClass("text-success");
        }, function () {
            $(this).removeClass("text-success");
        });
    }


    if (!parData.includes("none")) {
        var parcatid = parData.split("=")[1];
        parcatname = parData.split("=")[0];
        if (catname !== parcatname) {
            $(".shop-cat-par-name").removeClass("d-none");
            $(".shop-cat-par-name").text(parcatname).click(function () {
                localStorage.setItem("categoryid", parcatid);
                window.location = extension + "LinksServlet?type=Products";
            }).hover(function () {
                $(this).addClass("text-success");
            }, function () {
                $(this).removeClass("text-success");
            });
        } else {
            $(".shop-cat-par-name").addClass("d-none");
        }
    } else {
        $(".shop-cat-par-name").addClass("d-none");
    }


    if (!rootData.includes("none")) {
        var rootcatid = rootData.split("=")[1];
        rootcatname = rootData.split("=")[0];
        if (rootcatname !== catname && rootcatname !== parcatname) {
            $(".shop-cat-root-name").removeClass("d-none");
            $(".shop-cat-root-name").text(rootcatname).click(function () {
                localStorage.setItem("categoryid", rootcatid);
                window.location = extension + "LinksServlet?type=Products";
            }).hover(function () {
                $(this).addClass("text-success");
            }, function () {
                $(this).removeClass("text-success");
            });
        } else {
            $(".shop-cat-root-name").addClass("d-none");
        }
    } else {
        $(".shop-cat-root-name").addClass("d-none");
    }
}

function DisplayShopCategoryPricesByCategoryID(data) {
    var minAmount = data.split("-")[0];
    var maxAmount = data.split("-")[1];
    $("#slider-range").slider('option', {min: parseInt(minAmount), max: parseInt(maxAmount)});


    $("#slider-range").slider('values', 0, parseInt(minAmount)); // sets first handle (index 0) to minAmount
    $("#minamount").val(parseInt(minAmount));


    $("#maxamount").val(parseInt(maxAmount));
    $("#slider-range").slider('values', 1, parseInt(maxAmount)); // sets second handle (index 1) to maxAmount

}

function DisplayShopPropertiesByCategoryID(data) {
//     hideLoader();
    var parent = $(".cat-proplist");
    var CatList = data[0];
    var TopCatSubs = data[1];
    if (data[0] === "none") {
        parent.text("No Result");
    } else {
        var childclone = parent.find(".cat-proplist-clone");
        $.each(TopCatSubs, function (id, subs) {
            var newchild = childclone.clone();
            newchild.removeClass("cat-proplist-clone");
            newchild.removeClass("d-none");
            var topdetails = CatList["root" + id];
            newchild.find(".cat-proplist-name").text(topdetails["name"]);

            var subParent = newchild.find(".cat-subproplist");
            var subchildclone = subParent.find(".cat-subprop-clone");
            $.each(subs, function (id, subid) {
                var newsubchild = subchildclone.clone();
                newsubchild.removeClass("cat-subprop-clone");
                newsubchild.removeClass("d-none");
                var subdetails = CatList["par" + subid];
                newsubchild.find(".cat-subprop-id").val(subdetails["id"]);
                newsubchild.find(".cat-subprop-name").text(subdetails["name"]).click(function () {
                    GetData("Products", "GlobalSearch", "LoadShopProductsByCategoryID", subdetails["name"]);
                });
                newsubchild.appendTo(subParent);
            });
            newchild.appendTo(parent).show();
        });
        childclone.hide();
    }
}

function DisplayShopTagsByCategoryID(data) {
    var parent = $(".cat-taglist");
    var IDs = data[0];
    var List = data[1];
    if (data === "none") {
        parent.text("No Result");
    } else {
        var childclone = parent.find(".cat-taglist-clone");
        $.each(IDs, function (index, id) {
            var newchild = childclone.clone();
            newchild.removeClass("cat-taglist-clone");
            newchild.removeClass("d-none");
            var details = List[id];
            newchild.find(".cat-taglist-name").text(details["name"]);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
    }
}

function threegrid() {
    $(".product_thumb").addClass("threegridimage");
    $(".product_thumb").removeClass("fourgridimage");
}
function fourgrid() {
    $(".product_thumb").addClass("fourgridimage");
    $(".product_thumb").removeClass("threegridimage");
}