import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { ItemQuantityBar } from './ItemQuantityBar.js';
import { ItemCard } from './ItemCard.js';
import { CardHeader } from '../atoms/CardHeader.js';
import { ItemStock } from '../atoms/ItemStock.js';
import { inventoryAPI } from '../../inventory.js';

export function InventoryItemCard(props) {
  
  let item = props.item;
  let active = props.active;
  let updateInventory = props.updateInventory;

  function setActiveItem()
  {
    inventoryAPI.setActiveItem(item);
    updateInventory();
  }
  
  return(
    <ItemCard item={item} classes={`${active} ${item.getQuantity() == 0 && !item.hasFlag("unlimited") ? "itemOutOfStock":""}`} onClick={setActiveItem}>
      <CardHeader>
          <span>{item.getName()}</span>
      </CardHeader>
      <div className="itemCardInfo">
          <div className="itemCardCost">{item.getFormattedPrice()}</div>
          <div>x{item.getQuantity()}</div>
      </div>
    </ItemCard>
  )
}