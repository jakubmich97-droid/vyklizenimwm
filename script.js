const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const year = document.getElementById("year");
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll("#serviceCards .card");
const sizeRange = document.getElementById("sizeRange");
const sizeValue = document.getElementById("sizeValue");
const priceValue = document.getElementById("priceValue");
const testimonials = document.querySelectorAll(".testimonial");
const dots = document.querySelectorAll(".dot");
const form = document.getElementById("contactForm");
const formNotice = document.getElementById("formNotice");

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

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });

    chip.classList.add("is-active");
    chip.setAttribute("aria-selected", "true");

    const filter = chip.dataset.filter;
    cards.forEach((card) => {
      const category = card.dataset.category || "";
      card.style.display = filter === "all" || category.includes(filter) ? "block" : "none";
    });
  });
});

if (sizeRange && sizeValue && priceValue) {
  const updateEstimate = () => {
    const size = Number(sizeRange.value);
    const base = 1900;
    const dynamic = Math.round(size * 46);
    const estimate = base + dynamic;

    sizeValue.textContent = `${size} m²`;
    priceValue.textContent = `${estimate.toLocaleString("cs-CZ")} Kč`;
  };

  sizeRange.addEventListener("input", updateEstimate);
  updateEstimate();
}

let activeSlide = 0;

const showSlide = (index) => {
  activeSlide = index;
  testimonials.forEach((slide, i) => {
    slide.classList.toggle("is-visible", i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === index);
  });
};

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide));
  });
});

if (testimonials.length > 1) {
  setInterval(() => {
    const next = (activeSlide + 1) % testimonials.length;
    showSlide(next);
  }, 6000);
}

if (form && formNotice) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formNotice.textContent = "Děkujeme! Ozveme se vám co nejdříve.";
    form.reset();
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".card, .estimate-card, .testimonial-wrap, .faq-list details").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

const counters = document.querySelectorAll("[data-counter]");

const animateCounter = (counter) => {
  const target = Number(counter.dataset.counter);
  let current = 0;
  const step = Math.max(1, Math.round(target / 30));

  const tick = () => {
    current += step;
    if (current >= target) {
      const suffix = counter.dataset.suffix || "";
      counter.textContent = `${target}${suffix}`;
      return;
    }
    counter.textContent = String(current);
    requestAnimationFrame(tick);
  };

  tick();
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));
