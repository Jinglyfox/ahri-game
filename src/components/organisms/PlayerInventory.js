import React from "react";
import { Inventory } from "./Inventory";
import { input, request } from "../../data.js";
import { InventoryItemCard } from "../molecules/InventoryItemCard.js";
import { inventoryAPI } from "../../inventory.js";

export function PlayerInventory(props)
{
    let inventory = props.inventory;
    let updateInventory = props.updateInventory;

    function updateParentCategory(category)
    {
        inventoryAPI.setCategoryFilter(category);
        updateInventory();
    }

    function updateSubcategory(subcategory)
    {
        inventoryAPI.setSubcategoryFilter(subcategory);
        updateInventory();
    }

    function loadItems()
    {
        let stock = inventory.getFilteredInventory();
        let itemCards = []
        let activeItem = inventory.getActiveItem();
        for(let item in stock)
        {
            itemCards.push(<InventoryItemCard active={stock[item].hasFlag("active") ? 'activeItemListCard' : ''} updateInventory={updateInventory} item={stock[item]} key={item} />)
        }
        return itemCards;
    }

    return(
        <Inventory id="inventoryWrapper" updateInventory={updateInventory} inventory={inventory} updateParentCategory={updateParentCategory} updateSubcategory={updateSubcategory}>
            {loadItems()}
        </Inventory>
    )
}