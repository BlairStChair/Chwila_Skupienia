let addTask = document.querySelector(".addTask");
let taskName = document.querySelector(".taskName");
let taskList = document.querySelector(".taskList");

let taskNameContent = ""

addTask.addEventListener("click", () => {
    taskNameContent = taskName.value
    console.log(taskNameContent);

    let taskCompletion = document.createElement("input");
    taskCompletion.setAttribute("type","checkbox");

    let addedTask = document.createElement("p");
    console.log(addedTask);
    addedTask.textContent = taskNameContent;

    let deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.textContent = "-";
    
    taskList.appendChild(taskCompletion);
    taskList.appendChild(addedTask);
    taskList.appendChild(deleteTaskBtn);

    taskName.value = "";
});

deleteTaskBtn.addEventListener("click", () => {

});