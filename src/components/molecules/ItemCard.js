import React from "react";
import { DisplayCard } from "../atoms/DisplayCard";

export function ItemCard(props)
{
    let item = props.item;
    let classes = props.classes;
    let children = props.children;
    let onClick = props.onClick;


    return(
        <DisplayCard classes={`itemListCard ${classes}`} onClick={onClick}>
            <img className="itemImg" src={`resources/pictures/${item.getSubcategory()}icon.png`} />
            <div className="itemCardText">{children}</div>
        </DisplayCard>
    )
}