import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { FilterTab } from '../atoms/FilterTab.js';

export function FilterList(props) {
  
  let activeFilter = props.activeFilter;
  let filterCategories = props.filterCategories;
  let updateFilter = props.updateFilter;
  let emptyCategories = props.emptyCategories;

  function loadFilters()
  {
    let filterList = []
    if(!filterCategories.includes("all"))
    {
      filterCategories.unshift("all");
    }
    for(let i = 0; i < filterCategories.length; i++)
    {
      if(filterCategories[i] == activeFilter)
      {
          filterList.push(<FilterTab disabled={false} updateFilter={updateFilter} key={i} category={filterCategories[i]} active={true} />)
      }
      else
      { 
        if(emptyCategories.includes(filterCategories[i]))
        {
          filterList.push(<FilterTab disabled={true} updateFilter={updateFilter} key={i} category={filterCategories[i]} active={false} />)
        }
        else
        {
          filterList.push(<FilterTab disabled={false} updateFilter={updateFilter} key={i} category={filterCategories[i]} active={false} />)
        }
      }
    }
    return filterList;
  }

  return(
    <div id="inventoryFilters">{loadFilters()}</div>
  )
}