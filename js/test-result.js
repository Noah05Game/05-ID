// ========================================
// 05 ID TEST RESULT
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const resultIcon =
            document.getElementById(
                "resultIcon"
            );

        const resultTitle =
            document.getElementById(
                "resultTitle"
            );

        const resultMessage =
            document.getElementById(
                "resultMessage"
            );

        const resultDetails =
            document.getElementById(
                "resultDetails"
            );

        const returnButton =
            document.getElementById(
                "returnButton"
            );


        // ========================================
        // GET PARAMETERS
        // ========================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const status =
            params.get("status");

        const state =
            params.get("state");

        const error =
            params.get("error");

        const errorDescription =
            params.get("error_description");


        // ========================================
        // VERIFY STATE
        // ========================================

        const savedState =
            sessionStorage.getItem(
                "05id_test_state"
            );


        /*
         * A real authentication system must
         * verify state to prevent CSRF attacks.
         */

        if (
            !state ||
            !savedState ||
            state !== savedState
        ) {

            showFailure(
                "Invalid authentication state."
            );

            return;
        }


        /*
         * State has now been used.
         */

        sessionStorage.removeItem(
            "05id_test_state"
        );


        // ========================================
        // AUTHENTICATION FAILED
        // ========================================

        if (
            status === "failed" ||
            error
        ) {

            showFailure(
                errorDescription ||
                error ||
                "Authentication was unsuccessful."
            );

            return;
        }


        // ========================================
        // AUTHENTICATION CONFIRMED
        // ========================================

        if (
            status === "success"
        ) {

            showSuccess();

            return;
        }


        // ========================================
        // UNKNOWN RESULT
        // ========================================

        showFailure(
            "No valid authentication result was received."
        );


        // ========================================
        // SUCCESS
        // ========================================

        function showSuccess() {

            resultIcon.textContent =
                "✓";

            resultIcon.classList.add(
                "success"
            );

            resultTitle.textContent =
                "Authentication confirmed";

            resultMessage.textContent =
                "Your 05 ID was successfully authenticated.";

            resultDetails.hidden =
                false;

            resultDetails.textContent =
                "The test application received a valid authentication response.";

            returnButton.hidden =
                false;

            returnButton.addEventListener(
                "click",
                returnToTestApp
            );
        }


        // ========================================
        // FAILURE
        // ========================================

        function showFailure(
            message
        ) {

            resultIcon.textContent =
                "!";

            resultIcon.classList.add(
                "error"
            );

            resultTitle.textContent =
                "Authentication failed";

            resultMessage.textContent =
                message;

            resultDetails.hidden =
                false;

            resultDetails.textContent =
                "The test application could not verify your 05 ID.";

            returnButton.hidden =
                false;

            returnButton.addEventListener(
                "click",
                returnToTestApp
            );
        }


        // ========================================
        // RETURN
        // ========================================

        function returnToTestApp() {

            window.location.href =
                "test-app.html";

        }

    }
);