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

        :host {
          display: block;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease;
          padding-top: 0;
          padding-bottom: 0;
        }

        .faq-answer.open {
          max-height: 500px;
          opacity: 1;
          padding-top: 0;
          padding-bottom: 1rem;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        .faq-btn:focus-visible {
          outline: 2px solid #2a55c7;
          outline-offset: -2px;
          border-radius: 0.5rem;
        }
      </style>
      <div class="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-4" role="region" aria-label="${title}">
        <h2 class="text-2xl font-semibold text-center text-gray-800">${title}</h2>
        <div id="faq-inner" class="space-y-3"></div>
      </div>
    `;

    const inner = wrapper.querySelector("#faq-inner");

    items.forEach((item, index) => {
      const block = document.createElement("div");
      block.className = "border border-gray-200 rounded-lg overflow-hidden";

      const btnId = `faq-btn-${index}`;
      const panelId = `faq-panel-${index}`;

      block.innerHTML = `
        <button
          id="${btnId}"
          class="faq-btn w-full text-left p-4 font-medium flex justify-between items-center hover:bg-gray-50 transition"
          aria-expanded="false"
          aria-controls="${panelId}"
        >
          <span>${item.question}</span>
          <svg class="w-5 h-5 transform transition-transform flex-shrink-0 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          id="${panelId}"
          class="faq-answer px-4 text-sm text-gray-600 leading-relaxed"
          role="region"
          aria-labelledby="${btnId}"
        >${item.answer}</div>
      `;

      inner.appendChild(block);
    });

    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest("button[aria-controls]");
      if (!btn) return;

      const answer = btn.nextElementSibling;
      const icon = btn.querySelector("svg");
      const isOpen = answer.classList.contains("open");

      wrapper.querySelectorAll(".faq-answer").forEach((el) => {
        el.classList.remove("open");
      });
      wrapper.querySelectorAll("button[aria-controls]").forEach((b) => {
        b.setAttribute("aria-expanded", "false");
      });
      wrapper.querySelectorAll("svg").forEach((svg) => {
        svg.classList.remove("rotate-180");
      });

      if (!isOpen) {
        answer.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        icon.classList.add("rotate-180");
      }
    });

    wrapper.addEventListener("keydown", (e) => {
      const btn = e.target.closest("button[aria-controls]");
      if (!btn) return;

      const allBtns = Array.from(
        wrapper.querySelectorAll("button[aria-controls]")
      );
      const idx = allBtns.indexOf(btn);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = allBtns[(idx + 1) % allBtns.length];
        next.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = allBtns[(idx - 1 + allBtns.length) % allBtns.length];
        prev.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        allBtns[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        allBtns[allBtns.length - 1].focus();
      }
    });

    this.shadowRoot.appendChild(wrapper);
  }
}

customElements.define("faq-widget", FAQWidget);
