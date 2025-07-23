function inclusion(file, elementId) {
  fetch(file)
    .then((response) => {
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      const element = document.getElementById(elementId);
      element.innerHTML = data;
    })
    .catch((error) => {
      console.error("Une erreur est survenue lors de l'inclusion");
    });
}
inclusion("components/header.html", "main-header");
inclusion("components/footer.html", "main-footer");
inclusion("../components/sidebar.html", "sidebar");
inclusion("../components/accueil-tab.html", "accueil-tab");
inclusion("../components/explorer-tab.html", "explorer-tab");
inclusion("../components/chats-tab.html", "chats-tab");
inclusion("../components/notifications-tab.html", "notifications-tab");

const API_CONFIG = {
  url: "https://api.deepseek.com/v1/chat/completions",
  apiKey: "sk-76c2c3639a9845c19d335756677d0a96",
  model: "deepseek-chat",
};

let isTyping = false;

function openChat() {
  document.getElementById("chatPopup").classList.remove("hidden");
  document.getElementById("messageInput").focus();
}

function closeChat() {
  document.getElementById("chatPopup").classList.add("hidden");
}

function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message || isTyping) return;

  addMessage(message, "user");
  input.value = "";

  setTyping(true);

  try {
    const response = await callDeepSeekAPI(message);

    setTyping(false);

    addMessage(response, "bot");
  } catch (error) {
    console.error("Erreur API:", error);
    setTyping(false);
    addMessage(
      "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?",
      "bot"
    );
  }
}

async function callDeepSeekAPI(message) {
  const response = await fetch(API_CONFIG.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      messages: [
        {
          role: "system",
          content:
            "Tu es Info Bot, un assistant IA spécialisé en informatique Crée par Kouakep Dominique. Tu es expert dans tous les domaines de l'informatique : programmation, réseaux, bases de données, cybersécurité, systèmes, etc. Réponds de manière claire, précise et pédagogique. Adapte ton niveau de réponse à la question posée.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function addMessage(text, sender) {
  const container = document.getElementById("messagesContainer");
  const messageDiv = document.createElement("div");

  if (sender === "user") {
    messageDiv.className = "flex items-start gap-3 flex-row-reverse";
    messageDiv.innerHTML = `
                    <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        U
                    </div>
                    <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-primary text-black">
                        ${marked.parse(text)}
                    </div>
                `;
  } else {
    messageDiv.className = "flex items-start gap-3";
    messageDiv.innerHTML = `
                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        IB
                    </div>
                    <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100 text-gray-800">
                       ${marked.parse(text)}
                    </div>
                `;
  }

  container.appendChild(messageDiv);

  container.scrollTop = container.scrollHeight;
}

function setTyping(typing) {
  isTyping = typing;
  const typingIndicator = document.getElementById("typingIndicator");
  const sendButton = document.getElementById("sendButton");

  if (typing) {
    typingIndicator.classList.remove("hidden");
    sendButton.disabled = true;
  } else {
    typingIndicator.classList.add("hidden");
    sendButton.disabled = false;
  }

  const container = document.getElementById("messagesContainer");
  container.scrollTop = container.scrollHeight;
}

document.getElementById("chatPopup").addEventListener("click", function (e) {
  if (e.target === this) {
    closeChat();
  }
});

document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    !document.getElementById("chatPopup").classList.contains("hidden")
  ) {
    closeChat();
  }
});
