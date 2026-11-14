const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  siteMenu.setAttribute("aria-hidden", String(!isOpen));
  siteMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

siteMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

const currentYear = new Date().getFullYear();
document.querySelector("#year").textContent = currentYear;

const revealTargets = document.querySelectorAll(
  [
    ".site-header .wordmark",
    ".header-socials",
    ".menu-toggle",
    ".hero-index",
    ".hero h1",
    ".portrait-wrap",
    ".hero-intro > *",
    ".scroll-cue",
    ".hero-location",
    ".section-label",
    ".about-content > .eyebrow",
    ".about-content > h2",
    ".about-bottom > *",
    ".work-heading > *",
    ".project-card",
    ".work-note",
    ".experience-heading > *",
    ".experience-item",
    ".skills-heading > *",
    ".skill-group",
    ".skill-tags > li",
    ".contact > *",
    ".site-footer > *",
    ".social-list--footer > li",
  ].join(","),
);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px", threshold: 0.08 },
  );

  revealTargets.forEach((target) => {
    const siblingIndex = Array.prototype.indexOf.call(target.parentElement.children, target);
    target.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 4) * 70}ms`);
    target.classList.add("reveal-item");
    revealObserver.observe(target);
  });

  document.documentElement.classList.add("reveal-enabled");
}

const contactDialog = document.querySelector("#contact-dialog");
const contactOpenButton = document.querySelector("#contact-open");
const contactCloseButton = document.querySelector(".contact-dialog-close");
const contactForm = document.querySelector("#contact-form");
const contactFormStatus = document.querySelector("#contact-form-status");

contactOpenButton?.addEventListener("click", () => {
  contactDialog.showModal();
  contactDialog.querySelector('input[name="name"]').focus();
});

contactCloseButton?.addEventListener("click", () => {
  contactDialog.close();
});

contactDialog?.addEventListener("click", (event) => {
  if (event.target === contactDialog) {
    contactDialog.close();
  }
});

contactDialog?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    contactDialog.close();
  }
});

contactDialog?.addEventListener("close", () => {
  window.requestAnimationFrame(() => contactOpenButton?.focus());
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const formData = new FormData(contactForm);
  formData.set("_replyto", String(formData.get("email")));
  formData.set("_subject", `Portfolio hello from ${formData.get("name")}`);

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  contactFormStatus.textContent = "TRANSMITTING / SENDING YOUR NOTE...";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(result.errors)
        ? result.errors.map((error) => error.message).filter(Boolean).join(" ")
        : "";
      throw new Error(errorMessage || "Formspree could not accept this message.");
    }

    contactForm.reset();
    contactFormStatus.textContent = "MESSAGE SENT / THANK YOU FOR THE SIGNAL.";
  } catch (error) {
    console.error("Contact form submission failed:", error);
    contactFormStatus.textContent =
      error instanceof TypeError
        ? "DELIVERY FAILED / CHECK YOUR CONNECTION AND TRY AGAIN."
        : `DELIVERY FAILED / ${error.message}`;
  } finally {
    submitButton.disabled = false;
  }
});
