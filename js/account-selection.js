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
        // READ AUTHORIZATION REQUEST
        // ========================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const requestedApp =
            params.get("app_name");

        const redirectUri =
            params.get("redirect_uri");

        const state =
            params.get("state");


        // ========================================
        // CHECK REQUEST
        // ========================================

        if (
            !requestedApp ||
            !redirectUri ||
            !state
        ) {

            showAuthorizationError(
                "Invalid authorization request."
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
                () => {

                    continueButton.disabled =
                        true;

                    continueButton.textContent =
                        "Continuing...";


                    const resultParams =
                        new URLSearchParams({

                            status:
                                "success",

                            state:
                                state

                        });


                    window.location.href =
                        redirectUri +
                        "?" +
                        resultParams.toString();

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