import { ShopInventoryDisplay } from "./InventoryDisplay";
import { Money } from "./money"
import shops from "./resources/data/shops.json"
import { player } from "./player";
import { overworldAPI } from "./overworld";
import globals from "./resources/data/globals.json"
import { gameDataAPI } from "./GameData";

// The index of the shop and player inventories in the inventories array in the swappable inventory display.


class ShopAPI {
    constructor()
    {
        this.activeShop = {};
        this.runningTotal = 0;
        this.swappableDisplay = new ShopInventoryDisplay()
    }

    getEmptyCategories()
    {
        return this.swappableDisplay.getEmptyCategories();
    }

    getActiveItem()
    {
        return this.swappableDisplay.getActiveItem();
    }

    swapShopInventory(buyOrSell)
    {
        this.swappableDisplay.swapInventory(buyOrSell);
    }

    checkout()
    {
        player.soldItems(this.swappableDisplay.getSoldItems());
        player.boughtItems(this.swappableDisplay.getBoughtItems());
        player.removeMoney(this.runningTotal);
        this.runningTotal = 0;
        this.swappableDisplay.checkout(this.activeShop.getShopId());
    }

    shopReturn()
    {
        this.runningTotal = 0;
        overworldAPI.menuClosed();
    }

    areItemsAdded()
    {
        return this.swappableDisplay.areItemsAdded();
    }

    setActiveItem(item)
    {
        this.swappableDisplay.setActiveItem(item);
    }

    getDisplayedInventory()
    {
        return this.swappableDisplay.getDisplayedInventory();
    }

    getDisabledMenu()
    {
        return this.activeShop.getDisabledMenu();
    }

    getShopHeader()
    {
        if(this.swappableDisplay.getDisplayedPage() == "buy")
        {
            return this.activeShop.getVendorName();
        }
        return "Stash";
    }

    getDisplayedPage()
    {
        return this.swappableDisplay.getDisplayedPage();
    }

    setSubcategoryFilter(subcategory)
    {
        this.swappableDisplay.setSubcategoryFilter(subcategory);
    }

    setCategoryFilter(category)
    {
        this.swappableDisplay.setCategoryFilter(category);
    }

    setShop(shopName)
    {
        this.activeShop = Object.assign(new Shop(), JSON.parse(JSON.stringify(shops[shopName])));
        if(gameDataAPI.checkPurchasedFromShop(shopName))
        {
            this.activeShop.setInventory(gameDataAPI.getVisitedShopInventory(shopName));
        }
        this.virtualPlayerInventory = JSON.parse(JSON.stringify(player.getUnsortedItems()));
        this.swappableDisplay = new ShopInventoryDisplay(this.activeShop.getInventory(), this.virtualPlayerInventory);
        this.swappableDisplay.initializeInventories();
        this.swappableDisplay.initializeDisplay(this.activeShop.getCanBuy(), this.activeShop.getCanSell());
    }

    getVendorName()
    {
        return this.activeShop.getVendorName();
    }

    getVendorBlurb()
    {
        return this.activeShop.getVendorBlurb();
    }

    setShopItemQuantity(item, quantity)
    {
        let itemPrice = this.swappableDisplay.getDisplayedPage() == "buy" ? item.getPriceRaw() : -item.getPriceRaw();
        let runningTotal = this.runningTotal;
        let quantityInCart = item.getQuantityInCart();
        let maxAmountCanAfford = 0;
        //if the player can afford the quantity
        if(player.canAfford(runningTotal + itemPrice * (quantity - quantityInCart)))
        {
            if(quantity <= item.getQuantity() || item.hasFlag("unlimited"))
            {
                if(quantity > 9999)
                {
                    quantity = 9999;
                }
                if(quantity < 0)
                {
                    quantity = 0;
                }
                maxAmountCanAfford = quantity;
            }
            else
            {
                maxAmountCanAfford = item.getQuantity();
            }
        }
        else
        {
            maxAmountCanAfford = Math.floor((player.getMoney() - runningTotal)/Math.abs(itemPrice)) + quantityInCart;
            if(maxAmountCanAfford > item.getQuantity() && !item.hasFlag("unlimited"))
            {
                maxAmountCanAfford = item.getQuantity();
            }
        }
        this.runningTotal += (maxAmountCanAfford - quantityInCart) * itemPrice;
        this.swappableDisplay.setQuantity(item.getId(), maxAmountCanAfford);
        return maxAmountCanAfford;
    }

