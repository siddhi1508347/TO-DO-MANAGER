
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const statsLine = document.getElementById("statsLine");
const filtersWrap = document.getElementById("filters");
const clearCompletedBtn = document.getElementById("clearCompleted");
const dateLine = document.getElementById("dateLine");


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter(t => !t.completed);
  if (currentFilter === "completed") return tasks.filter(t => t.completed);
  return tasks;
}

function updateStats() {
  const remaining = tasks.filter(t => !t.completed).length;
  statsLine.textContent = tasks.length === 0
    ? "0 tasks"
    : `${remaining} of ${tasks.length} remaining`;
}

function setDateLine() {
  const options = { weekday: "long", month: "long", day: "numeric" };
  dateLine.textContent = new Date().toLocaleDateString("en-US", options);
}

function renderTasks() {
  const visibleTasks = getFilteredTasks();
  taskList.innerHTML = "";

  emptyState.classList.toggle("visible", visibleTasks.length === 0);

  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.priority = task.priority;
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} />
      <div class="task-body">
        <p class="task-text"></p>
        <p class="task-meta">${task.priority} priority</p>
      </div>
      <button class="delete-btn" aria-label="Delete task">&times;</button>
    `;

    
    li.querySelector(".task-text").textContent = task.text;

    taskList.appendChild(li);
  });

  updateStats();
}


function addTask(text, priority) {
  tasks.push({
    id: Date.now().toString(),
    text: text.trim(),
    priority,
    completed: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}


taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text, prioritySelect.value);
  taskInput.value = "";
  taskInput.focus();
});

taskList.addEventListener("click", (e) => {
  const li = e.target.closest(".task-item");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains("task-checkbox")) {
    toggleTask(id);
  }
  if (e.target.classList.contains("delete-btn")) {
    deleteTask(id);
  }
});

filtersWrap.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  renderTasks();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

setDateLine();
renderTasks();