/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Intl */

var extension = "";
$(document).ready(function () {
    performActions();
});

//function getCurrentPage() {
////returns the current page the user is on
//    var path = window.location.pathname;
////    var page = path.split("/").pop();
//    return path;
//}

function getCurrentPath() {
//returns the current page the user is on
    var path = window.location.pathname;
    return path;
}
function getCurrentPage() {
//returns the current page the user is on
    var path = window.location.pathname;
    var page = path.split("/").pop();
    return page;
}

function General() {
    extension = GetExtension();
}


function capitaliseFirstLetter(text) {
    if (text !== undefined) {
        return text.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}

function PriceFormat(price) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    });
    price = formatter.format(price);
    price = price.replace("NGN", "₦");
    return price.replace(".00", "");
}


function PriceNumberFormat(price) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    });
    price = formatter.format(price);
    price = price.replace("NGN", "");
    return price.replace(".00", "");
}
function verifyUser() {
    var shopsessionidString = "";
//This function checks if a user is signed in and responds     
    if (localStorage) {
        var shopsessionidString = localStorage.getItem("shopsessionid");
        if (shopsessionidString === "null" || shopsessionidString === null || shopsessionidString === "" || shopsessionidString === "undefined" || shopsessionidString === undefined) {
            $(".forMembers").hide();
            $(".forMembers").addClass("d-none");
            $(".notforMembers").show();
            $(".notforMembers").removeClass("d-none");
            $.getJSON("https://ip.seeip.org/geoip", function (data) {
                var address = data.city + " " + data.country;
                var data = [data.ip, address];
                GetData("User", "SaveGuest", "LoadSaveGuest", data);
            });
        } else {
            var utype = shopsessionidString.split("#")[1];
            if (utype === "G") {
                $(".forMembers").addClass("d-none");
                $(".forMembers").hide();
                $(".notforMembers").show();
                $(".notforMembers").removeClass("d-none");
            } else if (utype === "S" || utype === "A") {
//                window.location = extension + "LinksServlet?type=Index";
            } else {
                $(".forMembers").removeClass("d-none");
                $(".forMembers").show();
                $(".notforMembers").hide();
                $(".notforMembers").addClass("d-none");
            }

        }
    } else {
        shopsessionidString = 0;
    }
    return shopsessionidString;
}


function returnToTimeOutPage(extension) {
    window.location = extension + "LinksServlet?type=Index";
}


function loadProductPage(categoryID) {
    localStorage.setItem("categoryid", categoryID);
    window.location = extension + "LinksServlet?type=Products";
}

function GetData(action, type, callfunction, data) {
    var path = window.location.pathname;
    var href = window.location.href;
    var url = href.replace(path, '').replace("#", '').replace("?", '');
    $.ajax({
        url: url + '/FynGramEngine/DispatcherSerlvet',
        type: 'GET',
        data: {
            action: action,
            type: type,
            data: data
        },
        success: function (data) {
            linkToFunction(callfunction, data);
        }
    });
}

function ShowNotification(text, type) {
    new Noty({
        type: type,
        layout: 'topRight',
        theme: 'bootstrap-v4  alert alert-success alert-styled-left p-0 bg-white',
        text: text,
        timeout: 3500,
        progressBar: true,
//        closeWith: ['button'],
        killer: true
    }).show();
}

function showLoading() {
    $("#loader").removeClass("d-none");
}

function hideLoading(noty) {
    $("#loader").addClass("d-none");

}

function SessionTokenManager(resp) {
    localStorage.removeItem("shopsessionid");
    localStorage.removeItem("shopsessiontype");
    localStorage.setItem("shopsessionid", resp.data.sessionid);
    localStorage.setItem("shopsessiontype", resp.data.sessiontype);
}

function DisplayToolTip(btn) {
    btn.tooltip({
        position: {
            my: "center bottom-40",
            at: "center top"
        }
    });
}

$("input[data-type='currency']").on({
    keyup: function () {
        formatCurrency($(this));
    },
    blur: function () {
        formatCurrency($(this), "blur");
    }
});

function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    var input_val = input.val();

    // don't validate empty input
    if (input_val === "") {
        return;
    }

    // original length
    var original_len = input_val.length;

    // initial caret position 
    var caret_pos = input.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf(".") >= 0) {

        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");

        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);

        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
            right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = left_side;

    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);

        // final formatting
        if (blur === "blur") {
            input_val;
        }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}

