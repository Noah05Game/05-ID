document.addEventListener("DOMContentLoaded", async function () {


console.log("05 ID test-result.js loaded");

// ========================================
// ELEMENTS
// ========================================

const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const resultDetails = document.getElementById("resultDetails");
const backButton = document.getElementById("backButton");

console.log("Result elements:", {
    resultTitle,
    resultMessage,
    resultDetails,
    backButton
});

// ========================================
// ELEMENT CHECK
// ========================================

if (!resultTitle || !resultMessage || !resultDetails || !backButton) {
    console.error("05 ID RESULT PAGE: Required HTML element is missing.");
    return;
}

// ========================================
// CONFIGURATION
// ========================================

const CLIENT_ID = "05id_test_app";

const REDIRECT_URI =
    "https://id.the05company.com/pages/test-result.html";

const TOKEN_URL =
    "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-token";

// ========================================
// READ URL PARAMETERS
// ========================================

const params = new URLSearchParams(window.location.search);

const code = params.get("code");
const returnedState = params.get("state");

const oauthError = params.get("error");
const errorDescription = params.get("error_description");

console.log("OAuth callback:", {
    code,
    returnedState,
    oauthError,
    errorDescription
});

// ========================================
// ERROR FROM 05 ID
// ========================================

if (oauthError) {
    showFailure(errorDescription || oauthError);
    return;
}

// ========================================
// CHECK CODE
// ========================================

if (!code) {
    showFailure(
        "No authorization code was returned by 05 ID."
    );
    return;
}

// ========================================
// CHECK STATE
// ========================================

const storedState =
    sessionStorage.getItem("05id_oauth_state");

console.log("OAuth state:", {
    storedState,
    returnedState
});

if (!storedState) {
    showFailure(
        "No OAuth state was found in this browser session."
    );
    return;
}

if (!returnedState) {
    showFailure(
        "No OAuth state was returned by 05 ID."
    );
    return;
}

if (storedState !== returnedState) {
    showFailure(
        "OAuth state verification failed."
    );
    return;
}

// ========================================
// GET PKCE VERIFIER
// ========================================

const verifier =
    sessionStorage.getItem("05id_pkce_verifier");

console.log(
    "PKCE verifier exists:",
    Boolean(verifier)
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

    const formData =
        new URLSearchParams();

    formData.set(
        "grant_type",
        "authorization_code"
    );

    formData.set(
        "client_id",
        CLIENT_ID
    );

    formData.set(
        "redirect_uri",
        REDIRECT_URI
    );

    formData.set(
        "code",
        code
    );

    formData.set(
        "code_verifier",
        verifier
    );

    console.log(
        "Sending authorization code to 05 ID token endpoint..."
    );

    const headers = {
        "Content-Type":
            "application/x-www-form-urlencoded"
    };

    if (
        typeof SUPABASE_PUBLISHABLE_KEY !==
        "undefined"
    ) {
        headers["apikey"] =
            SUPABASE_PUBLISHABLE_KEY;
    }

    const response =
        await fetch(
            TOKEN_URL,
            {
                method: "POST",
                headers: headers,
                body: formData.toString()
            }
        );

    console.log(
        "Token response status:",
        response.status
    );

    const responseText =
        await response.text();

    console.log(
        "Token response:",
        responseText
    );

    let result;

    try {

        result =
            JSON.parse(responseText);

    } catch {

        throw new Error(
            "05 ID returned an invalid token response."
        );

    }

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
            result.user?.name ||
            "Authenticated user"
        ) +
        "<br><br>" +

        "<strong>User ID</strong><br>" +
        escapeHtml(
            result.user?.id ||
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
    // CLEAN SESSION
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

    showFailure(
        error.message ||
        "Unable to complete authentication."
    );

}

// ========================================
// FAILURE
// ========================================

function showFailure(message) {

    console.error(
        "05 ID authentication failed:",
        message
    );

    if (resultTitle) {
        resultTitle.textContent =
            "Authentication failed";
    }

    if (resultMessage) {
        resultMessage.textContent =
            message;
    }

    if (resultDetails) {
        resultDetails.style.display =
            "none";
    }

    if (backButton) {
        backButton.style.display =
            "block";
    }
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
