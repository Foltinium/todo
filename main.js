let body = document.querySelector(`body`);
let form = document.querySelector(`#form`);
let titleInput = document.querySelector(`#task-title-input`);
let descriptionInput = document.querySelector(`#task-description-input`);
let categorySelect = document.querySelector(`#task-category-select`);
let tasksList = document.querySelector(`#tasks-list`);
let emptyList = document.querySelector(`#empty-list`);
let exampleList = document.querySelector(`#example`);

let examples = [
    `выполнить домашнее задание`,
    `накормить домашнего питомца`,
    `составить отчёт`,
    `почитать книгу`
];

let i = 0;

let tasks = [];

if (localStorage.getItem(`tasks`)) {
    tasks = JSON.parse(localStorage.getItem(`tasks`));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener(`submit`, addTask);
tasksList.addEventListener(`click`, doneTask);
tasksList.addEventListener(`click`, deleteTask);
tasksList.addEventListener(`click`, editTask);

let taskTime = new Date();

function addTask(evt) {
    evt.preventDefault();
    let taskTitle = titleInput.value;
    let taskDescription = descriptionInput.value;
    let taskCategory = categorySelect.value;

    let newTask = {
        id: i,
        title: taskTitle,
        description: taskDescription,
        category: taskCategory,
        time: {
            minute: taskTime.getMinutes(),
            hour: taskTime.getHours(),
            day: taskTime.getDate(),
            month: taskTime.getMonth() + 1,
            year: taskTime.getFullYear()
        },
        done: false
    };

    if (newTask.time.minute < 10) {
        newTask.time.minute = "0" + newTask.time.minute;
    }
    if (newTask.time.hour < 10) {
        newTask.time.hour = "0" + newTask.time.hour;
    }
    if (newTask.time.day < 10) {
        newTask.time.day = "0" + newTask.time.day;
    }
    if (newTask.time.month < 10) {
        newTask.time.month = "0" + newTask.time.month;
    }

    tasks.push(newTask);
    renderTask(newTask);
    saveToLocalStorage();

    titleInput.value = "";
    descriptionInput.value = "";
    categorySelect.value = "Обычное";
    titleInput.focus();

    checkEmptyList();
    i++;
}

function doneTask(evt) {

    if (evt.target.dataset.action !== `done`) {
        return;
    }

    let parentNode = evt.target.closest(`.task-item`);
    let id = Number(parentNode.id);
    let task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    saveToLocalStorage();

    let taskTitle = parentNode.querySelector(`.task-title`);
    let taskCategory = parentNode.querySelector(`.task-category`);
    let taskTime = parentNode.querySelector(`.task-time`);
    let taskDescription = parentNode.querySelector(`.task-description`);

    taskTitle.classList.toggle(`task-done`);
    taskCategory.classList.toggle(`task-done`);
    taskTime.classList.toggle(`task-done`);
    taskDescription.classList.toggle(`task-done`);
}

function deleteTask(evt) {

    if (evt.target.dataset.action !== `delete`) {
        return;
    }

    let parenNode = evt.target.closest(`.task-item`);
    let id = Number(parenNode.id);
    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();
    parenNode.remove();
    checkEmptyList();
}

function editTask() {

}

function checkEmptyList() {
    if (tasks.length === 0) {
        let emptyListNode = `
                            <li id="emptyList" class="empty-list">
                                <div class="empty-list-title">Список задач пуст</div>
                            </li>
                            `;
        tasksList.insertAdjacentHTML(`afterbegin`, emptyListNode);
    }

    if (tasks.length > 0) {
        let emptyListElement = document.querySelector(`#emptyList`);
        emptyListElement ? emptyListElement.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem(`tasks`, JSON.stringify(tasks));
}

function renderTask(task) {
    let cssClass = task.done ? "task-title task-done" : "task-title";

    let taskHTML = `
                    <li id="${task.id}" class="task-item">
                        <div class="task-info">
                            <div class="title">
                                <span class="task-title-head">Название:</span> <span class="task-title">${task.title}</span>
                            </div>
                            <div class="category">
                                <span class="task-category-head">Категория:</span> <span class="task-category">${task.category}</span>
                            </div>
                            <div class="time">
                                <span class="task-time-head">Время:</span> <span class="task-time">${task.time.hour}:${task.time.minute}; ${task.time.day}.${task.time.month}.${task.time.year}</span>
                            </div>
                            <div class="description">
                                <span class="task-description-head">Описание:</span> <span class="task-description">${task.description}</span>
                            </div>
                        </div>
                        <div class="task-item-buttons">
                            <button type="button" data-action="done" class="btn-action done">
                                +
                            </button>
                            <button type="button" data-action="delete" class="btn-action delete">
                                -
                            </button>
                            <button type="button" data-action="edit" class="btn-action edit">
                                edit
                            </button>
                        </div>
                    </li>
                    `;

    tasksList.insertAdjacentHTML("beforeend", taskHTML);
}

function getRandomInt(min, max) {
    let number = Math.floor(Math.random() * (max - min)) + min;
    return number;
}

function randomExample() {
    let i = getRandomInt(0, examples.length);
    exampleList.innerHTML = examples[i];
}

randomExample();

// window.addEventListener(`load`, function () {
//     for (let i = 1; i <= 24; i++) {
//         if (taskTime.getHours() == 0) {
//             body.style.background = "linear-gradient(blue, black)";
//         }
//     }
// })