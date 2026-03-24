const revealItems = document.querySelectorAll(
  ".section-card, .program-card, .method-card, .trust-strip"
);

revealItems.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const leadForm = document.querySelector(".lead-form");

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = leadForm.querySelector("button");

  if (button) {
    button.textContent = "Заявка принята";
    button.disabled = true;
  }
});
