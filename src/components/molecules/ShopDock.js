import React from 'react';
import { input, request } from "../../data.js"
import { Button } from '../atoms/Button.js';
import { useState } from 'react';
import { shopAPI } from '../../shop.js';

export function ShopDock(props) {
    let updateGame = props.updateGame;

    function checkout()
    {
        shopAPI.checkout();
        shopReturn();
    }

    function shopReturn()
    {
        shopAPI.shopReturn()
        updateGame();
    }

    return(
        <div id="inventoryDock">
            <Button disabled={true}>Inspect</Button>
            <Button onClick={checkout} disabled={!shopAPI.areItemsAdded()}>Checkout</Button>
            <Button onClick={shopReturn}>Return</Button>
        </div>
    )
}