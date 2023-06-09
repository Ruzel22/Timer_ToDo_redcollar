//timer buttons
var start = document.getElementById('start');
var stop = document.getElementById('stop');
var reset = document.getElementById('reset');
stop.disabled = true;
reset.disabled = true;

//timer variables
var wm = document.getElementById('w_minutes');
var ws = document.getElementById('w_seconds');

var bm = document.getElementById('b_minutes');
var bs = document.getElementById('b_seconds');

//modal window
var modal = document.querySelector('.modal');
var closeButton = document.querySelector('.close');
closeButton.addEventListener('click', () => {
  modal.classList.add('closed');
});

var settings = document.querySelector('.settings');

settings.addEventListener('click', () => {
  modal.classList.remove('closed');
});
var timeInput = document.querySelector('.time-input');
var breakInput = document.querySelector('.break-input');
var longBreakInput = document.querySelector('.long-break-input');

timeInput.valueAsNumber = 25;
breakInput.valueAsNumber = 5;
longBreakInput.valueAsNumber = 15;

timeInput.addEventListener('change', () => {
  let timeChange = timeInput.valueAsNumber;
  wm.innerHTML = timeChange;
});
breakInput.addEventListener('change', () => {
  let breakChange = breakInput.valueAsNumber;
  bm.innerHTML = breakChange;
});
longBreakInput.addEventListener('change', () => {
  let longBreakChange = longBreakInput.valueAsNumber;
  isChecked ? (bm.innerHTML = longBreakChange) : (bm.innerHTML = breakChange);
  // bm.innerHTML = longBreakChange;
});

//toggle for long break
var breakCheckBox = document.querySelector('.break-checkbox');
var isChecked = breakCheckBox.checked;

var breakLabel = document.getElementById('break-timer').querySelector('.label');
breakCheckBox.addEventListener('change', () => {
  isChecked = breakCheckBox.checked;
  isChecked
    ? ((breakLabel.innerHTML = 'Long break'),
      (bm.innerHTML = longBreakInput.valueAsNumber),
      (bs.innerHTML = '00'))
    : ((breakLabel.innerHTML = 'Break'),
      (bm.innerHTML = breakInput.valueAsNumber),
      (bs.innerHTML = '00'));
});

//store a reference to a timer variable
var startTimer;

start.addEventListener('click', function () {
  if (startTimer === undefined) {
    stop.disabled = !stop.disabled;
    reset.disabled = false;
    start.disabled = true;
    startTimer = setInterval(timer, 1000);
  } else {
    alert('Timer is already running');
  }
});

reset.addEventListener('click', function () {
  wm.innerText = timeInput.valueAsNumber;
  ws.innerText = '00';
  start.disabled = false;
  stop.disabled = true;

  isChecked
    ? (bm.innerText = longBreakInput.valueAsNumber)
    : (bm.innerText = breakInput.valueAsNumber);
  // bm.innerText = breakInput.valueAsNumber;
  bs.innerText = '00';

  document.getElementById('counter').innerText = 0;
  stopInterval();
  startTimer = undefined;
});

stop.addEventListener('click', function () {
  start.disabled = false;
  stop.disabled = true;

  stopInterval();
  startTimer = undefined;
});

//Start Timer Function
function timer() {
  //Work Timer Countdown
  if (ws.innerText != 0) {
    ws.innerText--;
    ws.innerText < 10 ? (ws.innerText = '0' + ws.innerText) : (ws.innerText = ws.innerText);
  } else if (wm.innerText != 0 && ws.innerText == 0) {
    ws.innerText = 59;
    wm.innerText--;
  }

  //Break Timer Countdown
  if (wm.innerText == 0 && ws.innerText == 0) {
    if (bs.innerText != 0) {
      bs.innerText--;
    } else if (bm.innerText != 0 && bs.innerText == 0) {
      bs.innerText = 59;
      bm.innerText--;
    }
  }

  //Increment Counter by one if one full cycle is completed
  if (wm.innerText == 0 && ws.innerText == 0 && bm.innerText == 0 && bs.innerText == 0) {
    wm.innerText = timeInput.valueAsNumber;
    ws.innerText = '00';

    isChecked
      ? (bm.innerText = longBreakInput.valueAsNumber)
      : (bm.innerText = breakInput.valueAsNumber);
    // bm.innerText = breakInput.valueAsNumber;
    bs.innerText = '00';

    document.getElementById('counter').innerText++;
  }
}

