// static/chat.js
// Conversational frontend for PHQ-9 chatbot
// - shows empathetic "soothing" reply first (styled with .soothing)
// - waits 1s, then shows next PHQ question
// - disables send button while waiting for server response

const chatEl = document.getElementById('chat');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send');
const startBtn = document.getElementById('start');

function appendMessage(role, text, cls) {
  const wrapper = document.createElement('div');
  wrapper.className = 'msg ' + (cls || '');

  if (role === 'user') {
    wrapper.innerHTML = `<div class="user"><strong>You:</strong> ${escapeHtml(text)}</div>`;
  } else {
    // bot
    // if soothing class provided, use that styling
    if (cls === 'soothing') {
      wrapper.innerHTML = `<div class="bot soothing"><strong>Bot:</strong> ${escapeHtml(text)}</div>`;
    } else {
      wrapper.innerHTML = `<div class="bot"><strong>Bot:</strong> ${escapeHtml(text)}</div>`;
    }
  }

  chatEl.appendChild(wrapper);
  chatEl.scrollTop = chatEl.scrollHeight;
  return wrapper;
}

function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function callStart() {
  // clear input and show that user started
  inputEl.value = '';
  appendMessage('user', 'Start assessment');
  disableControls(true);
  try {
    const res = await fetch('/start', { method: 'POST' });
    const data = await res.json();
    const greeting = data.bot_greeting || "Hi — I'm here to listen. How are you feeling today?";
    appendMessage('bot', greeting);
  } catch (err) {
    appendMessage('bot', "Sorry, I couldn't start the chat right now. Try refreshing the page.");
    console.error("start error", err);
  } finally {
    disableControls(false);
  }
}

startBtn.onclick = () => {
  chatEl.innerHTML = '';
  callStart();
};

sendBtn.onclick = sendUserReply;
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendUserReply();
});

function disableControls(disabled) {
  sendBtn.disabled = disabled;
  startBtn.disabled = disabled;
  inputEl.disabled = disabled;
}

async function sendUserReply() {
  const text = inputEl.value.trim();
  if (!text) return;
  appendMessage('user', text);
  inputEl.value = '';
  disableControls(true);

  try {
    const res = await fetch('/answer', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ reply: text })
    });
    const data = await res.json();

    if (data.error) {
      appendMessage('bot', "Oops: " + (data.error || "unknown error"));
      return;
    }

    if (data.status === 'escalate') {
      // immediate crisis flow
      appendMessage('bot', data.message || "We need to escalate. Please seek help.");
      return;
    }

    if (data.status === 'finished') {
      if (data.bot_message) appendMessage('bot', data.bot_message);
      const s = data.summary || {};
      appendMessage('bot', `Summary — score: ${s.score}, level: ${s.level} (${s.label})`);
      return;
    }

    if (data.status === 'continue') {
      // show soothing reply first (styled)
      if (data.soothing) {
        appendMessage('bot', data.soothing, 'soothing');
      } else {
        // fallback empathetic phrase
        appendMessage('bot', "Thanks for sharing — I appreciate you telling me that.", 'soothing');
      }

      // small "typing" indicator (optional)
      const typingEl = appendMessage('bot', "…", 'typing');
      // then show the next question after a short delay so the soothing message registers
      const delayMs = 1000; // 1 second feels natural
      setTimeout(() => {
        // remove typing indicator
        if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);

        // show the next question
        if (data.question) {
          appendMessage('bot', data.question);
        } else {
          // fallback if LLM failed to produce a question
          appendMessage('bot', "Can you tell me a bit more about how often you've felt this way? (rare / a few days / most days / nearly every day)");
        }

        // re-enable controls after showing next prompt
        disableControls(false);
      }, delayMs);

      return;
    }

    // fallback for unexpected responses
    appendMessage('bot', "Hmm — I didn't understand that. Try again or refresh the page.");
    console.warn("Unexpected /answer response:", data);

  } catch (err) {
    appendMessage('bot', "Network or server error — please try again.");
    console.error("answer error", err);
  } finally {
    // ensure controls enabled if not waiting for next question (in continue branch we re-enable after delay)
    if (!document.querySelector('.typing')) disableControls(false);
  }
}

// start automatically on load
window.onload = () => {
  chatEl.innerHTML = '';
  callStart();
};
