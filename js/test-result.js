javascript
// ========================================
// 05 ID TEST RESULT
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "========================================"
        );

        console.log(
            "05 ID TEST RESULT LOADED"
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
                "05 ID: Required result page element is missing."
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


        const USERINFO_URL =
            "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-userinfo";


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
                codeExists:
                    !!code,

                returnedState,

                oauthError,

                errorDescription
            }
        );


        // ========================================
        // OAUTH ERROR
        // ========================================

        if (
            oauthError
        ) {

            showFailure(
                errorDescription ||
                oauthError
            );

            return;

        }


        // ========================================
        // CHECK CODE
        // ========================================

        if (
            !code
        ) {

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


        console.log(
            "OAuth state:",
            {
                storedState,
                returnedState
            }
        );


        if (
            !storedState
        ) {

            showFailure(
                "No OAuth state was found in this browser session."
            );

            return;

        }


        if (
            !returnedState
        ) {

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
        // PKCE VERIFIER
        // ========================================

        const verifier =
            sessionStorage.getItem(
                "05id_pkce_verifier"
            );


        console.log(
            "PKCE verifier exists:",
            !!verifier
        );


        if (
            !verifier
        ) {

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


            const tokenResponse =
                await fetch(
                    TOKEN_URL,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded",

                            "apikey":
                                typeof SUPABASE_PUBLISHABLE_KEY !==
                                    "undefined"
                                    ? SUPABASE_PUBLISHABLE_KEY
                                    : ""
                        },

                        body:
                            formData.toString()
                    }
                );


            console.log(
                "Token response status:",
                tokenResponse.status
            );


            const tokenText =
                await tokenResponse.text();


            console.log(
                "Token response:",
                tokenText
            );


            let tokenResult;


            try {

                tokenResult =
                    JSON.parse(
                        tokenText
                    );

            } catch {

                throw new Error(
                    "05 ID returned an invalid token response."
                );

            }


            if (
                !tokenResponse.ok
            ) {

                throw new Error(
                    tokenResult.error_description ||
                    tokenResult.error ||
                    "Token exchange failed."
                );

            }


            if (
                !tokenResult.access_token
            ) {

                throw new Error(
                    "05 ID did not return an access token."
                );

            }


            console.log(
                "Access token received."
            );


            console.log(
                "Access token format valid:",
                tokenResult.access_token.startsWith(
                    "05id_"
                )
            );


            // ========================================
            // USERINFO REQUEST
            // ========================================

            resultMessage.textContent =
                "Retrieving your 05 ID information...";


            console.log(
                "========================================"
            );

            console.log(
                "05 ID USERINFO REQUEST"
            );

            console.log(
                "========================================"
            );


            console.log(
                "UserInfo URL:",
                USERINFO_URL
            );


            console.log(
                "Access token exists:",
                !!tokenResult.access_token
            );


            console.log(
                "Access token starts with 05id_:",
                tokenResult.access_token.startsWith(
                    "05id_"
                )
            );


            const userInfoResponse =
                await fetch(
                    USERINFO_URL,
                    {
                        method:
                            "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${tokenResult.access_token}`,

                            "apikey":
                                typeof SUPABASE_PUBLISHABLE_KEY !==
                                    "undefined"
                                    ? SUPABASE_PUBLISHABLE_KEY
                                    : "",

                            "Accept":
                                "application/json"
                        }
                    }
                );


            // ========================================
            // USERINFO RESPONSE
            // ========================================

            console.log(
                "UserInfo response status:",
                userInfoResponse.status
            );


            console.log(
                "UserInfo response OK:",
                userInfoResponse.ok
            );


            const userInfoText =
                await userInfoResponse.text();


            console.log(
                "UserInfo raw response:",
                userInfoText
            );


            let userInfoResult =
                null;


            try {

                userInfoResult =
                    JSON.parse(
                        userInfoText
                    );

            } catch {

                console.error(
                    "UserInfo response was not JSON."
                );

            }


            console.log(
                "UserInfo parsed response:",
                userInfoResult
            );


            // ========================================
            // USERINFO ERROR
            // ========================================

            if (
                !userInfoResponse.ok
            ) {

                const userInfoError =
                    userInfoResult?.error_description ||
                    userInfoResult?.error ||
                    userInfoResult?.message ||
                    userInfoText ||
                    `HTTP ${userInfoResponse.status}`;


                console.error(
                    "========================================"
                );

                console.error(
                    "05 ID USERINFO ERROR"
                );

                console.error(
                    "Status:",
                    userInfoResponse.status
                );

                console.error(
                    "Response:",
                    userInfoText
                );

                console.error(
                    "========================================"
                );


                throw new Error(
                    `Userinfo failed (${userInfoResponse.status}): ${userInfoError}`
                );

            }


            // ========================================
            // USERINFO SUCCESS
            // ========================================

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


            // ========================================
            // SUCCESS PAGE
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
                    userInfoResult.name ||
                    tokenResult.user?.name ||
                    "Authenticated user"
                )}

                <br><br>

                <strong>User ID</strong><br>

                ${escapeHtml(
                    userInfoResult.sub ||
                    tokenResult.user?.id ||
                    "Not returned"
                )}

                <br><br>

                <strong>Email</strong><br>

                ${escapeHtml(
                    userInfoResult.email ||
                    tokenResult.user?.email ||
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
                error?.message ||
                "Unable to complete authentication."
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


            if (
                resultTitle
            ) {

                resultTitle.textContent =
                    "Authentication failed";

            }


            if (
                resultMessage
            ) {

                resultMessage.textContent =
                    message;

            }


            if (
                resultDetails
            ) {

                resultDetails.style.display =
                    "none";

            }


            if (
                backButton
            ) {

                backButton.style.display =
                    "block";

            }

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

