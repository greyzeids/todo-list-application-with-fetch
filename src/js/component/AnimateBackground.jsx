import React from "react";
import "../../styles/background.css";

const AnimatedBackground = () => {
    return (
        <div>
            <div className="bg"></div>
            <div className="star-field">
                <div className="layer"></div>
                <div className="layer"></div>
                <div className="layer"></div>
            </div>
        </div>
    );
};

export default AnimatedBackground;
