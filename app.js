// Task Class

class Task {
  constructor(title, category, priority) {
    this.title = title;
    this.category = category;
    this.priority = priority;
  }
}

//Handle UI Tasks
class UI {
  static displayTasks() {
    const tasks = Store.getTasks();

    tasks.forEach((task) => UI.addTaskToList(task));
  }

  static addTaskToList(task) {
    const list = document.querySelector("#taskList");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.category}</td>
      <td>${task.priority}</td>
      <td><a href="#" class="btn btn danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  // if element has a "Delete" class remove two parents! 
  static deleteTask(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#task-form");
    container.insertBefore(div, form);
    //Hide in 3 sec
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#task-form").reset();
  }
}

//Handle Storage LOCAL STORAGE
class Store {
  static getTasks() {
    let tasks;
    if(localStorage.getItem("tasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    return tasks;
  }
  static addTask(task) {
    const tasks = Store.getTasks();
    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static removeTask(priority) {
    const tasks = Store.getTasks();

    tasks.forEach((task, index) => {
      if(task.priority === priority) {
        tasks.splice(index, 1);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Event display Tasks
document.addEventListener("DOMContentLoaded", UI.displayTasks);

//Event Add a Task
document.querySelector("#task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const category = document.querySelector("#category").value;
  const priority = document.querySelector("#priority").value;

  //Validate inputs
  if (title === '' || category === '' || priority === '') {
    UI.showAlert("Please fill all fields", "danger");
  } else {
    // Instatiate task
    const task = new Task(title, category, priority);
    //Add Task to UI
    UI.addTaskToList(task);
    //Add Task to Store
    Store.addTask(task);
    //Success message
    UI.showAlert("Task Added", "success")
    //Clear fields
    UI.clearFields();
  }
});

  //Event Remove a task from UI
  document.querySelector("#taskList").addEventListener("click", (e) => {
  UI.deleteTask(e.target);

    //Remove task from Store
    Store.removeTask(e.target.parentElement.previousElementSibling.textContent);

  //Remove Task Alert
  UI.showAlert("Task Removed", "success")
})