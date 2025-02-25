import React from "react";
import { DisplayCard } from "../atoms/DisplayCard";
import { inventoryAPI } from "../../inventory";

export function EquipmentCard(props) {
    let item = props.item;
    let slot = props.slot;
    let updateInventory = props.updateInventory;

    function setActiveItem()
    {
        inventoryAPI.setActiveItem(item);
        updateInventory();
    }


    return(
        <DisplayCard onClick={item.getId() !="" ? setActiveItem : null} classes={`equipmentDisplayCard ${item.hasFlag("active") ? "active": ""}`}>
            <img className="slotImg" src={`resources/pictures/${slot}icon.png`} />
        </DisplayCard>
    )
}