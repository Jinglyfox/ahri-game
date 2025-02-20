import React from 'react';
import { useState } from 'react';
import { Button } from './Button';

export function FilterTab(props) {
  let active = props.active;
  let category = props.category;
  let disabled = props.disabled;
  let updateFilter = props.updateFilter;

  return (
    <Button 
      className={`inventoryFilter ${active ? "activeFilter" : "inactiveFilter"}`}
      disabled={disabled}
      onClick={() => updateFilter(category)}>
        <img className="filterImage" src={`./resources/pictures/${category}icon.png`} />
    </Button>
  )

}