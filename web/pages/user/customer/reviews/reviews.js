/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var shopsessionid, shopsessiontype;
$(document).ready(function () {
    reviewsFunctions();
});

function reviewsFunctions() {
    reviewsBtnEvents();
    shopsessionid = verifyUser();
    if (!shopsessionid || shopsessionid === 0) {
        returnToTimeOutPage(extension);
    }
    reviewsPageFunctions();
    reviewsSetLink();
}

function reviewsBtnEvents() {

}

function reviewsSetLink() {
    $("#collapseTwo").addClass("show");
    $(".id-reviews").addClass("active");

}
function reviewsPageFunctions() {

    showLoading();

    GetData("Review", "GetUserReviewList", "LoadUserReviewList", shopsessionid);

}

function DisplayUserReviewList(data) {
    hideLoading();

    var reviewParent = $("#reviewsList");
    reviewParent.find(".new-clone").remove();
    console.log(data);
    if (data === "none") {
        reviewParent.text("No Result");
    } else {
        var childclone = reviewParent.find(".shop-product-review-clone");
        var count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("shop-product-review-clone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".shop-product-review-date-time").text(details["date"] + " " + details["time"]);
            newchild.find(".shop-product-review-comment").text(details["comment"]);
            newchild.find(".shop-product-review-name").text(details["reviewUsername"]);
            newchild.find(".shop-product-review-rate_value").text(details["rate_value"]);
            newchild.find(".shop-product-review-p-name").text(details["reviewProductName"]);
            newchild.appendTo(reviewParent).show();
        });
        childclone.hide();
        
        $(".review_count").text(count);
    }
}