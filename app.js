<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Tasks</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 40px auto;
    }

    .input-row {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    input {
      flex: 1;
      padding: 10px;
    }

    button {
      padding: 10px 16px;
      cursor: pointer;
    }

    .list {
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
    }

    .task {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    .task:last-child {
      border-bottom: none;
    }

    .delete-btn {
      border: 1px solid red;
      color: red;
      background: white;
      padding: 6px 12px;
    }
  </style>
</head>

<body>
  <h1>Tasks</h1>

  <p id="version"></p>

  <div class="input-row">
    <input id="title" placeholder="Ny task" />
    <button onclick="addTask()">Add</button>
  </div>

  <div id="list" class="list"></div>

  <script>
    const API = "https://d1op30oze7ecvj.cloudfront.net";

    async function loadVersion() {
      const res = await fetch(`${API}/health`);
      const data = await res.json();

      document.getElementById("version").innerText =
        `Frontend v1 | Backend ${data.version}`;
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
        text.innerText = `${t.title} (${t.done})`;

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

    loadVersion();
    loadTasks();
  </script>
</body>
</html