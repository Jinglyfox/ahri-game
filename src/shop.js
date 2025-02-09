import { Inventory } from "./inventory"
import { Money } from "./money"
import shops from "./resources/data/shops.json"


export class ShopData {
    constructor()
    {
        this.activeShop = {};
    }

    setShop(shop)
    {
        this.activeShop = Object.assign(new Shop(), JSON.parse(JSON.stringify(shops[shop])));
    }
}

class Shop {
    constructor(vendor, inventory, type="item", canSell=true, canBuy=true)
    {
        this.vendor = vendor;
        this.inventory = inventory;
        this.type = type;
        this.canSell = canSell;
        this.canBuy = canBuy;
        this.runningTotal = 0;
        this.categoryFilter = "all";
        this.subcategoryFilter = "all";
        this.activeItem = null;
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

    getInventoryList()
    {
        return this.inventoryList;
    }

    getReturnTarget()
    {
        return this.return;
    }

    checkout()
    {
        let checkout = {};
        checkout.bought = this.inventory.getSoldItems();
        checkout.sold = this.virtualPlayerInventory.getSoldItems();
        this.inventory.checkout();
        return checkout;
    }

    areItemsAdded()
    {
        if(this.inventory.areItemsAdded() || this.virtualPlayerInventory.areItemsAdded())
        {
            return true;
        }
        return false;
    }

    getActiveItem()
    {
        return this.activeItem;
    }

    getActiveItemId()
    {
        if(this.activeItem == null)
        {
            return ''
        }
        return this.activeItem.getId();
    }

    setActiveItem(item)
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
    
    getEmptyCategories()
    {
        if(this.displayedPage == "buy")
        {
            return this.inventory.getEmptyCategories();
        }
        else
        {
            return this.virtualPlayerInventory.getEmptyCategories();
        }
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

    getVendor()
    {
        return this.vendor;
    }

    getShopInventory()
    {
        if(this.displayedPage == "buy")
        {
            return this.inventory.getAllInSubcategory(this.categoryFilter, this.subcategoryFilter);
        }
        else
        {
            return this.virtualPlayerInventory.getAllInSubcategory(this.categoryFilter, this.subcategoryFilter);
        }
    }

    setSubcategoryFilter(subcategory)
    {
        if(this.subcategoryFilter !== subcategory)
        {
            this.subcategoryFilter = subcategory;
            if(this.activeItem !== null)
            {
                if(subcategory !== "all" && this.activeItem.getSubcategory() !== subcategory)
                {
                    this.activeItem = null;
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
            if(this.activeItem !== null)
            {
                if(category !== "all" && this.activeItem.getCategory() !== category)
                {
                    this.activeItem = null;
                }
            }
        }
    }

    getDisabledMenu()
    {
        if(!this.canBuy)
        {
           return 'buy';
        }
        else if(!this.canSell || this.virtualPlayerInventory.checkEmpty())
        {
            return 'sell';
        }
        return '';
    }

    initializeShop(categories)
    {
        this.vendor = Object.assign(new Vendor(), this.vendor);
        this.inventory = new ShopInventory();
        this.inventory.initializeInventory(categories);
        this.displayedPage = "buy";
        if(!this.canBuy)
        {
            this.displayedPage = "sell";
        }
    }

    getHeader()
    {
        if(this.displayedPage == "buy")
        {
            return this.vendor.getName();
        }
        return "Stash"
    }

    setItemQuantity(item, quantity)
    {
        if(this.displayedPage == "buy")
        {
            this.runningTotal += (quantity - item.getQuantitySold()) * Money.convertDenomsToRaw(item.getPrice());
        }
        else
        {
            this.runningTotal -= (quantity - item.getQuantitySold()) * Money.convertDenomsToRaw(item.getSalePrice())
        }
        
        item.setQuantitySold(quantity);
    }

    removeFromTotal(amount)
    {
        this.runningTotal -= amount;
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
        this.activeFilter = "all";
        this.activeItem = null;
    }

    openShop(playerInventory)
    {
        this.virtualPlayerInventory = Object.assign(new ShopInventory(), JSON.parse(JSON.stringify(playerInventory)));
        this.virtualPlayerInventory.reinitializeInventory();
        this.virtualPlayerInventory.convertItems();
        this.virtualPlayerInventory.setQuantityForSale();
    }

    closeShop()
    {
        if(this.canBuy)
        {
            this.displayedPage = "buy";
        }
        this.activeFilter = "all";
        this.activeItem = null;
        this.inventory.resetQuantitySold();
        this.runningTotal = 0;
    }
}

class Vendor {
    constructor(name, blurb)
    {
        this.name = name;
        this.blurb = blurb;
        
    }

    getName()
    {
        return this.name;
    }

    getBlurb()
    {
        return this.blurb;
    }
}

export class ShopInventory extends Inventory {
    
    constructor()
    {
        super();
    }

    addInventory(inventory)
	{
		for(let category in inventory)
        {
            for(let item in inventory[category])
            {
                if(!this[category].hasOwnProperty(item))
                {
                    this[category][item] = (inventory.getItem(item, category));
                }
                else if(this[category][item].getQuantityForSale() !== -1 && inventory.getItem(item, category).getQuantityForSale() !== -1)
                {
                    this[category][item].setQuantityForSale(Math.max(this[category][item].getQuantityForSale(), inventory.getItem(item, category).getQuantityForSale())); 
                }
                else
                {
                    this[category][item].setQuantityForSale(-1);
                }
            }
        }
	}

    checkout()
    {
        for(let category in this)
        {
            for(let item in this[category])
            {
                let itemObject = this[category][item];
                if(itemObject.getQuantityForSale() > -1 && itemObject.getQuantitySold() > 0)
                {
                    itemObject.removeQuantityForSale(itemObject.getQuantitySold());
                }
            }
        }
    }

    resetQuantitySold()
    {
        for(let category in this)
        {
            for(let item in this[category])
            {
                this[category][item].setQuantitySold(0);
            }
        }
    }

    getSoldItems()
    {
        let soldItems = []
        for(let category in this)
        {
            for(let item in this[category])
            {
                if(this[category][item].getQuantitySold() > 0)
                {
                    soldItems.push(this[category][item])
                }
            }
        }
        return soldItems;
    }

    areItemsAdded()
    {
        for(let category in this)
        {
            for(let item in this[category])
            {
                if(this[category][item].getQuantitySold() > 0)
                {
                    return true;
                }
            }
        }
    }

    convertItems(items=null)
    {
        for(let category in this)
        {
            for(let item in this[category])
            {
                if(items !== null)
                {
                    this[category][item] = Object.assign(new ShopItem(this[category][item]), items[item]);
                }
                else
                {
                    this[category][item] = new ShopItem(this[category][item]);
                }
            }
        }
    }

    setQuantityForSale()
    {
        for(let category in this)
        {
            for(let item in this[category])
            {
                this[category][item].setQuantityAsSaleQuantity();
            }
        }
    }

    getActiveCategories()
    {
        let activeCategories = [];
        for(let category in this)
        {
            if(Object.keys(this[category] > 0))
            {
                activeCategories.push(category);
            }
        }
        return activeCategories;
    }
}

class ShopItem {
    constructor(item)
    {
        this.item = item;
        this.quantitySold = 0;
        this.flags = [];
    }

    isUnique()
    {
        return this.flags.includes("unique");
    }

    getSubcategory()
    {
        return this.item.getSubcategory();
    }

    getItem()
    {
        return this.item;
    }

    removeQuantityForSale(amount)
    {
        this.quantityForSale -= amount;
    }

    setQuantityAsSaleQuantity()
    {
        this.quantityForSale = this.item.getQuantity();
    }

    setQuantityForSale(amount)
    {
        this.quantityForSale = amount;
    }

    getDescription()
    {
        return this.item.getDescription();
    }

    getQuantityForSale()
    {
        return this.quantityForSale;
    }

    getCategory()
    {
        return this.item.getCategory();
    }

    getSalePrice()
    {
        return this.item.getSalePrice();
    }

    getPrice()
    {
        return this.item.getPrice();
    }

    getQuantitySold()
    {
        return this.quantitySold;
    }

    setQuantitySold(amount)
    {
        this.quantitySold = amount;
    }

    getQuantity()
    {
        return this.item.getQuantity();
    }

    getId()
    {
        return this.item.getId()
    }

    getName()
    {
        return this.item.getName()
    }
}