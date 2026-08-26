// ========================================
// 05 ID AUTHORIZATION / ACCOUNT SELECTION
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "========================================"
        );

        console.log(
            "05 ID ACCOUNT SELECTION"
        );

        console.log(
            "========================================"
        );


        // ========================================
        // ELEMENTS
        // ========================================

        const appName =
            document.getElementById(
                "appName"
            );

        const accountName =
            document.getElementById(
                "accountName"
            );

        const accountEmail =
            document.getElementById(
                "accountEmail"
            );

        const accountInitial =
            document.getElementById(
                "accountInitial"
            );

        const continueButton =
            document.getElementById(
                "continueButton"
            );

        const useAnotherAccountButton =
            document.getElementById(
                "useAnotherAccountButton"
            );


        // ========================================
        // ELEMENT CHECK
        // ========================================

        if (
            !appName ||
            !accountName ||
            !accountEmail ||
            !accountInitial ||
            !continueButton ||
            !useAnotherAccountButton
        ) {

            console.error(
                "05 ID: Required authorization page element is missing."
            );

            return;

        }


        // ========================================
        // ENDPOINTS
        // ========================================

        const CLIENT_INFO_URL =
            "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-client-info";

        const OAUTH_APPROVE_URL =
            "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-approve";


        // ========================================
        // READ OAUTH REQUEST
        // ========================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const clientId =
            params.get(
                "client_id"
            );

        const redirectUri =
            params.get(
                "redirect_uri"
            );

        const responseType =
            params.get(
                "response_type"
            );

        const scope =
            params.get(
                "scope"
            ) || "openid";

        const state =
            params.get(
                "state"
            );

        const codeChallenge =
            params.get(
                "code_challenge"
            );

        const codeChallengeMethod =
            params.get(
                "code_challenge_method"
            );


        console.log(
            "OAuth request:",
            {
                clientId,
                redirectUri,
                responseType,
                scope,
                hasState:
                    !!state,
                hasCodeChallenge:
                    !!codeChallenge,
                codeChallengeMethod
            }
        );


        // ========================================
        // VALIDATE REQUEST
        // ========================================

        if (!clientId) {

            showAuthorizationError(
                "Missing OAuth client ID."
            );

            return;

        }


        if (!redirectUri) {

            showAuthorizationError(
                "Missing redirect URI."
            );

            return;

        }


        if (
            responseType !==
            "code"
        ) {

            showAuthorizationError(
                "Unsupported OAuth response type."
            );

            return;

        }


        if (!codeChallenge) {

            showAuthorizationError(
                "PKCE code challenge is missing."
            );

            return;

        }


        if (
            codeChallengeMethod !==
            "S256"
        ) {

            showAuthorizationError(
                "Only S256 PKCE is supported."
            );

            return;

        }


        // ========================================
        // LOAD CLIENT INFORMATION
        // ========================================

        try {

            console.log(
                "Loading OAuth client..."
            );


            const clientResponse =
                await fetch(
                    `${CLIENT_INFO_URL}?client_id=${encodeURIComponent(clientId)}`,
                    {
                        method:
                            "GET",

                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            console.log(
                "Client info status:",
                clientResponse.status
            );


            const responseText =
                await clientResponse.text();


            console.log(
                "Client info response:",
                responseText
            );


            let clientResult;

            try {

                clientResult =
                    JSON.parse(
                        responseText
                    );

            } catch {

                throw new Error(
                    "05 ID returned an invalid client response."
                );

            }


            if (
                !clientResponse.ok
            ) {

                throw new Error(
                    clientResult.error_description ||
                    clientResult.error ||
                    "Unable to load OAuth client."
                );

            }


            if (
                !clientResult.client_name
            ) {

                throw new Error(
                    "05 ID did not return an application name."
                );

            }


            // ========================================
            // DISPLAY CLIENT
            // ========================================

            appName.textContent =
                clientResult.client_name;


            console.log(
                "OAuth client loaded:",
                clientResult
            );


            // ========================================
            // GET 05 ID SESSION
            // ========================================

            console.log(
                "Checking 05 ID session..."
            );


            const {
                data,
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {

                throw error;

            }


            // ========================================
            // NOT SIGNED IN
            // ========================================

            if (
                !data.session
            ) {

                console.log(
                    "No 05 ID session found."
                );


                sessionStorage.setItem(
                    "05id_return_to",
                    window.location.href
                );


                window.location.href =
                    "login.html";


                return;

            }


            // ========================================
            // CURRENT USER
            // ========================================

            const user =
                data.session.user;


            const fullName =
                user.user_metadata?.full_name ||
                user.email ||
                "05 ID User";


            const email =
                user.email ||
                "Unknown email";


            // ========================================
            // DISPLAY USER
            // ========================================

            accountName.textContent =
                fullName;


            accountEmail.textContent =
                email;


            accountInitial.textContent =
                fullName
                    .trim()
                    .charAt(0)
                    .toUpperCase() ||
                "0";


            // ========================================
            // CONTINUE
            // ========================================

            continueButton.addEventListener(
                "click",
                async function () {

                    continueButton.disabled =
                        true;

                    useAnotherAccountButton.disabled =
                        true;

                    continueButton.textContent =
                        "Authorizing...";


                    try {

                        console.log(
                            "Starting OAuth approval..."
                        );


                        // ========================================
                        // GET CURRENT SESSION
                        // ========================================

                        const {
                            data:
                                currentSessionData,
                            error:
                                currentSessionError
                        } =
                            await supabaseClient.auth.getSession();


                        if (
                            currentSessionError
                        ) {

                            throw currentSessionError;

                        }


                        if (
                            !currentSessionData.session
                        ) {

                            throw new Error(
                                "Your 05 ID session has expired."
                            );

                        }


                        // ========================================
                        // BUILD APPROVAL REQUEST
                        // ========================================

                        const approveParams =
                            new URLSearchParams();


                        approveParams.set(
                            "client_id",
                            clientId
                        );


                        approveParams.set(
                            "redirect_uri",
                            redirectUri
                        );


                        approveParams.set(
                            "response_type",
                            responseType
                        );


                        approveParams.set(
                            "scope",
                            scope
                        );


                        if (state) {

                            approveParams.set(
                                "state",
                                state
                            );

                        }


                        approveParams.set(
                            "code_challenge",
                            codeChallenge
                        );


                        approveParams.set(
                            "code_challenge_method",
                            codeChallengeMethod
                        );


                        console.log(
                            "Sending approval request..."
                        );


                        // ========================================
                        // APPROVE
                        // ========================================

                        const approveResponse =
                            await fetch(
                                OAUTH_APPROVE_URL,
                                {
                                    method:
                                        "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/x-www-form-urlencoded",

                                        "Authorization":
                                            `Bearer ${currentSessionData.session.access_token}`,

                                        "apikey":
                                            typeof SUPABASE_PUBLISHABLE_KEY !==
                                                "undefined"
                                                ? SUPABASE_PUBLISHABLE_KEY
                                                : ""
                                    },

                                    body:
                                        approveParams.toString()
                                }
                            );


                        console.log(
                            "Approval response status:",
                            approveResponse.status
                        );


                        const approveText =
                            await approveResponse.text();


                        console.log(
                            "Approval response:",
                            approveText
                        );


                        let approveResult;

                        try {

                            approveResult =
                                JSON.parse(
                                    approveText
                                );

                        } catch {

                            throw new Error(
                                "05 ID returned an invalid authorization response."
                            );

                        }


                        // ========================================
                        // APPROVAL ERROR
                        // ========================================

                        if (
                            !approveResponse.ok
                        ) {

                            throw new Error(
                                approveResult.error_description ||
                                approveResult.error ||
                                "Unable to authorize this application."
                            );

                        }


                        // ========================================
                        // AUTHORIZATION SUCCESS
                        // ========================================

                        if (
                            !approveResult.success
                        ) {

                            throw new Error(
                                approveResult.error_description ||
                                approveResult.error ||
                                "05 ID could not authorize this application."
                            );

                        }


                        if (
                            !approveResult.code
                        ) {

                            throw new Error(
                                "05 ID did not return an authorization code."
                            );

                        }


                        if (
                            !approveResult.redirect_uri
                        ) {

                            throw new Error(
                                "05 ID did not return a redirect URI."
                            );

                        }


                        console.log(
                            "Authorization successful."
                        );


                        // ========================================
                        // REDIRECT
                        // ========================================

                        window.location.href =
                            approveResult.redirect_uri;

                    } catch (error) {

                        console.error(
                            "OAuth approval error:",
                            error
                        );


                        continueButton.disabled =
                            false;

                        useAnotherAccountButton.disabled =
                            false;

                        continueButton.textContent =
                            "Continue";


                        showAuthorizationError(
                            error.message ||
                            "Unable to authorize this application."
                        );

                    }

                }
            );


            // ========================================
            // USE ANOTHER ACCOUNT
            // ========================================

            useAnotherAccountButton.addEventListener(
                "click",
                async function () {

                    useAnotherAccountButton.disabled =
                        true;

                    continueButton.disabled =
                        true;

                    useAnotherAccountButton.textContent =
                        "Signing out...";


                    try {

                        const {
                            error
                        } =
                            await supabaseClient.auth.signOut();


                        if (
                            error
                        ) {

                            throw error;

                        }


                        // ========================================
                        // RETURN TO LOGIN
                        // ========================================

                        window.location.href =
                            "login.html";

                    } catch (error) {

                        console.error(
                            "05 ID sign out error:",
                            error
                        );


                        useAnotherAccountButton.disabled =
                            false;

                        continueButton.disabled =
                            false;

                        useAnotherAccountButton.textContent =
                            "Use another account";

                    }

                }
            );


        } catch (error) {

            console.error(
                "Authorization page error:",
                error
            );


            showAuthorizationError(
                error.message ||
                "Unable to load OAuth client."
            );

        }


        // ========================================
        // AUTHORIZATION ERROR
        // ========================================

        function showAuthorizationError(
            message
        ) {

            console.error(
                "05 ID authorization error:",
                message
            );


            if (appName) {

                appName.textContent =
                    "05 ID";

            }


            if (accountName) {

                accountName.textContent =
                    "Unable to continue";

            }


            if (accountEmail) {

                accountEmail.textContent =
                    message;

            }


            if (accountInitial) {

                accountInitial.textContent =
                    "!";

            }


            if (continueButton) {

                continueButton.disabled =
                    true;

            }


            if (useAnotherAccountButton) {

                useAnotherAccountButton.disabled =
                    true;

            }

        }

    }
);

