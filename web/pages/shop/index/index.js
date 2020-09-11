/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "";
$(document).ready(function () {
    IndexFunctions();
});

function IndexFunctions() {
    IndexBtnEvents();
    IndexPageFunctions();

}

function IndexBtnEvents() {
    $(".b-close").click(function () {
        if ($("#newsletter_popup_dont_show_again").is(':checked')) {
            sessionStorage.setItem("newscheck", "No");
        } else {
            sessionStorage.setItem("newscheck", "Yes");
        }
    });

    $("form[name=mc-mail]").submit(function (e) {
        var newsletterEmail = $(".mc-email").val();
        var shopsessionid = $("#shopsessionid").val();
        if (newsletterEmail !== "") {
            var data = [newsletterEmail, shopsessionid];
            GetData("User", "SubcribeNewsletter", "LoadSubcribeNewsletter", data);
        }
        e.preventDefault();
    });

    $("#slideImage1").click(function () {
        loadProductPage(1);
    });
    $("#slideImage2").click(function () {
        loadProductPage(6);
    });
    $("#slideImage3").click(function () {
        loadProductPage(6);
    });
    $("#bannerImage1").click(function () {
        loadProductPage(8);
    });
    $("#bannerImage2").click(function () {
        loadProductPage(12);
    });
    $("#bannerImage3").click(function () {
        loadProductPage(7);
    });
    $("#bannerImage4").click(function () {
        loadProductPage(10);
    });
    $("#indexImage4").click(function () {
        loadProductPage(9);
    });
    $("#indexImage3").click(function () {
        loadProductPage(7);
    });
    $("#indexImage2").click(function () {
        loadProductPage(10);
    });
    $("#indexImage1").click(function () {
        loadProductPage(6);
    });
}

function DisplaySubcribeNewsletter(resp) {
    if (resp.status === "success") {
        $('.mailchimp-success').addClass('active');
        $('.mailchimp-success').html('' + resp.msg).fadeIn(900);
        $('.mailchimp-error').fadeOut(400);
    } else if (resp.status === "error") {
        $('.mailchimp-error').html('' + resp.msg).fadeIn(900);
    }
}


function IndexPageFunctions() {
    GetData("Products", "GetRecentlyAddedProducts", "LoadRecentlyAddedProducts", "");
    GetData("Products", "GetTopSellingProducts", "LoadTopSellingProducts", "");
    GetData("Products", "GetBestSellersProducts", "LoadBestSellersProducts", "");
    GetData("Products", "GetFeaturedProducts", "LoadFeaturedProducts", "");
    GetData("Products", "GetMostViewed", "LoadMostViewed", "");
}


function DisplayShopProducts(data, parent) {
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
            var ProductID = details["ProductID"];
            newchild.find(".prod-id").val(ProductID);
            newchild.find(".shop-p-name").text(details["InfoDetails"].name);
            newchild.find(".shop-p-desc").text(details["InfoDetails"].description);

            newchild.find(".shop-prod-rootcategory").text(details["RootCatName"]);


            newchild.find(".shop-p-selling-price").text(PriceFormat(details["PriceDetails"].selling_price));
            if(parseInt(details["show_actual_price"]) === 1){
                newchild.find(".shop-p-cost-price").text(PriceFormat(details["PriceDetails"].cost_price));
            }else{
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
            });
            DisplayToolTip(btndetails);
            var btnquick = newchild.find(".btn-shop-p-quick-view").click(function () {
                var modalParent = $("#modal_box");
                QuickView(modalParent, details);//
                var data = [shopsessionid, ProductID];
                GetData("Products", "ComputeUserProductViewed", "LoadComputeUserProductViewed", data);
            });
            DisplayToolTip(btnquick);
            var btndaddtocart = newchild.find(".btn-shop-p-add-to-cart").click(function () {
                ProcessProductOption("Cart", ProductID, details["PriceDetails"].selling_price, 1, "Increase");
                var data = [shopsessionid, ProductID];
                GetData("Products", "ComputeUserProductViewed", "LoadComputeUserProductViewed", data);
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
                    var data = [shopsessionid, ProductID];
                    GetData("Products", "ComputeUserProductViewed", "LoadComputeUserProductViewed", data);
                }
            });
            DisplayToolTip(btnsaved);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
    }
}

