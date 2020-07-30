/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "";
$(document).ready(function () {
    categoryFunctions();
});

function categoryFunctions() {
    categoryBtnEvents();
    categoryPageFunctions();

}


function categoryBtnEvents() {
    // with jQuery
    var $grid = $('.grid').imagesLoaded(function () {
        $grid.masonry({
            itemSelector: '.grid-item',
            percentPosition: true,
            gutter: 20,
            columnWidth: '.grid-sizer'
        });
    });
//    $('.grid').masonry({
//        itemSelector: '.grid-item',
//        columnWidth: '.grid-sizer',
//        percentPosition: true,
//        layoutItems: 'grid-items'
//    });
}
function categoryPageFunctions() {
    GetData("Category", "GetAllLevelCategories", "LoadAllLevelCategories", "");

}


function DisplayAllLevelCategories(data) {
    var parent = $(".callategorylist");
    parent.find(".catnewclone").remove();
    var List = data[0];
    var CatIDs = data[1];
    var SubCatIDs = data[2];
    if (data === "none") {
        parent.text("No Result");
    } else {
//-------------------TOp Categery Start----------------------//
        var childclone = parent.find(".allcategory-clone");
        $.each(List, function (topcatid, details) {
            var newchild = childclone.clone();
            newchild.removeClass("allcategory-clone");
            newchild.removeClass("d-none");
            newchild.find(".allcat-name").text(capitaliseFirstLetter(details["name"])).
                    click(function () {
                        localStorage.setItem("categoryid", details["id"]);
                        window.location = extension + "LinksServlet?type=Products";
                    });

//            //-------------------Categery Start----------------------//
            var Categories = CatIDs[topcatid];
            var catParent = newchild.find(".allparcategorylist");
            var catclone = catParent.find(".allparcategory-clone");
            $.each(Categories, function (cid, catdetails) {
                var catchild = catclone.clone();
                var catid = catdetails["id"];
                catchild.removeClass("parcategory-clone");
                catchild.removeClass("d-none");
                catchild.find(".allparcat-name").text(capitaliseFirstLetter(catdetails["name"])).
                        click(function () {
                            localStorage.setItem("categoryid", catid);
                            window.location = extension + "LinksServlet?type=Products";
                        });

////                //-------------------Sub Categery Start----------------------//
                var SubCategories = SubCatIDs[catid];

                var subcatParent = catchild.find(".allsubcategorylist");
                var subcatclone = subcatParent.find(".allsubcategory-clone");
                $.each(SubCategories, function (sid, subcatdetails) {
                    var subid = subcatdetails["id"];
                    var subcatchild = subcatclone.clone();
                    subcatchild.addClass("allsubcategory-clone");
                    subcatchild.removeClass("d-none");
                    subcatchild.find(".allsubcat-name").text(capitaliseFirstLetter(subcatdetails["name"])).
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