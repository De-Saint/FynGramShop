/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    messagesFunctions();
});

function messagesFunctions() {
    messagesBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    messagesPageFunctions();
    messagesSetLink();
}

function messagesBtnEvents() {

}

function messagesSetLink() {
    $("#collapseTwo").addClass("show");
    $(".id-messages").addClass("active");

}
function messagesPageFunctions() {
    var data = [sessionid, "All"];
    showLoading();
    GetData("Messages", "GetMessages", "LoadMessages", data);
}

function DisplayMessages(data, parent) {
    hideLoading();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var childclone = parent.find(".msglist-clone");
        $.each(ids, function (index, id) {
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("msglist-clone");
            newchild.addClass("newclone");
            newchild.removeClass("d-none");
            newchild.find(".msg_subject").text(result["subject"]);
            newchild.find(".msg_body").text(result["body"]);
            newchild.find(".msg_date").text(result["date"] + " " + result["time"]);
            var deletebtn = newchild.find(".delete-msg-btn");
            DisplayToolTip(deletebtn);

            deletebtn.click(function () {
                showLoading();
                var data = [sessionid, result["id"]];
                GetData("Messages", "DeleteMessage", "LoadDeleteMessageInfo", data);
            });
            newchild.appendTo(parent).show();
        });
        childclone.hide();

    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 text-center newclone text-primary", text: "No Result Found"}).appendTo(row);

    }
}

function DisplayDeleteMessageInfo(data, parent) {
    var resp = data[2];
    ShowNotification(resp.msg, resp.status);
    if (resp.status === "success") {
        DisplayMessages(data, parent);
    }
}