import React from "react";

export function DisplayCard(props)
{
    let disabled = props.disabled;
    let children = props.children;
    let classes = props.classes;
    let onClick = props.onClick;

    return (
        <div className={`cardShape ${classes}`} disabled={disabled} onClick={onClick}>
            {children}
        </div>
    )
}