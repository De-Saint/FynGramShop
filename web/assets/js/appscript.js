/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var sessionid;
var extension, cartcount, checkcat, loadedcategory;
function performActions() {
    sessionid = verifyUser();
    GenralBtnEvents();
    GeneralAppFunctions();
    logoFunction();
}

function GeneralAppFunctions() {
    GetData("Category", "GetShopAllLevelCategories", "LoadShopAllLevelCategories", "");
    GetData("Category", "GetShopMobileRootCategories", "LoadShopMobileRootCategories", "");


    if (sessionid || sessionid !== 0) {
        GetData("Cart", "GetShopCartCount", "LoadShopCartCount", sessionid); 
        GetData("User", "GetUserDetails", "LoadUserDetails", sessionid);
    }
    cartcount = GetCartCount();
    if (cartcount) {
        $(".cart_count").text(cartcount);
    } else {
        $(".cart_count").text(0);
    }
}

function GetCartCount() {
    return cartcount = localStorage.getItem("cartcount");
}

function logoFunction() {
    var path = getCurrentPath();
    var logoImage = "assets/img/logo/logo.png";
    var partnerLogo1 = "assets/img/icon/paypal1.jpg";
    var partnerLogo2 = "assets/img/icon/paypal2.jpg";
    var partnerLogo3 = "assets/img/icon/paypal3.jpg";
    var partnerLogo4 = "assets/img/icon/paypal4.jpg";
    if (path.includes("pages/shop")) {
        extension = "../../../";
        $(".logoImage").attr("src", extension + logoImage);
        $(".partnerLogo1").attr("src", extension + partnerLogo1);
        $(".partnerLogo2").attr("src", extension + partnerLogo2);
        $(".partnerLogo3").attr("src", extension + partnerLogo3);
        $(".partnerLogo4").attr("src", extension + partnerLogo4);
        $(".categories_menu").removeClass("categories_three");
    } else if (path.includes("pages/user")) {
        extension = "../../../../";
        $(".logoImage").attr("src", extension + logoImage);
        $(".partnerLogo1").attr("src", extension + partnerLogo1);
        $(".partnerLogo2").attr("src", extension + partnerLogo2);
        $(".partnerLogo3").attr("src", extension + partnerLogo3);
        $(".partnerLogo4").attr("src", extension + partnerLogo4);
        $(".categories_menu").removeClass("categories_three");
    } else {
        $(".logoImage").attr("src", logoImage);
        $(".partnerLogo1").attr("src", partnerLogo1);
        $(".partnerLogo2").attr("src", partnerLogo2);
        $(".partnerLogo3").attr("src", partnerLogo3);
        $(".partnerLogo4").attr("src", partnerLogo4);
    }
}

function GenralBtnEvents() {
    $('[data-toggle="tooltip"]').tooltip();
    var shownewsletter = localStorage.getItem("shownewsletter");
    if (shownewsletter === "No") {
        $('.newletter-popup').hide();
    } else {
        $('.newletter-popup').bPopup();
    }
    $("#logout").click(function () {
        localStorage.clear();
        localStorage.setItem("shownewsletter", "No");
        verifyUser();
    });
    $("#ContinueShopping").click(function () {
        $("#modal_box-added").modal("hide");
        cartcount = GetCartCount();
        $(".cart_count").text(cartcount);
        var saveditems = localStorage.getItem("savedtimepage");
        if (saveditems) {
            GetData("Cart", "GetShopSavedItems", "LoadShopSavedItems", sessionid);
        }
    });
    $("#ProceedToCheckOut").click(function () {
        window.location = extension + "LinksServlet?type=Cart";
    });
}


