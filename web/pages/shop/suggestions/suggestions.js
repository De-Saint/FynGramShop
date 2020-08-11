/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "";
var shopsessionid = "";
$(document).ready(function () {
    suggestionFunctions();
});

function suggestionFunctions() {
    suggestionsBtnEvents();
    suggestionPageFunctions();
    shopsessionid = verifyUser();
}

function suggestionsBtnEvents() {
    $("form[name=suggestionForm]").submit(function (e) {
        var featName = $("#featName").val();
        var featEmail = $("#featEmail").val();
        var featSuggestion = $("#featSuggestion").val();
        var data = [featName, featEmail, featSuggestion];
        showLoading();
        GetData("User", "NewFeatureRequest", "LoadNewFeatureRequest", data);
        $("#featSuggestion").val("");
        $("#featName").val("");
        $("#featEmail").val("");
        e.preventDefault();
    });
}

function suggestionPageFunctions() {

}

function DisplaySaveSuggestion(resp) {
    hideLoading();
    ShowNotification(resp.msg, resp.status);
}