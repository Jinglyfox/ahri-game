import React from "react";

export function GameArea(props) {
    let className = props.className;
    let children = props.children;

    return (
        <div id="gameArea" className={className == undefined? '': className}>
            {children}
        </div>
    )
}