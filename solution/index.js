if (localStorage.getItem('tasks') === null) {
  //check if there is  a "tasks" key in the local storage if not, create one
  let tasks = {
    todo: [],
    'in-progress': [],
    done: [],
  }
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

let tasksObj = JSON.parse(localStorage.getItem('tasks'))
createTasks()
const divSections = document.getElementById('sections')
divSections.addEventListener('click', addTask)

function addTask(event) {
  event.preventDefault()
  const target = event.target
  if (target.tagName === 'BUTTON') {
    //gets the text from the user
    const addToDo = document.getElementById('add-to-do-task').value
    const addProgress = document.getElementById('add-in-progress-task').value
    const addDone = document.getElementById('add-done-task').value

    //create the list for the task
    let li = createElement('li', [], ['task'], { tabindex: '0' })

    //chooses the case by the button that clicked
    switch (target.id) {
      case 'submit-add-to-do':
        li.textContent = addToDo
        if (addToDo === '') alert('add some content please')
        //if input empty an alert pop up
        else {
          ulTodo.append(li)
          document.getElementById('add-to-do-task').value = ''
          tasksObj.todo.push(addToDo)
        } //add the text to the list
        break

      case 'submit-add-in-progress':
        li.textContent = addProgress
        if (addProgress === '') alert('add some content please')
        //if input empty an alert pop up
        else {
          ulProgress.append(li)
          document.getElementById('add-in-progress-task').value = ''
          tasksObj['in-progress'].push(addProgress)
        } //add the text to the list
        break

      case 'submit-add-done':
        li.textContent = addDone
        if (addDone === '') alert('add some content please')
        //if input empty an alert pop up
        else {
          ulDone.append(li)
          document.getElementById('add-done-task').value = ''
          tasksObj.done.push(addDone)
        } //add the text to the list
        break
    }
    localStorage.setItem('tasks', JSON.stringify(tasksObj))
  }
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"}, {click: (...) => {...}})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 */
function createElement(tagName, children = [], classes = [], attributes = {}) {
  let element = document.createElement(tagName)

  for (const child of children) {
    element.append(child)
  }

  for (const cls of classes) {
    element.classList.add(cls)
  }

  for (const attr in attributes) {
    element.setAttribute(attr, attributes[attr])
  }
  return element
}

function createTasks() {
  for (let task of tasksObj.todo) {
    let li = createElement('li', [], ['task'], { tabindex: '0' })
    li.innerHTML = task
    ulTodo.append(li)
  }
  for (let task of tasksObj['in-progress']) {
    let li = createElement('li', [], ['task'], { tabindex: '0' })
    li.innerHTML = task
    ulProgress.append(li)
  }
  for (let task of tasksObj.done) {
    let li = createElement('li', [], ['task'], { tabindex: '0' })
    li.innerHTML = task
    ulDone.append(li)
  }
}

divSections.addEventListener('keydown', moveTask)
function moveTask(event) {
  if (
    !(
      (event.key === '1' && event.altKey) ||
      (event.key === '2' && event.altKey) ||
      (event.key === '3' && event.altKey)
    )
  )
    return
  let task = event.target
  if (task.className !== 'task') return
  const newTask = createElement('li', [task.innerText], ['task'], {
    tabindex: '0',
  })
  switch (task.parentElement.id) {
    case 'ulTodo':
      tasksObj.todo = tasksObj.todo.filter((a) => a !== newTask.textContent)
      break
    case 'ulProgress':
      tasksObj['in-progress'] = tasksObj['in-progress'].filter(
        (a) => a !== newTask.textContent
      )
      break
    case 'ulDone':
      tasksObj.done = tasksObj.done.filter((a) => a !== newTask.textContent)
      break
  }

  if (event.key === '1' && event.altKey) {
    ulTodo.append(newTask)
    task.remove()
    tasksObj.todo.push(newTask.textContent)
  }
  if (event.key === '2' && event.altKey) {
    ulProgress.append(newTask)
    task.remove()
    tasksObj['in-progress'].push(newTask.textContent)
  }
  if (event.key === '3' && event.altKey) {
    ulDone.append(newTask)
    task.remove()
    tasksObj.done.push(newTask.textContent)
  }
  localStorage.setItem('tasks', JSON.stringify(tasksObj))
}

divSections.addEventListener('dblclick', changeTask)

function changeTask(e) {
  e.preventDefault()
  const target = e.target
  if (target.className === 'task') {
    let newInput = document.createElement('input')
    newInput.setAttribute('id', 'change-task-input')
    const oldcontent = target.textContent
    newInput.value = target.textContent
    target.innerText = ''
    let listTask = []
    target.append(newInput)
    newInput.focus()
    newInput.addEventListener('blur', () => {
      if (newInput.value === '') newInput.value = oldcontent //bug fixed - when we dblclick and then remove the content and then lose focus so the old content came up and the task wouldn't stay empty
      target.innerHTML = newInput.value
      switch (target.parentElement.id) {
        case 'ulTodo':
          listTask = tasksObj.todo
          break
        case 'ulProgress':
          listTask = tasksObj['in-progress']
          break
        case 'ulDone':
          listTask = tasksObj.done
          break
      }
      listTask[listTask.findIndex((a) => a === oldcontent)] = newInput.value
      localStorage.setItem('tasks', JSON.stringify(tasksObj))
    })
  }
}
