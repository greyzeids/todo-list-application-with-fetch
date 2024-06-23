import React, { useState, useEffect } from "react";
import Checkbox from "./Checkbox";

const API_URL = "https://playground.4geeks.com/todo/";

const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        getTasks();
    }, []);

    async function getTasks() {
        const response = await fetch(`${API_URL}users/Miquel_Carnot`);
        const data = await response.json();
        setTodos(data.todos);
    }

    async function addTodo(e) {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const response = await fetch(`${API_URL}todos/Miquel_Carnot`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    label: inputValue,
                    is_done: false,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                const newTodo = {
                    id: data.id,
                    text: inputValue,
                    completed: false,
                };
                setTodos([...todos, newTodo]);
                setInputValue("");
            }
        }
    }

    async function deleteTasks(indexToDelete) {
        const todoToDelete = todos[indexToDelete];

        await fetch(`${API_URL}${indexToDelete}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    //     const updatedTodos = todos.filter(
    //         (_, index) => index !== indexToDelete
    //     );
    //     setTodos(updatedTodos);
    // }

    // const addTask = (task) => {
    //     const newTasks = [...todos, task];
    //     updateTasks(newTasks);
    // };

    // useEffect(() => {
    //     const storedTodos = JSON.parse(localStorage.getItem("todos"));
    //     if (storedTodos) {
    //         setTodos(storedTodos);
    //     }
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem("todos", JSON.stringify(todos));
    // }, [todos]);

    // const handleDelete = (indexToDelete) => {
    //     const updatedTodos = todos.filter(
    //         (_, index) => index !== indexToDelete
    //     );
    //     setTodos(updatedTodos);
    // };

    // const handleAddTodo = () => {
    //     if (inputValue.trim() !== "") {
    //         const newTodo = { text: inputValue, completed: false };
    //         setTodos([...todos, newTodo]);
    //         setInputValue("");
    //     }
    // };

    // const handleToggleCompleted = (indexToToggle) => {
    //     const updatedTodos = todos.map((todo, index) => {
    //         if (index === indexToToggle) {
    //             return { ...todo, completed: !todo.completed };
    //         }
    //         return todo;
    //     });
    //     setTodos(updatedTodos);
    // };

    const countPendingTodos = () => {
        return todos.filter((todo) => !todo.completed).length;
    };

    return (
        <div className="container">
            <h1 className="text-center mb-4">Lista de Tareas</h1>
            <div className="col-12">
                <input
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    onKeyDown={addTodo}
                    name="text"
                    placeholder="¿Cuál es la tarea hoy?"
                    className="input"
                    type="text"
                />
                <button type="submit" className="todo-btn" onClick={addTodo}>
                    Agregar Tarea
                </button>
            </div>
            <ul className="col-12 p-0 mt-3">
                {todos.map((todo, index) => (
                    <li
                        key={index}
                        className={`Todo text-white ${
                            todo.completed ? "completed" : ""
                        }`}
                    >
                        <Checkbox
                            checked={todo.completed}
                            onChange={() => handleToggleCompleted(index)}
                        />
                        {todo.text}
                        <i
                            className="ml-2 fa fa-trash"
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteTasks(todo.id)}
                        ></i>
                    </li>
                ))}
            </ul>
            <div className="col-12 p-0 text-white text-center">
                {countPendingTodos()} elemento(s) pendiente(s)
            </div>
        </div>
    );
};

export default TodoList;
