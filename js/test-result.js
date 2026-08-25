document.addEventListener("DOMContentLoaded", function () {

    console.log("===== 05 ID TEST RESULT DEBUG =====");

    console.log(
        "resultTitle:",
        document.getElementById("resultTitle")
    );

    console.log(
        "resultMessage:",
        document.getElementById("resultMessage")
    );

    console.log(
        "resultDetails:",
        document.getElementById("resultDetails")
    );

    console.log(
        "backButton:",
        document.getElementById("backButton")
    );

    console.log(
        "Current URL:",
        window.location.href
    );

    console.log(
        "Page title:",
        document.title
    );

    console.log(
        "HTML:",
        document.documentElement.outerHTML
    );

});