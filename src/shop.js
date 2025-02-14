import { ShopInventory, ShopItem } from "./inventory"
import { Money } from "./money"
import shops from "./resources/data/shops.json"
import { player } from "./player";
import globals from "./resources/data/globals.json"

export class ShopData {
    constructor()
    {
        this.activeShop = {};
        this.activeItem = new ShopItem();
        this.runningTotal = 0;
        this.categoryFilter = "all";
        this.subcategoryFilter = "all";
        this.displayedPage = "buy";
    }

    getShopReturn()
    {
        return this.activeShop.getShopReturn();
    }

    checkout()
    {
        player.soldItems(this.virtualPlayerShop.getSoldItems());
        player.boughtItems(this.activeShop.getSoldItems());
        player.addMoney(-this.runningTotal);
    }

    areItemsAdded()
    {
        if(this.activeShop.areItemsAdded() || this.virtualPlayerShop.areItemsAdded())
        {
            return true;
        }
        return false;
    }

    getItemSubcategories()
    {
        return this.displayedShop.getItemSubcategories(this.categoryFilter);
    }

    getActiveFilter()
    {
        return this.categoryFilter;
    }

    getDisabledMenu()
    {
        if(!this.activeShop.getCanBuy())
        {
            return 'buy';
        }
        else if(!this.activeShop.getCanSell() || this.virtualPlayerInventory.isEmpty())
        {
            return 'sell';
        }
        return ''
    }

