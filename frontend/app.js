const API = "http://localhost:3000/api";

let editingTaskId = null; // lưu task đang sửa

//
// REGISTER
//
async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) window.location.href = "login.html";
}

//
// LOGIN
//
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "tasks.html";
  } else {
    alert(data.message);
  }
}

//
// GET TASK LIST
//
async function getTasks() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/tasks`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  const list = document.getElementById("taskList");
  const tasks = data.tasks;

  list.innerHTML = "";

  tasks.forEach(t => {
    list.innerHTML += `
      <div class="task-item">
        <b>${t.title}</b><br>
        ${t.description}<br>
        <i>${t.status}</i><br><br>

        <button onclick="openEditModal('${t._id}', '${t.title}', '${t.description}', '${t.status}')">Sửa</button>
        <button onclick="deleteTask('${t._id}')">Xóa</button>
      </div>
    `;
  });
}

//
// CREATE TASK
//
async function createTask() {
  const token = localStorage.getItem("token");
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDesc").value;
  const status = document.getElementById("taskStatus").value;

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ title, description, status })
  });

  getTasks();
}

//
// DELETE TASK
//
async function deleteTask(id) {
  const token = localStorage.getItem("token");

  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  getTasks();
}

//
// SEARCH TASK
//
async function searchTasks() {
  const keyword = document.getElementById("searchBox").value.toLowerCase();
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/tasks`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  const list = document.getElementById("taskList");

  list.innerHTML = "";

  data.tasks
    .filter(t => t.title.toLowerCase().includes(keyword))
    .forEach(t => {
      list.innerHTML += `
        <div class="task-item">
          <b>${t.title}</b><br>
          ${t.description}<br>
          <i>${t.status}</i><br><br>

          <button onclick="openEditModal('${t._id}', '${t.title}', '${t.description}', '${t.status}')">Sửa</button>
          <button onclick="deleteTask('${t._id}')">Xóa</button>
        </div>
      `;
    });
}

//
// OPEN EDIT MODAL
//
function openEditModal(id, title, desc, status) {
  editingTaskId = id;

  document.getElementById("editTitle").value = title;
  document.getElementById("editDesc").value = desc;
  document.getElementById("editStatus").value = status;

  document.getElementById("editModal").style.display = "block";
}

//
// CLOSE EDIT MODAL
//
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

//
// SAVE EDITED TASK
//
async function saveEditTask() {
  const token = localStorage.getItem("token");

  const title = document.getElementById("editTitle").value;
  const description = document.getElementById("editDesc").value;
  const status = document.getElementById("editStatus").value;

  await fetch(`${API}/tasks/${editingTaskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ title, description, status })
  });

  closeEditModal();
  getTasks();
}

//
// LOGOUT
//
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

//
// AUTO LOAD TASKS WHEN ON tasks.html PAGE
//
if (window.location.pathname.includes("tasks.html")) {
  getTasks();
}
