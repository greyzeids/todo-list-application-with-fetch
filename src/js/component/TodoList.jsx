import React, { useState, useEffect } from "react";
import Checkbox from "./Checkbox";

const API_URL = "https://playground.4geeks.com/todo/";

const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        initializeUserAndTasks();
    }, []);

    async function initializeUserAndTasks() {
        await getTasks();
    }

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

    async function addTodo(e) {
        if (e.key === "Enter" || e.type === "click") {
            if (inputValue.trim() !== "") {
                try {
                    const response = await fetch(
                        `${API_URL}todos/Miquel_Carnot`,
                        {
                            method: "POST",
                            headers: {
                                accept: "application/json",
                                "Content-type": "application/json",
                            },
                            body: JSON.stringify({
                                label: inputValue,
                                is_done: false,
                            }),
                        }
                    );
                    const data = await response.json();
                    console.log("Added task:", data);
                    if (response.ok) {
                        const newTodo = {
                            id: data.id,
                            label: inputValue,
                            completed: false,
                        };
                        setTodos([...todos, newTodo]);
                        setInputValue("");
                    }
                } catch (error) {
                    console.error("Error adding task:", error);
                }
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

    const handleToggleCompleted = (indexToToggle) => {
        const updatedTodos = todos.map((todo, index) => {
            if (index === indexToToggle) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    const countPendingTodos = () => {
        return todos.filter((todo) => !todo.completed).length;
    };

    // Render the component.
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
        </div>
    );
};

export default TodoList;
