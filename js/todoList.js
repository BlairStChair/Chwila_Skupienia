let addTask = document.querySelector(".addTask");
let taskName = document.querySelector(".taskName");
let taskList = document.querySelector(".taskList");

let taskNameContent = ""

addTask.addEventListener("click", () => {
    taskNameContent = taskName.value
    console.log(taskNameContent);

    let addedTask = document.createElement("p");
    console.log(addedTask);
    addedTask.textContent = taskNameContent;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "-";
    
    taskList.appendChild(addedTask);
    taskList.appendChild(deleteBtn);

    taskName.value = "";
});