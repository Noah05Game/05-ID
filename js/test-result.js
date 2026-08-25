document.addEventListener("DOMContentLoaded", function () {

    console.log("========================================");
    console.log("05 ID TEST RESULT DEBUG");
    console.log("========================================");

    console.log(
        "Current URL:",
        window.location.href
    );

    console.log(
        "Document title:",
        document.title
    );

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
        "config script:",
        document.querySelector(
            'script[src*="config.js"]'
        )
    );

    console.log(
        "test-result scripts:",
        document.querySelectorAll(
            'script[src*="test-result.js"]'
        )
    );

    console.log(
        "Number of resultTitle elements:",
        document.querySelectorAll(
            "#resultTitle"
        ).length
    );

    console.log(
        "Number of resultMessage elements:",
        document.querySelectorAll(
            "#resultMessage"
        ).length
    );

    console.log(
        "========================================"
    );

    console.log(
        "LIVE HTML:"
    );

    console.log(
        document.documentElement.outerHTML
    );

    console.log(
        "========================================"
    );

});