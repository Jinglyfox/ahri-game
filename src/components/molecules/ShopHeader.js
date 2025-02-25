import React from 'react';
import { useState } from 'react';
import { input, request } from "../../data.js"
import { ShopInventoryHeader } from '../atoms/ShopInventoryHeader.js';
import { ShopDockButton } from './ShopDockButton.js';
import { shopAPI } from '../../shop.js';

export function ShopHeader (props) {

    let buyDisabled = props.disabledMenu == "buy";
    let sellDisabled = props.disabledMenu == "sell";
    let displayedPage = props.displayedPage
    function swapInventory(buyOrSell)
    {
        shopAPI.swapShopInventory(buyOrSell)
        props.updateInventory();
    }

    return(
        <div id="inventoryHeaderWrapper">
            <ShopDockButton active={displayedPage == 'buy'} disabled={buyDisabled} onClick={() => swapInventory(("buy"))}>
                Buy
            </ShopDockButton>
            <ShopInventoryHeader>{props.header}</ShopInventoryHeader>
            <ShopDockButton active={displayedPage == 'sell'} disabled={sellDisabled} onClick={() => swapInventory("sell")}>
                Sell
            </ShopDockButton>
        </div>
    )
}