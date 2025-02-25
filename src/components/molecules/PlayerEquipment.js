import React from "react";
import { DisplayCard } from "../atoms/DisplayCard";
import { EquipmentCard } from "../molecules/EquipmentCard";
import { inventoryAPI } from "../../inventory";
export function PlayerEquipment(props)
{
    let updateGame = props.updateGame;
    let equipment = props.equipment;

    function loadItems()
    {
        let equipmentSlotOrder = equipment.getEquipmentSlotOrder();
        let equipmentRows = []
        let equippedItems = [];
        let equipmentPerRow = 2;
        let i = 0;
        for(let slot of equipmentSlotOrder)
        {
            i++;
            equippedItems.push(<EquipmentCard slot={slot} key={slot} updateInventory={updateGame} item={equipment.getEquippedToSlot(slot)}/>)
            if(i % equipmentPerRow == 0)
            {
                equipmentRows.push(<div key={i} className="equipmentRow">{equippedItems}</div>)
                equippedItems = []
            }
        }
        equipmentRows.push(<div key={i} className="equipmentRow">{equippedItems}</div>)
        return equipmentRows;
    }

    return(
        <DisplayCard classes="playerEquipmentWrapper">
            {loadItems()}
        </DisplayCard>
    )
}