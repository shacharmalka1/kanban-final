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
        li.textContent = addToDo
        if (addToDo === '') alert('add some content please')
        //if input empty an alert pop up
        else {
          todo.append(li)
          document.getElementById('add-to-do-task').value = ''
          tasksObj.todo.unshift(addToDo)
        } //add the text to the list
        break

      case 'submit-add-in-progress':
        li.textContent = addProgress
        if (addProgress === '') alert('add some content please')
        //if input empty an alert pop up
        else {
          ulProg.append(li)
          document.getElementById('add-in-progress-task').value = ''
          tasksObj['in-progress'].unshift(addProgress)
        } //add the text to the list
        break

      case 'submit-add-done':
        li.textContent = addDone
        if (addDone === '') alert('add some content please')
        //if input empty an alert pop up
        else {
          done.append(li)
          document.getElementById('add-done-task').value = ''
          tasksObj.done.unshift(addDone)
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
  const newTask = makeTaskElement(task.textContent)
  switch (task.parentElement.id) {
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
  const ulProg = document.getElementById('in-progress')
  if (event.key === '1' && event.altKey) {
    todo.prepend(newTask)
    task.remove()
    tasksObj.todo.unshift(newTask.textContent)
  }
  if (event.key === '2' && event.altKey) {
    ulProg.prepend(newTask)
    task.remove()
    tasksObj['in-progress'].unshift(newTask.textContent)
  }
  if (event.key === '3' && event.altKey) {
    done.prepend(newTask)
    task.remove()
    tasksObj.done.unshift(newTask.textContent)
  }
  localStorage.setItem('tasks', JSON.stringify(tasksObj))
}

sections.addEventListener('dblclick', changeTask)

function changeTask(e) {
  e.preventDefault()
  const target = e.target
  const saveKey = tasksObj[target.closest('ul').id]
  const oldText = target.textContent
  target.setAttribute('contentEditable', 'true')
  target.addEventListener('blur', () => {
    let newText = target.textContent
    if (newText === '') target.textContent = oldText
    newText = target.textContent
    saveKey[saveKey.findIndex((a) => a === oldText)] = newText
    localStorage.setItem('tasks', JSON.stringify(tasksObj))
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
  localStorage.setItem('tasks', JSON.stringify(tasksObj))
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
