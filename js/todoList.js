let addTask = document.querySelector(".addTask");
let taskName = document.querySelector(".taskName");
let taskList = document.querySelector(".taskList");

let taskNameContent = ""
let i = 0;

addTask.addEventListener("click", () => {
    i = i + 1;
    taskNameContent = taskName.value
    console.log(taskNameContent);

    let taskContainer = document.createElement("div");
    taskContainer.id = "taskContainer" + i;

    let taskCompletion = document.createElement("input");
    taskCompletion.setAttribute("type","checkbox");

    taskCompletion.addEventListener("change", () => {
        if(taskCompletion.checked){
            addedTask.style.textDecoration = "line-through";
        }else{
            addedTask.style.textDecoration = "none";
        }
    });

    let addedTask = document.createElement("p");
    console.log(addedTask);
    addedTask.textContent = taskNameContent;

    let deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.textContent = "-";

    deleteTaskBtn.addEventListener("click", () => {
        taskList.removeChild(taskContainer);
    });
    
    taskList.appendChild(taskContainer);
    taskContainer.appendChild(taskCompletion);
    taskContainer.appendChild(addedTask);
    taskContainer.appendChild(deleteTaskBtn);

    taskName.value = "";
});

