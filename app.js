const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

//Array für alle Todos
let allTodos = getTodos();
updateTodoList();

//Eventlistener mit einer Callback Function
//Event = Submit also versenden der Todo mit ENTER oder Button
//Callbackfunction =  function(e){}
// e = EventObject
todoForm.addEventListener('submit', function(e){
    e.preventDefault(); // Verhindert das das Default verhalten ausgeführt wird also die Seite neugeladen wird nach dem Submiten
    
    // Funktion um Todos hinzufügen zu können
    addTodo();
})

function addTodo(){
    const todoText = todoInput.value.trim();    // Nimmt den Wert aus dem Input Feld und Trimmt die Leerzeichen vor und nachdem Wert
    // Nur wenn im Inputfeld was drin steht soll auch was gespeichert werden.
    if(todoText.length > 0){
        const todoObject ={
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
    else{
        alert("Bitte gib erst einmal einen Wert ins Inputfeld ein.")
    }    
}

function updateTodoList(){
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex)=>{
        todoItem = createTodoItem(todo,todoIndex);     
        todoListUL.append(todoItem);   
    })
}

function createTodoItem(todo, todoIndex){
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement('li');
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}">
    <label for="${todoId}" class="custom-checkbox">
        <svg fill="transparent"
        xmlns="http://www.w3.org/2000/svg" 
        height="24" 
        viewBox="0 -960 960 960" 
        width="24">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
    </label>
    <label for="${todoId}" class="todo-text">${todoText}</label>
    <button class="delete-button">
        <svg fill="var(--secondary-color)"
        xmlns="http://www.w3.org/2000/svg" 
        height="24" 
        viewBox="0 -960 960 960" 
        width="24">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
    </button>
    `
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex);
    })
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", ()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    })
    checkbox.checked = todo.completed;
    return todoLI;
}

function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}

// Speichern der ToDos im LocalStorage damit die Daten auch nach dem Neuladen vorhanden sind
// Das löschen des Caches wird den Local Storage auch leeren
// LocalStorage -> F12 o. Untersuchen dann auf App und dann auf Speicher "Lokaler Speicher"
function saveTodos(){
    // Da im localStorage kein Array mit den Inhalten abgelegt werden kann müssen wir diese in ein JSON umwandeln
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson)
}

// Holt die Todos aus dem LocalStorage und Parst die vom JSON Format zurück in ein Array
function getTodos(){
    const todos = localStorage.getItem("todos") || "[]"; // Wenn auf der Linkenseite ein NULL raus kommen würde weil z.B. 
                                                        // noch keine Todos da sind weil die Seite das erstemal geladen wurde
                                                        // dann wird ein Array mit der OR Operation erzeugt
    return JSON.parse(todos);
}