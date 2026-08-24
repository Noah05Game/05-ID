// ========================================
// 05 ID — POLLINATIONS OAUTH CALLBACK
// ========================================
const POLLINATIONS_TOKEN_URL =
    "https://enter.pollinations.ai/api/oauth/token";
document.addEventListener("DOMContentLoaded", async () => {

    const message =
        document.getElementById("callbackMessage");

    const errorElement =
        document.getElementById("callbackError");

    const loading =
        document.getElementById("callbackLoading");

    const backButton =
        document.getElementById("callbackBack");


    try {

        await completePollinationsConnection(
            message,
            errorElement,
            loading,
            backButton
        );


    } catch (error) {

        console.error(
            "Pollinations OAuth callback error:",
            error
        );


        if (message) {

            message.textContent =
                "We couldn't connect your Pollinations account.";

        }


        if (loading) {

            loading.style.display =
                "none";

        }


        if (errorElement) {

            errorElement.textContent =
                error.message ||
                "Unknown error.";

            errorElement.classList.add(
                "visible"
            );

        }


        if (backButton) {

            backButton.style.display =
                "inline-flex";

        }

    }

});


// ========================================
// COMPLETE CONNECTION
// ========================================

async function completePollinationsConnection(
    message,
    errorElement,
    loading,
    backButton
) {


    // ----------------------------------------
    // READ URL
    // ----------------------------------------

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


    console.log(
        "Pollinations callback parameters:",
        {
            hasCode: Boolean(code),
            hasState: Boolean(returnedState),
            oauthError
        }
    );


    // ----------------------------------------
    // POLLINATIONS ERROR
    // ----------------------------------------

    if (oauthError) {

        const description =
            params.get(
                "error_description"
            );


        throw new Error(
            description ||
            `Pollinations returned: ${oauthError}`
        );

    }


    // ----------------------------------------
    // CODE
    // ----------------------------------------

    if (!code) {

        throw new Error(
            "No authorization code was returned by Pollinations."
        );

    }


    // ----------------------------------------
    // STATE
    // ----------------------------------------

    const savedState =
        sessionStorage.getItem(
            "pollinations_oauth_state"
        );


    if (
        !savedState ||
        !returnedState
    ) {

        throw new Error(
            "The OAuth security state is missing. Please start the connection again."
        );

    }


    if (
        savedState !== returnedState
    ) {

        throw new Error(
            "The OAuth security state does not match. Please start the connection again."
        );

    }


    // ----------------------------------------
    // PKCE VERIFIER
    // ----------------------------------------

    const codeVerifier =
        sessionStorage.getItem(
            "pollinations_code_verifier"
        );


    if (!codeVerifier) {

        throw new Error(
            "The OAuth PKCE verifier is missing. Please start the connection again."
        );

    }


    // ----------------------------------------
    // SUPABASE SESSION
    // ----------------------------------------

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        throw new Error(
            "05 ID could not initialise Supabase."
        );

    }


    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        throw new Error(
            `Supabase session error: ${error.message}`
        );

    }


    if (!data.session) {

        throw new Error(
            "Your 05 ID session has expired. Please sign in again."
        );

    }


    console.log(
        "05 ID session found:",
        data.session.user.id
    );


    // ----------------------------------------
    // CONFIG
    // ----------------------------------------

    if (
        typeof POLLINATIONS_CLIENT_ID ===
        "undefined"
    ) {

        throw new Error(
            "Pollinations App Key is not configured in config.js."
        );

    }


    // ----------------------------------------
    // REDIRECT URI
    // ----------------------------------------

    const redirectUri =
        getRedirectUri();


    console.log(
        "Pollinations redirect URI:",
        redirectUri
    );


    // ----------------------------------------
    // TOKEN REQUEST
    // ----------------------------------------

    if (
        typeof POLLINATIONS_TOKEN_URL ===
        "undefined"
    ) {

        throw new Error(
            "Pollinations token endpoint is not configured."
        );

    }


    const body =
        new URLSearchParams({

            grant_type:
                "authorization_code",

            code:

                code,

            client_id:
                POLLINATIONS_CLIENT_ID,

            redirect_uri:
                redirectUri,

            code_verifier:
                codeVerifier

        });


    console.log(
        "Exchanging Pollinations authorization code..."
    );


    const response =
        await fetch(
            POLLINATIONS_TOKEN_URL,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded"

                },

                body:
                    body.toString()

            }
        );


    const responseText =
        await response.text();


    console.log(
        "Pollinations token response:",
        response.status,
        responseText
    );


    let tokenData;


    try {

        tokenData =
            JSON.parse(
                responseText
            );

    } catch {

        throw new Error(
            `Pollinations returned an unexpected response (${response.status}).`
        );

    }


    // ----------------------------------------
    // TOKEN ERROR
    // ----------------------------------------

    if (!response.ok) {

        throw new Error(
            tokenData.error_description ||
            tokenData.error ||
            `Pollinations token exchange failed (${response.status}).`
        );

    }


    // ----------------------------------------
    // ACCESS TOKEN
    // ----------------------------------------

    if (!tokenData.access_token) {

        throw new Error(
            "Pollinations did not return an access token."
        );

    }


    console.log(
        "Pollinations authorization successful."
    );


    // ----------------------------------------
    // SAVE CONNECTION
    // ----------------------------------------

    const user =
        data.session.user;


    const linkedAt =
        new Date().toISOString();


    const expiresAt =
        tokenData.expires_in
            ? new Date(
                Date.now() +
                (
                    tokenData.expires_in *
                    1000
                )
            ).toISOString()
            : null;


    const {
        error: insertError
    } =
        await supabaseClient
            .from("linked_services")
            .upsert(
                {

                    user_id:
                        user.id,

                    service:
                        "pollinations",

                    access_token:
                        tokenData.access_token,

                    linked_at:
                        linkedAt,

                    expires_at:
                        expiresAt

                },
                {
                    onConflict:
                        "user_id,service"
                }
            );


    if (insertError) {

        throw new Error(
            `Unable to save Pollinations connection: ${insertError.message}`
        );

    }


    // ----------------------------------------
    // CLEAN UP
    // ----------------------------------------

    sessionStorage.removeItem(
        "pollinations_oauth_state"
    );

    sessionStorage.removeItem(
        "pollinations_code_verifier"
    );


    // ----------------------------------------
    // SUCCESS
    // ----------------------------------------

    if (loading) {

        loading.style.display =
            "none";

    }


    if (message) {

        message.textContent =
            "Pollinations connected successfully.";

    }


    setTimeout(
        () => {

            window.location.href =
                "dashboard.html";

        },
        1000
    );

}


// ========================================
// REDIRECT URI
// ========================================

function getRedirectUri() {

    return (
        window.location.origin +
        "/pages/pollinations-callback.html"
    );

}