import React from "react";
import { player } from "../../player.js";
import { GameArea } from "../atoms/GameArea.js";
import { HalfArea } from "../atoms/HalfArea.js";
import { InventoryHeader } from "../atoms/InventoryHeader.js";
import { InventoryDock } from "../molecules/InventoryDock.js";
import { PlayerInventory } from "../organisms/PlayerInventory.js";
import { ItemInfoCard } from "../molecules/ItemInfoCard.js";
import { input, request } from "../../data.js"
import { inventoryAPI } from "../../inventory.js";
import { PlayerEquipment } from "../molecules/PlayerEquipment.js";
import { EquipmentDock } from "../molecules/EquipmentDock.js";
import { useState } from "react";

export function PlayerInventoryUI(props)
{
    let updateGame = props.updateGame;

    return(
        <GameArea>
            <div className="shopWrapper">
                <HalfArea>
                    <PlayerEquipment updateGame={updateGame} equipment={player.getEquippedItems()} activeItem={inventoryAPI.getActiveItem()}/>
                    <ItemInfoCard item={inventoryAPI.getActiveItem()}/>
                    <EquipmentDock activeItem={inventoryAPI.getActiveItem()} updateGame={updateGame}/>
                </HalfArea>
                <HalfArea>
                    <InventoryHeader>Player Inventory</InventoryHeader>
                    <PlayerInventory updateGame={updateGame} inventory={inventoryAPI.getDisplayedInventory()}/>
                    <InventoryDock updateGame={updateGame}/>
                </HalfArea>
            </div>
        </GameArea>
    )
}