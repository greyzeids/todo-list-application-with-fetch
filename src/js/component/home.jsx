import React from "react";
import TodoList from "./TodoList";
import AnimatedBackground from "./AnimateBackground";
import Footer from "./Footer";
import Checkbox from "./Checkbox";

const Home = () => {
    return (
        <div>
            <div className="FormBack">
                <div className="content">
                    <TodoList />
                    <AnimatedBackground />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
