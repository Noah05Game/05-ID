(function () {

    "use strict";


    /*
    ========================================
    05 ID SDK
    ========================================
    */

    const FIVE_ID = {

        version: "0.1.0",


        /*
        ========================================
        INITIALISE
        ========================================
        */

        init(options = {}) {

            const container =
                document.getElementById(
                    options.containerId ||
                    "05-id-login"
                );

            if (!container) {

                console.error(
                    "05 ID: Login container not found."
                );

                return;

            }


            /*
            ------------------------------------
            CONFIGURATION
            ------------------------------------
            */

            const config = {

                authorizeUrl:
                    options.authorizeUrl ||
                    "authorize.html",

                animation:
                    options.animation !== false,

                animationDelay:
                    options.animationDelay ||
                    3000,

                greetingDuration:
                    options.greetingDuration ||
                    5000

            };


            /*
            ------------------------------------
            CREATE BUTTON
            ------------------------------------
            */

            createButton(
                container,
                config
            );

        }

    };


    /*
    ========================================
    CREATE BUTTON
    ========================================
    */

    function createButton(
        container,
        config
    ) {

        /*
        ------------------------------------
        WRAPPER
        ------------------------------------
        */

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "five-id-wrapper";


        /*
        ------------------------------------
        BUTTON
        ------------------------------------
        */

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "five-id-button";


        /*
        ------------------------------------
        LOGO
        ------------------------------------
        */

        const logo =
            document.createElement(
                "img"
            );

        logo.className =
            "five-id-logo";

        logo.src =
            "../assets/05-id-logo.png";

        logo.alt =
            "05 ID";

        logo.draggable =
            false;


        /*
        ------------------------------------
        TEXT CONTAINER
        ------------------------------------
        */

        const textContainer =
            document.createElement(
                "span"
            );

        textContainer.className =
            "five-id-text";


        /*
        ------------------------------------
        INITIAL TEXT
        ------------------------------------
        */

        textContainer.textContent =
            "Continue with 05 ID";


        /*
        ------------------------------------
        BUILD BUTTON
        ------------------------------------
        */

        button.appendChild(
            logo
        );

        button.appendChild(
            textContainer
        );

        wrapper.appendChild(
            button
        );

        container.innerHTML =
            "";

        container.appendChild(
            wrapper
        );


        /*
        ------------------------------------
        STYLES
        ------------------------------------
        */

        injectStyles();


        /*
        ------------------------------------
        ANIMATION
        ------------------------------------
        */

        if (config.animation) {

            startAnimation(
                textContainer,
                config
            );

        }


        /*
        ------------------------------------
        CLICK
        ------------------------------------
        */

        button.addEventListener(
            "click",
            () => {

                button.disabled =
                    true;

                textContainer.classList.add(
                    "five-id-loading"
                );

                textContainer.textContent =
                    "Connecting...";


                /*
                ------------------------------
                REDIRECT
                ------------------------------
                */

                const redirect =
                    window.location.href;

                const url =
                    config.authorizeUrl +
                    "?redirect=" +
                    encodeURIComponent(
                        redirect
                    );

                window.location.href =
                    url;

            }
        );

    }


    /*
    ========================================
    ANIMATION
    ========================================
    */

    function startAnimation(
        textElement,
        config
    ) {

        let running =
            true;


        /*
        ------------------------------------
        CONTINUE → HELLO
        ------------------------------------
        */

        function showGreeting() {

            if (!running) {
                return;
            }


            /*
            Fade out
            */

            textElement.classList.add(
                "five-id-text-out"
            );


            setTimeout(
                () => {

                    if (!running) {
                        return;
                    }


                    /*
                    --------------------------
                    GET NAME
                    --------------------------
                    */

                    const name =
                        getUserName();


                    if (name) {

                        textElement.textContent =
                            `Hello ${name}`;

                    } else {

                        textElement.textContent =
                            "Hello";

                    }


                    /*
                    --------------------------
                    FADE IN
                    --------------------------
                    */

                    textElement.classList.remove(
                        "five-id-text-out"
                    );

                    textElement.classList.add(
                        "five-id-text-in"
                    );


                    setTimeout(
                        () => {

                            textElement.classList.remove(
                                "five-id-text-in"
                            );

                            setTimeout(
                                showContinue,
                                config.greetingDuration
                            );

                        },
                        350
                    );

                },
                250
            );

        }


        /*
        ------------------------------------
        HELLO → CONTINUE
        ------------------------------------
        */

        function showContinue() {

            if (!running) {
                return;
            }


            textElement.classList.add(
                "five-id-text-out"
            );


            setTimeout(
                () => {

                    if (!running) {
                        return;
                    }


                    textElement.textContent =
                        "Continue with 05 ID";


                    textElement.classList.remove(
                        "five-id-text-out"
                    );

                    textElement.classList.add(
                        "five-id-text-in"
                    );


                    setTimeout(
                        () => {

                            textElement.classList.remove(
                                "five-id-text-in"
                            );

                            setTimeout(
                                showGreeting,
                                config.animationDelay
                            );

                        },
                        350
                    );

                },
                250
            );

        }


        /*
        ------------------------------------
        START
        ------------------------------------
        */

        setTimeout(
            showGreeting,
            config.animationDelay
        );

    }


    /*
    ========================================
    GET USER NAME
    ========================================
    */

    function getUserName() {

        /*
        ------------------------------------
        FUTURE AUTHENTICATED USER
        ------------------------------------

        For now this looks for a value
        supplied by the test environment.

        Later this will come from the
        05 ID authentication session.
        ------------------------------------
        */

        const storedName =
            localStorage.getItem(
                "five_id_name"
            );


        if (storedName) {
            return storedName;
        }


        /*
        ------------------------------------
        DEMO NAME
        ------------------------------------

        Temporary only.

        This lets us see the animation
        before the real authentication
        profile system is connected.
        ------------------------------------
        */

        return "Noah";

    }


    /*
    ========================================
    INJECT STYLES
    ========================================
    */

    function injectStyles() {

        if (
            document.getElementById(
                "five-id-sdk-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );

        style.id =
            "five-id-sdk-styles";


        style.textContent = `

            .five-id-wrapper {
                width: 100%;
                display: flex;
                justify-content: center;
            }


            .five-id-button {
                position: relative;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 12px;

                width: 100%;
                max-width: 360px;

                height: 52px;

                padding: 0 20px;

                border: 1px solid #dadce0;

                border-radius: 8px;

                background: #ffffff;

                color: #202124;

                font-family:
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    Roboto,
                    Helvetica,
                    Arial,
                    sans-serif;

                font-size: 15px;

                font-weight: 600;

                cursor: pointer;

                overflow: hidden;

                transition:
                    background 0.15s ease,
                    border-color 0.15s ease,
                    box-shadow 0.15s ease,
                    transform 0.1s ease;
            }


            .five-id-button:hover {

                background: #f8f9fa;

                border-color: #c8c8c8;

                box-shadow:
                    0 1px 3px
                    rgba(0, 0, 0, 0.08);

            }


            .five-id-button:active {

                transform:
                    scale(0.985);

            }


            .five-id-button:disabled {

                cursor: wait;

                opacity: 0.75;

            }


            .five-id-logo {

                width: 22px;

                height: 22px;

                object-fit: contain;

                flex-shrink: 0;

            }


            .five-id-text {

                display: inline-block;

                min-width: 150px;

                text-align: left;

                white-space: nowrap;

                transition:
                    opacity 0.25s ease,
                    transform 0.25s ease;

            }


            .five-id-text-out {

                opacity: 0;

                transform:
                    translateY(5px);

            }


            .five-id-text-in {

                animation:
                    fiveIdTextIn
                    0.35s ease forwards;

            }


            .five-id-loading {

                animation:
                    fiveIdPulse
                    1s ease-in-out infinite;

            }


            @keyframes fiveIdTextIn {

                from {
                    opacity: 0;
                    transform:
                        translateY(-5px);
                }

                to {
                    opacity: 1;
                    transform:
                        translateY(0);
                }

            }


            @keyframes fiveIdPulse {

                0%,
                100% {
                    opacity: 1;
                }

                50% {
                    opacity: 0.55;
                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /*
    ========================================
    GLOBAL SDK
    ========================================
    */

    window.FiveID =
        FIVE_ID;


})();