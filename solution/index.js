function updateStorage(tasks) {
  //Function that update the tasks in the local storage.
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function getFromStorage() {
  //Function that get the tasks from the local storage.
  return JSON.parse(localStorage.getItem('tasks'))
}

if (localStorage.getItem('tasks') === null) {
  //check if there is  a "tasks" key in the local storage if not, create one
  let tasks = {
    todo: [],
    'in-progress': [],
    done: [],
  }
  updateStorage(tasks)
}

let tasksObj = getFromStorage()
createTasks()
const divSections = document.getElementById('sections')

divSections.addEventListener('click', addTask)

function addValueToList(ul, li, newValue, inputId) {
  //The function add the new task to the correct list and updates the taskObj
  li.textContent = newValue
  if (newValue === '') alert('add some content please')
  else {
    ul.append(li)
    document.getElementById(inputId).value = ''
    tasksObj[ul.id].unshift(newValue)
  }
}

function addTask(event) {
  const ulProg = document.getElementById('in-progress')
  event.preventDefault()
  const target = event.target
  if (target.tagName === 'BUTTON') {
    //gets the text from the user
    const addToDo = document.getElementById('add-to-do-task').value
    const addProgress = document.getElementById('add-in-progress-task').value
    const addDone = document.getElementById('add-done-task').value

    //create the list for the task
    let li = makeTaskElement()

    //chooses the case by the button that clicked
    switch (target.id) {
      case 'submit-add-to-do':
        addValueToList(todo, li, addToDo, 'add-to-do-task')
        break

      case 'submit-add-in-progress':
        addValueToList(ulProg, li, addProgress, 'add-in-progress-task')
        break

      case 'submit-add-done':
        addValueToList(done, li, addDone, 'add-done-task')
        break
    }
    updateStorage(tasksObj)
  }
}

/**
 * Creates a new DOM element
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
  const ulProg = document.getElementById('in-progress')
  for (let task of tasksObj.todo) {
    let li = makeTaskElement(task)
    todo.append(li)
  }
  for (let task of tasksObj['in-progress']) {
    let li = makeTaskElement(task)
    ulProg.append(li)
  }
  for (let task of tasksObj.done) {
    let li = makeTaskElement(task)
    done.append(li)
  }
  let uls = document.getElementsByTagName('UL')
  for (const ul of uls) {
    ul.addEventListener('dragover', allowDrop)
    ul.addEventListener('drop', drop)
  }
}

function removeContentFromOldTask(ulId, newTask) {
  switch (ulId) {
    case 'todo':
      tasksObj.todo = tasksObj.todo.filter((a) => a !== newTask.textContent)
      break
    case 'in-progress':
      tasksObj['in-progress'] = tasksObj['in-progress'].filter(
        (a) => a !== newTask.textContent
      )
      break
    case 'done':
      tasksObj.done = tasksObj.done.filter((a) => a !== newTask.textContent)
      break
  }
}

function addTaskToListAndSaveIt(event, newTask) {
  const ulPogress = document.getElementById('in-progress')
  if (event.key === '1' && event.altKey) {
    todo.prepend(newTask)
    tasksObj.todo.unshift(newTask.textContent)
    event.target.remove()
  }
  if (event.key === '2' && event.altKey) {
    ulPogress.prepend(newTask)
    tasksObj['in-progress'].unshift(newTask.textContent)
    event.target.remove()
  }
  if (event.key === '3' && event.altKey) {
    done.prepend(newTask)
    tasksObj.done.unshift(newTask.textContent)
    event.target.remove()
  }

  //Updates the localStorage
  updateStorage(tasksObj)
}

divSections.addEventListener('keydown', moveTask)
function moveTask(event) {
  if (!(event.altKey && [1, 2, 3].includes(Number(event.key)))) return
  let task = event.target
  if (task.className !== 'task') return
  const newTask = makeTaskElement(task.textContent)
  removeContentFromOldTask(event.target.parentElement.id, newTask)
  const ulProg = document.getElementById('in-progress')
  addTaskToListAndSaveIt(event, newTask)
  updateStorage(tasksObj)
}

sections.addEventListener('dblclick', changeTask)

function changeTask(e) {
  e.preventDefault()
  const saveKey = tasksObj[e.target.closest('ul').id]
  const oldText = e.target.textContent
  e.target.setAttribute('contentEditable', 'true')
  e.target.addEventListener('blur', () => {
    let newText = e.target.textContent
    if (newText === '') e.target.textContent = oldText
    newText = e.target.textContent
    saveKey[saveKey.findIndex((a) => a === oldText)] = newText
    updateStorage(tasksObj)
  })
}

search.addEventListener('input', searchTask)

function searchTask() {
  let tasks = document.getElementsByClassName('task')
  const length = tasks.length
  for (let i = 0; i < length; i++) {
    tasks[0].remove()
  }
  for (const taskType in tasksObj) {
    for (const task of tasksObj[taskType]) {
      if (task.includes(search.value)) {
        let newTask = createElement('li', [task], ['task'], { tabindex: '0' })
        document.getElementById(taskType).append(newTask)
      }
    }
  }
}

//bonusssssss

function drop(e) {
  const removeTask = document.getElementById('remove-task')
  if (removeTask === null) return
  const taskText = e.dataTransfer.getData('Text')
  e.target.closest('ul').append(makeTaskElement(taskText))

  tasksObj[e.target.closest('ul').id].unshift(taskText)
  tasksObj[removeTask.parentNode.id] = tasksObj[
    removeTask.parentNode.id
  ].filter((a) => a !== taskText)
  removeTask.remove()
  updateStorage(tasksObj)
}

function drag(e) {
  e.target.setAttribute('id', 'remove-task')
  e.dataTransfer.setData('Text', e.target.textContent)
}

function allowDrop(e) {
  e.preventDefault()
}

function makeTaskElement(text) {
  const task = document.createElement('li')
  task.setAttribute('tabindex', '0')
  task.setAttribute('class', 'task')
  task.setAttribute('draggable', 'true')
  task.addEventListener('dragstart', drag)
  task.textContent = text
  return task
}

const urlApi = 'https://json-bins.herokuapp.com/bin/614af9534021ac0e6c080cbf'

const loader = document.getElementById('loading')

async function save() {
  loader.style.visibility = 'visible'
  const putProp = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tasks: tasksObj }),
  }
  await fetch(urlApi, putProp)
  loader.style.visibility = 'hidden'
}

async function load() {
  loader.style.visibility = 'visible'
  const getProp = {
    method: 'Get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }

  let getAns = await fetch(urlApi, getProp)
  const data = await getAns.json()
  console.log(data.tasks)
  localStorage.setItem('tasks', JSON.stringify(data.tasks))
  tasksObj = data.tasks
  let tasks = document.getElementsByClassName('task')
  loader.style.visibility = 'hidden'
  const length = tasks.length
  for (let i = 0; i < length; i++) {
    tasks[0].remove()
  }
  createTasks()
}
