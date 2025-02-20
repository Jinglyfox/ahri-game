import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { InventoryHeader } from '../atoms/InventoryHeader.js';
import { ShopDockButton } from './ShopDockButton.js';

export function ShopHeader (props) {

    let buyDisabled = props.disabledMenu == "buy";
    let sellDisabled = props.disabledMenu == "sell";
    let displayedPage = props.displayedPage
    function swapInventory(buyOrSell)
    {
        input.swapShopInventory(buyOrSell)
        props.updateInventory();
    }

    return(
        <div id="shopHeader">
            <ShopDockButton active={displayedPage == 'buy'} disabled={buyDisabled} onClick={() => swapInventory(("buy"))}>
                Buy
            </ShopDockButton>
            <InventoryHeader>{props.header}</InventoryHeader>
            <ShopDockButton active={displayedPage == 'sell'} disabled={sellDisabled} onClick={() => swapInventory("sell")}>
                Sell
            </ShopDockButton>
        </div>
    )
}