function DisplayShopAllLevelCategories(data) {
    var parent = $(".categorylist");
    parent.find(".catnewclone").remove();
    if (data === "none") {
        parent.text("No Result");
    } else {
        var List = data[0];
        var CatIDs = data[1];
        var SubCatIDs = data[2];
//-------------------TOp Categery Start----------------------//
        var childclone = parent.find(".category-clone");
        $.each(List, function (topcatid, details) {
            var newchild = childclone.clone();
            newchild.removeClass("category-clone");
            newchild.removeClass("d-none");
            newchild.find(".cat-name").text(capitaliseFirstLetter(details["name"]))
                    .click(function () {
                        localStorage.setItem("categoryid", details["id"]);
                        window.location = extension + "LinksServlet?type=Products";
                    });

            //            //-------------------Categery Start----------------------//
            var Categories = CatIDs[topcatid];
            var catParent = newchild.find(".parcategorylist");
            var catclone = catParent.find(".parcategory-clone");
            $.each(Categories, function (cid, catdetails) {
                var catchild = catclone.clone();
                var catid = catdetails["id"];
                catchild.removeClass("parcategory-clone");
                catchild.removeClass("d-none");
                catchild.find("input[name=addprod-parcat-id]").val(catid);
                catchild.find(".parcat-name").text(capitaliseFirstLetter(catdetails["name"])).
                        click(function () {
                            localStorage.setItem("categoryid", catid);
                            window.location = extension + "LinksServlet?type=Products";
                        });

////                //-------------------Sub Categery Start----------------------//
                var SubCategories = SubCatIDs[catid];

                var subcatParent = catchild.find(".subcategorylist");
                var subcatclone = subcatParent.find(".subcategory-clone");
                $.each(SubCategories, function (sid, subcatdetails) {
                    var subid = subcatdetails["id"];
                    var subcatchild = subcatclone.clone();
                    subcatchild.addClass("subcategory-clone");
                    subcatchild.removeClass("d-none");
                    subcatchild.find("input[name=addprod-subcat-id]").val(subid);
                    subcatchild.find(".subcat-name").text(capitaliseFirstLetter(subcatdetails["name"])).
                            click(function () {
                                localStorage.setItem("categoryid", subid);
                                window.location = extension + "LinksServlet?type=Products";
                            });
                    subcatchild.appendTo(subcatParent);
                });
                subcatclone.hide();
////                //-------------------Sub Categery End----------------------//
                catchild.appendTo(catParent).show();
            });
            catclone.hide();
            //-------------------Categery End----------------------//
            newchild.appendTo(parent).show();
        });
        childclone.hide();
        //-------------------Top Categery End----------------------//
    }
}



