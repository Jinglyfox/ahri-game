import React from "react";

export function CardHeader(props){
    let children = props.children;
    return(
        <div className="cardHeader">
            <div className="cardHeaderContainer">{children}</div>
            <div className="underline"></div>
        </div>
    )
}