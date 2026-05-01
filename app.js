const FRONTEND_VERSION = "v3";
const FRONTEND_BUILD_TIME = new Date().toLocaleString();
const API = "https://d1op30oze7ecvj.cloudfront.net";

async function loadVersion() {
  try {
    const res = await fetch(`${API}/health`);
    const data = await res.json();

    document.getElementById("version").innerText =
      `Frontend ${FRONTEND_VERSION} (${FRONTEND_BUILD_TIME}) | Backend ${data.version}`;
  } catch (err) {
    document.getElementById("version").innerText =
      `Frontend ${FRONTEND_VERSION} | Backend error`;
    console.error(err);
  }
}

async function loadTasks() {
  const res = await fetch(`${API}/tasks`);
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  if (!Array.isArray(data)) {
    console.error("Fel format:", data);
    return;
  }

  data.forEach(t => {
    const row = document.createElement("div");
    row.className = "task";

    const text = document.createElement("span");
    text.innerText = `${t.title} ${t.done ? "✅" : ""}`;

    const btn = document.createElement("button");
    btn.innerText = "Delete";
    btn.className = "delete-btn";
    btn.onclick = () => deleteTask(t.id);

    row.appendChild(text);
    row.appendChild(btn);

    list.appendChild(row);
  });
}

async function addTask() {
  const input = document.getElementById("title");
  const title = input.value;

  if (!title) return;

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  input.value = "";
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE"
  });

  loadTasks();
}

document.getElementById("title").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

loadVersion();
loadTasks();