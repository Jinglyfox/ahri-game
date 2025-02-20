import React from 'react';
import { input, request } from "../../data.js"
import { ShopDockButton } from './ShopDockButton.js';
import { useState } from 'react';

export function ShopDock(props) {
    let updateGame = props.updateGame;

    function checkout()
    {
        input.shopCheckout();
        shopReturn();
    }

    function shopReturn()
    {
        input.shopReturn()
        updateGame();
    }

    return(
        <div id="shopDock">
            <ShopDockButton disabled={true}>Inspect</ShopDockButton>
            <ShopDockButton onClick={checkout} disabled={!request.areItemsAdded()}>Checkout</ShopDockButton>
            <ShopDockButton onClick={shopReturn}>Return</ShopDockButton>
        </div>
    )
}