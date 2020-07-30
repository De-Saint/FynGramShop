/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = "../../../../";
var sessionid, sessiontype;
$(document).ready(function () {
    addressFunctions();
});

function addressFunctions() {
    addressBtnEvents();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    addressPageFunctions();
    addressSetLink();
}

function addressBtnEvents() {
    $('#addresstypes').select2({
        placeholder: "Select Address Type"
    });
    $('#states').select2({
        placeholder: "Select States"
    });
    $('#lgas').select2({
        placeholder: "Select LGA"
    });
    $('#towns').select2({
        tags: true,
        placeholder: "Select Towns"
    });
    $('#busstops').select2({
        tags: true,
        placeholder: "Select Bus Stop"
    });
    $('#streets').select2({
        tags: true,
        placeholder: "Select Street"
    });

    $(".btn-add-busstop").click(function () {
        var newStateVal = $(".txt-add-busstop").val();
        // Set the value, creating a new option if necessary
        if ($("#busstops").find("option[value='" + newStateVal + "']").length) {
            $("#busstops").val(newStateVal).trigger("change");
            $(".txt-add-busstop").val("");
        } else {
            // Create the DOM option that is pre-selected by default
            var newState = new Option(newStateVal, newStateVal, true, true);
            // Append it to the select
            $("#busstops").append(newState).trigger('change');
            $(".txt-add-busstop").val("");
        }
    });
    $(".btn-add-street").click(function () {
        var newStateVal = $(".txt-add-street").val();
        // Set the value, creating a new option if necessary
        if ($("#streets").find("option[value='" + newStateVal + "']").length) {
            $("#streets").val(newStateVal).trigger("change");
            $(".txt-add-street").val("");
        } else {
            // Create the DOM option that is pre-selected by default
            var newState = new Option(newStateVal, newStateVal, true, true);
            // Append it to the select
            $("#streets").append(newState).trigger('change');
            $(".txt-add-street").val("");
        }
    });



    $("form[name=addAddressForm]").submit(function (e) {
        var addresstypes = $("#addresstypes").val();
        var states = $("#states").val();
        var lgas = $("#lgas").val();
        var towns = $("#towns").val();
        var busstops = $("#busstops").val();
        var streets = $("#streets").val();
        var add_closeto = $("#add_closeto").val();
        var add_postal_code = $("#add_postal_code").val();
        var add_addressline = $("#add_addressline").val();
        var add_makedefault = $("#add_makedefault").val();
        var add_phone_line = $("#add_phone_line").val();
        var data = [sessionid, addresstypes, states, lgas, towns, busstops, streets, add_closeto, add_postal_code, add_addressline, add_makedefault, add_phone_line];
        showLoading();
        $(".mini_cart_close").click();
        GetData("Address", "AddNewAddress", "LoadUserAddressesInfo", data);
        e.preventDefault();
    });



}

function addressSetLink() {
    $("#collapseTwo").addClass("show");
    $(".id-address").addClass("active");

}
function addressPageFunctions() {
    GetData("Address", "GetAddressTypes", "LoadAddressTypes", "");
    GetData("Address", "GetStates", "LoadStates", "");
    showLoading();
    GetData("Address", "GetUserAddresses", "LoadUserAddresses", sessionid);
}


function DisplayAddressTypes(data) {
    var cs = $("#addresstypes");
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Address Type"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));

        });
    }
}
function DisplayStates(data) {
    var cs = $("#states");
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select State"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
        cs.change('#states', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Address", "GetLGAs", "LoadLGAs", id);
        });
    }
}

function DisplayLGAs(data) {
    console.log(data);
    var cs = $("#lgas");
    cs.empty();
    $("#towns").empty();
    $("#busstops").empty();
    $("#streets").empty();
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.append($('<option/>').val(0).text("Select LGA"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
        cs.change('#lgas', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Address", "GetTowns", "LoadTowns", id);
        });
    }
}

function DisplayTowns(data) {
    var cs = $("#towns");
    cs.empty();
    $("#busstops").empty();
    $("#streets").empty();
    if (data === "none") {
        cs.text("No Result");
    } else {
        var ids = data[0];
        var result = data[1];

        cs.append($('<option/>').val(0).text("Select Town"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
        cs.change('#towns', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Address", "GetBusStops", "LoadBusStops", id);
        });
    }
}


function DisplayBusStops(data) {
    var cs = $("#busstops");
    cs.empty();
    $("#streets").empty();
    if (data === "none") {
    } else {
        var ids = data[0];
        var result = data[1];
        cs.append($('<option/>').val(0).text("Select Bus Stop"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });

        cs.change('select2:select', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Address", "GetStreets", "LoadStreets", id);
            $(".add_busstop").addClass("d-none");
        });
    }
}
function DisplayStreets(data) {
    var cs = $("#streets");
    cs.empty();
    if (data === "none") {
    } else {
        var ids = data[0];
        var result = data[1];
        cs.append($('<option/>').val(0).text("Select Street"));

        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));

        });
        cs.change('select2:select', function () {
            $(".add_street").addClass("d-none");
        });
    }
}

function DisplayUserAddressesInfo(data) {
    var resp = data[2];
    var parent = $(".AddressList");
    ShowNotification(resp.msg, resp.status);
    if (resp.status === "success") {
        DisplayUserAddresses(data, parent);
    }
}



function DisplayUserAddresses(data, parent) {
//    alert(data);
    hideLoading();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var childclone = parent.find(".addresslist-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("addresslist-clone");
            newchild.addClass("newclone");
            newchild.find(".addresstypename").text(result["addresstypename"] + " Address");
            newchild.find(".addressuserphone").text(result["phone"]);
            newchild.find(".addressusername").text(result["addressusername"]);
            newchild.find(".addressfulladress").text(result["full_address"]);
            var makedefault = newchild.find(".btn_makedefault_address");
            DisplayToolTip(makedefault);
            var default_address = result["default_address"];
            if (parseInt(default_address) === 1) {
                makedefault.addClass("d-none");
                newchild.find(".address_container").addClass("border border-success");
            } else if (parseInt(default_address) === 0) {
                makedefault.removeClass("d-none");
                newchild.find(".address_container").removeClass("border border-success");
            }
            var deletebtn = newchild.find(".btn_delete_ddress").click(function () {
                if (parseInt(default_address) === 1) {
                    ShowNotification("You have to make another address the default address before deleting this address.", "error");
                    return false;
                }
                showLoading();
                var data = [sessionid, result["id"]];
                GetData("Address", "DeleteUserAddresses", "LoadUserAddressesInfo", data);
            });
            DisplayToolTip(deletebtn);

            makedefault.click(function () {
                showLoading();
                var data = [sessionid, result["id"]];
                GetData("Address", "MakeUserAddressDefault", "LoadUserAddressesInfo", data);
            });
            newchild.appendTo(parent).show();
        });
        childclone.hide();

    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 text-center newclone text-primary", text: "No Result Found"}).appendTo(row);

    }
}