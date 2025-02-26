import React from "react";
import { Inventory } from "./Inventory";
import { input, request } from "../../data.js";
import { InventoryItemCard } from "../molecules/InventoryItemCard.js";
import { inventoryAPI } from "../../inventory.js";
import { useState } from "react";

export function PlayerInventory(props)
{
    let inventory = props.inventory;
    let updateGame = props.updateGame;

    function updateParentCategory(category)
    {
        inventoryAPI.setCategoryFilter(category);
        updateGame();
    }

    function updateSubcategory(subcategory)
    {
        inventoryAPI.setSubcategoryFilter(subcategory);
        updateGame();
    }

    function loadItems()
    {
        let stock = inventory.getFilteredInventory();
        let itemCards = []
        for(let item in stock)
        {
            itemCards.push(<InventoryItemCard active={stock[item].hasFlag("active") ? 'activeItemListCard' : ''} updateInventory={updateGame} item={stock[item]} key={item} />)
        }
        return itemCards;
    }

    return(
        <Inventory id="inventoryWrapper" updateInventory={updateGame} inventory={inventory}  updateParentCategory={updateParentCategory} updateSubcategory={updateSubcategory}>
            {loadItems()}
        </Inventory>
    )
}