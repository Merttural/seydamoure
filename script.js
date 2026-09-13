const createPlaceholder = (type, index = 0) => {
  const galleryPalettes = [
    ["#b5a08e", "#d9c9b9", "#6f7866"],
    ["#b8aba0", "#e3d7c8", "#8c776e"],
    ["#9c9a83", "#d8c7ae", "#606851"],
    ["#c6b4a1", "#eee5d8", "#7c665b"],
    ["#99887b", "#d5bca3", "#575f4c"],
    ["#b7a994", "#e0cfb9", "#776b5f"],
  ];
  const [dark, light, accent] = galleryPalettes[index % galleryPalettes.length];
  const hero = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 760">
      <defs>
        <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#c6ae9b"/><stop offset=".5" stop-color="#e7cbb0"/><stop offset="1" stop-color="#807b61"/></linearGradient>
        <radialGradient id="sun"><stop stop-color="#fff4d8"/><stop offset="1" stop-color="#e8b982" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1920" height="760" fill="url(#sky)"/>
      <circle cx="1430" cy="230" r="260" fill="url(#sun)"/>
      <path d="M0 445 Q360 390 720 455 T1450 425 T1920 450 V760H0Z" fill="#6c7054"/>
      <path d="M210 0v185m-42 0h84m-66-12q24 48 48 0" stroke="#4e493f" stroke-width="6" fill="none" opacity=".7"/>
      <ellipse cx="960" cy="550" rx="525" ry="54" fill="#d4c2aa"/>
      <rect x="460" y="545" width="1000" height="38" fill="#b8a38d"/>
      <path d="M530 584l-35 176m895-176 35 176" stroke="#4f4b41" stroke-width="18"/>
      <g fill="#e8ded0"><circle cx="670" cy="520" r="23"/><circle cx="950" cy="515" r="27"/><circle cx="1240" cy="522" r="23"/></g>
      <g fill="#695f55"><rect x="580" y="585" width="16" height="130"/><rect x="830" y="585" width="16" height="130"/><rect x="1090" y="585" width="16" height="130"/><rect x="1330" y="585" width="16" height="130"/></g>
      <rect width="1920" height="760" fill="#5e4a3b" opacity=".08"/>
    </svg>`;
  const gallery = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 680">
      <defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>
      <rect width="520" height="680" fill="url(#g)"/>
      <ellipse cx="${260 + (index % 3 - 1) * 45}" cy="470" rx="210" ry="42" fill="#ede4d7" opacity=".8"/>
      <path d="M80 510 Q260 400 445 515" stroke="#6c5e53" stroke-width="15" fill="none" opacity=".5"/>
      <g fill="${accent}" opacity=".78">
        <circle cx="150" cy="410" r="40"/><circle cx="200" cy="380" r="32"/><circle cx="250" cy="420" r="45"/>
        <circle cx="320" cy="390" r="36"/><circle cx="370" cy="423" r="43"/>
      </g>
      <path d="M255 0v210m-54 0h108m-78-22q24 50 48 0" stroke="#554c43" stroke-width="5" fill="none" opacity=".45"/>
      <rect width="520" height="680" fill="#fff" opacity=".05"/>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(type === "hero" ? hero : gallery)}`;
};

const initializePlaceholder = (image, index) => {
  const applyPlaceholder = () => {
    image.src = createPlaceholder(image.dataset.placeholder, Math.max(0, index - 1));
    image.classList.add("is-placeholder");
  };
  image.addEventListener("error", applyPlaceholder, { once: true });
  if (image.complete && image.naturalWidth === 0) applyPlaceholder();
};

document.querySelectorAll("img[data-placeholder]").forEach(initializePlaceholder);

const menuButton = document.querySelector(".sd-menu-button");
const menuClose = document.querySelector(".sd-menu-close");
const menuOverlay = document.querySelector(".sd-menu-overlay");
const menuLinks = document.querySelectorAll(".sd-menu-nav a");

const setMenu = (open) => {
  menuOverlay.classList.toggle("is-open", open);
  menuOverlay.setAttribute("aria-hidden", String(!open));
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  document.body.style.overflow = open ? "hidden" : "";
  if (open) menuClose.focus();
  else menuButton.focus();
};

menuButton.addEventListener("click", () => setMenu(true));
menuClose.addEventListener("click", () => setMenu(false));
menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuOverlay.classList.contains("is-open")) setMenu(false);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.09 },
);
document.querySelectorAll(".sd-reveal").forEach((section) => revealObserver.observe(section));

const gallery = document.querySelector(".sd-gallery");
const track = gallery.querySelector(".sd-gallery__track");
const originals = [...track.children];

