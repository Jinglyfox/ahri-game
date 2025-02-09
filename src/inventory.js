import { ItemDictionary } from "./items";

export class Inventory
{
	constructor(items = null)
	{
        this.items = items;
	}

	containsItem(item)
	{
		return this.items.hasOwnProperty(item)
	}

	getItem(item)
	{
		if(this.containsItem(item))
        {
            return this.items[item]
        }
        console.log("Error: Attempted to pull item not in inventory.");
        return undefined;
	}

	checkEmpty()
	{
		for(let item in this.items)
		{
            if(this[item].getQuantity() > 0) 
            {
                return false;
            }
		}
		return true;
	}

	addItem(item, quantity = 0)
	{
		if(!this.items.hasOwnProperty(item.getId()))
		{
			this.items[item.getId()] = item;
		}
		this.items[item.getId()].addQuantity(quantity);
	}

	getAllInSubcategory(category, subcategory)
	{
		if(category == "all" || subcategory == "all")
		{
			return this.getAllInCategory(category)
		}
		let itemsInSubcategory = [];
		for(let item in this.items)
		{
			if(this.items[item].getSubcategory() == subcategory)
			{
				itemsInSubcategory.push(this.items[item])
			}
		}
		return itemsInSubcategory;
	}

	getAllInCategory(filter)
	{
		let itemsInCategory = [];
		if(filter == "all")
		{
			return this.items;
		}
		else
		{
			for(let item in this.items)
			{
				if(this.items.getCategory() == filter)
                {
                    itemsInCategory.push(this.items[item]);
                }
			}
		}		
		return itemsInCategory;
	}

	getEmptyCategories()
	{
		let emptyCategories = []
		for(let category in this)
		{
			if(Object.keys(this[category]) == 0)
			{
				emptyCategories.push(category);
			}
		}
		return emptyCategories;
	}

	removeItem(item, quantity = 1)
	{
		let id = item.getId();
		if(this.items[id].quantity > quantity)
		{
			this.items[id].quantity -= quantity;
		}
		else if(this.items[id].quantity <= quantity)
		{
			delete this.items[id];
		}
	}
    
    
	/*
	

	canRemoveItem(item, quantity = 1)
	{
		if(this[item].quantity >= quantity)
		{
			return true;
		}
		return false;
	}

	getExcludedCategories()
	{
		let includedCategories = new Array();
		let excludedCategories = new Array();
		for(let item in this)
		{
			if(!includedCategories.includes(this[item].type))
			{
				includedCategories.push(this[item].type);
			}
		}
		for(let category in data.itemDict.itemCategories)
		{
			
			if(!includedCategories.includes(data.itemDict.itemCategories[category]))
			{
				excludedCategories.push(data.itemDict.itemCategories[category]);
			}
		}
		return excludedCategories;
	}

	containsItemOfCategory(category)
	{
		if(category === "all")
		{
			return true;
		}
		for(let item in this)
		{
			if(this[item].type === category)
			{
				return true;
			}
		}
		return false;
	}

	filterInventory(category)
	{
		let filteredInventory = new Inventory();
		for(let item in this)
		{
			if(category === "all" || this[item].type === category)
			{
				filteredInventory.items[item] = this[item];
			}
		}
		return filteredInventory;
	}

	containsItems()
	{
		for(let item in this)
		{
			if(this[item].quantity > 0)
			{
				return true;
			}
		}
		return false;
	} */
}