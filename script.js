// =====================================================
// JAVASCRIPT TO-DO LIST APPLICATION
// =====================================================


// ---------- DOM ELEMENTS ----------

const todoForm = document.getElementById("todoForm");

const todoInput = document.getElementById("todoInput");

const todoList = document.getElementById("todoList");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const taskCount =
    document.getElementById("taskCount");


// ---------- APPLICATION STATE ----------

let todos =
    JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";


// =====================================================
// SAVE DATA TO LOCAL STORAGE
// =====================================================

function saveTodos() {

    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );
}


// =====================================================
// CREATE TODO
// =====================================================

todoForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText =
        todoInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTodo = {

        id: Date.now(),

        text: taskText,

        completed: false
    };

    todos.push(newTodo);

    saveTodos();

    renderTodos();

    todoInput.value = "";

    todoInput.focus();
});


// =====================================================
// READ / DISPLAY TODOS
// =====================================================

function renderTodos() {

    todoList.innerHTML = "";

    const filteredTodos =
        getFilteredTodos();

    filteredTodos.forEach(function (todo) {

        const li =
            document.createElement("li");

        li.className = "todo-item";

        li.dataset.id = todo.id;

        if (todo.completed) {

            li.classList.add("completed");
        }


        // Checkbox

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "complete-checkbox";

        checkbox.checked =
            todo.completed;


        // Task Text

        const span =
            document.createElement("span");

        span.className = "todo-text";

        span.textContent =
            todo.text;


        // Buttons Container

        const actions =
            document.createElement("div");

        actions.className =
            "todo-actions";


        // Edit Button

        const editButton =
            document.createElement("button");

        editButton.className =
            "edit-btn";

        editButton.dataset.action =
            "edit";

        editButton.textContent =
            "Edit";


        // Delete Button

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-btn";

        deleteButton.dataset.action =
            "delete";

        deleteButton.textContent =
            "Delete";


        // Build DOM

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);

        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(actions);

        todoList.appendChild(li);
    });

    updateTaskCount();
}


// =====================================================
// FILTER TODOS
// =====================================================

function getFilteredTodos() {

    if (currentFilter === "active") {

        return todos.filter(function (todo) {

            return !todo.completed;
        });
    }


    if (currentFilter === "completed") {

        return todos.filter(function (todo) {

            return todo.completed;
        });
    }


    return todos;
}


// =====================================================
// EVENT DELEGATION
// =====================================================

todoList.addEventListener("click", function (event) {

    const target =
        event.target;

    const todoItem =
        target.closest(".todo-item");

    if (!todoItem) {
        return;
    }

    const todoId =
        Number(todoItem.dataset.id);


    // ---------- DELETE ----------

    if (target.dataset.action === "delete") {

        deleteTodo(todoId);

        return;
    }


    // ---------- EDIT ----------

    if (target.dataset.action === "edit") {

        editTodo(todoId);

        return;
    }
});


// =====================================================
// COMPLETE / UNCOMPLETE TODO
// =====================================================

todoList.addEventListener("change", function (event) {

    if (
        !event.target.classList.contains(
            "complete-checkbox"
        )
    ) {
        return;
    }

    const todoItem =
        event.target.closest(".todo-item");

    const todoId =
        Number(todoItem.dataset.id);

    const todo =
        todos.find(function (todo) {

            return todo.id === todoId;
        });

    if (!todo) {
        return;
    }

    todo.completed =
        event.target.checked;

    saveTodos();

    renderTodos();
});


// =====================================================
// UPDATE TODO
// =====================================================

function editTodo(id) {

    const todo =
        todos.find(function (todo) {

            return todo.id === id;
        });

    if (!todo) {
        return;
    }

    const updatedText =
        prompt(
            "Edit your task:",
            todo.text
        );

    if (
        updatedText === null ||
        updatedText.trim() === ""
    ) {
        return;
    }

    todo.text =
        updatedText.trim();

    saveTodos();

    renderTodos();
}


// =====================================================
// DELETE TODO
// =====================================================

function deleteTodo(id) {

    todos =
        todos.filter(function (todo) {

            return todo.id !== id;
        });

    saveTodos();

    renderTodos();
}


// =====================================================
// FILTER BUTTON EVENTS
// =====================================================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter =
            button.dataset.filter;


        // Remove active class

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");
        });


        // Add active class

        button.classList.add("active");


        renderTodos();
    });
});


// =====================================================
// TASK COUNTER
// =====================================================

function updateTaskCount() {

    const activeTasks =
        todos.filter(function (todo) {

            return !todo.completed;
        }).length;


    if (activeTasks === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${activeTasks} tasks remaining`;
    }
}


// =====================================================
// INITIAL APPLICATION LOAD
// =====================================================

renderTodos();
