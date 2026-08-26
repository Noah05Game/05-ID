// ========================================
// POLLINATIONS CONFIG
// ========================================

const POLLINATIONS_AUTHORIZE_URL =
    "https://enter.pollinations.ai/authorize";

const POLLINATIONS_TOKEN_URL =
    "https://enter.pollinations.ai/api/oauth/token";


// ========================================
// APP
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /*
        ========================================
        PAGE DETECTION
        ========================================
        */

        const createAccountForm =
            document.getElementById(
                "createAccountForm"
            );

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );

        const dashboardPage =
            document.querySelector(
                ".dashboard-page"
            );


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
                document.getElementById(
                    "fullName"
                );

            const emailInput =
                document.getElementById(
                    "email"
                );

            const passwordInput =
                document.getElementById(
                    "password"
                );

            const confirmPasswordInput =
                document.getElementById(
                    "confirmPassword"
                );

            const createAccountButton =
                document.getElementById(
                    "createAccountButton"
                );

            const formMessage =
                document.getElementById(
                    "formMessage"
                );


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


                    if (
                        password !==
                        confirmPassword
                    ) {

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
                            await supabaseClient.auth.signUp(
                                {
                                    email,
                                    password,
                                    options: {
                                        data: {
                                            full_name:
                                                fullName
                                        }
                                    }
                                }
                            );


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
                document.getElementById(
                    "email"
                );

            const passwordInput =
                document.getElementById(
                    "password"
                );

            const loginButton =
                document.getElementById(
                    "loginButton"
                );

            const formMessage =
                document.getElementById(
                    "formMessage"
                );


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
                            await supabaseClient.auth.signInWithPassword(
                                {
                                    email,
                                    password
                                }
                            );


                        if (error) {
                            throw error;
                        }


                        console.log(
                            "Successfully signed in:",
                            data
                        );


                        const returnTo =
                            sessionStorage.getItem(
                                "05id_return_to"
                            );


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
                            getLoginErrorMessage(
                                error
                            )
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
                CONNECTED APPS
                --------------------------------
                */

                await loadConnectedApps(
                    user.id
                );


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
        CONNECTED APPS
        ========================================
        */

        async function loadConnectedApps(
            userId
        ) {

            const loading =
                document.getElementById(
                    "connectedAppsLoading"
                );

            const empty =
                document.getElementById(
                    "connectedAppsEmpty"
                );

            const list =
                document.getElementById(
                    "connectedAppsList"
                );


            if (!loading || !empty || !list) {
                return;
            }


            try {

                /*
                --------------------------------
                GET ACTIVE TOKENS
                --------------------------------
                */

                const {
                    data: tokens,
                    error: tokenError
                } =
                    await supabaseClient
                        .from(
                            "oauth_access_tokens"
                        )
                        .select(
                            `
                            id,
                            client_id,
                            scope,
                            expires_at,
                            revoked_at,
                            created_at
                            `
                        )
                        .eq(
                            "user_id",
                            userId
                        )
                        .is(
                            "revoked_at",
                            null
                        )
                        .order(
                            "created_at",
                            {
                                ascending:
                                    false
                            }
                        );


                if (tokenError) {
                    throw tokenError;
                }


                /*
                --------------------------------
                NO CONNECTIONS
                --------------------------------
                */

                if (
                    !tokens ||
                    tokens.length === 0
                ) {

                    loading.hidden =
                        true;

                    empty.hidden =
                        false;

                    list.innerHTML =
                        "";

                    return;

                }


                /*
                --------------------------------
                GET CLIENT IDs
                --------------------------------
                */

                const clientIds =
                    [
                        ...new Set(
                            tokens.map(
                                token =>
                                    token.client_id
                            )
                        )
                    ];


                const {
                    data: clients,
                    error: clientError
                } =
                    await supabaseClient
                        .from(
                            "oauth_clients"
                        )
                        .select(
                            `
                            client_id,
                            client_name,
                            allowed_scopes,
                            client_type
                            `
                        )
                        .in(
                            "client_id",
                            clientIds
                        );


                if (clientError) {
                    throw clientError;
                }


                /*
                --------------------------------
                CLIENT LOOKUP
                --------------------------------
                */

                const clientMap =
                    new Map();


                for (
                    const client of
                    clients || []
                ) {

                    clientMap.set(
                        client.client_id,
                        client
                    );

                }


                /*
                --------------------------------
                RENDER
                --------------------------------
                */

                list.innerHTML =
                    "";


                for (
                    const token of
                    tokens
                ) {

                    const client =
                        clientMap.get(
                            token.client_id
                        );


                    if (!client) {
                        continue;
                    }


                    const appCard =
                        createConnectedAppCard(
                            token,
                            client
                        );


                    list.appendChild(
                        appCard
                    );

                }


                loading.hidden =
                    true;

                empty.hidden =
                    list.children.length === 0;


                /*
                --------------------------------
                SETUP BUTTONS
                --------------------------------
                */

                setupConnectedAppButtons();


            } catch (error) {

                console.error(
                    "Unable to load connected apps:",
                    error
                );


                loading.hidden =
                    true;

                empty.hidden =
                    false;

                list.innerHTML =
                    "";

                empty.querySelector(
                    "p"
                ).textContent =
                    "Unable to load your connected apps right now.";

            }

        }



        /*
        ========================================
        CREATE CONNECTED APP CARD
        ========================================
        */

        function createConnectedAppCard(
            token,
            client
        ) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "service-card";


            article.dataset.tokenId =
                token.id;


            const information =
                document.createElement(
                    "div"
                );


            information.className =
                "service-information";


            const text =
                document.createElement(
                    "div"
                );


            text.className =
                "service-text";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                client.client_name ||
                client.client_id;


            const description =
                document.createElement(
                    "p"
                );


            const createdDate =
                new Date(
                    token.created_at
                );


            const formattedDate =
                createdDate.toLocaleDateString(
                    "en-GB",
                    {
                        day:
                            "numeric",
                        month:
                            "long",
                        year:
                            "numeric"
                    }
                );


            const scopes =
                (token.scope || "")
                    .split(" ")
                    .filter(Boolean);


            const scopeText =
                scopes.length > 0
                    ? scopes.join(
                        ", "
                    )
                    : "No permissions";


            description.textContent =
                `Connected ${formattedDate} • Permissions: ${scopeText}`;


            text.appendChild(
                title
            );


            text.appendChild(
                description
            );


            information.appendChild(
                text
            );


            const state =
                document.createElement(
                    "div"
                );


            state.className =
                "service-state";


            const status =
                document.createElement(
                    "span"
                );


            status.className =
                "service-status";


            status.textContent =
                "Connected";


            const disconnectButton =
                document.createElement(
                    "button"
                );


            disconnectButton.type =
                "button";


            disconnectButton.className =
                "unlink-button";


            disconnectButton.dataset.tokenId =
                token.id;


            disconnectButton.dataset.clientName =
                client.client_name ||
                client.client_id;


            disconnectButton.textContent =
                "Disconnect";


            state.appendChild(
                status
            );


            state.appendChild(
                disconnectButton
            );


            article.appendChild(
                information
            );


            article.appendChild(
                state
            );


            return article;

        }



        /*
        ========================================
        CONNECTED APP BUTTONS
        ========================================
        */

        function setupConnectedAppButtons() {

            const buttons =
                document.querySelectorAll(
                    "#connectedAppsList .unlink-button"
                );


            buttons.forEach(
                button => {

                    button.onclick =
                        () => {

                            openDisconnectAppModal(
                                button.dataset.tokenId,
                                button.dataset.clientName
                            );

                        };

                }
            );

        }



        /*
        ========================================
        OPEN DISCONNECT APP MODAL
        ========================================
        */

        function openDisconnectAppModal(
            tokenId,
            clientName
        ) {

            const modal =
                document.getElementById(
                    "disconnectAppModal"
                );

            const message =
                document.getElementById(
                    "disconnectAppModalMessage"
                );

            const cancelButton =
                document.getElementById(
                    "cancelDisconnectAppButton"
                );

            const confirmButton =
                document.getElementById(
                    "confirmDisconnectAppButton"
                );


            if (!modal) {
                return;
            }


            modal.hidden =
                false;


            if (message) {

                message.textContent =
                    `${clientName} will no longer be able to access your 05 ID information using this connection.`;

            }


            if (confirmButton) {

                confirmButton.disabled =
                    false;

                confirmButton.textContent =
                    "Disconnect";


                confirmButton.onclick =
                    () => {

                        disconnectConnectedApp(
                            tokenId,
                            confirmButton
                        );

                    };

            }


            if (cancelButton) {

                cancelButton.onclick =
                    closeDisconnectAppModal;

            }


            document.addEventListener(
                "keydown",
                handleDisconnectAppEscape
            );

        }



        /*
        ========================================
        CLOSE DISCONNECT MODAL
        ========================================
        */

        function closeDisconnectAppModal() {

            const modal =
                document.getElementById(
                    "disconnectAppModal"
                );


            if (!modal) {
                return;
            }


            modal.hidden =
                true;


            document.removeEventListener(
                "keydown",
                handleDisconnectAppEscape
            );

        }



        /*
        ========================================
        ESCAPE
        ========================================
        */

        function handleDisconnectAppEscape(
            event
        ) {

            if (
                event.key ===
                "Escape"
            ) {

                closeDisconnectAppModal();

            }

        }



        /*
        ========================================
        DISCONNECT CONNECTED APP
        ========================================
        */

        async function disconnectConnectedApp(
            tokenId,
            confirmButton
        ) {

            if (confirmButton) {

                confirmButton.disabled =
                    true;

                confirmButton.textContent =
                    "Disconnecting...";

            }


            try {

                /*
                --------------------------------
                REVOKE TOKEN
                --------------------------------
                */

                const {
                    error
                } =
                    await supabaseClient
                        .from(
                            "oauth_access_tokens"
                        )
                        .update(
                            {
                                revoked_at:
                                    new Date().toISOString()
                            }
                        )
                        .eq(
                            "id",
                            tokenId
                        );


                if (error) {
                    throw error;
                }


                /*
                --------------------------------
                CLOSE MODAL
                --------------------------------
                */

                closeDisconnectAppModal();


                /*
                --------------------------------
                RELOAD CONNECTIONS
                --------------------------------
                */

                const {
                    data: {
                        user
                    }
                } =
                    await supabaseClient.auth.getUser();


                if (user) {

                    await loadConnectedApps(
                        user.id
                    );

                }


            } catch (error) {

                console.error(
                    "Unable to disconnect app:",
                    error
                );


                if (confirmButton) {

                    confirmButton.disabled =
                        false;

                    confirmButton.textContent =
                        "Disconnect";

                }


                alert(
                    "Unable to disconnect this app right now. Please try again."
                );

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
                    text:
                        "Welcome",
                    pause:
                        5000
                },

                {
                    text:
                        "Bienvenue",
                    pause:
                        5000
                },

                {
                    text:
                        "Willkommen",
                    pause:
                        5000
                },

                {
                    text:
                        "Bienvenido",
                    pause:
                        5000
                },

                {
                    text:
                        "Benvenuto",
                    pause:
                        5000
                },

                {
                    text:
                        "ようこそ",
                    pause:
                        5000
                },

                {
                    text:
                        "欢迎",
                    pause:
                        5000
                },

                {
                    text:
                        "환영합니다",
                    pause:
                        5000
                }

            ];


            let currentIndex =
                0;


            element.textContent =
                greetings[0].text;


            async function runAnimation() {

                currentIndex =
                    (
                        currentIndex +
                        1
                    ) %
                    greetings.length;


                const greeting =
                    greetings[
                        currentIndex
                    ];


                await deleteText(
                    element
                );


                await wait(
                    350
                );


                await typeText(
                    element,
                    greeting.text
                );


                await wait(
                    greeting.pause
                );


                runAnimation();

            }


            wait(
                5000
            ).then(
                () => {
                    runAnimation();
                }
            );

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
                (
                    resolve
                ) => {

                    let index =
                        0;


                    const interval =
                        setInterval(
                            () => {

                                element.textContent =
                                    text.substring(
                                        0,
                                        index +
                                            1
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

                            },
                            80
                        );

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
                (
                    resolve
                ) => {

                    const interval =
                        setInterval(
                            () => {

                                const currentText =
                                    element.textContent;


                                if (
                                    currentText.length ===
                                    0
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
                                        currentText.length -
                                            1
                                    );


                                if (
                                    currentText.length <=
                                    1
                                ) {

                                    clearInterval(
                                        interval
                                    );

                                    resolve();

                                }

                            },
                            50
                        );

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
                (
                    resolve
                ) => {

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


            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "linked_services"
                    )
                    .select(
                        "linked_at"
                    )
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


            if (!data) {

                unlinked.hidden =
                    false;

                linked.hidden =
                    true;


                setupPollinationsButtons();

                return;

            }


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
                            day:
                                "numeric",
                            month:
                                "long",
                            year:
                                "numeric"
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


            if (linkButton) {

                linkButton.onclick =
                    startPollinationsOAuth;

            }


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


                const state =
                    generateRandomString(
                        32
                    );


                const codeVerifier =
                    generateRandomString(
                        64
                    );


                const codeChallenge =
                    await createCodeChallenge(
                        codeVerifier
                    );


                sessionStorage.setItem(
                    "pollinations_oauth_state",
                    state
                );


                sessionStorage.setItem(
                    "pollinations_code_verifier",
                    codeVerifier
                );


                const redirectUri =
                    getPollinationsRedirectUri();


                const params =
                    new URLSearchParams(
                        {
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
                        }
                    );


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
                new Uint8Array(
                    length
                );


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
                new Uint8Array(
                    digest
                )
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
                .replace(
                    /\+/g,
                    "-"
                )
                .replace(
                    /\//g,
                    "_"
                )
                .replace(
                    /=+$/,
                    ""
                );

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


            if (confirmButton) {

                confirmButton.disabled =
                    false;

                confirmButton.textContent =
                    "Unlink";

            }


            if (cancelButton) {

                cancelButton.onclick =
                    closeUnlinkModal;

            }


            if (confirmButton) {

                confirmButton.onclick =
                    unlinkPollinations;

            }


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


                const {
                    error
                } =
                    await supabaseClient
                        .from(
                            "linked_services"
                        )
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


                closeUnlinkModal();


                unlinkButton.disabled =
                    false;

                unlinkButton.textContent =
                    "Unlink";


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


                console.error(
                    "Unable to unlink Pollinations right now."
                );

            }

        }

    }
);

