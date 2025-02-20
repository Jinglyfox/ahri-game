import items from "./resources/data/items.json"
import { Item } from "./items";
import globals from "./resources/data/globals.json"
import { Money } from "./money";

/*
I want inventory objects to have a list of items 



*/


export class Inventory
{
	constructor(itemsUnsorted = {})
	{
        this.itemsUnsorted = itemsUnsorted;
        this.itemsSorted = {}
        this.emptyCategories = [];
	}

    initializeInventory()
    {
        for(let item in this.itemsUnsorted)
        {
            for(let category in items)
            {
                if(items[category].hasOwnProperty(item))
                {
                    let itemObject = Object.assign(new Item(), items[category][item]);
                    let quantity = this.itemsUnsorted[item].quantity;
                    this.itemsUnsorted[item] = new InventoryItem(itemObject, quantity);
                }
            }
        }
    }

    getItemSubcategories(category)
    {
        let subCategories = new Array()
		if(category !== "all")
		{
			for(let item in this.itemsSorted[category])
			{
                if(!subCategories.includes(this.itemsSorted[category][item].getSubcategory()))
				{
					subCategories.push(this.itemsSorted[category][item].getSubcategory())
				}
			}
		}
		return subCategories
    }

    sortItems()
    {
        for(let item in this.itemsUnsorted)
        {
            let category = this.itemsUnsorted[item].getCategory();
            if(!this.itemsSorted.hasOwnProperty(category))
            {
                this.itemsSorted[category] = {};
            }
            this.itemsSorted[category][item] = this.itemsUnsorted[item];
        }
        for(let category in items)
        {
            if(!this.itemsSorted.hasOwnProperty(category))
            {
                this.emptyCategories.push(category);
            }
        }
    }

	containsItem(item)
	{
		return this.itemsUnsorted.hasOwnProperty(item)
	}

	getItem(item)
	{
		if(this.containsItem(item))
        {
            return this.itemsUnsorted[item]
        }
        console.log("Error: Attempted to pull item not in inventory.");
        return undefined;
	}

	isEmpty()
	{
		for(let item in this.itemsUnsorted)
		{
            if(this.itemsUnsorted[item].getQuantity() > 0 || this.itemsUnsorted[item].hasFlag("unlimited")) 
            {
                return false;
            }
		}
		return true;
	}

    boughtItems(itemsBought)
    {
        for(let i = 0; i < itemsBought.length; i++)
        {
            this.addItem(itemsBought[i].getId(), itemsBought[i].getQuantityInCart());
        }
    }

    soldItems(itemsSold)
    {
        for(let i = 0; i < itemsSold.length; i++)
        {
            this.removeItem(itemsSold[i].getId(), itemsSold[i].getQuantityInCart());
        }
        
    }

	addItem(item, quantity = 1)
	{
		if(!this.itemsUnsorted.hasOwnProperty(item))
		{
			for(let category in items)
            {
                if(items[category].hasOwnProperty(item))
                {
                    let itemObject = Object.assign(new Item(), items[category][item]);
                    this.itemsUnsorted[item] = new InventoryItem(itemObject, 0)
                    break;
                }
            }
		}
        if(!this.itemsUnsorted.hasOwnProperty(item))
        {
            Error("Attempted to add item to inventory that does not exist.\nItem Name: " + item);
        }
        else
        {
            this.itemsUnsorted[item].addQuantity(quantity);
            this.sortItems();
        }
	}

    removeItem(item, quantity = 1)
	{
		if(this.itemsUnsorted[item].getQuantity() > quantity)
		{
			this.itemsUnsorted[item].subtractQuantity(quantity);
		}
		else if(this.itemsUnsorted[item].getQuantity() <= quantity)
		{
			delete this.itemsUnsorted[item];
		}
	}

	getAllInSubcategory(subcategory)
	{
		let itemsInSubcategory = [];
        for(let item in this.itemsUnsorted)
		{
            if(this.itemsUnsorted[item].getSubcategory() == subcategory)
			{
                itemsInSubcategory.push(this.itemsUnsorted[item])
			}
		}
		return itemsInSubcategory;
	}

	getAllInCategory(filter)
	{
        if(filter == "all")
		{
            return this.itemsUnsorted;
		}
		else
		{
			return this.itemsSorted[filter]
		}		
	}

