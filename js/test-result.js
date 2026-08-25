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
// TEST OAUTH USERINFO
// ========================================

resultMessage.textContent =
    "Verifying access token...";

const userInfoResponse =
    await fetch(
        "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-userinfo",
        {
            method: "GET",

            headers: {
                "Authorization":
                    `Bearer ${result.access_token}`,

                "apikey":
                    typeof SUPABASE_PUBLISHABLE_KEY !==
                        "undefined"
                        ? SUPABASE_PUBLISHABLE_KEY
                        : ""
            }
        }
    );


const userInfoText =
    await userInfoResponse.text();


let userInfo;

try {

    userInfo =
        JSON.parse(
            userInfoText
        );

} catch {

    throw new Error(
        "05 ID returned an invalid userinfo response."
    );

}


if (!userInfoResponse.ok) {

    console.error(
        "05 ID USERINFO ERROR:",
        {
            status: userInfoResponse.status,
            response: userInfo
        }
    );

    javascript
// ========================================
// 05 ID USERINFO
// ========================================

const USERINFO_URL =
    "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-userinfo";


console.log(
    "========================================"
);

console.log(
    "05 ID USERINFO REQUEST"
);

console.log(
    "Access token exists:",
    !!result.access_token
);

console.log(
    "Access token starts with 05id_:",
    result.access_token?.startsWith("05id_")
);

console.log(
    "========================================"
);


const userInfoResponse =
    await fetch(
        USERINFO_URL,
        {
            method:
                "GET",

            headers: {
                "Authorization":
                    `Bearer ${result.access_token}`,

                "apikey":
                    SUPABASE_PUBLISHABLE_KEY,

                "Accept":
                    "application/json"
            }
        }
    );


console.log(
    "USERINFO HTTP STATUS:",
    userInfoResponse.status
);


console.log(
    "USERINFO HTTP OK:",
    userInfoResponse.ok
);


console.log(
    "USERINFO RESPONSE HEADERS:",
    Object.fromEntries(
        userInfoResponse.headers.entries()
    )
);


const userInfoText =
    await userInfoResponse.text();


console.log(
    "USERINFO RAW RESPONSE:",
    userInfoText
);


let userInfoResult = null;


try {

    userInfoResult =
        JSON.parse(
            userInfoText
        );

} catch (parseError) {

    console.error(
        "USERINFO JSON PARSE ERROR:",
        parseError
    );

}


console.log(
    "USERINFO PARSED RESPONSE:",
    userInfoResult
);


if (
    !userInfoResponse.ok
) {

    const errorDescription =
        userInfoResult?.error_description ||
        userInfoResult?.message ||
        userInfoResult?.error ||
        userInfoText ||
        `HTTP ${userInfoResponse.status}`;


    console.error(
        "========================================"
    );

    console.error(
        "05 ID USERINFO FAILED"
    );

    console.error(
        "HTTP status:",
        userInfoResponse.status
    );

    console.error(
        "Response:",
        userInfoText
    );

    console.error(
        "Parsed:",
        userInfoResult
    );

    console.error(
        "========================================"
    );


    throw new Error(
        `Userinfo failed (${userInfoResponse.status}): ${errorDescription}`
    );

}


console.log(
    "========================================"
);

console.log(
    "05 ID USERINFO SUCCESS"
);

console.log(
    userInfoResult
);

console.log(
    "========================================"
);



}


console.log(
    "05 ID USERINFO:",
    userInfo
);
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
