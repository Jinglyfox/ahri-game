import globals from "./resources/data/globals.json"
import { Money } from "./money"

export class Inventory
{
	constructor()
	{

	}

	containsItem(item, category)
	{
		return this[category].hasOwnProperty(item)
	}

	getItem(item, category)
	{
		return this[category][item]
	}

	checkEmpty()
	{
		for(let category in this)
		{
			for(let item in this[category])
			{
				if(this[category][item].getQuantity() > 0)
				{
					return false;
				}
			}
		}
		return true;
	}

	addItem(item, quantity = 0)
	{
		if(!this[item.getCategory()].hasOwnProperty(item.getId()))
		{
			this[item.getCategory()][item.getId()] = item;
		}
		this[item.getCategory()][item.getId()].addQuantity(quantity);
	}

	getAllInSubcategory(category, subcategory)
	{
		if(category == "all" || subcategory == "all")
		{
			return this.getAllInCategory(category)
		}

		let itemsInSubcategory = [];
		for(let item in this[category])
		{
			if(this[category][item].getSubcategory() == subcategory)
			{
				itemsInSubcategory.push(this[category][item])
			}
		}
		return itemsInSubcategory;
	}

	getAllInCategory(filter)
	{
		let itemsInCategory = [];
		if(filter == "all")
		{
			for(let category in this)
			{
				for(let item in this[category])
				{
					itemsInCategory.push(this[category][item]);
				}
			}
		}
		else
		{
			for(let item in this[filter])
			{
				itemsInCategory.push(this[filter][item]);
			}
		}
		
		return itemsInCategory;
	}

	initializeInventory(categories)
	{
		for(let category of categories)
		{
			this[category] = {};
		}
	}

	reinitializeInventory()
	{
		for(let category in this)
		{
			for(let item in this[category])
			{
				this[category][item] = Object.assign(new Item(), this[category][item]);
			}
		}
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
		let category = item.getCategory();
		let id = item.getId();
		if(this[category][id].quantity > quantity)
		{
			this[category][id].quantity -= quantity;
		}
		else if(this[category][id].quantity <= quantity)
		{
			let truncatedInventory = {};
			for(let itemId in this[category])
			{
				if(itemId != id)
				{
					truncatedInventory[itemId] = this[category][itemId];
				}
			}
			this[category] = truncatedInventory;
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

export class Item {
	constructor(id="", name="", category="", description= "", price = [0,0,0,0], sellable = true)
	{
		this.id = id;
		this.name = name;
		this.category = category;
		this.description = description;
		this.price = price;
		this.sellable = sellable;
		this.salePriceMultiplier = globals.salePriceMultiplier;
		this.quantity = 0;
	}

	setSalePrice()
	{
        if(this.hasOwnProperty("salePrice"))
        {
            this.salePrice = this.salePrice;
        }
        else
        {
            let rawValue = Math.floor(Money.convertDenomsToRaw(this.price) * this.salePriceMultiplier);
            this.salePrice = Money.convertRawToDenoms(rawValue);
        }
	}

	getSubcategory()
	{
		return this.subcategory;
	}

	addQuantity(amount)
	{
		this.quantity += amount;
	}	

	removeQuantity(amount)
	{
		this.quantity -= amount;
	}

	getQuantity()
	{
		return this.quantity;
	}

	getName()
	{
		return this.name;
	}	

	getSellabe()
	{
		return this.sellable;
	}

	getDescription()
	{
		return this.description;
	}

	getQuantity()
	{
		return this.quantity;
	}

	getSalePriceMultiplier()
	{
		return this.salePriceMultiplier;
	}

	getSalePrice()
	{
		return this.salePrice;
	}

	getPrice()
	{
		return this.price;
	}

	getCategory()
	{
		return this.category;
	}

	getId()
	{
		return this.id;
	}
}

class ItemPrice {
	
}

export class ItemDictionary {
    constructor()
    {

    }

	initializeDictionary()
	{
		for(let category in this)
		{
			for(let item in this[category])
			{
				this[category][item] = Object.assign(new Item(), this[category][item]);
				this[category][item].setSalePrice();
			}
		}
	}

	getCategory(category)
	{
		return this[category];
	}

	findItemById(itemId)
	{
		for(let category in this)
		{
			for(let item in this[category])
			{
				if(itemId === this[category][item].getId())
				{
					return this[category][item];
				}
			}
		}
	}

	// returns a clone of an item. the item input can be either an item object or the id of an item.
	// clones are important for managing vendors & inventories.
	getItem(item, category="")
	{
		if(item instanceof Item)
		{
			return Object.assign(new Item(), JSON.parse(JSON.stringify(this[item.getCategory()][item.getId()])))
		}
		if(!this.hasOwnProperty(category))
		{
			console.log(`Category ${category} not found.`);
			return;
		}
		if(!this[category].hasOwnProperty(item))
		{
			console.log(`Item ${item} not found.`);
			return;
		}
		return Object.assign(new Item(), JSON.parse(JSON.stringify(this[category][item])));
	}
	
	getSubcategories(parentCategory)
	{
		let subCategories = new Array()
		if(parentCategory !== "all")
		{
			for(let item in this[parentCategory])
			{
				if(!subCategories.includes(this[parentCategory][item].getSubcategory()))
				{
					subCategories.push(this[parentCategory][item].getSubcategory())
				}
			}
		}
		return subCategories
	}

	getCategories()
	{
		let categories = new Array();
		for(let category in this)
		{
			categories.push(category);
		}

		return categories;
	}
}