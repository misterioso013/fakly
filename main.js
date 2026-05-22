function updatePreview() {
  const title = document.getElementById("faqTitle").value;
  const qaItems = Array.from(document.querySelectorAll(".qa-item"));

  const data = qaItems
    .map((item) => ({
      question: item.querySelector(".question").value,
      answer: item.querySelector(".answer").value,
    }))
    .filter((q) => q.question && q.answer);

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const escapedTitle = title.replace(/"/g, "&quot;");
  const escapedData = JSON.stringify(data).replace(/'/g, "\\'");
  const schemaScript =
    '<script type="application/ld+json">' +
    JSON.stringify(schemaJson) +
    "<\\/script>";

  const code = `<!-- Fakly FAQ Widget - https://github.com/misterioso013/fakly -->
${schemaScript}
<script src="https://misterioso013.github.io/fakly/faq-widget.js"><\/script>
<faq-widget
  title="${escapedTitle}"
  data='${escapedData}'>
<\/faq-widget>`;

  document.getElementById("generatedCode").textContent = code;

  const previewCode = `<script src="faq-widget.js"><\/script>
<faq-widget
  title="${escapedTitle}"
  data='${escapedData}'>
<\/faq-widget>`;
  document.getElementById("preview").innerHTML = previewCode;

  saveToLocalStorage();
  updateQANumbers();
}

function updateQANumbers() {
  const items = document.querySelectorAll(".qa-item");
  items.forEach((item, i) => {
    const numberEl = item.querySelector(".qa-number");
    if (numberEl) {
      numberEl.textContent = i + 1;
    }
  });
}

function createQAItemElement(question, answer) {
  const qaItem = document.createElement("div");
  qaItem.className = "qa-item";
  qaItem.setAttribute("role", "listitem");
  qaItem.innerHTML = `
    <span class="qa-number" aria-hidden="true">0</span>
    <button class="remove-btn" onclick="removeQA(this)" aria-label="Remover esta pergunta">×</button>
    <div class="input-group">
      <label>Pergunta</label>
      <input type="text" class="question" placeholder="Digite a pergunta" value="${(question || "").replace(/"/g, "&quot;")}" oninput="updatePreview()">
    </div>
    <div class="input-group">
      <label>Resposta</label>
      <textarea class="answer" placeholder="Digite a resposta" oninput="updatePreview()">${answer || ""}</textarea>
    </div>
  `;
  return qaItem;
}

function addQA() {
  const container = document.getElementById("qaContainer");
  const qaItem = createQAItemElement("", "");
  container.appendChild(qaItem);
  updatePreview();
  qaItem.querySelector(".question").focus();
}

function removeQA(btn) {
  const container = document.getElementById("qaContainer");
  const items = container.querySelectorAll(".qa-item");
  if (items.length <= 1) {
    return;
  }
  btn.closest(".qa-item").remove();
  updatePreview();
  saveToLocalStorage();
}

function copyCode() {
  const codeElement = document.getElementById("generatedCode");
  const copyMessage = document.getElementById("copyMessage");

  navigator.clipboard
    .writeText(codeElement.textContent)
    .then(() => {
      copyMessage.classList.remove("hidden");
      setTimeout(() => {
        copyMessage.classList.add("hidden");
      }, 2000);
    })
    .catch(() => {
      const range = document.createRange();
      range.selectNode(codeElement);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      copyMessage.classList.remove("hidden");
      setTimeout(() => {
        copyMessage.classList.add("hidden");
      }, 2000);
    });
}

function saveToLocalStorage() {
  const title = document.getElementById("faqTitle").value;
  const qaItems = Array.from(document.querySelectorAll(".qa-item")).map(
    (item) => ({
      question: item.querySelector(".question").value,
      answer: item.querySelector(".answer").value,
    })
  );

  const faqData = {
    title,
    items: qaItems,
  };

  localStorage.setItem("faklyData", JSON.stringify(faqData));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem("faklyData");
  if (!savedData) {
    addQA();
    return;
  }

  const faqData = JSON.parse(savedData);

  document.getElementById("faqTitle").value = faqData.title || "";

  const container = document.getElementById("qaContainer");
  container.innerHTML = "";

  if (!faqData.items || faqData.items.length === 0) {
    addQA();
  } else {
    faqData.items.forEach((item) => {
      const qaItem = createQAItemElement(item.question, item.answer);
      container.appendChild(qaItem);
    });
  }

  updatePreview();
}

document.getElementById("faqTitle").addEventListener("input", updatePreview);
document.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", updatePreview);
});

document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});

function clearSavedData() {
  if (confirm("Tem certeza que deseja limpar todos os dados salvos?")) {
    localStorage.removeItem("faklyData");
    document.getElementById("faqTitle").value = "";
    const container = document.getElementById("qaContainer");
    container.innerHTML = "";
    addQA();
    updatePreview();
  }
}
