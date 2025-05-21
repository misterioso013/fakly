class FAQWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "FAQ";
    let items = [];

    try {
      const rawData = this.getAttribute("data");
      // Suporte para JSON em atributo HTML com aspas duplas
      const cleaned = rawData
        ?.replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n/g, "")
        .replace(/\t/g, "")
        .trim();
      items = JSON.parse(cleaned);
    } catch (e) {
      console.error("FAQWidget: JSON inválido em 'data'", e);
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <style>
        @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.4s ease, opacity 0.4s ease;
        }

        .faq-answer.open {
          max-height: 300px;
          opacity: 1;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }
      </style>
      <div class="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <h2 class="text-2xl font-semibold text-center">${title}</h2>
        <div id="faq-inner" class="space-y-3"></div>
      </div>
    `;

    const inner = wrapper.querySelector("#faq-inner");

    items.forEach((item, index) => {
      const block = document.createElement("div");
      block.className = "border border-gray-200 rounded-lg";

      block.innerHTML = `
        <button class="w-full text-left p-4 font-medium flex justify-between items-center hover:bg-gray-50 transition" data-index="${index}">
          <span>${item.question}</span>
          <svg class="w-5 h-5 transform transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div class="faq-answer px-4 pb-4 text-sm text-gray-600">${item.answer}</div>
      `;

      inner.appendChild(block);
    });

    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-index]");
      if (!btn) return;

      const answer = btn.nextElementSibling;
      const icon = btn.querySelector("svg");

      const isOpen = answer.classList.contains("open");

      wrapper
        .querySelectorAll(".faq-answer")
        .forEach((el) => el.classList.remove("open"));
      wrapper
        .querySelectorAll("svg")
        .forEach((svg) => svg.classList.remove("rotate-180"));

      if (!isOpen) {
        answer.classList.add("open");
        icon.classList.add("rotate-180");
      }
    });

    this.shadowRoot.appendChild(wrapper);
  }
}

customElements.define("faq-widget", FAQWidget);