    getUnsortedItems()
    {
        return this.itemsUnsorted;
    }

	getEmptyCategories()
	{
        return this.emptyCategories;
	}
}

export class ShopInventory extends Inventory
{
    constructor(itemsUnsorted = {})
	{
        super(itemsUnsorted)
	}

    setBoughtItems(items)
    {
        for(let item in items)
        {
            this.itemsUnsorted[items[item].getId()].subtractQuantity(items[item].getQuantityInCart())
        }
    }

    setSalePrices()
    {
        for(let item in this.itemsUnsorted)
        {
            this.itemsUnsorted[item].setSalePrice();
        }
    }

    removeSoldItems()
    {
        for(let item in this.itemsUnsorted)
        {
            this.itemsUnsorted[item].subtractQuantity(this.itemsUnsorted[item].getQuantityInCart())
            this.itemsUnsorted[item].setQuantityInCart(0);
        }
    }

    initializeInventory()
    {
        for(let item in this.itemsUnsorted)
        {
            for(let category in items)
            {
                if(items[category].hasOwnProperty(item))
                {
                    let itemObject = Object.assign(new Item(), items[category][item]);
                    let quantity = this.itemsUnsorted[item].quantity;
                    let flags = this.itemsUnsorted[item].flags
                    this.itemsUnsorted[item] = new ShopItem(itemObject, quantity, flags);
                    this.itemsUnsorted[item].setPrice();
                }
            }
        }
    }

    getSoldItems()
    {
        let soldItems = []
        for(let item in this.itemsUnsorted)
        {
            if(this.itemsUnsorted[item].getQuantityInCart() > 0)
            {
                soldItems.push(this.itemsUnsorted[item])
            }
        }
        return soldItems;
    }

    setQuantityInCart(item, quantity)
    {
        this.itemsUnsorted[item].setQuantityInCart(quantity);
    }

    areItemsAdded()
    {
        for(let item in this.itemsUnsorted)
        {
            if(this.itemsUnsorted[item].getQuantityInCart() > 0)
            {
                return true;
            }
        }
        return false;
    }
}

export class InventoryItem
{
    constructor(item = null, quantity = 0, flags = [])
    {
        this.item = item;
        this.quantity = quantity;
        this.flags = flags;
    }

    addQuantity(quantity)
    {
        this.quantity += quantity;
    }

    subtractQuantity(quantity)
    {
        this.quantity -= quantity;
    }

    getId()
    {
        if(this.item == null)
        {
            return "";
        }
        return this.item.getId();
    }

    hasFlag(flag)
    {
        return this.flags.includes(flag);
    }

    getItemFlag(flag)
    {
        return this.item.hasFlag(flag);
    }

    getQuantity()
    {
        return this.quantity;
    }

    getDescription()
    {
        return this.item.getDescription();
    }

    getName()
    {
        return this.item.getName();
    }

    getCategory()
    {
        return this.item.getCategory();
    }

    getQuantity()
    {
        return this.quantity;
    }

    getPriceRaw()
    {
        return this.item.getPriceRaw();
    }

    getPriceDenom()
	{
		return this.item.getPriceDenom();
	}

    getSubcategory()
    {
        return this.item.getSubcategory();
    }
}

export class ShopItem extends InventoryItem 
{
    constructor(item = null, quantity = 0, flags= [], quantityInCart = 0, price = 0)
    {
        super(item, quantity, flags);
        this.quantityInCart = quantityInCart;
        this.price = price;
    }

    getFormattedPrice()
    {
		return Money.formatPrice(Money.convertRawToDenoms(this.price));
    }

    getPriceRaw()
    {
        return this.price;
    }

    getPriceDenom()
	{
		return Money.convertRawToDenoms(this.price);
	}

    setPrice()
    {
        this.price = this.item.getPriceRaw();
    }

    setSalePrice()
    {
        this.price = Math.ceil(this.item.getPriceRaw() * globals.salePriceMultiplier);
    }

    addQuantityInCart(quantity)
    {
        this.quantityInCart += quantity;
    }

    removeQuantityInCart(quantity)
    {
        this.quantityInCart -= quantity;
    }

    setQuantityInCart(quantity)
    {
        this.quantityInCart = quantity;
    }

    getQuantityInCart()
    {
        return this.quantityInCart;
    }
}