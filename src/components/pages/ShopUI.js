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

export function ShopUI(props){
  let updateGame = props.updateGame;

    return(
    <GameArea>
      <div className="shopWrapper">
        <HalfArea>
            <VendorCard vendorName={request.getVendorName()} vendorBlurb={request.getVendorBlurb()} />
            <ItemInfoCard item={request.getActiveShopItem()}/>
        </HalfArea>
        <HalfArea>
            <ShopHeader updateInventory={updateGame} disabledMenu={request.getDisabledMenu()} displayedPage={request.getDisplayedPage()} header={request.getShopHeader()}/>
            <ShopInventory updateInventory={updateGame} items={request.getShopInventory()}/>
            <RunningTotal updateInventory={updateGame} total={request.getRunningTotal()}/>
            <ShopDock updateGame={updateGame}/>
        </HalfArea>
      </div>
    </GameArea>

  )
}