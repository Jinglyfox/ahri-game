import React from "react";

export function ItemStock(props)
{
    let item = props.item;
    
    function displayStock()
    {
        if(item.hasFlag("unique"))
        {
            return "Unique Item"
        }
        else if(item.hasFlag("unlimited"))
        {
            return "Unlimited Stock"
        }
        let quantityForSale = item.getQuantity();
        if(quantityForSale > 0)
        {
            return "remaining: " + quantityForSale;
        }
        else if(quantityForSale == 0)
        {
            return "OUT OF STOCK"
        }
        return;
    }
    
    return(
        <span className="itemCardRemaining">{displayStock()}</span>
    )
}