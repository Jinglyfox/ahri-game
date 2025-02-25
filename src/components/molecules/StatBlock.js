import React from "react";
import { Stat } from "../atoms/Stat";

export function StatBlock(props) {
    let statBlock = props.statBlock;

    function loadStats()
    {
        let statsArray = [];
        let statOrder = statBlock.getStatOrder();
        for(let stat of statOrder)
        {
            statsArray.push(<Stat key={stat} stat={statBlock.getStat(stat)} />)
        }
        return statsArray;
    }

    return(
        <div className="statBlockWrapper">
            {loadStats()}
        </div>
    )
}