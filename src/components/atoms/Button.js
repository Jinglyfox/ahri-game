import React from 'react';

export function Button(props)
{
    let disabled = props.disabled;
    let onClick = props.onClick;
    let className = props.className;
    let children = props.children
    let title = props.title;

    return(
        <button className={className} title={title} disabled={disabled} onClick={onClick}>
            <span className="buttonText">{children}</span>
        </button>
    )
}