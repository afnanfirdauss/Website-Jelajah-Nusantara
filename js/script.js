document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       1. HEADER SAAT SCROLL
       ===================================================== */

    const afnanHeader = document.querySelector(".afnan-header");

    if (afnanHeader) {
        const afnanUpdateHeader = function () {
            afnanHeader.classList.toggle("afnan-scrolled", window.scrollY > 10);
        };

        afnanUpdateHeader();
        window.addEventListener("scroll", afnanUpdateHeader, { passive: true });
    }

    /* =====================================================
       2. MENU NAVIGASI MOBILE
       ===================================================== */

    const afnanMenuToggle = document.getElementById("afnan-menu-toggle");
    const afnanNavLinks = document.getElementById("afnan-nav-links");

    if (afnanMenuToggle && afnanNavLinks) {
        const afnanCloseMenu = function () {
            afnanNavLinks.classList.remove("afnan-open");
            afnanMenuToggle.setAttribute("aria-expanded", "false");
            afnanMenuToggle.textContent = "☰";
        };

        afnanMenuToggle.addEventListener("click", function () {
            const afnanIsOpen = afnanNavLinks.classList.toggle("afnan-open");

            afnanMenuToggle.setAttribute("aria-expanded", String(afnanIsOpen));
            afnanMenuToggle.textContent = afnanIsOpen ? "×" : "☰";
        });

        afnanNavLinks.querySelectorAll("a").forEach(function (afnanLink) {
            afnanLink.addEventListener("click", afnanCloseMenu);
        });
    }

    /* =====================================================
       3. FILTER DESTINASI
       ===================================================== */

    const afnanFilterContainer = document.getElementById("afnan-destination-filters");

    const afnanDestinationCards = document.querySelectorAll(
        ".afnan-destination-card[data-category]",
    );

    if (afnanFilterContainer && afnanDestinationCards.length) {
        afnanFilterContainer.querySelectorAll(".afnan-filter-btn").forEach(function (afnanButton) {
            afnanButton.addEventListener("click", function () {
                afnanFilterContainer
                    .querySelectorAll(".afnan-filter-btn")
                    .forEach(function (afnanItem) {
                        afnanItem.classList.remove("afnan-filter-active");
                    });

                afnanButton.classList.add("afnan-filter-active");

                const afnanFilter = afnanButton.dataset.filter;

                afnanDestinationCards.forEach(function (afnanCard) {
                    afnanCard.hidden = !(
                        afnanFilter === "all" || afnanCard.dataset.category === afnanFilter
                    );
                });
            });
        });
    }

    /* =====================================================
       4. PENCARIAN DESTINASI DARI HALAMAN HOME
       ===================================================== */

    const afnanTravelSearch = document.getElementById("afnan-travel-search");
    const afnanDateInput = document.getElementById("afnan-date");

    if (afnanDateInput) {
        const afnanToday = new Date().toISOString().split("T")[0];
        afnanDateInput.min = afnanToday;
    }

    if (afnanTravelSearch) {
        afnanTravelSearch.addEventListener("submit", function (afnanEvent) {
            afnanEvent.preventDefault();

            const afnanDestination = document.getElementById("afnan-destination").value.trim();

            const afnanRegion = document.getElementById("afnan-region").value;

            const afnanParams = new URLSearchParams();

            if (afnanDestination) {
                afnanParams.set("tempat", afnanDestination);
            }

            if (afnanRegion) {
                afnanParams.set("wilayah", afnanRegion);
            }

            window.location.href = "destinasi.html?" + afnanParams.toString();
        });
    }

    /* =====================================================
       5. MENAMPILKAN HASIL PENCARIAN DESTINASI
       ===================================================== */

    const afnanDestinationGrid = document.getElementById("afnan-destination-grid");

    if (afnanDestinationGrid) {
        const afnanParams = new URLSearchParams(window.location.search);

        const afnanPlace = (afnanParams.get("tempat") || "").toLowerCase();

        const afnanRegion = (afnanParams.get("wilayah") || "").toLowerCase();

        const afnanNote = document.getElementById("afnan-search-note");

        let afnanVisibleCount = 0;

        afnanDestinationGrid
            .querySelectorAll(".afnan-destination-card")
            .forEach(function (afnanCard) {
                const afnanText = afnanCard.textContent.toLowerCase();

                const afnanCategory = (afnanCard.dataset.category || "").toLowerCase();

                const afnanMatches =
                    (!afnanPlace || afnanText.includes(afnanPlace)) &&
                    (!afnanRegion || afnanCategory === afnanRegion);

                afnanCard.hidden = !afnanMatches;

                if (afnanMatches) {
                    afnanVisibleCount++;
                }
            });

        if ((afnanPlace || afnanRegion) && afnanNote) {
            afnanNote.textContent = afnanVisibleCount
                ? "Menampilkan " +
                  afnanVisibleCount +
                  " destinasi yang sesuai dengan pencarian Anda."
                : "Destinasi tidak ditemukan. Coba kata kunci atau wilayah lain.";
        }
    }

    /* =====================================================
       6. FORM KONTAK
       ===================================================== */

    const afnanContactForm = document.getElementById("afnan-contact-form");

    if (afnanContactForm) {
        const afnanFormMessage = document.getElementById("afnan-form-message");

        const afnanSubmitButton = afnanContactForm.querySelector('button[type="submit"]');

        const afnanSetFormMessage = function (afnanText, afnanState) {
            if (!afnanFormMessage) {
                return;
            }

            afnanFormMessage.textContent = afnanText;
            afnanFormMessage.dataset.state = afnanState || "";
        };

        afnanContactForm.addEventListener("submit", async function (afnanEvent) {
            afnanEvent.preventDefault();

            if (!afnanContactForm.checkValidity()) {
                afnanContactForm.reportValidity();
                afnanSetFormMessage("Mohon lengkapi kolom bertanda *.", "error");
                return;
            }

            const afnanOriginalButton = afnanSubmitButton
                ? afnanSubmitButton.innerHTML
                : "";

            if (afnanSubmitButton) {
                afnanSubmitButton.disabled = true;
                afnanSubmitButton.classList.add("afnan-is-loading");
                afnanSubmitButton.innerHTML = "<span>Mengirim...</span>";
            }

            afnanSetFormMessage("Sedang mengirim pesan Anda...", "pending");

            try {
                const afnanResponse = await fetch(afnanContactForm.action, {
                    method: "POST",
                    body: new FormData(afnanContactForm),
                    headers: {
                        Accept: "application/json",
                    },
                });

                const afnanData = await afnanResponse.json().catch(function () {
                    return {};
                });

                if (afnanResponse.ok && afnanData.success) {
                    afnanContactForm.reset();
                    afnanSetFormMessage(
                        "Terima kasih! Pesan Anda berhasil dikirim. Kami akan membalas melalui email dalam 1×24 jam kerja.",
                        "success",
                    );
                } else {
                    afnanSetFormMessage(
                        afnanData.message ||
                            "Maaf, pesan belum berhasil dikirim. Silakan coba lagi.",
                        "error",
                    );
                }
            } catch (afnanError) {
                afnanSetFormMessage(
                    "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.",
                    "error",
                );
            } finally {
                if (afnanSubmitButton) {
                    afnanSubmitButton.disabled = false;
                    afnanSubmitButton.classList.remove("afnan-is-loading");
                    afnanSubmitButton.innerHTML = afnanOriginalButton;
                }
            }
        });
    }

    /* =====================================================
       7. LIGHTBOX GALERI
       ===================================================== */

    const afnanGalleryItems = document.querySelectorAll(".afnan-gallery-item");
    const afnanLightbox = document.getElementById("afnan-lightbox");
    const afnanLightboxImage = document.getElementById("afnan-lightbox-image");
    const afnanLightboxClose = document.getElementById("afnan-lightbox-close");

    if (afnanGalleryItems.length && afnanLightbox && afnanLightboxImage) {
        const afnanOpenLightbox = function (afnanImage) {
            afnanLightboxImage.src = afnanImage.src;
            afnanLightboxImage.alt = afnanImage.alt;
            afnanLightbox.classList.add("afnan-open");
            document.body.classList.add("afnan-no-scroll");
        };

        const afnanCloseLightbox = function () {
            afnanLightbox.classList.remove("afnan-open");
            document.body.classList.remove("afnan-no-scroll");
            afnanLightboxImage.src = "";
        };

        afnanGalleryItems.forEach(function (afnanItem) {
            afnanItem.setAttribute("tabindex", "0");
            afnanItem.setAttribute("role", "button");

            const afnanShowImage = function () {
                const afnanImage = afnanItem.querySelector("img");
                if (afnanImage) {
                    afnanOpenLightbox(afnanImage);
                }
            };

            afnanItem.addEventListener("click", afnanShowImage);

            afnanItem.addEventListener("keydown", function (afnanEvent) {
                if (afnanEvent.key === "Enter" || afnanEvent.key === " ") {
                    afnanEvent.preventDefault();
                    afnanShowImage();
                }
            });
        });

        if (afnanLightboxClose) {
            afnanLightboxClose.addEventListener("click", afnanCloseLightbox);
        }

        afnanLightbox.addEventListener("click", function (afnanEvent) {
            if (afnanEvent.target === afnanLightbox) {
                afnanCloseLightbox();
            }
        });

        document.addEventListener("keydown", function (afnanEvent) {
            if (afnanEvent.key === "Escape" && afnanLightbox.classList.contains("afnan-open")) {
                afnanCloseLightbox();
            }
        });
    }

    /* =====================================================
       8. ANIMASI REVEAL SAAT SCROLL
       ===================================================== */

    const afnanRevealTargets = document.querySelectorAll(
        ".afnan-section .afnan-section-heading, " +
            ".afnan-section .afnan-centered-heading, " +
            ".afnan-card-grid > *, " +
            ".afnan-feature-grid > *, " +
            ".afnan-testimonial-grid > *, " +
            ".afnan-about-media, " +
            ".afnan-about-content, " +
            ".afnan-detail-main > *, " +
            ".afnan-booking-card, " +
            ".afnan-contact-card, " +
            ".afnan-contact-info, " +
            ".afnan-contact-form, " +
            ".afnan-gallery-item",
    );

    if (afnanRevealTargets.length) {
        const afnanReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!afnanReducedMotion && "IntersectionObserver" in window) {
            const afnanObserver = new IntersectionObserver(
                function (afnanEntries) {
                    afnanEntries.forEach(function (afnanEntry) {
                        if (afnanEntry.isIntersecting) {
                            afnanEntry.target.classList.add("afnan-visible");
                            afnanObserver.unobserve(afnanEntry.target);
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px",
                },
            );

            afnanRevealTargets.forEach(function (afnanTarget) {
                afnanTarget.classList.add("afnan-reveal");
                afnanObserver.observe(afnanTarget);
            });
        }
    }
});