    requestCanChangeQuantity(item, quantity)
    {
        let itemPrice = this.displayedPage == "buy" ? item.getPriceRaw() : -item.getPriceRaw();
        let runningTotal = this.runningTotal;
        let quantityInCart = item.getQuantityInCart();
        if(player.canAfford(runningTotal + itemPrice * quantity))
        {
            if(quantityInCart + quantity > item.getQuantity())
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

    setShopItemQuantity(item, quantity)
    {
        let itemPrice = this.displayedPage == "buy" ? item.getPriceRaw() : -item.getPriceRaw();
        let runningTotal = this.runningTotal;
        let quantityInCart = item.getQuantityInCart();
        let maxAmountCanAfford = 0;
        //if the player can afford the quantity
        if(player.canAfford(runningTotal + itemPrice * (quantity - quantityInCart)))
        {
            if(quantity <= item.getQuantity())
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
            maxAmountCanAfford = Math.floor((player.getMoneyRaw() - runningTotal)/Math.abs(itemPrice)) + quantityInCart;
            if(maxAmountCanAfford > item.getQuantity())
            {
                maxAmountCanAfford = item.getQuantity();
            }
        }
        this.runningTotal += (maxAmountCanAfford - quantityInCart) * itemPrice;
        this.displayedShop.setQuantityInCart(item.getId(), maxAmountCanAfford);
        return maxAmountCanAfford;
    }

    getEmptyCategories()
    {
        return this.displayedShop.getEmptyCategories();
    }

    getItemDisplayPrice(item)
    {
        if(this.displayedPage == "buy")
        {
            return item.getPrice();
        }
        else
        {
            return item.getSalePrice();
        }
    }

    getShopInventory()
    {
        return this.displayedShop.getFilteredInventory(this.categoryFilter, this.subcategoryFilter);
    }

    getItemPrice(item)
    {
        if(this.displayedPage == "buy")
        {
            return Money.convertDenomsToRaw(item.getPrice());
        }
        else
        {
            return -Money.convertDenomsToRaw(item.getSalePrice());
        }
    }

    setSubcategoryFilter(subcategory)
    {
        if(this.subcategoryFilter !== subcategory)
        {
            this.subcategoryFilter = subcategory;
            if(this.activeItem.getId() !== "")
            {
                if(subcategory !== "all" && this.activeItem.getSubcategory() !== subcategory)
                {
                    this.activeItem = new ShopItem();
                }
            }
        }
    }

    setCategoryFilter(category)
    {
        if(this.categoryFilter !== category)
        {
            this.categoryFilter = category;
            this.subcategoryFilter = "all";
            if(this.activeItem.getId() !== "")
            {
                if(category !== "all" && this.activeItem.getCategory() !== category)
                {
                    this.activeItem = new ShopItem();
                }
            }
        }
    }
    
    getShopHeader()
    {
        if(this.displayedPage == "buy")
        {
            return this.activeShop.getVendorName();
        }
        return "Stash"
    }

    getRunningTotal()
    {
        return this.runningTotal;
    }

    getDisplayedPage()
    {
        return this.displayedPage;
    }

    swapShopInventory(buyOrSell)
    {
        this.displayedPage = buyOrSell;
        if(this.displayedPage == "buy")
        {
            this.displayedShop = this.activeShop;
        }
        else
        {
            this.displayedShop = this.virtualPlayerShop;
        }
        this.activeFilter = "all";
        this.categoryFilter = "all";
        this.subcategoryFilter = "all";
        this.activeItem = new ShopItem();
    }

    setShop(shopName)
    {
        this.virtualPlayerShop = new Shop(JSON.parse(JSON.stringify(player.getUnsortedItems())));
        this.virtualPlayerShop.initializeInventory();
        this.virtualPlayerShop.setSalePrices();
        this.virtualPlayerInventory = player.getInventory();
        this.activeShop = Object.assign(new Shop(), JSON.parse(JSON.stringify(shops[shopName])));
        this.activeItem = new ShopItem();
        this.activeShop.initializeInventory();
        if(!this.activeShop.getCanBuy())
        {
            this.displayedShop = this.virtualPlayerShop;
        }
        else
        {
            this.displayedShop = this.activeShop;
        }
    }


    getVendorName()
    {
        return this.activeShop.getVendorName();
    }

    getVendorBlurb()
    {
        return this.activeShop.getVendorBlurb();
    }

    getActiveItem()
    {
        return this.activeItem;
    }

    getActiveItemId()
    {
        if(this.activeItem.getItem() == null)
        {
            return ''
        }
        return this.activeItem.getId();
    }

    setActiveShopItem(item)
    {
        this.activeItem = item;
    }

    getSubcategoryFilter()
    {
        return this.subcategoryFilter;
    }

    getCategoryFilter()
    {
        return this.categoryFilter;
    }
}

class Shop {
    constructor(inventory, vendor={}, type="item", canSell=true, canBuy=true)
    {
        this.vendor = vendor;
        this.inventory = inventory;
        this.type = type;
        this.canSell = canSell;
        this.canBuy = canBuy;
        
    }

    getShopReturn()
    {
        return this.return;
    }

    initializeInventory()
    {
        this.inventory = new ShopInventory(this.inventory);
        this.inventory.initializeInventory();
        this.inventory.sortItems();
    }

    setSalePrices()
    {
        this.inventory.setSalePrices();
    }

    getFilteredInventory(category, subcategory)
    {
        if(category == "all" || subcategory == "all")
        {
            return this.inventory.getAllInCategory(category)
        }
        return this.inventory.getAllInSubcategory(subcategory);
    }

    getSoldItems()
    {
        return this.inventory.getSoldItems();
    }
    
    resetInventory(categories)
    {
        this.inventory = new ShopInventory();
        this.inventory.initializeInventory(categories)
    }

    addInventory(inventory)
    {
        this.inventory.addInventory(inventory);
    }

    areItemsAdded()
    {
        return this.inventory.areItemsAdded();
    }

    getEmptyCategories()
    {
        return this.inventory.getEmptyCategories();
    }

    getItemCategories()
	{
		return this.inventory.getItemCategories();
	}

	getItemSubcategories(category)
	{
		return this.inventory.getItemSubcategories(category);
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

    setQuantityInCart(item, quantity)
    {
        this.inventory.setQuantityInCart(item, quantity);
    }
}