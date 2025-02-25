import React from "react";

export function Stat(props)
{
    let stat = props.stat;

    return(
        <div className="statDisplayWrapper">
            <div className={`${stat.getName()}Color statProgressBar`} style={{width: `${stat.getPercentToCap()}%`}}/>
            <div className="statDisplay">
                <span>{stat.getName()}</span>
                <span>{stat.getStatValue()}</span>
            </div>
        </div>
    )
}