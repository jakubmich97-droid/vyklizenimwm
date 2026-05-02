const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const year = document.getElementById("year");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const pills = document.querySelectorAll(".pill");
const spaceRange = document.getElementById("spaceRange");
const spaceValue = document.getElementById("spaceValue");
const estimateOutput = document.getElementById("estimateOutput");
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const backToTop = document.getElementById("backToTop");

let activeRate = 85;

if (year) year.textContent = new Date().getFullYear();

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

if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  reveals.forEach((el) => revealObserver.observe(el));
}

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || "";
  const start = performance.now();
  const duration = 1200;

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

if (counters.length) {
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

const formatCzk = (value) => new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(value);

const updateEstimate = () => {
  if (!spaceRange || !spaceValue || !estimateOutput) return;
  const meters = Number(spaceRange.value);
  spaceValue.textContent = String(meters);
  estimateOutput.textContent = `Orientačně: ${formatCzk(meters * activeRate)}`;
};

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
    activeRate = Number(pill.dataset.rate);
    updateEstimate();
  });
});

spaceRange?.addEventListener("input", updateEstimate);
updateEstimate();

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formFeedback.textContent = "Prosím doplňte všechna povinná pole ve správném formátu.";
      formFeedback.className = "form-feedback error";
      contactForm.reportValidity();
      return;
    }

    formFeedback.textContent = "Děkujeme! Poptávku jsme přijali a co nejdříve se ozveme.";
    formFeedback.className = "form-feedback success";
    contactForm.reset();
  });
}

window.addEventListener("scroll", () => {
  if (!backToTop) return;
  backToTop.classList.toggle("show", window.scrollY > 500);
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
