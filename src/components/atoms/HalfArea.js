import React from "react";

export function HalfArea(props) {
    let children = props.children;
    return (
        <div id={`gameAreaHalf`}>{children}</div>
    )
}