    requestCanChangeQuantity(item, quantity)
    {
        let itemPrice = this.swappableDisplay.getDisplayedPage() == "buy" ? item.getPriceRaw() : -item.getPriceRaw();
        let runningTotal = this.runningTotal;
        let quantityInCart = item.getQuantityInCart();
        if(player.canAfford(runningTotal + itemPrice * quantity))
        {
            if(quantityInCart + quantity > item.getQuantity() && !item.hasFlag("unlimited"))
            {
                return false;
            }
            if(quantityInCart + quantity > 9999)
            {
                return false;
            }
            if(quantityInCart + quantity < 0)
            {
                return false;
            }
            return true;
        }
        return false;
    }

    getFormattedRunningTotal()
    {
        let totalString = [];
        let total = Money.convertRawToDenoms(this.runningTotal);
        if(this.runningTotal < 0)
        {
            totalString.push(<span key={total.length - 1}>+{total[total.length - 1]}{globals.denomAbbrevs[total.length - 1]}</span>);
        }
        else if(this.runningTotal > 0)
        {
            totalString.push(<span key={total.length - 1}>-{total[total.length - 1]}{globals.denomAbbrevs[total.length - 1]}</span>);
        }
        else
        {
            totalString.push(<span key={total.length - 1}>{total[total.length - 1]}{globals.denomAbbrevs[total.length - 1]}</span>);
        }
        for(let i = total.length - 2; i >= 0; i--)
        {
            totalString.push(<span key={i}>{total[i]}{globals.denomAbbrevs[i]}</span>);
        }
        return totalString;
    }

    getRunningTotal()
    {
        return this.runningTotal;
    }
}

class Shop {
    constructor(inventory = {}, shopId ="", vendor={}, type="item", canSell=true, canBuy=true)
    {
        this.vendor = vendor;
        this.shopId = shopId;
        this.inventory = inventory;
        this.type = type;
        this.canSell = canSell;
        this.canBuy = canBuy;
    }

    swapShopInventory(buyOrSell)
    {
        this.swappableDisplay.swapInventory(buyOrSell);
    }

    getInventory()
    {
        return this.inventory;
    }

    setActiveItem(item)
    {
        this.swappableDisplay.setActiveItem(item);
    }

    getDisplayedPage()
    {
        return this.swappableDisplay.getDisplayedPage();
    }

    checkout()
    {
        this.swappableDisplay.checkout(this.shopId);
    }

    getShopHeader()
    {
        if(this.swappableDisplay.getDisplayedPage() == "buy")
        {
            return this.vendor.name;
        }
        return "Stash"
    }

    setCategoryFilter(category)
    {
        this.swappableDisplay.setCategoryFilter(category);
    }

    setSubcategoryFilter(subcategory)
    {
        this.swappableDisplay.setSubcategoryFilter(subcategory);
    }
    
    getActiveItem()
    {
        return this.swappableDisplay.getActiveItem();
    }

    getShopId()
    {
        return this.shopId;
    }
    
    getShopReturn()
    {
        return this.return;
    }

    initializeShop()
    {
        this.virtualPlayerInventory = JSON.parse(JSON.stringify(player.getUnsortedItems()));
        this.swappableDisplay = new ShopInventoryDisplay(this.inventory, this.virtualPlayerInventory);
        this.swappableDisplay.initializeInventories();
        this.swappableDisplay.initializeDisplay(this.canBuy, this.canSell);
    }

    getDisabledMenu()
    {
        if(!this.canBuy)
        {
            return 'buy';
        }
        else if(!this.canSell || player.isInventoryEmpty())
        {
            return 'sell';
        }
        return ''
    }

    setQuantityInCart(itemId, quantity)
    {
        this.swappableDisplay.setQuantity(itemId, quantity);
    }

    getDisplayedInventory()
    {
        return this.swappableDisplay;
    }

    getSoldItems()
    {
        return this.swappableDisplay.getSoldItems();
    }

    getBoughtItems()
    {
        return this.swappableDisplay.getBoughtItems();
    }

    setInventory(inventory)
    {
        this.inventory = inventory;
    }

    areItemsAdded()
    {
        return this.swappableDisplay.areItemsAdded();
    }

    getEmptyCategories()
    {
        return this.swappableDisplay.getEmptyCategories();
    }

    getItemCategories()
	{
		return this.swappableDisplay.getItemCategories();
	}

	getItemSubcategories(category)
	{
		return this.swappableDisplay.getItemSubcategories(category);
	}

    getCanBuy()
    {
        return this.canBuy;
    }

    getCanSell()
    {
        return this.canSell;
    }

    getReturnTarget()
    {
        return this.return;
    }

    getVendorName()
    {
        return this.vendor.name;
    }

    getVendorBlurb()
    {
        return this.vendor.blurb;
    }
}

export var shopAPI = new ShopAPI();