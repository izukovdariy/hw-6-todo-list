let ToDoModule = (function () {
    let taskInput = document.querySelector('.task-add__input');
    let deadlineDate = document.querySelector('.task-add__date');
    let addTaskButton = document.querySelector('.task-add__button');
    let taskList = document.querySelector('.task-list');
    let resetDoneButton = document.querySelector('.done__button');
    let resetDeadlineButton = document.querySelector('.deadline__button');
    let radioButtons = document.querySelectorAll('input[type=radio]');

    function updateStorage(){
        sessionStorage.setItem('taskList', taskList.innerHTML);
    }

    function loadToDo() {
        taskList.innerHTML = sessionStorage.getItem('taskList');
        resetDoneFilter(); resetDeadlineFilter();
    }

    function addEvents() {
       addTaskButton.addEventListener('click', addNewTask);
       taskList.addEventListener('click', taskEvent);
       resetDeadlineButton.addEventListener('click', resetFilter);
       resetDoneButton.addEventListener('click', resetFilter);
       radioButtons.forEach((element) => element.addEventListener('click', applyFilter));
    }
    
    function addNewTask() {
        let inputValue = taskInput.value;
        let inputDate = deadlineDate.value;
        if (inputValue.trim().length){
            let li = document.createElement('li');
            li.className = 'task-list__item not-done';
            let doneIcon = document.createElement('i');
            doneIcon.className = 'list-column done-column far fa-circle';
            let taskName = document.createElement('p');
            taskName.className = 'list-column';
            taskName.textContent = inputValue;
            let deadlineDate = document.createElement('p')
            deadlineDate.textContent = inputDate;
            if(!inputDate) li.classList.add('no-date');
            deadlineDate.className = 'list-column';
            let removeIcon = document.createElement('i');
            removeIcon.className = 'fas fa-minus list-column remove-column';
            li.append(doneIcon, taskName,deadlineDate, removeIcon);
            taskList.appendChild(li);
            updateStorage();
        }
        else alert('Add new task')
    }

    function taskEvent(event) {
        let li = event.target.parentElement;
        if(event.target.classList.contains('remove-column')){
            event.target.parentElement.remove();
        }
        if(event.target.classList.contains('done-column')){
            if (li.classList.contains('not-done')){
                li.classList.remove('not-done');
                li.classList.add('done');
                li.children.item(0).classList.remove('fa-circle');
                li.children.item(0).classList.add('fa-check-circle');
            } else {
                li.classList.remove('done');
                li.classList.add('not-done');
                li.children.item(0).classList.add('fa-circle');
                li.children.item(0).classList.remove('fa-check-circle');
            }
        }
        updateStorage();
    }

    function resetDoneFilter() {
        let checkBox = document.querySelectorAll('input[name=done-filter]');
        checkBox.forEach((element)=>{
            element.checked = false;
        })
        showAll('hide-done');
    }

    function resetDeadlineFilter() {
        let checkBox = document.querySelectorAll('input[name=deadline-filter]');
        checkBox.forEach((element)=>{
            element.checked = false;
        })
        showAll('hide-deadline');
    }

    function resetFilter(event) {
        if(event.target === resetDoneButton){
            resetDoneFilter();
        }
        if (event.target === resetDeadlineButton){
            resetDeadlineFilter();
        }
    }

    function applyFilter(event) {
        let radioName = event.target.className;
        switch (radioName) {
            case 'done__radio':
                for (let i = 0; i<taskList.children.length; i++) {
                    let task = taskList.children.item(i);
                    if(task.classList.contains('not-done')) task.classList.add('hide-done');
                    if(task.classList.contains('done') && task.classList.contains('hide-done')) task.classList.remove('hide-done');
                }
                break;
            case 'not-done__radio':
                for (let i = 0; i<taskList.children.length; i++) {
                    let task = taskList.children.item(i);
                    if(task.classList.contains('done')) task.classList.add('hide-done');
                    if(task.classList.contains('not-done') && task.classList.contains('hide-done')) task.classList.remove('hide-done');
                }
                break;
            case 'tomorrow__radio':
                for (let i = 0; i<taskList.children.length; i++) {
                    let task = taskList.children.item(i);
                    let date = new Date(task.children.item(2).textContent);
                    let tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    if (tomorrow.toDateString() === date.toDateString()){
                        if (task.classList.contains('hide-deadline')) task.classList.remove('hide-deadline');
                    } else task.classList.add('hide-deadline');
                }
                break;
            case 'next-week__radio':
                for (let i = 0; i<taskList.children.length; i++) {
                    let task = taskList.children.item(i);
                    let date = new Date(task.children.item(2).textContent);
                    let todayWeekDay = new Date().getDay();
                    let startWeekDay = new Date();
                    if(todayWeekDay !== 0) startWeekDay.setDate(startWeekDay.getDate() + 8 - todayWeekDay)
                    else startWeekDay = startWeekDay + 1;
                    let endWeekDay = new Date();
                    endWeekDay.setDate(startWeekDay.getDate() + 6);
                    startWeekDay.setHours(0,0,0,0);
                    endWeekDay.setHours(0,0,0,0);
                    if (date <= endWeekDay && startWeekDay <= date){
                        if (task.classList.contains('hide-deadline')) task.classList.remove('hide-deadline');
                    } else task.classList.add('hide-deadline');
                }
        }
    }

    function showAll(selector) {
        for (let i = 0; i<taskList.children.length; i++){
           if (taskList.children.item(i).classList.contains(selector))
               taskList.children.item(i).classList.remove(selector);
        }
    }

    return {
         init : function () {
             loadToDo();
             addEvents();
         }
    }
})();
ToDoModule.init();