function updatePreview() {
  const title = document.getElementById("faqTitle").value;
  const qaItems = Array.from(document.querySelectorAll(".qa-item"));

  const data = qaItems
    .map((item) => ({
      question: item.querySelector(".question").value,
      answer: item.querySelector(".answer").value,
    }))
    .filter((q) => q.question && q.answer);

  const code = `<script src="https://misterioso013.github.io/fakly/faq-widget.js"><\/script>
<faq-widget
  title="${title.replace(/"/g, "&quot;")}"
  data='${JSON.stringify(data).replace(/'/g, "\\'")}'>
<\/faq-widget>`;

  document.getElementById("generatedCode").textContent = code;
  document.getElementById("preview").innerHTML = code;

  saveToLocalStorage();
}

function addQA() {
  const qaItem = document.createElement("div");
  qaItem.className = "qa-item";
  qaItem.innerHTML = `
                <button class="remove-btn" onclick="removeQA(this)">×</button>
                <div class="input-group">
                    <label>Pergunta</label>
                    <input type="text" class="question" placeholder="Digite a pergunta" oninput="updatePreview()">
                </div>
                <div class="input-group">
                    <label>Resposta</label>
                    <textarea class="answer" placeholder="Digite a resposta" oninput="updatePreview()"></textarea>
                </div>
            `;
  document.getElementById("qaContainer").appendChild(qaItem);
  updatePreview();
}

function removeQA(btn) {
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
    .catch((err) => {
      console.error("Erro ao copiar:", err);
      alert("Não foi possível copiar o código");
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
    // Se não houver dados salvos, criar um item QA vazio
    addQA();
    return;
  }

  const faqData = JSON.parse(savedData);

  // Set title
  document.getElementById("faqTitle").value = faqData.title || "";

  // Clear existing QA items
  const container = document.getElementById("qaContainer");
  container.innerHTML = "";

  // Add saved QA items
  if (faqData.items.length === 0) {
    addQA(); // Adiciona um item vazio se não houver itens salvos
  } else {
    faqData.items.forEach((item) => {
      const qaItem = document.createElement("div");
      qaItem.className = "qa-item";
      qaItem.innerHTML = `
        <button class="remove-btn" onclick="removeQA(this)">×</button>
        <div class="input-group">
          <label>Pergunta</label>
          <input type="text" class="question" placeholder="Digite a pergunta" value="${item.question}" oninput="updatePreview()">
        </div>
        <div class="input-group">
          <label>Resposta</label>
          <textarea class="answer" placeholder="Digite a resposta" oninput="updatePreview()">${item.answer}</textarea>
        </div>
      `;
      container.appendChild(qaItem);
    });
  }

  updatePreview();
}

// Event listeners para atualização em tempo real
document.getElementById("faqTitle").addEventListener("input", updatePreview);
document.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", updatePreview);
});

// Carregar dados salvos quando a página iniciar
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});

function clearSavedData() {
  if (confirm("Tem certeza que deseja limpar todos os dados salvos?")) {
    localStorage.removeItem("faklyData");
    document.getElementById("faqTitle").value = "";
    const container = document.getElementById("qaContainer");
    container.innerHTML = "";
    addQA(); // Adiciona um item vazio após limpar
    updatePreview();
  }
}
