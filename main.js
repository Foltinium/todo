let form = document.querySelector(`#form`);
let titleInput = document.querySelector(`#task-title-input`);
let descriptionInput = document.querySelector(`#task-description-input`);
let categoryTaskSelect = document.querySelector(`#task-category-select`);
let tasksList = document.querySelector(`#tasks-list`);
let emptyList = document.querySelector(`#empty-list`);
let exampleList = document.querySelector(`#example`);

let examples = [
    `выполнить домашнее задание`,
    `накормить домашнего питомца`,
    `составить отчёт`,
    `почитать книгу`,
    `c`,
    `d`,
    `e`,
    `f`,
    `g`,
    `h`
];

let tasks = [];

if (localStorage.getItem(`tasks`)) {
    tasks = JSON.parse(localStorage.getItem(`tasks`));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener(`submit`, addTask);
tasksList.addEventListener(`click`, deleteTask);
tasksList.addEventListener(`click`, doneTask);

function addTask(evt) {
    evt.preventDefault();
    let taskTitle = titleInput.value;
    let taskDescription = descriptionInput.value;
    let taskCategory = categoryTaskSelect.value;
    let now = new Date();
    let newTask = {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        category: taskCategory,
        time: {
            minute: now.getMinutes(),
            hour: now.getHours(),
            day: now.getDate(),
            month: now.getMonth() + 1,
            year: now.getFullYear()
        },
        done: false,
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTask(newTask);
    titleInput.value = '';
    descriptionInput.value = '';
    categoryTaskSelect.value = 'Обычное';
    titleInput.focus();
    checkEmptyList();
}

function deleteTask(evt) {

    if (evt.target.dataset.action !== 'delete') {
        return
    };

    let parenNode = evt.target.closest(`.task-item`);
    let id = Number(parenNode.id);
    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();
    parenNode.remove();
    checkEmptyList();
}

function doneTask(evt) {

    if (evt.target.dataset.action !== 'done') {
        return;
    }

    let parentNode = evt.target.closest(`.task-item`);
    let id = Number(parentNode.id);
    let task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    saveToLocalStorage();

    let taskTitle = parentNode.querySelector(`.task-title`);
    taskTitle.classList.toggle(`task-title-done`);
}

function checkEmptyList() {
    if (tasks.length === 0) {
        let emptyListHTML = `
                            <li id="emptyList" class="empty-list">
					            <div class="empty-list-title">Список задач пуст</div>
				            </li>
                            `;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        let emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    let cssClass = task.done ? 'task-title task-title-done' : 'task-title';

    let taskHTML = `
                <li id="${task.id}" class="task-item">
                <div class="${cssClass}">
					<div class="title"><span class="task-title-head">Название:</span> <span class="task-title">${task.title}</span></div> <div class="category"><span class="task-category-head">Категория:</span> <span class="task-category">${task.category}</span></div> <div class="time"><span class="task-time-head">Время:</span> <span class="task-time">${task.time.hour}:${task.time.minute}; ${task.time.day}.${task.time.month}.${task.time.year}</span></div> <div class="description"><span class="task-description-head">Описание:</span> <span class="task-description">${task.description}</span></div>
                </div>
				<div class="task-item-buttons">
					<button type="button" data-action="done" class="btn-action done">
					+
					</button>
					<button type="button" data-action="delete" class="btn-action delete">
					-
					</button>
                    <button type="button" data-action="edit" class="btn-action edit">edit</button>
				</div>
				</li>
                `;

    // Добавление задачи на странице
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
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