function QuickView(parent, data) {
    parent.find("#shop-qv-prod-name").text(data.InfoDetails.name);
    parent.find("#shop-qv-prod-desc").text(data.InfoDetails.description);
    parent.find("#shop-qv-prod-selling-price").text(PriceFormat(data.PriceDetails.selling_price));
    parent.find("#shop-qv-prod-cost-price").text(PriceFormat(data.PriceDetails.cost_price));
    parent.find("#shop-qv-prod-root-category").text(data.RootCatName);
    parent.find("#shop-qv-prod-add-to-wishlist").click(function () {
        sessionid = verifyUser();
        var UserType = sessionid.split("#")[1];
        if (UserType === "G") {
            localStorage.setItem("page_redirect", "saveditems");
            window.location = extension + "LinksServlet?type=Login";
        } else {
            parent.modal("hide");
            ProcessProductOption("SavedItems", data.ProductID, data.PriceDetails.selling_price, 1, "Increase");
        }
    });
    parent.find("#shop-qv-p-addtocart").click(function () {
        var quantity = parent.find("#shop-qv-p-quantity").val();
        parent.modal("hide");
        ProcessProductOption("Cart", data.ProductID, data.PriceDetails.selling_price, quantity, "Increase");
    });

    if (data.FirstImage === "0" || data.FirstImage === 0) {
        var image_url = extension + "assets/images/no-image.png";
        parent.find(".shop-qv-prod-root-image1").attr("src", image_url);
    } else if (data.FirstImage !== "0" || data.FirstImage !== 0) {
        parent.find(".shop-qv-prod-root-image1").attr("src", "data:image/png;base64," + data.FirstImage);
    }
    if (data.SecondImage) {
        if (data.SecondImage === "0" || data.SecondImage === 0) {
            var image_url = extension + "assets/images/no-image.png";
            parent.find(".shop-qv-prod-root-image2").attr("src", image_url);
        } else if (data.SecondImage !== "0" || data.SecondImage !== 0) {
            parent.find(".shop-qv-prod-root-image2").attr("src", "data:image/png;base64," + data.SecondImage);
        }
    }
    if (data.ImageDetails.ImageText3) {
        if (data.ImageDetails.ImageText3 === "0" || data.ImageDetails.ImageText3 === 0) {
            var image_url = extension + "assets/images/no-image.png";
            parent.find(".shop-qv-prod-root-image3").attr("src", image_url);
        } else if (data.ImageDetails.ImageText3 !== "0" || data.ImageDetails.ImageText3 !== 0) {
            $(".owl-carousel .s-qv-p-img3").addClass("owl-item").removeClass("d-none");
            parent.find(".shop-qv-prod-root-image3").attr("src", "data:image/png;base64," + data.ImageDetails.ImageText3);
        }
    } else {
        $(".owl-carousel .s-qv-p-img3").removeClass("owl-item").addClass("d-none");
    }
    if (data.ImageDetails.ImageText4) {
        if (data.ImageDetails.ImageText4 === "0" || data.ImageDetails.ImageText4 === 0) {
            var image_url = extension + "assets/images/no-image.png";
            parent.find(".shop-qv-prod-root-image3").attr("src", image_url);
        } else if (data.ImageDetails.ImageText4 !== "0" || data.ImageDetails.ImageText4 !== 0) {
            $(".owl-carousel .s-qv-p-img4").addClass("owl-item").removeClass("d-none");
            parent.find(".shop-qv-prod-root-image4").attr("src", "data:image/png;base64," + data.ImageDetails.ImageText4);
        }
    } else {
        $(".owl-carousel .s-qv-p-img4").removeClass("owl-item").addClass("d-none");
    }

    DisplayPropertyList(data, parent);

    var catdata = data["CategoryDetails"];
    var catParent = parent.find(".shop-qv-p-cat-list");
    catParent.find(".new-clone").remove();
    if (catdata === "none") {
        catParent.text("No Result");
    } else {
        var childclone = catParent.find(".shop-qv-p-prop-cat-clone");
        var count = 0;
        $.each(catdata, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("shop-qv-p-prop-cat-clone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".shop-qv-p-cat-name").text(details["CategoryName"]);
            newchild.appendTo(catParent).show();
        });
        childclone.hide();
    }


}

function DisplayPropertyList(data, parent) {
    var propdata = data.PropertyDetails;
    var PropertyParent = parent.find(".shop-qv-p-prop-list");
    PropertyParent.find(".new-clone").remove();
    if (propdata === "none") {
        PropertyParent.text("No Result");
    } else {
        var childclone = PropertyParent.find(".shop-qv-p-prop-list-clone");
        var count = 0;
        $.each(propdata, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("shop-qv-p-prop-list-clone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            if (details["RootPropName"] !== details["name"]) {
                newchild.find(".shop-qv-p-prop-name").text(details["RootPropName"]);
                newchild.find(".shop-qv-p-prop-value").text(details["name"]);
            }
            newchild.appendTo(PropertyParent).show();
        });
        childclone.hide();
    }
}

function DisplayShopMobileRootCategories(data) {
    var cs = $("#cat-root-cat");
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Category"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
        cs.change('cat-root-cat', function () {
            var option = $(this).find('option:selected');
            //Added with the EDIT
            var id = option.val(); //to get content of "value"
            localStorage.setItem("categoryid", id);
            window.location = extension + "LinksServlet?type=Products";
        });
    }
}


function ProcessProductOption(Option, ProductID, ProductPrice, ProductQuantity, Action) {
    var data = [sessionid, Option, ProductID, ProductPrice, ProductQuantity, Action];
    GetData("Cart", "AddOptions", "LoadAddOption", data);

}

