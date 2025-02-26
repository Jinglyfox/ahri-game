import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { FilterList } from '../molecules/FilterList.js';

export function Inventory(props) {

    let updateInventory = props.updateInventory;
    let updateParentCategory = props.updateParentCategory;
    let updateSubcategory = props.updateSubcategory;
    let emptyCategories = props.emptyCategories;
    let inventory = props.inventory;
    let id = props.id;
    let children = props.children;

    //console.log(emptyCategories);

    return(
        <div id={id}>
            <FilterList updateInventory={updateInventory} updateFilter={updateParentCategory} activeFilter={inventory.getCategoryFilter()} emptyCategories={inventory.getEmptyCategories()} filterCategories={inventory.getItemCategories()} />
            <FilterList updateInventory={updateInventory} updateFilter={updateSubcategory} activeFilter={inventory.getSubcategoryFilter()} emptyCategories ={[]} filterCategories={inventory.getItemSubcategories()} />
            <div id="itemList">
                {children}
            </div>
        </div>
    )
}