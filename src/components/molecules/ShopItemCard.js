import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { ItemQuantityBar } from './ItemQuantityBar.js';
import { ItemCard } from './ItemCard.js';
import { CardHeader } from '../atoms/CardHeader.js';
import { ItemStock } from '../atoms/ItemStock.js';
import { shopAPI } from '../../shop.js';

export function ShopItemCard(props) {
  
  let item = props.item;
  let updateInventory = props.updateInventory;
  let active = props.active;

  function setActiveItem()
  {
    shopAPI.setActiveItem(item);
    updateInventory();
  }
  
  return(
    <ItemCard item={item} classes={`${active} ${item.getQuantity() == 0 && !item.hasFlag("unlimited") ? "itemOutOfStock":""}`} onClick={setActiveItem}>
      <CardHeader>
          <span>{item.getName()}</span>
          <ItemStock item={item}/>
      </CardHeader>
      <div className="itemCardInfo">
          <div className="itemCardCost">{item.getFormattedPrice()}</div>
          <ItemQuantityBar
              item={item}
              canAdd={shopAPI.requestCanChangeQuantity(item, 1)}
              canRemove={shopAPI.requestCanChangeQuantity(item, -1)}
              updateInventory={updateInventory}
          />
      </div>
    </ItemCard>
  )
}