function CalculatePercentage(userAmt) {
    var addedPerc = (parseInt(userAmt) * parseFloat(0.02));
    var newAmt = parseInt(userAmt) + parseInt(addedPerc);
    if (parseInt(userAmt) >= parseInt(2500)) {
        newAmt = parseInt(userAmt) + parseInt(100);
    }
    return newAmt;
}

function linkToFunction(action, params) {
    switch (action) {
        case "LoadSaveGuest":
        {
            DisplaySaveGuest(params);
            break;
        }
        case "LoadLoginCustomer":
        {
            DisplayLoginCustomer(params);
            break;
        }
        case "LoadUserDetails":
        {
            DisplayUserDetails(params);
            break;
        }
        case "LoadSubcribeNewletter":
        {
            DisplaySubcribeNewletter(params);
            break;
        }
        case "LoadRegisterCustomer":
        {
            DisplayRegisterCustomer(params);
            break;
        }
        case "LoadShopAllLevelCategories":
        {
            DisplayShopAllLevelCategories(params);
            break;
        }
        case "LoadAllLevelCategories":
        {
            DisplayAllLevelCategories(params);
            break;
        }
        case "LoadShopProductsByCategoryID":
        {
            DisplayShopProductsByCategoryID(params);
            break;
        }
        case "LoadShopCategoriesByCategoryID":
        {
            DisplayShopCategoriesByCategoryID(params);
            break;
        }
        case "LoadShopCategoryPricesByCategoryID":
        {
            DisplayShopCategoryPricesByCategoryID(params);
            break;
        }
        case "LoadShopProductDetails":
        {
            DisplayShopProductDetails(params);
            break;
        }
        case "LoadShopMobileRootCategories":
        {
            DisplayShopMobileRootCategories(params);
            break;
        }
        case "LoadShopPropertiesByCategoryID":
        {
            DisplayShopPropertiesByCategoryID(params);
            break;
        }
        case "LoadShopTagsByCategoryID":
        {
            DisplayShopTagsByCategoryID(params);
            break;
        }
        case "LoadAddOption":
        {
            if (params.result.option === "Cart") {
                DisplayCartAddOption(params);
            } else if (params.result.option === "SavedItems") {
                ShowNotification(params.result.msg, params.result.status);
            }
            break;
        }
        case "LoadShopCart":
        {
            var parent = $(".ShopCartList");
            DisplayShopCart(params, parent);
            break;
        }
        case "LoadGetShopCart":
        {
            var parent = $(".CheckOutShopCartList");
            DisplayGetShopCart(params, parent);
            DisplayShippingDetails(params);
            break;
        }
        case "LoadUpdateOptions":
        {
            DisplayUpdateOptions(params);
            break;
        }
        case "LoadDeleteOptions":
        {
            var respData = params[0];
            if (respData.option === "Cart") {
                DisplayUpdateCartOptions(params);
            } else if (respData.option === "SavedItems") {
                DisplayUpdateSavedItemsOptions(params);
            }

            break;
        }
        case "LoadEmptyOptions":
        {
            if (params.option === "Cart") {
                DisplayEmptyCartOptions(params);
            } else if (params.option === "SavedItems") {
                DisplayEmptySavedItemsOptions(params);
            }

            break;
        }
        case "LoadShopSavedItems":
        {
            DisplayShopSavedItems(params);
            break;
        }
        case "LoadBuyAllSavedItems":
        {
            DisplayBuyAllSavedItems(params);
            break;
        }
        case "LoadAddressTypes":
        {
            DisplayAddressTypes(params);
            break;
        }
        case "LoadStates":
        {
            DisplayStates(params);
            break;
        }
        case "LoadLGAs":
        {
            DisplayLGAs(params);
            break;
        }
        case "LoadTowns":
        {
            DisplayTowns(params);
            break;
        }
        case "LoadBusStops":
        {
            DisplayBusStops(params);
            break;
        }
        case "LoadStreets":
        {
            DisplayStreets(params);
            break;
        }
        case "LoadUserAddresses":
        {
            var parent = $(".AddressList");
            DisplayUserAddresses(params, parent);
            break;
        }
        case "LoadUserAddressesInfo":
        {
            DisplayUserAddressesInfo(params);
            break;
        }
        case "LoadShopCartCount":
        {
            DisplayShopCartCount(params);
            break;
        }
        case "LoadMessages":
        {
            var parent = $(".msglist");
            DisplayMessages(params, parent);
            break;
        }
        case "LoadDeleteMessageInfo":
        {
            var parent = $(".msglist");
            DisplayDeleteMessageInfo(params, parent);
            break;
        }
        case "LoadGetWalletDetails":
        {
            DisplayGetWalletDetails(params);
            break;
        }
        case "LoadValidatePaystackPayment":
        {
            DisplayValidatePaystackPayment(params);
            break;
        }
        case "LoadGetPayments":
        {
            var parent = $(".PaymentList");
            DisplayGetPayments(params, parent);
            break;
        }
        case "LoadPaymentsInfo":
        {
            var parent = $(".PaymentList");
            DisplayPaymentsInfo(params, parent);
            break;
        }
        case "LoadRecentTransactions":
        {
            var parent = $(".TransionList");
            DisplayRecentTransactions(params, parent);
            break;
        }
        case "LoadDeleteTransaction":
        {
            var parent = $(".TransionList");
            DisplayDeleteTransaction(params, parent);
            break;
        }
        case "LoadBanks":
        {
            DisplayBanks(params, parent);
            break;
        }
        case "LoadAddBankDetails":
        {
            DisplayAddBankDetails(params);
            break;
        }
        case "LoadCashoutRequests":
        {
            var parent = $(".CashOutList");
            DisplayCashoutRequests(params, parent);
            break;
        }
        case "LoadCashOutOptions":
        {
            var parent = $(".CashOutList");
            DisplayCashOutOptions(params, parent);
            break;
        }
        case "LoadCustomerDiscountCodes":
        {
            var parent = $(".DiscountCodeList");
            DisplayCustomerDiscountCodes(params, parent);
            break;
        }
        case "LoadDefaultAddress":
        {
            DisplayDefaultAddress(params);
            break;
        }
        case "LoadShippingFees":
        {
            DisplayShippingFees(params);
            break;
        }
        case "LoadCartShippingAddress":
        {
            DisplayCartShippingAddress(params);
            break;
        }
        case "LoadUpdateDiscountCode":
        {
            DisplayUpdateDiscountCode(params);
            break;
        }
        case "LoadWalletBalance":
        {
            DisplayWalletBalance(params);
            break;
        }
        case "LoadPlaceOrder":
        {
            DisplayPlaceOrder(params);
            break;
        }
        case "LoadSaveComplaints":
        {
            DisplaySaveComplaints(params);
            break;
        }
        case "LoadNewFeatureRequest":
        {
            DisplaySaveSuggestion(params);
            break;
        }
        case "LoadOrders":
        {
            DisplayOrders(params);
            break;
        }
        case "LoadOrderDetails":
        {
            DisplayOrderDetails(params);
            break;
        }
        case "LoadStockMovement":
        {
            DisplayStockMovement(params);
            break;
        }
        case "LoadRecentlyAddedProducts":
        {
            var parent = $(".RecentlyAddedProd");
            DisplayShopProducts(params, parent);
            break;
        }
        case "LoadTopSellingProducts":
        {
            var parent = $(".TopSellingProd");
            DisplayShopProducts(params, parent);
            break;
        }
        case "LoadBestSellersProducts":
        {
            var parent = $(".BestSellersProd");
            DisplayShopProducts(params, parent);
            break;
        }
        case "LoadFeaturedProducts":
        {
            var parent = $(".FeaturedProd");
            DisplayShopProducts(params, parent);
            break;
        }
        case "LoadMostViewed":
        {
            var parent = $(".MostViewedProd");
            DisplayShopProducts(params, parent);
            break;
        }
        case "LoadRelatedProducts":
        {
            var parent = $(".RelatedProductList");
            DisplayDetailsProducts(params, parent);
            break;
        }
        case "LoadComputeUserProductViewed":
        {
            console.log(params);
            break;
        }
        case "LoadRecentlyViewed":
        {
            var parent = $(".RecentlyViewedList");
            DisplayDetailsProducts(params, parent);
            break;
        }
        case "LoadDetailFeaturedList":
        {
            var parent = $(".DetailFeaturedList");
            DisplayDetailsProducts(params, parent);
            break;
        }
        case "LoadReviewProduct":
        {
            DisplayReviewProduct(params);
            break;
        }
        case "LoadUserReviewList":
        {
            DisplayUserReviewList(params);
            break;
        }
        case "LoadCustomerStats":
        {
            DisplayCustomerStats(params);
            break;
        }
        case "LoadGlobalSearch":
        {
            DisplayGlobalSearch(params);
            break;
        }

    }
}