//Stop Timer Function
function stopInterval() {
  clearInterval(startTimer);
}
//Tasks
window.addEventListener('DOMContentLoaded', () => {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  class Card {
    constructor(task, isCompleted, parent) {
      this.task = task;
      this.isCompleted = isCompleted;
      this.parent = parent;
    }
    render() {
      const elem = document.createElement('div');
      elem.innerHTML = `
        <input placeholder="Edit task" type="text"/>
        <p>${this.task}</p>
        <div class="each-task-btns">
          <button class="task-edit-cancel">
            Cancel
          </button>
          <button class="task-edit-save">
            Save
          </button>
          <button class="task-button">
            <img class="edit" width="20" src="./images/edit.svg" alt="edit">
          </button>
          <button class="task-button">
            <img class="delete" width="20" src="./images/trash.svg" alt="delete">
          </button>
        </div>   
      `;
      this.parent.append(elem);
      elem.classList.add('task');
      this.isCompleted ? elem.classList.add('completed') : null;
    }
  }
  tasks.forEach((element) => {
    new Card(element.task, element.isCompleted, document.querySelector('.tasks')).render();
  });

  //adding new tasks
  const taskInput = document.querySelector('.task-container input');
  const addBtn = document.querySelector('.task-input-btn-save');
  const cancelBtn = document.querySelector('.task-input-btn-cancel');

  addBtn.style.opacity = '0';
  cancelBtn.style.opacity = '0';
  //  show/hide input buttons
  taskInput.addEventListener('input', () => {
    taskInput.value == ''
      ? ((addBtn.style.opacity = '0'), (cancelBtn.style.opacity = '0'))
      : ((addBtn.style.opacity = '1'), (cancelBtn.style.opacity = '1'));
  });

  addBtn.addEventListener('click', () => {
    tasks.push({ task: taskInput.value, isCompleted: false });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    new Card(taskInput.value, false, document.querySelector('.tasks')).render();
    if (taskInput.value != '') {
      taskInput.value = '';
      (addBtn.style.opacity = '0'), (cancelBtn.style.opacity = '0');
    }
  });

  cancelBtn.addEventListener('click', (target) => {
    if (taskInput.value != '') {
      taskInput.value = '';
    }
    (addBtn.style.opacity = '0'), (cancelBtn.style.opacity = '0');
  });

  //event listeners for delete and edit
  const editInput = document.querySelector('.task input');
  const editBtn = document.querySelector('.edit');

  document.querySelector('.tasks').addEventListener('click', (event) => {
    if (event.target.className == 'delete') {
      let task = event.target.parentNode.parentNode.parentNode;

      tasks = tasks.filter((obj) => obj.task !== task.querySelector('p').innerHTML);
      task.parentNode.removeChild(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    if (event.target.className == 'edit') {
      let editingTask = document.querySelector('.tasks .editing');
      if (editingTask) {
        editingTask.classList.remove('editing');
      } else console.log(document.querySelector('.editing'));

      let task = event.target.parentNode.parentNode.parentNode;
      task.classList.add('editing');
      task.querySelector('input').focus();
      task.querySelector('input').value = task.querySelector('p').innerHTML;
    }
    if (event.target.className == 'task-edit-cancel') {
      let task = event.target.parentNode.parentNode;
      task.classList.remove('editing');
    }
    if (event.target.className == 'task-edit-save') {
      let task = event.target.parentNode.parentNode;
      let taskIndex = tasks.findIndex((obj) => obj.task == task.querySelector('p').innerHTML);
      tasks.splice(taskIndex, 1, { task: task.querySelector('input').value, isCompleted: false });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      task.querySelector('p').innerHTML = task.querySelector('input').value;
      task.classList.remove('editing');
    }
    if (event.target.classList.contains('task')) {
      if (event.target.classList.contains('completed')) {
        tasks.find((obj) => obj.task == event.target.querySelector('p').innerHTML);
        let taskIndex = tasks.findIndex(
          (obj) => obj.task == event.target.querySelector('p').innerHTML,
        );
        tasks[taskIndex].isCompleted = false;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        event.target.classList.remove('completed');
        console.log(tasks);
      } else {
        event.target.classList.add('completed');
        let taskIndex = tasks.findIndex(
          (obj) => obj.task == event.target.querySelector('p').innerHTML,
        );
        tasks[taskIndex].isCompleted = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    }
  });
});
