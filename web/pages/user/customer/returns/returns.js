/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var shopsessionid, sessiontype;
$(document).ready(function () {
    returnsFunctions();
});

function returnsFunctions() {
    returnsBtnEvents();
    shopsessionid = verifyUser();
    if (!shopsessionid || shopsessionid === 0) {
        returnToTimeOutPage(extension);
    }
    returnsPageFunctions();
    returnsSetLink();
}

function returnsBtnEvents() {

}

function returnsSetLink() {
    $("#collapseFour").addClass("show");
    $(".id-returns").addClass("active");

}
function returnsPageFunctions() {
    showLoading();
    GetData("Stock", "GetStockMovement", "LoadStockMovement", shopsessionid);
}




function DisplayStockMovement(data) {
    hideLoading();
    var parent = $(".StockList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var totalretuned = 0;
        var totalpurchased = 0;
        var count = 0;
        var childclone = parent.find(".stock-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("stock-clone");
            newchild.addClass("newclone");
            newchild.find(".stock-sn").text(count);
           newchild.find(".stock-name").text(result["name"]);
            newchild.find(".stock-product-name").text(result["ProductName"]);
            newchild.find(".stock-order-qty").text(result["product_quantity"]);
            newchild.find(".stock-date").text(result["date"]);
            newchild.find(".stock-time").text(result["time"]);
            newchild.appendTo(parent).show();
        });
        $(".stock-total-count").text(totalcount);
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "ml-9 text-center newclone text-primary", colspan: "10", text: "No Result Found"}).appendTo(row);
    }
}