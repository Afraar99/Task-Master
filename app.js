const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = getTodos();
updateToDoList();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addToDo();
});

function addToDo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    allTodos.push({
      text: todoText,
      completed: false,
    });
    updateToDoList();
    saveTodos();
    todoInput.value = "";
  }
}

function updateToDoList() {
  todoListUL.innerHTML = "";
  if (allTodos.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent =
      "Your todo list is empty! Add a task to get started.";
    todoListUL.appendChild(emptyState);
    return;
  }

  allTodos.forEach((todo, todoIndex) => {
    todoItem = createToDoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

function createToDoItem(todo, todoIndex) {
  const todoId = "todo-" + todoIndex;
  const todoLI = document.createElement("li");
  // Fix here - properly handle todo text whether it's a string or object with text property
  const todoText = typeof todo === "object" && todo !== null ? todo.text : todo;
  todoLI.className = "todo";
  todoLI.style.animationDelay = todoIndex * 0.05 + "s"; // Staggered animation
  todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}" />
          <label for="${todoId}" class="custom-checkbox">
            <svg
              fill="transparent"
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
          </label>
          <label for="${todoId}" class="todo-text">${todoText}</label>
          <button class="delete-button" aria-label="Delete todo">
            <svg
              fill="var(--secondary-color)"
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
            >
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
              />
            </svg>
          </button>
    `;
  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    deleteToDoItem(todoIndex);
  });
  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", () => {
    // Make sure to handle both object and string formats
    if (
      typeof allTodos[todoIndex] === "object" &&
      allTodos[todoIndex] !== null
    ) {
      allTodos[todoIndex].completed = checkbox.checked;
    } else {
      // Convert string format to object format
      allTodos[todoIndex] = {
        text: allTodos[todoIndex],
        completed: checkbox.checked,
      };
    }
    saveTodos();
  });

  // Check if the todo is an object with a completed property
  if (typeof todo === "object" && todo !== null && "completed" in todo) {
    checkbox.checked = todo.completed;
  }

  return todoLI;
}

function deleteToDoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateToDoList();
}
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(allTodos));
}
function getTodos() {
  const todos = localStorage.getItem("todos") || "[]";
  return JSON.parse(todos);
}
