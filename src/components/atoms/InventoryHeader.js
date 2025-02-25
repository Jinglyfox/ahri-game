import React from 'react';

export function InventoryHeader({children})
{
    return(
        <div id="inventoryHeaderWrapper">
            <span id="inventoryHeader">{children}</span>
        </div>
    )
}