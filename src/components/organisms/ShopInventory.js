import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { ShopItemCard } from '../molecules/ShopItemCard.js';
import { Inventory } from './Inventory.js';
import { shopAPI } from '../../shop.js';

export function ShopInventory(props) {

    let inventory = props.inventory;
    let updateInventory = props.updateInventory;

    function updateParentCategory(category)
    {
        shopAPI.setCategoryFilter(category);
        updateInventory();
    }

    function updateSubcategory(subcategory)
    {
        shopAPI.setSubcategoryFilter(subcategory);
        updateInventory();
    }

    function loadItems()
    {
        let stock = inventory.getFilteredInventory();
        let itemCards = []
        let activeItem = inventory.getActiveItem();
        for(let item in stock)
        {
            itemCards.push(<ShopItemCard active={stock[item].hasFlag("active") ? 'activeItemListCard' : ''} updateInventory={updateInventory} item={stock[item]} key={item} />)
        }
        return itemCards;
    }

    return(
        <Inventory id="shopInventoryWrapper" updateInventory={updateInventory} inventory={inventory} updateParentCategory={updateParentCategory} updateSubcategory={updateSubcategory}>
            {loadItems()}
        </Inventory>
    )
}