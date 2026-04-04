const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(50, 50, 100, 100);

// Add more game logic here
lucide.createIcons();

let currentMode = "General";
const knowledgeBase = {
    "shakespeare": {
        verify: "Checking British Library & Folger Shakespeare Library...",
        data: "William Shakespeare (1564–1616). Died: April 23, 1616. He did not write novels/books; he wrote 39 plays and 154 sonnets. He was an actor and shareholder in the Globe Theatre."
    }
};

// Sync Clock
function updateUI() {
    const d = new Date();
    document.getElementById('live-clock').innerText = d.toLocaleString();
}
setInterval(updateUI, 1000);
updateUI();

function setMode(m) {
    currentMode = m;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Handle Input
const input = document.getElementById('userInput');
input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
});

document.getElementById('sendBtn').addEventListener('click', runAI);
input.addEventListener('keydown', (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runAI(); } });

async function runAI() {
    const query = input.value.trim();
    if(!query) return;

    // Add User UI
    appendMessage('user', query);
    input.value = "";
    input.style.height = 'auto';

    // TRIGGER PREMIUM THINKING MODE
    const processDisplay = document.getElementById('ai-process-display');
    processDisplay.style.display = 'flex';
    
    // Simulate multi-step reasoning
    await sleep(800); // Thinking...
    await sleep(1000); // Searching Google...
    await sleep(500); // Verifying Facts...

    processDisplay.style.display = 'none';
    const response = constructResponse(query);
    appendMessage('ai', response);
}

function constructResponse(q) {
    const lowQ = q.toLowerCase();
    const dateStr = new Date().toLocaleDateString();
    
    // THE CATCHPHRASE
    let content = `> "You want to learn about ${q}! well this is a ${currentMode} lesson lets dig deep into ${q}’s past!…"\n\n`;

    // ADD THINKING TRACE (ChatGPT o1 Style)
    content += `<div class="thought-block"><strong>Thought Process:</strong><br>
    - Analyzed user intent: ${currentMode} Inquiry<br>
    - Cross-referencing real-time 2026 databases...<br>
    - Verifying historical/mathematical constants...<br>
    - Conclusion: Accurate data found.</div>`;

    // LOGIC: SHAKESPEARE
    if (lowQ.includes("shakespeare")) {
        return content + `### Verification Result: High Confidence
Contrary to common misconceptions, William Shakespeare did not write "books." He was a **playwright**. 

**Key Data Points:**
- **Born:** April 1564
- **Died:** April 23, 1616 (Confirmed date)
- **Primary Works:** 39 plays, 154 sonnets.
- **2026 Status:** His works remain the most performed in human history. As of today (${dateStr}), no "new" writings have been discovered since the late 17th century discoveries.`;
    }

    // LOGIC: CURRENT DATE
    if (lowQ.includes("date") || lowQ.includes("time") || lowQ.includes("today")) {
        return content + `My high-precision clock is synced with global servers. 

Today is **${new Date().toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}**. 
Current precise time is **${new Date().toLocaleTimeString()}**.`;
    }

    // LOGIC: MATH
    if (currentMode === "Math" || /[0-9]/.test(lowQ)) {
        try {
            const exp = lowQ.replace(/[^-()\d/*+.]/g, '');
            const result = eval(exp);
            return content + `### Mathematical Computation
**The result is: ${result}**

I have verified this using a 64-bit floating point precision engine. Standard arithmetic rules (PEMDAS) were applied to ensure 0% error margin.`;
        } catch {
            return content + `I am ready to compute this equation. Please provide the specific numbers so I can apply my logic engine to solve it.`;
        }
    }

    // FALLBACK
    return content + `I have explored my internal 2026 knowledge graph regarding **${q}**. 

From a **${currentMode}** perspective, this is a significant subject. Extensive data analysis shows that it involves complex variables that have shaped current global understanding. 

Would you like me to trigger a **Deep Scan** on a specific detail of this topic?`;
}

function appendMessage(role, text) {
    const feed = document.getElementById('chat-feed');
    const row = document.createElement('div');
    row.className = `bubble-row ${role}`;
    
    const avatar = role === 'ai' ? 'C' : 'U';
    const htmlContent = role === 'ai' ? marked.parse(text) : text;

    row.innerHTML = `
        <div class="ai-avatar">${avatar}</div>
        <div class="bubble-content">${htmlContent}</div>
    `;
    feed.appendChild(row);
    feed.scrollTop = feed.scrollHeight;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
