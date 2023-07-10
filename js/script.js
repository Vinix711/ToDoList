//seleçao dos elementos 
const todoForm = document.querySelector("#todo-form"); //formulário
const todoInput = document.querySelector("#todo-input"); //adiciona tarefas/adiciona tarefas
const todoList = document.querySelector("#todo-list"); //incluir novas tarefas
const editForm = document.querySelector("#edit-form"); //formulário de edição
const editInput = document.querySelector("#edit-input"); //campo de edição
const cancelEditBtn = document.querySelector("#cancel-edit-btn"); //cancelar a edição
const searchInput = document.querySelector("#search-input");
const ereserBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;



//funções 

const saveTodo = (text, done = 0, save = 1) => {

    const todo = document.createElement("div")
    todo.classList.add("todo")

    const todoTitle = document.createElement("h3")
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML =  '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    const editBtn= document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML =  '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const  dellBtn= document.createElement("button")
    dellBtn.classList.add("remove-todo")
    dellBtn.innerHTML =  '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(dellBtn)

    //Utilizando dados da localStorage
    if (done) {
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStorage({ text, done: 0 })
    }

    todoList.appendChild(todo); // appendChild serve para adicionar um "filho" ao outro 

    todoInput.value = "" //quando termina de digitar ele apaga oq vc digitou 
    todoInput.focus() //quando vc termina de digitar vc volta o foco na mesma linha 
}

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")

}

const updateTodo = (text) => {

    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text 

        //Utilizando dados da localStorage
        updateTodoLocalStorage(oldInputValue, text)
        }
    })
}
const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3").innerText.toLowerCase()

        todo.style.display = "flex"
        
        console.log(todoTitle)

        if(!todoTitle.includes(search)) {
            todo.style.display = "none";
        }
    })
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo")
    
    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"))

            break;
        
        case "done":
            todos.forEach((todo) => 
            todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );

            break;
          
        case "todo":
            todos.forEach((todo) =>
             ! todo.classList.contains("done")
             ? (todo.style.display = "flex")
             : (todo.style.display = "none")
            );

            break;

        default:
            break;     
    }
}









//Eventos
todoForm.addEventListener("submit", (e) => { //fução anônima

    e.preventDefault()

    const inputValue = todoInput.value

    if(inputValue){
       saveTodo(inputValue)
      //save todo
   }

})

document.addEventListener("click", (e) => {

    const targetEl = e.target //agora eu sei qual é o elemento 
    const parentEl = targetEl.closest("div") //acabei de selecionar a div mais prox, que será a div com class="todo-done"
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText || "";
        
    }

    if(targetEl.classList.contains("finish-todo")){  //classList serve para manipular as classes de um elemento em HTML, Ela fornece métodos para adicionar, remover, verificar a presença e alternar classes em um elemento.

        parentEl.classList.toggle("done") //estou adicionando "toggle" para as classes todo que eu clico ali na setinha de certo

        updateTodoStatusLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("remove-todo")){
       
        if (confirm("Deseja realmente realizar essa ação?")) {
            // Ação a ser executada se o usuário clicar em "OK"
            console.log("Ação realizada com sucesso!");
            parentEl.remove();
          } else {
            // Ação a ser executada se o usuário clicar em "Cancelar" ou fechar a caixa de diálogo
            console.log("Ação cancelada pelo usuário.");
          }

          //utilizando dados da localStorage
          removeTodoLocalStorage(todoTitle)
        
    }

    if(targetEl.classList.contains("edit-todo")){
        toggleForms()
        editInput.value = todoTitle
        oldInputValue = todoTitle
    }

});
    
    cancelEditBtn.addEventListener("click", (e) => {
        e.preventDefault() //impedir padrão

        toggleForms()
    })

    editForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const editInputValue = editInput.value
        if(editInput) {
            updateTodo(editInputValue)
        }
        toggleForms()
    })

    searchInput.addEventListener("keyup", (e) => {
        const search = e.target.value;
      
        getSearchedTodos(search);
      });

    ereserBtn.addEventListener("click", (e) => {
        e.preventDefault()

        searchInput.value =  "";

        searchInput.dispatchEvent(new Event("keyup"))
    })

    filterBtn.addEventListener("change", (e) => {
        const filterValue = e.target.value;
        
        filterTodos(filterValue)
    })

    //Local Storage
    const getTodosLocalStorage = () => {

        const todos = JSON.parse(localStorage.getItem("todos")) || []

        return todos 
    }

    const loadTodos = () => {
        const todos = getTodosLocalStorage()
         
        todos.forEach((todo) => {
            saveTodo(todo.text, todo.done, 0)
        })
    }

    const saveTodoLocalStorage = (todo) => {
        const todos = getTodosLocalStorage()

        todos.push(todo)

        localStorage.setItem("todos", JSON.stringify(todos))
    }

    const removeTodoLocalStorage = (todoText) => {
        const todos = getTodosLocalStorage()

        const filteredTodos = todos.filter((todo) => todo.text != todoText)

        localStorage.setItem("todos", JSON.stringify(filteredTodos))
    }

    const updateTodoStatusLocalStorage = (todoText) => {
        const todos = getTodosLocalStorage()

        todos.map((todo) =>
        todo.text === todoText ? (todo.done = !todo.done) : null
        )

        localStorage.setItem("todos", JSON.stringify(todos))
    }

    const updateTodoLocalStorage = (todoOldText, todoNewText) => {
        const todos = getTodosLocalStorage()

        todos.map((todo) =>
        todo.text === todoOldText ? (todo.text = todoNewText) : null
        )

        localStorage.setItem("todos", JSON.stringify(todos))
    }

    loadTodos();














































































