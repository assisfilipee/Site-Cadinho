/* ==================================================
   RICARDO VIANA | SCRIPT.JS
================================================== */


/* ==================================================
   ANO AUTOMÁTICO NO FOOTER
================================================== */

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


/* ==================================================
   MENU HAMBÚRGUER
================================================== */

const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelector(".nav__links");
const navItems = document.querySelectorAll(".nav__link");

function openMenu() {
  if (!navToggle || !navLinks) return;

  navToggle.classList.add("is-active");
  navLinks.classList.add("is-open");

  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Fechar menu");
}

function closeMenu() {
  if (!navToggle || !navLinks) return;

  navToggle.classList.remove("is-active");
  navLinks.classList.remove("is-open");

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
}

function toggleMenu() {
  if (!navToggle || !navLinks) return;

  const isOpen = navLinks.classList.contains("is-open");

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}


/* Clique no hambúrguer */
if (navToggle) {
  navToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });
}


/* Fecha ao clicar em um link */
navItems.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});


/* Fecha ao clicar fora */
document.addEventListener("click", (event) => {
  if (!navToggle || !navLinks) return;

  const clickedInsideMenu = navLinks.contains(event.target);
  const clickedToggle = navToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
});


/* Fecha ao voltar para desktop */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});


/* ==================================================
   SLIDER / FADE DA HERO
================================================== */

const layers = [
  document.querySelector(".hero__bg"),
  document.querySelector(".hero__bg--top")
];

const images = [
  "./img/cozinha-portfolio.png",
  "./img/dormitorio-portfolio.png",
  "./img/home-office-portfolio.png",
  "./img/sala-portfolio.png",
];

let current = 0;


/* Pré-carrega as imagens */
function preload(srcs) {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();

          img.onload = () => {
            resolve({
              src,
              ok: true
            });
          };

          img.onerror = () => {
            resolve({
              src,
              ok: false
            });
          };

          img.src = src;
        })
    )
  );
}


function setBaseImage(src) {
  if (!layers[0] || !layers[1]) return;

  layers[0].style.backgroundImage = `url('${src}')`;
  layers[1].style.backgroundImage = `url('${src}')`;

  layers[1].style.opacity = 0;
}


function nextHeroImage() {
  if (!layers[0] || !layers[1] || images.length === 0) return;

  current = (current + 1) % images.length;

  const bottom = layers[0];
  const top = layers[1];

  top.style.backgroundImage = `url('${images[current]}')`;
  top.style.opacity = 1;

  setTimeout(() => {
    bottom.style.backgroundImage = `url('${images[current]}')`;
    top.style.opacity = 0;
  }, 1000);
}


/* Inicia slider */
if (layers[0] && layers[1]) {
  preload(images).then((results) => {

    const failed = results
      .filter((result) => !result.ok)
      .map((result) => result.src);

    if (failed.length) {
      console.warn("Imagens não carregaram:", failed);
    }

    const firstOk =
      results.find((result) => result.ok)?.src || images[0];

    setBaseImage(firstOk);

    setInterval(nextHeroImage, 4000);
  });
}


/* ==================================================
   LIGHTBOX
================================================== */

const lightbox = document.getElementById("lightbox");

const lbImg =
  lightbox?.querySelector(".lightbox__img");

const lbCaption =
  lightbox?.querySelector(".lightbox__caption");

const btnClose =
  lightbox?.querySelector(".lightbox__close");

const btnPrev =
  lightbox?.querySelector(".lightbox__prev");

const btnNext =
  lightbox?.querySelector(".lightbox__next");


/* Cards do portfólio */
const workCards = Array.from(
  document.querySelectorAll(".work")
);

let currentIndex = 0;


