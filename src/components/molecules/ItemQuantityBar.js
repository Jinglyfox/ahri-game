import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { QuantityButton } from './QuantityButton.js';

export function ItemQuantityBar(props) {
  let item = props.item;
  let updateInventory = props.updateInventory;
  let canAdd = props.canAdd;
  let canRemove = props.canRemove;

  const [displayedQuantity, setDisplayedQuantity] = useState({
    value: 0
  })

  function quantityPress(value, event)
  {
    let quantity = value;
    if(event.ctrlKey)
    {
      quantity *= 10;
    }
    if(event.shiftKey)
    {
      quantity *= 100;
    }
    quantity = input.setShopItemQuantity(item, item.getQuantityInCart() + quantity);
    setDisplayedQuantity({
      value: quantity
    });
  }

  function setQuantityInput(event)
  {
    if(/^[0-9\b]+$/.test(event.target.value) && event.target.value >= 0 && event.target.value <= 9999 || event.target.value == '')
    {
      
      let quantity = input.setShopItemQuantity(item, Number(event.target.value));
      
      if(event.target.value === '')
      {
        setDisplayedQuantity({
          value: ""
        });
      }
      else
      {
        setDisplayedQuantity({
          value: quantity
        });
      }
      updateInventory();
    }
  }

  function onBlur(event)
  {
    if(event.target.value == '')
    {
      setDisplayedQuantity({
        value: 0
      });
    }
  }

  if(item.hasFlag("unique"))
  return(
    
    <div className="itemCardUniqueItem">
      <QuantityButton 
        disabled={!canAdd}
        onClick={(e) => quantityPress(1, e)}
      >
        Select
      </QuantityButton>
      <QuantityButton 
        disabled={!canRemove}
        onClick={(e) => quantityPress(-1, e)}
      >
        Cancel
      </QuantityButton>
    </div>
  )
  else
  {
    return(
      <div className="itemCardQuantityControl">
        <QuantityButton 
          title="Hold control to remove 10 items, shift to add 100, or both to add 1000." 
          disabled={!canRemove}
          onClick={(e) => quantityPress(-1, e)}
        >
          -
        </QuantityButton>
        <input className="quantityInput" value={displayedQuantity.value === '' ? '' : displayedQuantity.value} type="text" placeholder="0" onBlur={(e) => onBlur(e)} onChange={(e) => setQuantityInput(e)}/>
        <QuantityButton 
          title="Hold control to add 10 items, shift to add 100, or both to add 1000." 
          disabled={!canAdd}
          onClick={(e) => quantityPress(1, e)}
        >
          +
        </QuantityButton>
      </div>
    )
  }
}