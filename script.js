/*
  Task Tracker Script
  Session-Based State Management
*/

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const dateFilter = document.getElementById("dateFilter");

let tasks = [];
let currentFilter = "all";

function saveTasksToSession() {
  sessionStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromSession() {
  const storedTasks = sessionStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const now = new Date();
  tasks.push({
    text,
    completed: false,
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: now.toISOString().split("T")[0],
  });

  taskInput.value = "";
  saveTasksToSession();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasksToSession();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasksToSession();
  renderTasks();
}

function setFilter(type) {
  currentFilter = type;
  document
    .querySelectorAll(".filters button")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  let completed = 0;
  let pending = 0;

  tasks.forEach((task, index) => {
    if (currentFilter === "completed" && !task.completed) return;
    if (currentFilter === "pending" && task.completed) return;
    if (dateFilter.value && task.date !== dateFilter.value) return;

    task.completed ? completed++ : pending++;

    taskList.innerHTML += `
      <div class="task-item">
        <div class="task-left">
          <input type="checkbox" ${task.completed ? "checked" : ""}
            onclick="toggleTask(${index})" />
          <div>
            <div class="task-text ${task.completed ? "done" : ""}">
              ${task.text}
            </div>
            <div class="time">${task.time}</div>
          </div>
        </div>
        <div class="delete" onclick="deleteTask(${index})">
          <i class="ri-delete-bin-6-line"></i>
        </div>
      </div>
    `;
  });

  totalTasks.innerText = `Total: ${tasks.length} tasks`;
  completedCount.innerText = `${completed} completed`;
  pendingCount.innerText = `${pending} pending`;
}

loadTasksFromSession();
renderTasks();
