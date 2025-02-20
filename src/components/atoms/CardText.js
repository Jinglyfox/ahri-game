import React from "react";

export function CardText(props)
{
    let children = props.children;

    return(
        <div className="cardTextArea">{children}</div>
    )
}