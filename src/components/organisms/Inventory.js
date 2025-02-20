import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { FilterList } from '../molecules/FilterList.js';

export function Inventory(props) {

    let updateInventory = props.updateInventory;
    let updateParentCategory = props.updateParentCategory;
    let updateSubcategory = props.updateSubcategory;
    let children = props.children;

    return(
        <div id="shopInventoryWrapper">
            <FilterList updateInventory={updateInventory} updateFilter={updateParentCategory} activeFilter={request.getCategoryFilter()} filterCategories={request.getItemCategories()} />
            <FilterList updateInventory={updateInventory} updateFilter={updateSubcategory} activeFilter={request.getSubcategoryFilter()} filterCategories={request.getItemSubcategories()} />
            <div id="itemList">
                {children}
            </div>
        </div>
    )
}