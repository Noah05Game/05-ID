// ========================================
// 05 ID AUTHORIZATION PAGE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

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
        // OAUTH APPROVE ENDPOINT
        // ========================================

        const OAUTH_APPROVE_URL =
            "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-approve";


        // ========================================
        // READ AUTHORIZATION REQUEST
        // ========================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const clientId =
            params.get(
                "client_id"
            );

        const requestedApp =
            params.get(
                "app_name"
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


        // ========================================
        // CHECK REQUEST
        // ========================================

        if (
            !clientId ||
            !requestedApp ||
            !redirectUri ||
            !responseType ||
            !codeChallenge ||
            !codeChallengeMethod
        ) {

            showAuthorizationError(
                "Invalid authorization request."
            );

            return;
        }


        // ========================================
        // RESPONSE TYPE
        // ========================================

        if (
            responseType !==
            "code"
        ) {

            showAuthorizationError(
                "Unsupported authorization request."
            );

            return;
        }


        // ========================================
        // PKCE
        // ========================================

        if (
            codeChallengeMethod !==
            "S256"
        ) {

            showAuthorizationError(
                "Unsupported PKCE method."
            );

            return;
        }


        // ========================================
        // DISPLAY APP NAME
        // ========================================

        appName.textContent =
            requestedApp;


        // ========================================
        // GET SESSION
        // ========================================

        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {
                throw error;
            }


            // ========================================
            // NOT LOGGED IN
            // ========================================

            if (!data.session) {

                sessionStorage.setItem(
                    "05id_return_to",
                    window.location.href
                );


                window.location.href =
                    "login.html";

                return;
            }


            // ========================================
            // USER
            // ========================================

            const user =
                data.session.user;


            const fullName =
                user.user_metadata?.full_name ||
                "05 ID User";


            const email =
                user.email ||
                "Unknown email";


            // ========================================
            // DISPLAY ACCOUNT
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
                async () => {

                    continueButton.disabled =
                        true;

                    useAnotherAccountButton.disabled =
                        true;

                    continueButton.textContent =
                        "Authorizing...";


                    try {

                        // ========================================
                        // GET CURRENT SESSION
                        // ========================================

                        const {
                            data: sessionData,
                            error: sessionError
                        } =
                            await supabaseClient.auth.getSession();


                        if (sessionError) {
                            throw sessionError;
                        }


                        if (
                            !sessionData.session
                        ) {

                            throw new Error(
                                "Your 05 ID session has expired."
                            );

                        }


                        // ========================================
                        // BUILD FORM DATA
                        // ========================================

                        const formData =
                            new URLSearchParams();


                        formData.set(
                            "client_id",
                            clientId
                        );

                        formData.set(
                            "redirect_uri",
                            redirectUri
                        );

                        formData.set(
                            "response_type",
                            responseType
                        );

                        formData.set(
                            "scope",
                            scope
                        );

                        if (state) {

                            formData.set(
                                "state",
                                state
                            );

                        }

                        formData.set(
                            "code_challenge",
                            codeChallenge
                        );

                        formData.set(
                            "code_challenge_method",
                            codeChallengeMethod
                        );


                        // ========================================
                        // REQUEST AUTHORIZATION CODE
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


const response =
    await fetch(
        OAUTH_APPROVE_URL,
        {
            method:
                "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",

                "Authorization":
                    `Bearer ${sessionData.session.access_token}`,

                "apikey":
                    SUPABASE_PUBLISHABLE_KEY
            },

            body:
                approveParams.toString()
        }
    );


                        // ========================================
                        // READ RESPONSE
                        // ========================================

                        let result;

                        try {

                            result =
                                await response.json();

                        } catch {

                            throw new Error(
                                "05 ID returned an invalid response."
                            );

                        }


                        // ========================================
                        // CHECK ERROR
                        // ========================================

                        if (
                            !response.ok ||
                            !result.success
                        ) {

                            throw new Error(
                                result.error_description ||
                                "Unable to authorize this application."
                            );

                        }


                        // ========================================
                        // CHECK CODE
                        // ========================================

                        if (
                            !result.code
                        ) {

                            throw new Error(
                                "05 ID did not return an authorization code."
                            );

                        }


                        // ========================================
                        // BUILD CALLBACK URL
                        // ========================================

                        const callbackUrl =
                            new URL(
                                result.redirect_uri
                            );


                        callbackUrl.searchParams.set(
                            "code",
                            result.code
                        );


                        if (result.state) {

                            callbackUrl.searchParams.set(
                                "state",
                                result.state
                            );

                        }


                        // ========================================
                        // REDIRECT TO APPLICATION
                        // ========================================

                        window.location.href =
                            callbackUrl.toString();

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
                async () => {

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


                        if (error) {
                            throw error;
                        }


                        window.location.href =
                            "login.html";


                    } catch (error) {

                        console.error(
                            "Sign out error:",
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
                "Authorization error:",
                error
            );


            showAuthorizationError(
                "Unable to load your 05 ID."
            );

        }


        // ========================================
        // AUTHORIZATION ERROR
        // ========================================

        function showAuthorizationError(
            message
        ) {

            appName.textContent =
                "05 ID";

            accountName.textContent =
                "Unable to continue";

            accountEmail.textContent =
                message;

            accountInitial.textContent =
                "!";

            continueButton.disabled =
                true;

            useAnotherAccountButton.disabled =
                true;

        }

    }
);