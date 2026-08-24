// ========================================
// POLLINATIONS CONFIG
// ========================================

const POLLINATIONS_AUTHORIZE_URL =
    "https://enter.pollinations.ai/authorize";

const POLLINATIONS_TOKEN_URL =
    "https://enter.pollinations.ai/api/oauth/token";


document.addEventListener("DOMContentLoaded", () => {


    /*
    ========================================
    PAGE DETECTION
    ========================================
    */

    const createAccountForm =
        document.getElementById("createAccountForm");

    const loginForm =
        document.getElementById("loginForm");

    const logoutButton =
        document.getElementById("logoutButton");

    const dashboardPage =
        document.querySelector(".dashboard-page");


    /*
    ========================================
    CREATE ACCOUNT
    ========================================
    */

    if (createAccountForm) {

        setupCreateAccount();

    }


    /*
    ========================================
    LOGIN
    ========================================
    */

    if (loginForm) {

        setupLogin();

    }


    /*
    ========================================
    DASHBOARD
    ========================================
    */

    if (dashboardPage) {

        setupDashboard();

    }


    /*
    ========================================
    LOGOUT
    ========================================
    */

    if (logoutButton) {

        setupLogout();

    }


    /*
    ========================================
    CREATE ACCOUNT
    ========================================
    */

    function setupCreateAccount() {

        const fullNameInput =
            document.getElementById("fullName");

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const confirmPasswordInput =
            document.getElementById("confirmPassword");

        const createAccountButton =
            document.getElementById("createAccountButton");

        const formMessage =
            document.getElementById("formMessage");


        createAccountForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                clearMessage();


                const fullName =
                    fullNameInput.value.trim();

                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;

                const confirmPassword =
                    confirmPasswordInput.value;


                if (!fullName) {

                    showError(
                        "Please enter your full name."
                    );

                    fullNameInput.focus();

                    return;

                }


                if (!email) {

                    showError(
                        "Please enter your email address."
                    );

                    emailInput.focus();

                    return;

                }


                if (!password) {

                    showError(
                        "Please create a password."
                    );

                    passwordInput.focus();

                    return;

                }


                if (password.length < 8) {

                    showError(
                        "Your password must be at least 8 characters."
                    );

                    passwordInput.focus();

                    return;

                }


                if (password !== confirmPassword) {

                    showError(
                        "Your passwords do not match."
                    );

                    confirmPasswordInput.focus();

                    return;

                }


                setButtonLoading(
                    createAccountButton,
                    true,
                    "Creating account..."
                );


                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth.signUp({

                            email,

                            password,

                            options: {

                                data: {
                                    full_name: fullName
                                }

                            }

                        });


                    if (error) {

                        throw error;

                    }


                    console.log(
                        "Account created:",
                        data
                    );


                    showSuccess(
                        "Account created! Check your email to verify your 05 ID."
                    );


                    createAccountForm.reset();


                } catch (error) {

                    console.error(
                        "Create account error:",
                        error
                    );


                    showError(
                        error.message ||
                        "Something went wrong. Please try again."
                    );


                } finally {

                    setButtonLoading(
                        createAccountButton,
                        false,
                        "Create account"
                    );

                }

            }
        );


        function showError(message) {

            formMessage.textContent =
                message;

            formMessage.className =
                "form-message error";

        }


        function showSuccess(message) {

            formMessage.textContent =
                message;

            formMessage.className =
                "form-message success";

        }


        function clearMessage() {

            formMessage.textContent =
                "";

            formMessage.className =
                "form-message";

        }

    }


    /*
    ========================================
    LOGIN
    ========================================
    */

    function setupLogin() {

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const loginButton =
            document.getElementById("loginButton");

        const formMessage =
            document.getElementById("formMessage");


        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                clearMessage();


                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;


                if (!email) {

                    showError(
                        "Please enter your email address."
                    );

                    emailInput.focus();

                    return;

                }


                if (!password) {

                    showError(
                        "Please enter your password."
                    );

                    passwordInput.focus();

                    return;

                }


                setButtonLoading(
                    loginButton,
                    true,
                    "Signing in..."
                );


                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth.signInWithPassword({

                            email,

                            password

                        });


                    if (error) {

                        throw error;

                    }


                    console.log(
                        "Successfully signed in:",
                        data
                    );


                   const returnTo =
    sessionStorage.getItem("05id_return_to");

if (returnTo) {

    window.location.href =
        returnTo;

} else {

    window.location.href =
        "dashboard.html";

}


                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    showError(
                        getLoginErrorMessage(error)
                    );


                } finally {

                    setButtonLoading(
                        loginButton,
                        false,
                        "Sign in"
                    );

                }

            }
        );


        function showError(message) {

            formMessage.textContent =
                message;

            formMessage.className =
                "form-message error";

        }


        function clearMessage() {

            formMessage.textContent =
                "";

            formMessage.className =
                "form-message";

        }

    }


    /*
    ========================================
    DASHBOARD
    ========================================
    */

    async function setupDashboard() {

        try {

            const {
                data: {
                    session
                },
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {

                throw error;

            }


            /*
            --------------------------------
            NO SESSION
            --------------------------------
            */

            if (!session) {

                window.location.href =
                    "login.html";

                return;

            }


            /*
            --------------------------------
            USER
            --------------------------------
            */

            const user =
                session.user;


            const fullName =
                user.user_metadata?.full_name ||
                "there";


            const userName =
                document.getElementById(
                    "userName"
                );

            const welcomeGreeting =
                document.getElementById(
                    "welcomeGreeting"
                );

            const accountName =
                document.getElementById(
                    "accountName"
                );

            const accountEmail =
                document.getElementById(
                    "accountEmail"
                );

            const accountId =
                document.getElementById(
                    "accountId"
                );

            const accountStatus =
                document.getElementById(
                    "accountStatus"
                );


            /*
            --------------------------------
            DISPLAY USER DATA
            --------------------------------
            */

            if (userName) {

                userName.textContent =
                    fullName;

            }


            if (accountName) {

                accountName.textContent =
                    fullName;

            }


            if (accountEmail) {

                accountEmail.textContent =
                    user.email ||
                    "Unknown";

            }


            if (accountId) {

                accountId.textContent =
                    user.id;

            }


            if (accountStatus) {

                accountStatus.textContent =
                    "Active";

                accountStatus.classList.add(
                    "active"
                );

            }


            /*
            --------------------------------
            WELCOME ANIMATION
            --------------------------------
            */

            if (welcomeGreeting) {

                startWelcomeAnimation(
                    welcomeGreeting
                );

            }


            /*
            --------------------------------
            POLLINATIONS
            --------------------------------
            */

            await loadPollinationsConnection(
                user.id
            );


        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );


            window.location.href =
                "login.html";

        }

    }


    /*
    ========================================
    WELCOME GREETING ANIMATION
    ========================================
    */

    function startWelcomeAnimation(
        element
    ) {

        if (!element) {

            return;

        }


        const greetings = [

            {
                text: "Welcome",
                pause: 5000
            },

            {
                text: "Bienvenue",
                pause: 5000
            },

            {
                text: "Willkommen",
                pause: 5000
            },

            {
                text: "Bienvenido",
                pause: 5000
            },

            {
                text: "Benvenuto",
                pause: 5000
            },

            {
                text: "ようこそ",
                pause: 5000
            },

            {
                text: "欢迎",
                pause: 5000
            },

            {
                text: "환영합니다",
                pause: 5000
            }

        ];


        let currentIndex = 0;


        element.textContent =
            greetings[0].text;


        async function runAnimation() {

            currentIndex =
                (
                    currentIndex + 1
                ) % greetings.length;


            const greeting =
                greetings[currentIndex];


            await deleteText(
                element
            );


            await wait(350);


            await typeText(
                element,
                greeting.text
            );


            await wait(
                greeting.pause
            );


            runAnimation();

        }


        wait(5000).then(() => {

            runAnimation();

        });

    }


    /*
    ========================================
    TYPE TEXT
    ========================================
    */

    function typeText(
        element,
        text
    ) {

        return new Promise(
            (resolve) => {

                let index = 0;


                const interval =
                    setInterval(() => {

                        element.textContent =
                            text.substring(
                                0,
                                index + 1
                            );


                        index++;


                        if (
                            index >=
                            text.length
                        ) {

                            clearInterval(
                                interval
                            );

                            resolve();

                        }

                    }, 80);

            }
        );

    }


    /*
    ========================================
    DELETE TEXT
    ========================================
    */

    function deleteText(
        element
    ) {

        return new Promise(
            (resolve) => {

                const interval =
                    setInterval(() => {

                        const currentText =
                            element.textContent;


                        if (
                            currentText.length === 0
                        ) {

                            clearInterval(
                                interval
                            );

                            resolve();

                            return;

                        }


                        element.textContent =
                            currentText.substring(
                                0,
                                currentText.length - 1
                            );


                        if (
                            currentText.length <= 1
                        ) {

                            clearInterval(
                                interval
                            );

                            resolve();

                        }

                    }, 50);

            }
        );

    }


    /*
    ========================================
    WAIT
    ========================================
    */

    function wait(
        milliseconds
    ) {

        return new Promise(
            (resolve) => {

                setTimeout(
                    resolve,
                    milliseconds
                );

            }
        );

    }


    /*
    ========================================
    LOGOUT
    ========================================
    */

    function setupLogout() {

        logoutButton.addEventListener(
            "click",
            async () => {

                logoutButton.disabled =
                    true;

                logoutButton.textContent =
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
                        "Logout error:",
                        error
                    );


                    logoutButton.disabled =
                        false;

                    logoutButton.textContent =
                        "Sign out";

                }

            }
        );

    }


    /*
    ========================================
    BUTTON LOADING
    ========================================
    */

    function setButtonLoading(
        button,
        loading,
        loadingText
    ) {

        if (!button) {

            return;

        }


        if (loading) {

            button.disabled =
                true;

            button.textContent =
                loadingText;

        } else {

            button.disabled =
                false;


            if (
                button.id ===
                "loginButton"
            ) {

                button.textContent =
                    "Sign in";

            } else {

                button.textContent =
                    "Create account";

            }

        }

    }


    /*
    ========================================
    LOGIN ERROR HANDLING
    ========================================
    */

    function getLoginErrorMessage(
        error
    ) {

        const message =
            error?.message?.toLowerCase() ||
            "";


        if (
            message.includes(
                "email not confirmed"
            )
        ) {

            return "Please verify your email before signing in.";

        }


        if (
            message.includes(
                "invalid login credentials"
            )
        ) {

            return "Incorrect email or password.";

        }


        return (
            error?.message ||
            "Unable to sign in. Please try again."
        );

    }


    /*
    ========================================
    POLLINATIONS
    ========================================
    */

    async function loadPollinationsConnection(
        userId
    ) {

        const unlinked =
            document.getElementById(
                "pollinationsUnlinked"
            );

        const linked =
            document.getElementById(
                "pollinationsLinked"
            );

        const linkedSince =
            document.getElementById(
                "pollinationsLinkedSince"
            );

        const linkButton =
            document.getElementById(
                "linkPollinationsButton"
            );

        const unlinkButton =
            document.getElementById(
                "unlinkPollinationsButton"
            );


        if (!unlinked || !linked) {

            return;

        }


        /*
        --------------------------------
        GET CONNECTION
        --------------------------------
        */

        const {
            data,
            error
        } =
            await supabaseClient
                .from("linked_services")
                .select("linked_at")
                .eq(
                    "user_id",
                    userId
                )
                .eq(
                    "service",
                    "pollinations"
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Unable to load Pollinations connection:",
                error
            );


            unlinked.hidden =
                false;

            linked.hidden =
                true;


            setupPollinationsButtons();

            return;

        }


        /*
        --------------------------------
        NOT LINKED
        --------------------------------
        */

        if (!data) {

            unlinked.hidden =
                false;

            linked.hidden =
                true;


            setupPollinationsButtons();

            return;

        }


        /*
        --------------------------------
        LINKED
        --------------------------------
        */

        unlinked.hidden =
            true;

        linked.hidden =
            false;


        if (linkedSince) {

            const date =
                new Date(
                    data.linked_at
                );


            linkedSince.textContent =
                `Linked since ${date.toLocaleDateString(
                    "en-GB",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                )}`;

        }


        if (linkButton) {

            linkButton.style.display =
                "none";

        }


        if (unlinkButton) {

            unlinkButton.style.display =
                "";

        }


        setupPollinationsButtons();

    }


    /*
    ========================================
    POLLINATIONS BUTTONS
    ========================================
    */

    function setupPollinationsButtons() {

        const linkButton =
            document.getElementById(
                "linkPollinationsButton"
            );

        const unlinkButton =
            document.getElementById(
                "unlinkPollinationsButton"
            );


        /*
        --------------------------------
        LINK
        --------------------------------
        */

        if (linkButton) {

            linkButton.onclick =
                startPollinationsOAuth;

        }


        /*
        --------------------------------
        UNLINK
        --------------------------------
        */

        if (unlinkButton) {

            unlinkButton.onclick =
                openUnlinkModal;

        }

    }


    /*
    ========================================
    START POLLINATIONS OAUTH
    ========================================
    */

    async function startPollinationsOAuth() {

        try {

            const button =
                document.getElementById(
                    "linkPollinationsButton"
                );


            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    "Connecting...";

            }


            /*
            --------------------------------
            RANDOM STATE
            --------------------------------
            */

            const state =
                generateRandomString(
                    32
                );


            /*
            --------------------------------
            PKCE VERIFIER
            --------------------------------
            */

            const codeVerifier =
                generateRandomString(
                    64
                );


            /*
            --------------------------------
            PKCE CHALLENGE
            --------------------------------
            */

            const codeChallenge =
                await createCodeChallenge(
                    codeVerifier
                );


            /*
            --------------------------------
            SAVE SECURITY VALUES
            --------------------------------
            */

            sessionStorage.setItem(
                "pollinations_oauth_state",
                state
            );


            sessionStorage.setItem(
                "pollinations_code_verifier",
                codeVerifier
            );


            /*
            --------------------------------
            BUILD AUTHORISATION URL
            --------------------------------
            */

            const redirectUri =
                getPollinationsRedirectUri();


            const params =
                new URLSearchParams({

                    response_type:
                        "code",

                    client_id:
                        POLLINATIONS_CLIENT_ID,

                    redirect_uri:
                        redirectUri,

                    scope:
                        "profile usage",

                    state,

                    code_challenge:
                        codeChallenge,

                    code_challenge_method:
                        "S256"

                });


            window.location.href =
                `${POLLINATIONS_AUTHORIZE_URL}?${params.toString()}`;


        } catch (error) {

            console.error(
                "Unable to start Pollinations OAuth:",
                error
            );


            const button =
                document.getElementById(
                    "linkPollinationsButton"
                );


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Link";

            }

        }

    }


    /*
    ========================================
    RANDOM STRING
    ========================================
    */

    function generateRandomString(
        length
    ) {

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";


        const values =
            new Uint8Array(length);


        crypto.getRandomValues(
            values
        );


        return Array
            .from(values)
            .map(
                value =>
                    characters[
                        value %
                        characters.length
                    ]
            )
            .join("");

    }


    /*
    ========================================
    PKCE SHA-256
    ========================================
    */

    async function createCodeChallenge(
        verifier
    ) {

        const encoder =
            new TextEncoder();


        const data =
            encoder.encode(
                verifier
            );


        const digest =
            await crypto.subtle.digest(
                "SHA-256",
                data
            );


        return base64UrlEncode(
            new Uint8Array(digest)
        );

    }


    /*
    ========================================
    BASE64 URL ENCODE
    ========================================
    */

    function base64UrlEncode(
        bytes
    ) {

        let binary =
            "";


        bytes.forEach(
            byte => {

                binary +=
                    String.fromCharCode(
                        byte
                    );

            }
        );


        return btoa(binary)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

    }


    /*
    ========================================
    REDIRECT URI
    ========================================
    */

    function getPollinationsRedirectUri() {

        return (
            window.location.origin +
            "/pages/pollinations-callback.html"
        );

    }


    /*
    ========================================
    OPEN UNLINK MODAL
    ========================================
    */

    function openUnlinkModal() {

        const modal =
            document.getElementById(
                "unlinkModal"
            );

        const cancelButton =
            document.getElementById(
                "cancelUnlinkButton"
            );

        const confirmButton =
            document.getElementById(
                "confirmUnlinkButton"
            );


        if (!modal) {

            return;

        }


        modal.hidden =
            false;


        /*
        --------------------------------
        RESET BUTTON
        --------------------------------
        */

        if (confirmButton) {

            confirmButton.disabled =
                false;

            confirmButton.textContent =
                "Unlink";

        }


        /*
        --------------------------------
        CANCEL
        --------------------------------
        */

        if (cancelButton) {

            cancelButton.onclick =
                closeUnlinkModal;

        }


        /*
        --------------------------------
        CONFIRM
        --------------------------------
        */

        if (confirmButton) {

            confirmButton.onclick =
                unlinkPollinations;

        }


        /*
        --------------------------------
        ESCAPE KEY
        --------------------------------
        */

        document.addEventListener(
            "keydown",
            handleUnlinkEscape
        );

    }


    /*
    ========================================
    CLOSE UNLINK MODAL
    ========================================
    */

    function closeUnlinkModal() {

        const modal =
            document.getElementById(
                "unlinkModal"
            );


        if (!modal) {

            return;

        }


        modal.hidden =
            true;


        document.removeEventListener(
            "keydown",
            handleUnlinkEscape
        );

    }


    /*
    ========================================
    ESCAPE MODAL
    ========================================
    */

    function handleUnlinkEscape(
        event
    ) {

        if (
            event.key ===
            "Escape"
        ) {

            closeUnlinkModal();

        }

    }


    /*
    ========================================
    UNLINK POLLINATIONS
    ========================================
    */

    async function unlinkPollinations() {

        const unlinkButton =
            document.getElementById(
                "unlinkPollinationsButton"
            );

        const confirmButton =
            document.getElementById(
                "confirmUnlinkButton"
            );


        if (!unlinkButton) {

            return;

        }


        /*
        --------------------------------
        SHOW LOADING STATE
        --------------------------------
        */

        unlinkButton.disabled =
            true;


        unlinkButton.textContent =
            "Unlinking...";


        if (confirmButton) {

            confirmButton.disabled =
                true;

            confirmButton.textContent =
                "Unlinking...";

        }


        try {

            /*
            --------------------------------
            GET CURRENT USER
            --------------------------------
            */

            const {
                data: {
                    user
                },
                error: userError
            } =
                await supabaseClient.auth.getUser();


            if (userError) {

                throw userError;

            }


            if (!user) {

                throw new Error(
                    "You are not signed in."
                );

            }


            /*
            --------------------------------
            DELETE CONNECTION
            --------------------------------
            */

            const {
                error
            } =
                await supabaseClient
                    .from("linked_services")
                    .delete()
                    .eq(
                        "user_id",
                        user.id
                    )
                    .eq(
                        "service",
                        "pollinations"
                    );


            if (error) {

                throw error;

            }


            /*
            --------------------------------
            UPDATE UI
            --------------------------------
            */

            const unlinked =
                document.getElementById(
                    "pollinationsUnlinked"
                );

            const linked =
                document.getElementById(
                    "pollinationsLinked"
                );


            if (unlinked) {

                unlinked.hidden =
                    false;

            }


            if (linked) {

                linked.hidden =
                    true;

            }


            /*
            --------------------------------
            CLOSE MODAL
            --------------------------------
            */

            closeUnlinkModal();


            /*
            --------------------------------
            RESET BUTTON
            --------------------------------
            */

            unlinkButton.disabled =
                false;

            unlinkButton.textContent =
                "Unlink";


            /*
            --------------------------------
            RESET LINK BUTTON
            --------------------------------
            */

            const linkButton =
                document.getElementById(
                    "linkPollinationsButton"
                );


            if (linkButton) {

                linkButton.style.display =
                    "";

                linkButton.disabled =
                    false;

                linkButton.textContent =
                    "Link";

            }


        } catch (error) {

            console.error(
                "Pollinations unlink error:",
                error
            );


            /*
            --------------------------------
            KEEP MODAL OPEN
            --------------------------------
            */

            if (confirmButton) {

                confirmButton.disabled =
                    false;

                confirmButton.textContent =
                    "Unlink";

            }


            unlinkButton.disabled =
                false;

            unlinkButton.textContent =
                "Unlink";


            /*
            --------------------------------
            SHOW ERROR IN CONSOLE
            --------------------------------
            */

            console.error(
                "Unable to unlink Pollinations right now."
            );

        }

    }

});