function DisplayCartAddOption(data) {
    if (data.result.status === "error") {
        ShowNotification(data.result.msg, 'error');
    } else if (data.result.status === "success") {
        var parent = $("#modal_box-added");
        parent.modal("show");
        var cartdata = data.CartDetails;
        parent.find(".added-p-name").text(cartdata.productName);
        parent.find(".added-p-price").text(PriceFormat(cartdata.productPrice));
        parent.find(".added-p-cart-count").text(cartdata.product_count);
        parent.find(".added-p-cart-amount").text(PriceFormat(cartdata.total_amount));
        if (parseInt(cartdata.product_count) > 1) {
            parent.find(".added-p-msg").text("There are " + cartdata.product_count + " items in your cart.");
        } else {
            parent.find(".added-p-msg").text("There is 1 item in your cart.");
        }
        localStorage.removeItem("cartcount");
        localStorage.setItem("cartcount", cartdata.product_count);
        if (cartdata.ImageText === "0" || cartdata.ImageText === 0) {
            var image_url = extension + "assets/images/no-image.png";
            parent.find(".added-p-image").attr("src", image_url);
        } else if (cartdata.ImageText !== "0" || cartdata.ImageText !== 0) {
            parent.find(".added-p-image").attr("src", "data:image/png;base64," + cartdata.ImageText);
        }


        var propdata = data.PropertyDetails;
        var PropertyParent = parent.find("#added-p-det-prop-list");
        PropertyParent.find(".new-clone").remove();
        if (propdata === "none") {
            PropertyParent.text("No Result");
        } else {
            var childclone = PropertyParent.find(".added-p-det-prop-clone");
            var count = 0;
            $.each(propdata, function (index, details) {
                var newchild = childclone.clone();
                count++;
                newchild.removeClass("added-p-det-prop-clone");
                newchild.removeClass("d-none");
                newchild.addClass("new-clone");
                if (details["RootPropName"] !== details["name"]) {
                    newchild.find(".added-p-det-prop-name").text(details["RootPropName"]);
                    newchild.find(".added-p-det-prop-value").text(details["name"]);
                } else {
                    newchild.addClass("d-none");
                }
                newchild.appendTo(PropertyParent).show();
            });
            childclone.hide();
        }
    }

}


function DisplaySaveGuest(data) {
    localStorage.setItem("shownewsletter", "No");
    localStorage.removeItem("sessionid");
    localStorage.setItem("sessionid", data);
}

function DisplayShopCartCount(data) {
    localStorage.removeItem("cartcount");
    localStorage.setItem("cartcount", data);
}

function DisplayUserDetails(resp) {
//    hideLoading();
    $(".UserType").text(resp.UserType);
    $(".UserName").text(resp.UserName);
    localStorage.setItem("uUserName", resp.UserName);
    $(".uFirstName").val(resp.firstname);
    $(".uLastName").val(resp.lastname);
    $(".uDateJoined").text(resp.date);
    if (resp.newsletter === 1 || resp.newsletter === "1") {
        $(".uNewsletter").text("Has Subcribed").addClass("badge badge-success");
    } else {
        $(".uNewsletter").text("Has not subscribed").addClass("badge badge-primary");
    }
    $(".uEmail").val(resp.email);
    localStorage.setItem("uEmail", resp.email);
    $(".uPhone").val(resp.phone);
    $(".uGender").text(resp.gender);
    $(".uBankName").val(resp.BankDetails.bankName);
    if (resp.BankDetails.bankName) {
        $(".add_bank_details").addClass("d-none");
        $(".change_bank_details").removeClass("d-none");
    } else if (!resp.BankDetails.bankName) {
        $(".add_bank_details").removeClass("d-none");
        $(".change_bank_details").addClass("d-none");
    }
    $(".uAccoutNumber").val(resp.BankDetails.account_number);
    $(".uAcctType").val(resp.BankDetails.account_type);
    $(".ubkdetid").val(resp.BankDetails.id);
    if (resp.ImageText !== "none") {
        $(".UserImage").attr("src", "data:image/png;base64," + resp.ImageText);
    } else {
        var image_url = "../../../../assets/img/no-image.png";
        $(".UserImage").attr("src", image_url);
    }
}