    document.getElementById("year").textContent = new Date().getFullYear();


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
let topIndex = 1; // a camada de cima começa sendo layers[1]

// Preload (carrega tudo antes de começar)
function preload(srcs) {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ src, ok: true });
          img.onerror = () => resolve({ src, ok: false });
          img.src = src;
        })
    )
  );
}

function setBaseImage(src) {
  layers[0].style.backgroundImage = `url('${src}')`;
  layers[1].style.backgroundImage = `url('${src}')`;
  layers[1].style.opacity = 0;
}

function next() {
  current = (current + 1) % images.length;

  const bottom = layers[0];
  const top = layers[1];

  // coloca a próxima imagem na camada de cima e faz fade
  top.style.backgroundImage = `url('${images[current]}')`;
  top.style.opacity = 1;

  // depois do fade, troca a de baixo pra ficar “fixa” e zera a de cima
  setTimeout(() => {
    bottom.style.backgroundImage = `url('${images[current]}')`;
    top.style.opacity = 0;
  }, 1000);
}

// Start
preload(images).then((results) => {
  const failed = results.filter((r) => !r.ok).map((r) => r.src);

  if (failed.length) {
    console.warn("Imagens não carregaram:", failed);
  }

  // usa a primeira que deu certo
  const firstOk = results.find((r) => r.ok)?.src || images[0];
  setBaseImage(firstOk);

  setInterval(next, 4000);
});

// ========== LIGHTBOX (modal do portfólio) ==========
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector(".lightbox__img");
const lbCaption = lightbox.querySelector(".lightbox__caption");
const btnClose = lightbox.querySelector(".lightbox__close");
const btnPrev = lightbox.querySelector(".lightbox__prev");
const btnNext = lightbox.querySelector(".lightbox__next");

// pega todos os cards do portfolio
const workCards = Array.from(document.querySelectorAll(".work"));
let currentIndex = 0;

function getBgUrl(el) {
  const bg = getComputedStyle(el).backgroundImage; // url("...") ou none
  if (!bg || bg === "none") return null;
  // extrai url do css: url("caminho")
  return bg.slice(5, -2);
}

function openLightbox(index) {
  currentIndex = index;

  const card = workCards[currentIndex];
  const media = card.querySelector(".work__media");
  const imgUrl = getBgUrl(media);

  if (!imgUrl) return;

  const title = card.querySelector(".work__info h3")?.textContent?.trim() || "";
  const desc = card.querySelector(".work__info p")?.textContent?.trim() || "";

  lbImg.src = imgUrl;
  lbCaption.textContent = title ? (desc ? `${title} — ${desc}` : title) : "";

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // trava scroll
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lbImg.src = ""; // evita ficar carregando em background
  document.body.style.overflow = ""; // libera scroll
}

function prevImage() {
  currentIndex = (currentIndex - 1 + workCards.length) % workCards.length;
  openLightbox(currentIndex);
}

function nextImage() {
  currentIndex = (currentIndex + 1) % workCards.length;
  openLightbox(currentIndex);
}

// clique em cada card abre
workCards.forEach((card, i) => {
  card.style.cursor = "zoom-in";
  card.addEventListener("click", () => openLightbox(i));
});

// fechar: X
btnClose.addEventListener("click", closeLightbox);

// fechar clicando fora (fundo)
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// prev/next
btnPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  prevImage();
});
btnNext.addEventListener("click", (e) => {
  e.stopPropagation();
  nextImage();
});

// teclado: Esc fecha / setas navegam
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("whatsForm");
  const campoMensagem = document.getElementById("mensagem");

  if (!form || !campoMensagem) {
    console.error("Form ou campo de mensagem não encontrado");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome")?.value.trim() || "";
    const telefone = document.getElementById("telefone")?.value.trim() || "";
    const mensagem = campoMensagem.value.trim();

    if (mensagem.length === 0) {
      alert("Digite uma mensagem antes de enviar 🙂");
      return;
    }

    const phone = "5554984338859";

    const texto = encodeURIComponent(
      `Olá, Ricardo!

Nome: ${nome}
Telefone: ${telefone}

Mensagem: ${mensagem}`
    );

    window.open(`https://wa.me/${phone}?text=${texto}`, "_blank");
  });
});

// ===== MÁSCARA TELEFONE (BR) =====
const telefoneInput = document.getElementById("telefone");

if (telefoneInput) {
  telefoneInput.addEventListener("input", () => {
    let valor = telefoneInput.value.replace(/\D/g, "");

    if (valor.length > 11) valor = valor.slice(0, 11);

    if (valor.length > 6) {
      telefoneInput.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      telefoneInput.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else if (valor.length > 0) {
      telefoneInput.value = `(${valor}`;
    }
  });
}