/* Pega URL do background-image */
function getBgUrl(el) {
  if (!el) return null;

  const bg = getComputedStyle(el).backgroundImage;

  if (!bg || bg === "none") {
    return null;
  }

  const match = bg.match(/url\(["']?(.*?)["']?\)/);

  return match ? match[1] : null;
}


/* Abre Lightbox */
function openLightbox(index) {
  if (!lightbox || !lbImg || !lbCaption) return;

  currentIndex = index;

  const card = workCards[currentIndex];

  if (!card) return;

  const media = card.querySelector(".work__media");

  const imgUrl = getBgUrl(media);

  if (!imgUrl) return;

  const title =
    card.querySelector(".work__info h3")
      ?.textContent
      ?.trim() || "";

  const desc =
    card.querySelector(".work__info p")
      ?.textContent
      ?.trim() || "";

  lbImg.src = imgUrl;

  lbCaption.textContent =
    title
      ? desc
        ? `${title} — ${desc}`
        : title
      : "";

  lightbox.classList.add("is-open");

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";
}


/* Fecha Lightbox */
function closeLightbox() {
  if (!lightbox || !lbImg) return;

  lightbox.classList.remove("is-open");

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  lbImg.src = "";

  document.body.style.overflow = "";
}


/* Imagem anterior */
function prevImage() {
  if (!workCards.length) return;

  currentIndex =
    (currentIndex - 1 + workCards.length) %
    workCards.length;

  openLightbox(currentIndex);
}


/* Próxima imagem */
function nextImage() {
  if (!workCards.length) return;

  currentIndex =
    (currentIndex + 1) %
    workCards.length;

  openLightbox(currentIndex);
}


/* Clique nos cards */
workCards.forEach((card, index) => {

  card.style.cursor = "zoom-in";

  card.addEventListener("click", () => {
    openLightbox(index);
  });

});


/* Botão fechar */
if (btnClose) {
  btnClose.addEventListener(
    "click",
    closeLightbox
  );
}


/* Clique no fundo */
if (lightbox) {

  lightbox.addEventListener(
    "click",
    (event) => {

      if (event.target === lightbox) {
        closeLightbox();
      }

    }
  );

}


/* Imagem anterior */
if (btnPrev) {

  btnPrev.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      prevImage();

    }
  );

}


/* Próxima imagem */
if (btnNext) {

  btnNext.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      nextImage();

    }
  );

}


/* ==================================================
   TECLADO
================================================== */

document.addEventListener("keydown", (event) => {

  /* ESC fecha menu hambúrguer */
  if (event.key === "Escape") {
    closeMenu();
  }


  /* Lightbox fechado */
  if (
    !lightbox ||
    !lightbox.classList.contains("is-open")
  ) {
    return;
  }


  if (event.key === "Escape") {
    closeLightbox();
  }


  if (event.key === "ArrowLeft") {
    prevImage();
  }


  if (event.key === "ArrowRight") {
    nextImage();
  }

});


/* ==================================================
   FORMULÁRIO WHATSAPP
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const form =
      document.getElementById("whatsForm");

    const campoNome =
      document.querySelector(
        '#whatsForm input[name="nome"]'
      );

    const campoTelefone =
      document.getElementById("telefone");

    const campoMensagem =
      document.getElementById("mensagem");


    if (!form || !campoMensagem) {
      return;
    }


    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const nome =
          campoNome?.value.trim() || "";

        const telefone =
          campoTelefone?.value.trim() || "";

        const mensagem =
          campoMensagem.value.trim();


        if (mensagem.length === 0) {

          alert(
            "Digite uma mensagem antes de enviar."
          );

          campoMensagem.focus();

          return;
        }


        const phone =
          "5554984338859";


        const texto =
          encodeURIComponent(
`Olá, Ricardo!

Nome: ${nome}

Telefone: ${telefone}

Mensagem: ${mensagem}`
          );


        const whatsappUrl =
          `https://wa.me/${phone}?text=${texto}`;


        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  }
);


/* ==================================================
   MÁSCARA TELEFONE BR
================================================== */

const telefoneInput =
  document.getElementById("telefone");


if (telefoneInput) {

  telefoneInput.addEventListener(
    "input",
    () => {

      let valor =
        telefoneInput.value.replace(/\D/g, "");


      if (valor.length > 11) {

        valor =
          valor.slice(0, 11);

      }


      if (valor.length > 6) {

        telefoneInput.value =
          `(${valor.slice(0, 2)}) ` +
          `${valor.slice(2, 7)}-` +
          `${valor.slice(7)}`;

      }

      else if (valor.length > 2) {

        telefoneInput.value =
          `(${valor.slice(0, 2)}) ` +
          `${valor.slice(2)}`;

      }

      else if (valor.length > 0) {

        telefoneInput.value =
          `(${valor}`;

      }

      else {

        telefoneInput.value = "";

      }

    }
  );

}