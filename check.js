// First of all we have to check if there is any 'tasks' key in our the local storage if not, create one.
if (localStorage.getItem('tasks') === null) {
  let tasks = {
    todo: [],
    'in-progress': [],
    done: [],
  }
  //Update it into the localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

//Here we copied the 'tasks' object into "taskObj" object so that we can change "taskObj", when we done, update it into localStorage.
const tasksObj = JSON.parse(localStorage.getItem('tasks'))

//Make sure all the tasks stay in the page after refresh/closing the page
generateTasks()

//__________________First interaction assignment__________________
// ◼ When the user clicks on one of the add-task buttons, a new task will be added to the respective list. The task content will be taken from the respective input field.

//Listening to the 'click' event in order to add a task to the to-do/in-progress/done sections.
sections.addEventListener('click', addTask)

//Function that handels the case of clicking in the field of all sections.
//Add a list(that represent a task) to the correct unordinary lists(represent the three sections - to-do/in-progress/done).
function addTask(event) {
  event.preventDefault()
  const target = event.target

  //Gets the texts from the user
  const addToDo = document.getElementById('add-to-do-task').value
  const addProgress = document.getElementById('add-in-progress-task').value
  const addDone = document.getElementById('add-done-task').value

  //Create the list(list = task).
  const li = buildListItem([])

  //Chooses the case according to the clicked button.
  const ulPogress = document.getElementById('in-progress')
  switch (target.id) {
    case 'submit-add-to-do':
      li.textContent = addToDo

      //If the user trying to add an empty task an alert messege pops up.
      if (addToDo === '') alert('add some content please')
      //Add the text to the list, and add the task to the taskObj in order to update the localStorage.
      else {
        todo.append(li)
        document.getElementById('add-to-do-task').value = ''
        tasksObj.todo.unshift(addToDo)
      }
      break
    //The same progress(as the case above) is executed in the other cases...
    case 'submit-add-in-progress':
      li.textContent = addProgress
      if (addProgress === '') alert('add some content please')
      else {
        ulPogress.append(li)
        document.getElementById('add-in-progress-task').value = ''
        tasksObj['in-progress'].unshift(addProgress)
      }
      break
    case 'submit-add-done':
      li.textContent = addDone
      if (addDone === '') alert('add some content please')
      else {
        done.append(li)
        document.getElementById('add-done-task').value = ''
        tasksObj.done.unshift(addDone)
      }
      break
  }
  //Updates the localStorage
  localStorage.setItem('tasks', JSON.stringify(tasksObj))
}

//_________________Second interaction assignment__________________
// ◼ Double clicking a task element will enable the user to edit its text. When the task element loses focus (blur event) the change will be saved.

//Listening to the 'dblclick' event in order to edit some task in the to-do/in-progress/done sections.
sections.addEventListener('dblclick', editTask)

//Function that handels the case of double clicking in the field of all sections.
//Gives an options for the user to edit some task by double click on it, when the task element loses focus the changes will be saved.
function editTask(e) {
  e.preventDefault()

  //In this case, we will refer to the case that the target is a list
  const target = e.target

  //Now saveKey contains some array from the our copied object taskObj - todo[]/in-progress[]/done[]
  const saveKey = tasksObj[target.closest('ul').id]

  //Here we save the current task before the change.
  //Why are we need to save the current task? because we have to know what needs to be changed in the localStoarage.
  const oldTask = target.textContent

  //This attribute enable the user to edit the list(task) by double click on it.
  target.setAttribute('contentEditable', 'true')

  //Listening to the 'blur' event for the case of loose focus from the edited list(task).
  target.addEventListener('blur', () => {
    //Here we save the new task in order to save it in the localstorage
    let newTask = target.textContent

    //This if statement take care of any case the user double click on a task, then removes it's content,and eventually loses focus.
    //So the old content came up and the task wouldn't stay empty.
    if (newTask === '') target.textContent = oldTask

    //Here we need to update the new task the user just wrote
    newTask = target.textContent

    //Here we removes the old task and replace it with the new task, the findIndex method make sure we replace the correct task
    saveKey[saveKey.findIndex((a) => a === oldTask)] = newTask

    //Updates the localStorage
    localStorage.setItem('tasks', JSON.stringify(tasksObj))
  })
}
