import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { ShopItemCard } from '../molecules/ShopItemCard.js';
import { Inventory } from './Inventory.js';

export function ShopInventory(props) {

    let stock = props.items;
    let updateInventory = props.updateInventory;

    function updateParentCategory(category)
    {
        input.setCategoryFilter(category);
        updateInventory();
    }

    function updateSubcategory(subcategory)
    {
        input.setSubcategoryFilter(subcategory);
        updateInventory();
    }

    function loadItems()
    {
        let itemCards = []
        let activeItem = request.getActiveShopItem();
        for(let item in stock)
        {
            itemCards.push(<ShopItemCard active={activeItem.getId() == stock[item].getId() ? 'activeItemListCard' : ''} updateInventory={updateInventory} item={stock[item]} key={item} />)
        }
        return itemCards;
    }

    return(
        <Inventory updateInventory={updateInventory} updateParentCategory={updateParentCategory} updateSubcategory={updateSubcategory}>
            {loadItems()}
        </Inventory>
    )
}