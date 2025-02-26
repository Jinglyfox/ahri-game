import React from 'react';
import { VendorCard } from '../molecules/VendorCard.js';
import { ItemInfoCard } from '../molecules/ItemInfoCard.js';
import { ShopHeader } from '../molecules/ShopHeader.js';
import { ShopInventory } from '../organisms/ShopInventory.js';
import { RunningTotal } from '../atoms/RunningTotal.js';
import { ShopDock } from '../molecules/ShopDock.js';
import { GameArea } from '../atoms/GameArea.js';
import { HalfArea } from '../atoms/HalfArea.js';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { shopAPI } from '../../shop.js';

export function ShopUI(props){
  let updateGame = props.updateGame;

  return(
    <GameArea>
      <div className="shopWrapper">
        <HalfArea>
            <VendorCard vendorName={shopAPI.getVendorName()} vendorBlurb={shopAPI.getVendorBlurb()} />
            <ItemInfoCard item={shopAPI.getActiveItem()}/>
        </HalfArea>
        <HalfArea>
            <ShopHeader updateInventory={updateGame} disabledMenu={shopAPI.getDisabledMenu()} displayedPage={shopAPI.getDisplayedPage()} header={shopAPI.getShopHeader()}/>
            <ShopInventory updateInventory={updateGame} emptyCategories={shopAPI.getEmptyCategories()} inventory={shopAPI.getDisplayedInventory()}/>
            <RunningTotal updateInventory={updateGame} total={shopAPI.getFormattedRunningTotal()}/>
            <ShopDock updateGame={updateGame}/>
        </HalfArea>
      </div>
    </GameArea>
  )
}