import React from "react";
import { Button } from "../atoms/Button";
import { inventoryAPI } from "../../inventory";

export function EquipmentDock(props)
{
    let updateGame = props.updateGame;
    let activeItem = props.activeItem;

    function equipItem()
    {
        inventoryAPI.equipItem();
        updateGame();
    }

    function unequipItem()
    {
        inventoryAPI.unequipItem();
        updateGame();
    }

    function setButton()
    {
        if(activeItem.hasFlag("equipped"))
        {
            return <Button onClick={unequipItem}>Unequip</Button>
        }
        if(activeItem.itemHasFlag("equippable"))
        {
            return <Button onClick={equipItem}>Equip</Button>
        }
        return <Button disabled={true}>Use</Button>
    }

    return(
        <div id="inventoryDock">
            {setButton()}
        </div>
    )
}