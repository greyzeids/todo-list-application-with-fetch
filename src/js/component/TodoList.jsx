import React, { useState, useEffect } from "react";
import Checkbox from "./Checkbox";

const API_URL = "https://playground.4geeks.com/todo/";

const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        getTasks();
    }, []);

    async function createUser() {
        try {
            const response = await fetch(`${API_URL}users/Miquel_Carnot`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    username: "Miquel_Carnot",
                }),
            });

            if (response.ok) {
                console.log("User created successfully.");
            } else {
                console.log("User already exists or failed to create user.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    async function getTasks() {
        try {
            const response = await fetch(`${API_URL}users/Miquel_Carnot`);
            if (!response.ok) {
                if (response.status === 404) {
                    console.log("User not found, creating user...");
                    await createUser();
                    await getTasks();
                    return;
                } else {
                    throw new Error("Failed to fetch tasks");
                }
            }
            const data = await response.json();
            console.log("Fetched tasks:", data);
            if (data.todos) {
                setTodos(data.todos);
            } else {
                setTodos([]);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTodos([]);
        }
    }

    async function addTodo() {
        if (inputValue.trim() !== "") {
            try {
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
                console.log("Added task:", data);
                if (response.ok) {
                    const newTodo = {
                        id: data.id,
                        label: inputValue,
                        completed: false,
                    };
                    setTodos((prevTodos) => [...prevTodos, newTodo]);
                    setInputValue("");
                }
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    }

    async function deleteTasks(id) {
        try {
            const response = await fetch(`${API_URL}todos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                setTodos(todos.filter((todo) => todo.id !== id));
            } else {
                console.error("Failed to delete task:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    async function deleteAllTasks() {
        try {
            const deletePromises = todos.map((todo) =>
                fetch(`${API_URL}todos/${todo.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );
            await Promise.all(deletePromises);
            setTodos([]);
        } catch (error) {
            console.error("Error deleting all tasks:", error);
        }
    }

    const handleToggleCompleted = (indexToToggle) => {
        setTodos = prevTodos.map((todo, index) => {
            if (index === indexToToggle) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
    };

    const countPendingTodos = () => {
        return todos.filter((todo) => !todo.completed).length;
    };

    // Render the component.
    return (
        <div className="container">
            <h1 className="text-center mb-4">Lista de Tareas</h1>
            <div className="input-container">
                <input
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
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
                        {todo.label}
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
            <div className="col-12 p-0 text-center">
                <button className="todo-btn2 mt-2" onClick={deleteAllTasks}>
                    Eliminar todas las tareas
                </button>
            </div>
        </div>
    );
};

export default TodoList;
