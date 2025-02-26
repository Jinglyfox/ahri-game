import { DisplayInventory, ShopInventory, InventoryItem, ShopItem } from "./inventory";
import { gameDataAPI } from "./GameData";

const shopIndex = 0;
const playerIndex = 1;


class SwappableInventoryDisplay {
    constructor(...inventories)
    {
        this.inventories = inventories;
        this.categoryFilter = "all";
        this.subcategoryFilter = "all";
        this.activeItem = new InventoryItem();
        this.displayedPage = 0;
        this.displayedInventory = {};
    }

    getEmptyCategories()
    {
        return this.displayedInventory.getEmptyCategories();
    }

    initializeInventories()
    {
        for(let inventory of this.inventories)
        {
            inventory = new DisplayInventory(inventory);
            inventory.initializeInventory();
            inventory.sortInventory();
        }
        this.displayedInventory = this.inventories[this.displayedPage];
    }

    getDisplayedPage()
    {
        return this.displayedPage;
    }

    swapInventory(inventoryIndex)
    {
        this.displayedPage = inventoryIndex;
        this.displayedInventory = this.inventories[inventoryIndex]
        this.displayedInventory.resetPage();
    }

    setSubcategoryFilter(subcategory)
    {
        this.displayedInventory.setSubcategoryFilter(subcategory);
    }

    setCategoryFilter(category)
    {
        this.displayedInventory.setCategoryFilter(category);
    }

    setQuantity(itemId, quantity)
    {
        this.displayedInventory.setQuantity(itemId, quantity);
    }

    setActiveItem(item)
    {
        this.displayedInventory.setActiveItem(item);
    }

    getDisplayedInventory()
    {
        return this.displayedInventory;
    }
}

export class ShopInventoryDisplay extends SwappableInventoryDisplay 
{
    constructor(shopInventory, playerInventory)
    {
        super(shopInventory, playerInventory);
        this.displayedPage = "buy";
    }

    initializeInventories()
    {
        this.inventories[shopIndex] = new ShopInventory(this.inventories[shopIndex]);
        this.inventories[playerIndex] = new ShopInventory(this.inventories[playerIndex]);
        for(let inventory of this.inventories)
        {
            inventory.initializeInventory();
            inventory.sortItems();
        }
        this.inventories[playerIndex].setSalePrices();
    }

    initializeDisplay(canBuy, canSell)
    {
        if(canBuy)
        {
            this.displayedPage = 'buy';
            this.displayedInventory = this.inventories[shopIndex];
        }
        else if(canSell && !this.inventories[playerIndex].isEmpty())
        {
            this.displayedPage = "sell"
            this.displayedInventory = this.inventories[playerIndex];
        }
    }

    swapInventory(buyOrSell)
    {
        this.displayedPage = buyOrSell;
        if(this.displayedPage == "buy")
        {
            this.displayedInventory = this.inventories[shopIndex];
        }
        else
        {
            this.displayedInventory = this.inventories[playerIndex];
        }
        this.displayedInventory.resetPage();
    }

    getActiveItem()
    {
        return this.displayedInventory.getActiveItem();
    }

    getSoldItems()
    {
        return this.inventories[playerIndex].getSoldItems();
    }

    getBoughtItems()
    {
        return this.inventories[shopIndex].getSoldItems()
    }

    checkout(shopId)
    {
        this.inventories[shopIndex].removeSoldItems();
        gameDataAPI.setVisitedShop(shopId, this.inventories[shopIndex].getUnsortedItems())
    }

    areItemsAdded()
    {
        for(let inventory of this.inventories)
        {
            if(inventory.areItemsAdded())
            {
                return true;
            }
        }
        return false;
    }

    setQuantity(itemId, quantity)
    {
        this.displayedInventory.setQuantityInCart(itemId, quantity);
    }
}