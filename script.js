const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const year = document.getElementById("year");
const counters = document.querySelectorAll(".counter");
const reveals = document.querySelectorAll(".reveal");
const spaceType = document.getElementById("spaceType");
const spaceRange = document.getElementById("spaceRange");
const spaceValue = document.getElementById("spaceValue");
const estimateOutput = document.getElementById("estimateOutput");
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (reveals.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach((item) => revealObserver.observe(item));
}

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

if (counters.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const formatCzk = (value) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(value);

const updateEstimate = () => {
  if (!spaceType || !spaceRange || !spaceValue || !estimateOutput) {
    return;
  }

  const rate = Number(spaceType.value);
  const meters = Number(spaceRange.value);
  const estimate = rate * meters;

  spaceValue.textContent = String(meters);
  estimateOutput.textContent = `Orientačně: ${formatCzk(estimate)}`;
};

if (spaceType && spaceRange) {
  spaceType.addEventListener("change", updateEstimate);
  spaceRange.addEventListener("input", updateEstimate);
  updateEstimate();
}

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.textContent = "Děkujeme! Ozveme se vám co nejdříve.";
    contactForm.reset();
    updateEstimate();
  });
}
