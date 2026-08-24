// ========================================
// 05 ID TEST APP
// OAuth PKCE CLIENT
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const loginButton =
            document.getElementById(
                "loginButton"
            );

        const statusMessage =
            document.getElementById(
                "statusMessage"
            );


        // ========================================
        // 05 ID CONFIGURATION
        // ========================================

        const CLIENT_ID =
            "05id_test_app";

        const CLIENT_NAME =
            "05 ID Test App";

        const AUTHORIZE_URL =
            "https://fmkecvetadtihdgeqezo.supabase.co/functions/v1/oauth-authorize";

        const REDIRECT_URI =
            "https://id.the05company.com/pages/test-result.html";

        const SCOPE =
            "openid profile email";


        // ========================================
        // BASE64URL
        // ========================================

        function base64UrlEncode(
            arrayBuffer
        ) {

            const bytes =
                new Uint8Array(
                    arrayBuffer
                );

            let binary = "";

            bytes.forEach(
                byte => {
                    binary += String.fromCharCode(
                        byte
                    );
                }
            );

            return btoa(binary)
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, "");

        }


        // ========================================
        // RANDOM STRING
        // ========================================

        function randomString(
            length = 64
        ) {

            const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

            const randomValues =
                new Uint8Array(
                    length
                );

            crypto.getRandomValues(
                randomValues
            );

            let result = "";

            for (
                let i = 0;
                i < length;
                i++
            ) {

                result +=
                    characters[
                        randomValues[i] %
                        characters.length
                    ];

            }

            return result;

        }


        // ========================================
        // CREATE PKCE CHALLENGE
        // ========================================

        async function createPKCE() {

            const verifier =
                randomString(64);


            const data =
                new TextEncoder().encode(
                    verifier
                );


            const digest =
                await crypto.subtle.digest(
                    "SHA-256",
                    data
                );


            const challenge =
                base64UrlEncode(
                    digest
                );


            return {
                verifier,
                challenge
            };

        }


        // ========================================
        // LOGIN
        // ========================================

        loginButton.addEventListener(
            "click",
            async () => {

                loginButton.disabled =
                    true;

                loginButton.textContent =
                    "Connecting...";

                statusMessage.textContent =
                    "Preparing secure OAuth connection...";


                try {

                    // ========================================
                    // PKCE
                    // ========================================

                    const {
                        verifier,
                        challenge
                    } =
                        await createPKCE();


                    // ========================================
                    // STATE
                    // ========================================

                    const state =
                        randomString(32);


                    // ========================================
                    // STORE TEMPORARY OAUTH DATA
                    // ========================================

                    sessionStorage.setItem(
                        "05id_pkce_verifier",
                        verifier
                    );

                    sessionStorage.setItem(
                        "05id_oauth_state",
                        state
                    );


                    // ========================================
                    // BUILD AUTHORIZATION URL
                    // ========================================

                    const params =
                        new URLSearchParams({

                            client_id:
                                CLIENT_ID,

                            app_name:
                                CLIENT_NAME,

                            redirect_uri:
                                REDIRECT_URI,

                            response_type:
                                "code",

                            scope:
                                SCOPE,

                            state:
                                state,

                            code_challenge:
                                challenge,

                            code_challenge_method:
                                "S256"

                        });


                    const authorizationUrl =
                        AUTHORIZE_URL +
                        "?" +
                        params.toString();


                    statusMessage.textContent =
                        "Redirecting to 05 ID...";


                    // ========================================
                    // REDIRECT
                    // ========================================

                    window.location.href =
                        authorizationUrl;

                } catch (error) {

                    console.error(
                        "OAuth start error:",
                        error
                    );

                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "Continue with 05 ID";

                    statusMessage.textContent =
                        "Unable to start 05 ID.";

                }

            }
        );

    }
);