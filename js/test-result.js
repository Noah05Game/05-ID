document.addEventListener(
"DOMContentLoaded",
async function () {


    console.log(
        "========================================"
    );

    console.log(
        "05 ID TEST RESULT"
    );

    console.log(
        "========================================"
    );


    // ========================================
    // ELEMENTS
    // ========================================

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

    const backButton =
        document.getElementById(
            "backButton"
        );


    console.log(
        "Result elements:",
        {
            resultTitle,
            resultMessage,
            resultDetails,
            backButton
        }
    );


    // ========================================
    // ELEMENT CHECK
    // ========================================

    if (
        !resultTitle ||
        !resultMessage ||
        !resultDetails ||
        !backButton
    ) {

        console.error(
            "05 ID RESULT PAGE: Required HTML element is missing."
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
    // READ CALLBACK
    // ========================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const code =
        params.get(
            "code"
        );

    const returnedState =
        params.get(
            "state"
        );

    const oauthError =
        params.get(
            "error"
        );

    const errorDescription =
        params.get(
            "error_description"
        );


    console.log(
        "OAuth callback:",
        {
            code,
            returnedState,
            oauthError,
            errorDescription
        }
    );


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
        sessionStorage.getItem(
            "05id_oauth_state"
        );


    console.log(
        "OAuth state:",
        {
            storedState,
            returnedState
        }
    );


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


    if (
        storedState !==
        returnedState
    ) {

        showFailure(
            "OAuth state verification failed."
        );

        return;

    }


    // ========================================
    // GET PKCE VERIFIER
    // ========================================

    const verifier =
        sessionStorage.getItem(
            "05id_pkce_verifier"
        );


    console.log(
        "PKCE verifier exists:",
        !!verifier
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


        // ========================================
        // TOKEN REQUEST
        // ========================================

        const tokenResponse =
            await fetch(
                TOKEN_URL,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        formData.toString()
                }
            );


        console.log(
            "Token response status:",
            tokenResponse.status
        );


        const tokenResponseText =
            await tokenResponse.text();


        console.log(
            "Token response:",
            tokenResponseText
        );


        let tokenResult;


        try {

            tokenResult =
                JSON.parse(
                    tokenResponseText
                );

        } catch {

            throw new Error(
                "05 ID returned an invalid token response."
            );

        }


        // ========================================
        // TOKEN ERROR
        // ========================================

        if (
            !tokenResponse.ok
        ) {

            throw new Error(
                tokenResult.error_description ||
                tokenResult.error ||
                "Token exchange failed."
            );

        }


        // ========================================
        // CHECK ACCESS TOKEN
        // ========================================

        if (
            !tokenResult.access_token
        ) {

            throw new Error(
                "05 ID did not return an access token."
            );

        }


        // ========================================
        // GET USER FROM TOKEN RESPONSE
        // ========================================

        const authenticatedUser =
            tokenResult.user;


        if (
            !authenticatedUser
        ) {

            throw new Error(
                "05 ID did not return authenticated user information."
            );

        }


        console.log(
            "Authenticated 05 ID user:",
            authenticatedUser
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


        resultDetails.innerHTML = `

            <strong>05 ID User</strong><br>

            ${escapeHtml(
                authenticatedUser.name ||
                "05 ID User"
            )}

            <br><br>

            <strong>User ID</strong><br>

            ${escapeHtml(
                authenticatedUser.id ||
                "Not returned"
            )}

            <br><br>

            <strong>Email</strong><br>

            ${escapeHtml(
                authenticatedUser.email ||
                "Not returned"
            )}

            <br><br>

            <strong>Scope</strong><br>

            ${escapeHtml(
                tokenResult.scope ||
                "Not returned"
            )}

            <br><br>

            <strong>Token type</strong><br>

            ${escapeHtml(
                tokenResult.token_type ||
                "Bearer"
            )}

            <br><br>

            <strong>Expires in</strong><br>

            ${escapeHtml(
                String(
                    tokenResult.expires_in ||
                    "Not returned"
                )
            )} seconds

        `;


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
        // REMOVE OAUTH PARAMETERS
        // ========================================

        window.history.replaceState(
            {},
            document.title,
            REDIRECT_URI
        );


        console.log(
            "05 ID authentication completed successfully."
        );


    } catch (error) {

        console.error(
            "OAuth token exchange error:",
            error
        );


        showFailure(
            error instanceof Error
                ? error.message
                : "Unable to complete authentication."
        );

    }


    // ========================================
    // FAILURE
    // ========================================

    function showFailure(
        message
    ) {

        console.error(
            "05 ID authentication failed:",
            message
        );


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

    function escapeHtml(
        value
    ) {

        return String(
            value
        )
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

}


);
