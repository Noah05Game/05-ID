document.addEventListener("DOMContentLoaded", async () => {

    const resultTitle = document.getElementById("resultTitle");
    const resultMessage = document.getElementById("resultMessage");
    const resultDetails = document.getElementById("resultDetails");
    const backButton = document.getElementById("backButton");

    const CLIENT_ID = "05id_test_app";

    const REDIRECT_URI =
        "https://id.the05company.com/pages/test-result.html";

    const TOKEN_URL =
        "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-token";


    // ========================================
    // READ CALLBACK PARAMETERS
    // ========================================

    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");
    const returnedState = params.get("state");

    const error = params.get("error");
    const errorDescription = params.get("error_description");


    // ========================================
    // HANDLE OAUTH ERROR
    // ========================================

    if (error) {
        showError(errorDescription || error);
        return;
    }


    // ========================================
    // CHECK AUTHORIZATION CODE
    // ========================================

    if (!code) {
        showError(
            "No authorization code was returned by 05 ID."
        );
        return;
    }


    // ========================================
    // CHECK STATE
    // ========================================

    const storedState =
        sessionStorage.getItem("05id_oauth_state");

    if (
        !storedState ||
        !returnedState ||
        storedState !== returnedState
    ) {
        showError(
            "OAuth state verification failed."
        );
        return;
    }


    // ========================================
    // GET PKCE VERIFIER
    // ========================================

    const verifier =
        sessionStorage.getItem("05id_pkce_verifier");

    if (!verifier) {
        showError(
            "The PKCE verifier could not be found."
        );
        return;
    }


    // ========================================
    // TOKEN EXCHANGE
    // ========================================

    try {

        resultMessage.textContent =
            "Exchanging authorization code...";


        const tokenParams = new URLSearchParams();

        tokenParams.set(
            "grant_type",
            "authorization_code"
        );

        tokenParams.set(
            "client_id",
            CLIENT_ID
        );

        tokenParams.set(
            "redirect_uri",
            REDIRECT_URI
        );

        tokenParams.set(
            "code",
            code
        );

        tokenParams.set(
            "code_verifier",
            verifier
        );


        // ========================================
        // SEND TOKEN REQUEST
        // ========================================

        const response = await fetch(
            TOKEN_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",

                    "apikey":
                        SUPABASE_PUBLISHABLE_KEY
                },

                body:
                    tokenParams.toString()
            }
        );


        // ========================================
        // READ RESPONSE
        // ========================================

        const result = await response.json();


        console.log(
            "05 ID token response:",
            result
        );


        // ========================================
        // CHECK RESPONSE
        // ========================================

        if (!response.ok) {

            throw new Error(
                result.error_description ||
                result.error ||
                "Token exchange failed."
            );
        }


        // ========================================
        // CHECK ACCESS TOKEN
        // ========================================

        if (!result.access_token) {

            throw new Error(
                "05 ID did not return an access token."
            );
        }


        // ========================================
        // SUCCESS
        // ========================================

        resultTitle.textContent =
            "Authentication successful";

        resultMessage.textContent =
            "05 ID successfully authenticated this application.";


        resultDetails.style.display =
            "block";


        resultDetails.innerHTML =
            "<strong>05 ID User</strong><br>" +
            escapeHtml(
                result.user &&
                result.user.name
                    ? result.user.name
                    : "Authenticated user"
            ) +
            "<br><br>" +

            "<strong>User ID</strong><br>" +
            escapeHtml(
                result.user &&
                result.user.id
                    ? result.user.id
                    : "Not returned"
            ) +
            "<br><br>" +

            "<strong>Email</strong><br>" +
            escapeHtml(
                result.user &&
                result.user.email
                    ? result.user.email
                    : "Not returned"
            ) +
            "<br><br>" +

            "<strong>Scope</strong><br>" +
            escapeHtml(
                result.scope || "Not returned"
            ) +
            "<br><br>" +

            "<strong>Token type</strong><br>" +
            escapeHtml(
                result.token_type || "Bearer"
            );


        backButton.style.display =
            "block";


        // ========================================
        // CLEAN UP
        // ========================================

        sessionStorage.removeItem(
            "05id_pkce_verifier"
        );

        sessionStorage.removeItem(
            "05id_oauth_state"
        );


        // ========================================
        // CLEAN URL
        // ========================================

        window.history.replaceState(
            {},
            document.title,
            REDIRECT_URI
        );


    } catch (error) {

        console.error(
            "OAuth token exchange error:",
            error
        );

        showError(
            error.message ||
            "Unable to complete authentication."
        );

    }


    // ========================================
    // ERROR DISPLAY
    // ========================================

    function showError(message) {

        resultTitle.textContent =
            "Authentication failed";

        resultMessage.textContent =
            message;

        resultDetails.style.display =
            "none";

        backButton.style.display =
            "block";
    }


    // ========================================
    // HTML ESCAPING
    // ========================================

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});