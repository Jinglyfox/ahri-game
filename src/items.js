import globals from "./resources/data/globals.json"
import items from "./resources/data/items.json"
import { Money } from "./money"

export class Item {
	constructor(id="", name="", category="", description= "", priceRaw = 0, priceDenom = [], sellable = true)
	{
		this.id = id;
		this.name = name;
		this.category = category;
		this.description = description;
		this.priceRaw = priceRaw == 0 && priceDenom != [] ? Money.convertDenomToRaw(priceDenom) : priceRaw;
		this.priceDenom = priceDenom == [] ? Money.convertRawToDenoms(priceRaw) : priceDenom;
		//almost everything should just be flags. Whether or not it's unique, etc. Why is quantity also tied to the fucking item? tie it to the inventory.
		this.sellable = sellable;
	}

	getSubcategory()
	{
		return this.subcategory;
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

	getPriceRaw()
	{
		return this.priceRaw;
	}

	getPriceDenom()
	{
		return this.priceDenom;
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