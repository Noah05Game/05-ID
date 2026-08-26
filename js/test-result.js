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


            console.log(
                "Access token received successfully."
            );


            // ========================================
            // USERINFO REQUEST
            // ========================================

            resultMessage.textContent =
                "Retrieving your 05 ID profile...";


            console.log(
                "Requesting user information from 05 ID..."
            );


            const userInfoResponse =
                await fetch(
                    USERINFO_URL,
                    {
                        method:
                            "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${tokenResult.access_token}`
                        }
                    }
                );


            console.log(
                "Userinfo response status:",
                userInfoResponse.status
            );


            const userInfoResponseText =
                await userInfoResponse.text();


            console.log(
                "Userinfo response:",
                userInfoResponseText
            );


            let userInfo;


            try {

                userInfo =
                    JSON.parse(
                        userInfoResponseText
                    );

            } catch {

                throw new Error(
                    "05 ID returned an invalid userinfo response."
                );

            }


            // ========================================
            // USERINFO ERROR
            // ========================================

            if (
                !userInfoResponse.ok
            ) {

                throw new Error(
                    userInfo.error_description ||
                    userInfo.error ||
                    "Unable to retrieve 05 ID user information."
                );

            }


            // ========================================
            // CHECK SUBJECT
            // ========================================

            if (
                !userInfo.sub
            ) {

                throw new Error(
                    "05 ID userinfo response did not contain a subject."
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


            resultDetails.innerHTML = `

                <strong>05 ID Userinfo</strong><br>

                User information successfully retrieved from
                the 05 ID userinfo endpoint.

                <br><br>

                <strong>Subject</strong><br>

                ${escapeHtml(
                    userInfo.sub
                )}

                <br><br>

                <strong>Name</strong><br>

                ${escapeHtml(
                    userInfo.name ||
                    "Not returned"
                )}

                <br><br>

                <strong>Email</strong><br>

                ${escapeHtml(
                    userInfo.email ||
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
                "========================================"
            );

            console.log(
                "05 ID OAUTH + USERINFO TEST SUCCESSFUL"
            );

            console.log(
                "========================================"
            );


        } catch (error) {

            console.error(
                "OAuth test error:",
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

