import React from 'react';
import { input, request } from "../../data.js"
import { Button } from '../atoms/Button.js';
import { useState } from 'react';
import { inventoryAPI } from '../../inventory.js';

export function InventoryDock(props) {
    let updateGame = props.updateGame;

    

    function returnFromInventory()
    {
        inventoryAPI.menuClosed()
        updateGame();
    }

    return(
        <div id="inventoryDock">
            <Button disabled={true}>Inspect</Button>
            <Button onClick={returnFromInventory}>Return</Button>
        </div>
    )
}