originals.forEach((item) => track.append(item.cloneNode(true)));
track.querySelectorAll("figure:nth-child(n+7) img[data-placeholder]").forEach(initializePlaceholder);

const configureGalleryFlow = () => {
  const firstItem = track.firstElementChild;
  if (!firstItem) return;
  const distance = (firstItem.getBoundingClientRect().width + 5) * originals.length;
  track.style.setProperty("--sd-gallery-distance", `${distance}px`);
  track.style.setProperty("--sd-gallery-duration", `${Math.max(65, distance / 20)}s`);
};

let galleryResizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(galleryResizeTimer);
  galleryResizeTimer = window.setTimeout(configureGalleryFlow, 150);
});
configureGalleryFlow();

const reviews = document.querySelector(".sd-reviews");
const reviewsTrack = reviews.querySelector(".sd-reviews__track");
const reviewCards = [...reviewsTrack.children];
reviewCards.forEach((card) => reviewsTrack.append(card.cloneNode(true)));

const configureReviewsFlow = () => {
  const firstCard = reviewsTrack.firstElementChild;
  if (!firstCard) return;
  const distance = (firstCard.getBoundingClientRect().width + 12) * reviewCards.length;
  reviewsTrack.style.setProperty("--sd-reviews-distance", `${distance}px`);
  reviewsTrack.style.setProperty("--sd-reviews-duration", `${Math.max(55, distance / 18)}s`);
};

let reviewsResizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(reviewsResizeTimer);
  reviewsResizeTimer = window.setTimeout(configureReviewsFlow, 150);
});
configureReviewsFlow();

const lightbox = document.querySelector(".sd-lightbox");
const lightboxImage = lightbox.querySelector(".sd-lightbox__image");
const lightboxClose = lightbox.querySelector(".sd-lightbox__close");
const galleryImages = originals.map((figure) => figure.querySelector("img"));
let lightboxIndex = 0;

const showLightboxImage = (index) => {
  lightboxIndex = (index + galleryImages.length) % galleryImages.length;
  const selectedImage = galleryImages[lightboxIndex];
  lightboxImage.src = selectedImage.currentSrc || selectedImage.src;
  lightboxImage.alt = selectedImage.alt;
};

let galleryPointerX = 0;
const galleryViewport = gallery.querySelector(".sd-gallery__viewport");
galleryViewport.addEventListener("pointerdown", (event) => {
  galleryPointerX = event.clientX;
});

gallery.addEventListener("click", (event) => {
  if (Math.abs(event.clientX - galleryPointerX) > 8) return;
  const selectedImage = event.target.closest("figure img");
  if (!selectedImage) return;
  const selectedSrc = selectedImage.currentSrc || selectedImage.src;
  const selectedIndex = galleryImages.findIndex(
    (image) => (image.currentSrc || image.src) === selectedSrc,
  );
  showLightboxImage(selectedIndex >= 0 ? selectedIndex : 0);
  track.style.animationPlayState = "paused";
  lightbox.showModal();
});

lightboxImage.addEventListener("click", () => {
  showLightboxImage(lightboxIndex + 1);
  lightboxImage.animate([{ opacity: 0.45 }, { opacity: 1 }], {
    duration: 400,
    easing: "ease-out",
  });
});

lightboxClose.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  track.style.animationPlayState = "";
});

const form = document.querySelector(".sd-form");
const formStatus = document.querySelector(".sd-form__status");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    "Merhaba SeydAmour’e,",
    "",
    "Yeni bir organizasyon teklifi almak istiyorum.",
    "",
    `Ad Soyad: ${data.get("name") || "—"}`,
    `Telefon: ${data.get("phone") || "—"}`,
    `E-posta: ${data.get("email") || "—"}`,
    `Organizasyon Türü: ${data.get("eventType") || "—"}`,
    `Tarih: ${data.get("date") || "—"}`,
    `Şehir: ${data.get("city") || "—"}`,
    `Notlar: ${data.get("notes") || "—"}`,
  ].join("\n");

  formStatus.textContent = "WhatsApp açılıyor…";
  window.open(`https://wa.me/905373112001?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

const hero = document.querySelector(".sd-hero");
const heroVideo = hero?.querySelector(".sd-hero__video");
if (heroVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const showHeroVideo = () => {
    hero.classList.add("is-video");
    heroVideo.play().catch(() => hero.classList.remove("is-video"));
  };
  heroVideo.addEventListener("loadeddata", showHeroVideo);
  heroVideo.addEventListener("error", () => hero.classList.remove("is-video"));
  if (heroVideo.readyState >= 2) showHeroVideo();
}
