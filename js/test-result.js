document.addEventListener("DOMContentLoaded", async function () {

```
const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const resultDetails =
    document.getElementById("resultDetails");

const backButton =
    document.getElementById("backButton");


// ========================================
// CHECK PAGE ELEMENTS
// ========================================

if (
    !resultTitle ||
    !resultMessage ||
    !resultDetails ||
    !backButton
) {
    console.error(
        "05 ID test-result.html is missing required elements."
    );

    return;
}


// ========================================
// CONFIGURATION
// ========================================

const CLIENT_ID =
    "05id_test_app";

const REDIRECT_URI =
    "https://id.the05company.com/pages/test-result.html";

const TOKEN_URL =
    "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-token";


// ========================================
// READ URL
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const code =
    params.get("code");

const returnedState =
    params.get("state");

const oauthError =
    params.get("error");

const errorDescription =
    params.get("error_description");


// ========================================
// OAUTH ERROR
// ========================================

if (oauthError) {

    showFailure(
        errorDescription ||
        oauthError
    );

    return;
}


// ========================================
// CODE
// ========================================

if (!code) {

    showFailure(
        "No authorization code was returned by 05 ID."
    );

    return;
}


// ========================================
// STATE
// ========================================

const storedState =
    sessionStorage.getItem(
        "05id_oauth_state"
    );

if (
    !storedState ||
    !returnedState ||
    storedState !== returnedState
) {

    showFailure(
        "OAuth state verification failed."
    );

    return;
}


// ========================================
// PKCE VERIFIER
// ========================================

const verifier =
    sessionStorage.getItem(
        "05id_pkce_verifier"
    );

if (!verifier) {

    showFailure(
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


    const tokenParams =
        new URLSearchParams();


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
    // SEND REQUEST
    // ========================================

    const response =
        await fetch(
            TOKEN_URL,
            {
                method:
                    "POST",

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
    // RESPONSE
    // ========================================

    const result =
        await response.json();


    console.log(
        "05 ID OAuth token response:",
        result
    );


    // ========================================
    // TOKEN ERROR
    // ========================================

    if (!response.ok) {

        throw new Error(
            result.error_description ||
            result.error ||
            "Token exchange failed."
        );
    }


    // ========================================
    // ACCESS TOKEN
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


    const user =
        result.user || {};


    resultDetails.innerHTML =
        "<strong>05 ID User</strong><br>" +
        escapeHtml(
            user.name ||
            "Authenticated user"
        ) +

        "<br><br>" +

        "<strong>User ID</strong><br>" +
        escapeHtml(
            user.id ||
            "Not returned"
        ) +

        "<br><br>" +

        "<strong>Email</strong><br>" +
        escapeHtml(
            user.email ||
            "Not returned"
        ) +

        "<br><br>" +

        "<strong>Scope</strong><br>" +
        escapeHtml(
            result.scope ||
            "Not returned"
        ) +

        "<br><br>" +

        "<strong>Token type</strong><br>" +
        escapeHtml(
            result.token_type ||
            "Bearer"
        );


    backButton.style.display =
        "block";


    // ========================================
    // CLEAN SESSION STORAGE
    // ========================================

    sessionStorage.removeItem(
        "05id_pkce_verifier"
    );

    sessionStorage.removeItem(
        "05id_oauth_state"
    );


    // ========================================
    // REMOVE CODE FROM URL
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

    showFailure(
        error.message ||
        "Unable to complete authentication."
    );

}


// ========================================
// FAILURE
// ========================================

function showFailure(message) {

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
// HTML ESCAPE
// ========================================

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
```

});
