document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("lineSidebar");

    if (!sidebar) {
        return;
    }


    const items = Array.from(
        sidebar.querySelectorAll(
            ".line-sidebar__item"
        )
    );


    const sections = items
        .map(item => {
            const id =
                item.dataset.section;

            return document.getElementById(id);
        })
        .filter(Boolean);


    const FALLOFF_CURVES = {

        linear: p => p,

        smooth: p =>
            p * p * (3 - 2 * p),

        sharp: p =>
            p * p * p

    };


    const proximityRadius = 100;

    const maxShift = 30;

    const smoothing = 100;


    let targets = [];

    let current = [];

    let animationFrame = null;

    let lastTime = performance.now();


    function runFrame(now) {

        const dt =
            Math.min(
                (now - lastTime) / 1000,
                0.05
            );

        lastTime = now;


        const tau =
            Math.max(
                smoothing,
                1
            ) / 1000;


        const k =
            1 -
            Math.exp(
                -dt / tau
            );


        let moving = false;


        items.forEach(
            (item, index) => {

                const target =
                    Math.max(
                        targets[index] || 0,
                        item.classList.contains(
                            "active"
                        )
                            ? 1
                            : 0
                    );


                const value =
                    current[index] || 0;


                const next =
                    value +
                    (target - value) * k;


                const settled =
                    Math.abs(
                        target - next
                    ) < 0.0015;


                const effect =
                    settled
                        ? target
                        : next;


                current[index] =
                    effect;


                item.style.setProperty(
                    "--effect",
                    effect.toFixed(4)
                );


                if (!settled) {
                    moving = true;
                }

            }
        );


        animationFrame =
            moving
                ? requestAnimationFrame(
                    runFrame
                )
                : null;

    }


    function startAnimation() {

        if (
            animationFrame !== null
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        lastTime =
            performance.now();


        animationFrame =
            requestAnimationFrame(
                runFrame
            );

    }


    function handlePointerMove(event) {

        const rect =
            sidebar.getBoundingClientRect();


        const pointerY =
            event.clientY -
            rect.top;


        const ease =
            FALLOFF_CURVES.smooth;


        targets =
            items.map(item => {

                const center =
                    item.offsetTop +
                    item.offsetHeight / 2;


                const distance =
                    Math.abs(
                        pointerY -
                        center
                    );


                return ease(
                    Math.max(
                        0,
                        1 -
                        distance /
                        proximityRadius
                    )
                );

            });


        startAnimation();

    }


    function handlePointerLeave() {

        targets =
            items.map(() => 0);


        startAnimation();

    }


    sidebar.addEventListener(
        "pointermove",
        handlePointerMove
    );


    sidebar.addEventListener(
        "pointerleave",
        handlePointerLeave
    );


    /* ========================================
       SIDEBAR CLICK
    ======================================== */

    items.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const targetId =
                    item.dataset.section;


                const target =
                    document.getElementById(
                        targetId
                    );


                if (!target) {
                    return;
                }


                items.forEach(
                    other => {

                        other.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


                startAnimation();

            }
        );

    });


    /* ========================================
       ACTIVE SECTION
    ======================================== */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const id =
                            entry.target.id;


                        items.forEach(
                            item => {

                                item.classList.toggle(
                                    "active",
                                    item.dataset.section ===
                                    id
                                );

                            }
                        );


                        startAnimation();

                    }
                );

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(
        section => {

            observer.observe(
                section
            );

        }
    );


    /* ========================================
       INITIAL STATE
    ======================================== */

    targets =
        items.map(() => 0);


    current =
        items.map(() => 0);


    startAnimation();

});