import areas from "./resources/data/areas.json"
import characters from "./resources/data/characters.json"
import items from "./resources/data/items.json"
import shops from "./resources/data/shops.json"
import globals from "./resources/data/globals.json"
import inventories from "./resources/data/inventories.json"
import { Wallet, Money } from "./money"
import { ItemDictionary, Inventory } from "./items"
import { Shop, ShopInventory } from "./shop"

var fish = "oink";

class Data
{
	constructor()
    {
        this.areas = {};
		this.characters = {};
		this.shops = {};
        this.variables = {};
		this.activeScenes = {};
		this.shopInventories = {};
		this.uiToRender = "overworld";
    }
    
    /*constructor()
	{
		this.player;
		this.characters = {};
		this.areas = {};
		this.variables = {}
		this.raceDict = {};
		this.vendorDict = {};
		this.bodyPartDict = {};
		this.customerDict = {};
		this.storage = {};
		this.itemDict = {};
		this.activeMap;
	}

    */

	shopReturn()
	{
		this.activeShop.closeShop();
		this.setNewScene(this.activeShop.getReturnTarget());
		this.activeShop = null;
	}

	areItemsAdded()
	{
		return this.activeShop.areItemsAdded();
	}

	getDisabledMenu()
	{
		return this.activeShop.getDisabledMenu();
	}
	
	canRemoveItem(item)
	{
		if(item.quantityForSale - 1 == this.requestItemQuantity(item, item.quantityForSale - 1))
		{
			return false;
		}
		return true;
	}

	swapShopInventory(buyOrSell)
	{
		this.activeShop.swapShopInventory(buyOrSell);
	}

	getEmptyCategories()
	{
		return this.activeShop.getEmptyCategories();
	}

	getItemCategories()
	{
		return this.itemDictionary.getCategories();
	}

	getFilteredSubcategories()
	{
		return this.itemDictionary.getSubcategories(this.activeShop.getCategoryFilter())
	}

	getSubcategoryFilter()
	{
		return this.activeShop.getSubcategoryFilter()
	}

	getCategoryFilter()
	{
		return this.activeShop.getCategoryFilter();
	}

	setSubcategoryFilter(filter)
	{
		this.activeShop.setSubcategoryFilter(filter);
	}

	setCategoryFilter(filter)
	{
		this.activeShop.setCategoryFilter(filter);
	}

	getRunningTotal()
	{
		return this.formatRunningTotal(Money.convertRawToDenoms(this.activeShop.getRunningTotal()));
	}

	getItemPrice(item)
	{
		return this.formatPrice(this.activeShop.getItemDisplayPrice(item))
	}

	getActiveShop()
	{
		return this.activeShop;
	}

	getVendor()
	{
		return this.activeShop.getVendor();
	}

	getShopHeader()
	{
		return this.activeShop.getHeader();
	}

	getShopInventory()
	{
		return this.activeShop.getShopInventory();
	}

	addMoney(amount)
	{
		this.variables.wallet.addMoney(amount);
	}

	removeMoney(amount)
	{
		this.variables.wallet.removeMoney(amount);
	}

	getUiToRender()
	{
		return this.uiToRender;
	}

	getMoney()
	{
		return this.variables.wallet.getProcessedMoney();
	}

	setActiveShopItem(item)
	{
		this.activeShop.setActiveItem(item);
	}

	getActiveItemId()
	{
		return this.activeShop.getActiveItemId();
	}

	getActiveItem()
	{
		return this.activeShop.getActiveItem();
	}

	getActiveScene()
	{
		return this.activeScene;
	}

	getDisplayText()
	{
		return this.displayText;
	}

	getButtonDock()
	{
		return this.buttonDock;
	}

	checkout()
	{
		let runningTotal = this.activeShop.getRunningTotal();
		let checkout = this.activeShop.checkout();
		for(let shopItem of checkout.sold)
		{
			this.variables.inventory.removeItem(shopItem.getItem(), shopItem.getQuantitySold());
		}
		for(let shopItem of checkout.bought)
		{
			this.variables.inventory.addItem(shopItem.getItem(), shopItem.getQuantitySold());
		}
		this.variables.wallet.removeMoney(runningTotal);
	}

	formatRunningTotal(total)
	{
		let totalString = [];
		if(this.activeShop.getRunningTotal() < 0)
		{
			totalString.push(<span key={total.length - 1}>+{total[total.length - 1]}{globals.denomAbbrevs[total.length - 1]}</span>);
		}
		else if(this.activeShop.getRunningTotal() > 0)
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

	formatPrice(price)
	{
		let startDenom = false;
		let priceString = [];
		for(let i = price.length - 1; i >= 0; i--)
		{
			if(price[i] !== 0 || startDenom)
			{
				priceString.push(<span key={i}>{price[i]}{globals.denomAbbrevs[i]}</span>);
				startDenom = true;
			}
		}
   		return priceString;
  	}

	requestItemQuantity(item, request)
	{
		let itemPrice = this.activeShop.getItemPrice(item);
		let runningTotal = this.activeShop.getRunningTotal();
		let totalForSale = item.getQuantityForSale();
		let quantity = request;
		if(!this.variables.wallet.canAfford(runningTotal + itemPrice * (quantity - item.getQuantitySold())))
		{
			quantity = Math.floor((this.variables.wallet.getRawValue() - (runningTotal - itemPrice * item.getQuantitySold()))/Math.abs(itemPrice));
			if(quantity < 0)
			{
				quantity = item.getQuantitySold();
			}
		}
		if((totalForSale != null && quantity > totalForSale) && totalForSale >= 0)
		{
			quantity = totalForSale;
		}
		if(quantity < 0)
		{
			quantity = 0;
		}
		if(quantity > 9999)
		{
			quantity = 9999;
		}
		return quantity;
	}

	setShopItemQuantity(item, quantity)
	{
		this.activeShop.setItemQuantity(item, quantity);
	}

	buttonPress(buttonObject)
	{
		let target = buttonObject.target;
		if(buttonObject.targetType === "shop")
		{
			this.setNewShop(target)
		}
		else if(target !== null)
		{
			if(target instanceof Object)
			{
				this.setNewArea(target[0], target[1]);
			}
			else
			{
				this.setNewScene(target);
			}
		}
	}

	setNewShop(shopId)
	{
		this.uiToRender = "shop";
		this.activeShop = this.shops[shopId];
		this.activeShop.openShop(this.variables.inventory);
	}

	setNewScene(sceneID)
	{
		if(this.uiToRender != "overworld")
		{
			this.uiToRender = "overworld";
		}
		this.activeScene = this.activeScenes[sceneID];
		if(!this.variables.flags.hasOwnProperty(`times_seen_${sceneID}`))
		{
			this.variables.flags[`times_seen_${sceneID}`] = 0;
		}
		this.variables.flags[`times_seen_${sceneID}`] += 1;

		this.buttonDock = this.activeScene.getButtonDock();
		this.displayText = this.activeScene.description;
		for(let character in this.characters)
		{
			if(this.characters[character].checkAreaBlurbs(this.currentArea, sceneID))
			{
				this.displayText += this.characters[character].getDisplayText(this.currentArea, sceneID);
				if(this.characters[character].accessibleInScene(this.currentArea, sceneID))
				{
					this.addDockButton(this.characters[character].getSceneButton(this.currentArea, sceneID));
				}
			}
		}
	}

	updateShops()
	{
		for(let shop in this.shops)
		{
			this.shops[shop].resetInventory(this.itemDictionary.getCategories());
			let inventoryList = this.shops[shop].getInventoryList()
			for(let shopInventory in inventoryList)
			{
				if(inventoryList[shopInventory].hasOwnProperty("lock"))
				{
					if(this.testLock(inventoryList[shopInventory].lock))
					{
						this.shops[shop].addInventory(this.shopInventories[shopInventory]);
					}
				}
				else
				{
					this.shops[shop].addInventory(this.shopInventories[shopInventory]);
				}
			}
		}
	}

	testLock(lock)
	{
		if(this.variables.flags.hasOwnProperty(lock.flag))
		{
			return Lock.testLock(lock.key, lock.value, this.variables.flags[lock.flag])
		}
		return false;
	}

	setNewArea(area, entryScene)
	{
		this.activeMap = this.areas[area];
		this.currentArea = area;
		this.activeScenes = this.areas[area].cells;
		for(let character in this.characters)
		{
			if(this.characters[character].checkAreaScenes(area))
			{
				this.loadCharacter(this.characters[character]);
			}
		}
		this.setNewScene(entryScene);
	}

	addDockButton(buttonObject)
	{
		for(let i = 0; i < this.buttonDock.length; i++)
		{
			if(this.buttonDock[i].name == "")
			{
				this.buttonDock[i] = buttonObject;
				break;
			}
			if(i == this.buttonDock.length - 1)
			{
				console.log("Error: Too many buttons added to this scene.");
			}
		}
	}

	loadCharacter(character)
	{
		for(let scene in character.scenes[this.currentArea])
		{
			if(!(character.scenes[this.currentArea][scene] instanceof Scene))
			{
				character.scenes[this.currentArea][scene] = Object.assign(new Scene(), character.scenes[this.currentArea][scene]);
				character.scenes[this.currentArea][scene].initializeScene();
				
			}
			this.activeScenes[scene] = character.scenes[this.currentArea][scene];
		}
	}

    initializeData()
    {
		this.itemDictionary = Object.assign(new ItemDictionary(), items);
		this.itemDictionary.initializeDictionary();
		this.variables.flags = {};
		this.variables.wallet = new Wallet();
		this.variables.inventory = new Inventory();
		this.variables.inventory.initializeInventory(this.itemDictionary.getCategories());
		this.variables.inventory.addItem(this.itemDictionary.getItem("woodbow", "weapon"), 5)
		this.variables.inventory.addItem(this.itemDictionary.getItem("iron", "resource"), 3)
		
		for(let character in characters)
		{
			this.characters[character] = Object.assign(new Character(), characters[character]);
		}
		for(let area in areas) {
            this.areas[area] = new Area(area, areas[area]);
			this.areas[area].initializeArea();
        }
		for(let inventory in inventories)
		{
			let itemObjects = new Inventory();
			itemObjects.initializeInventory(this.itemDictionary.getCategories());
			for(let itemId in inventories[inventory])
			{
				let itemObject = this.itemDictionary.findItemById(itemId);
				itemObjects.addItem(itemObject);
			}
			itemObjects = Object.assign(new ShopInventory(), itemObjects);
			itemObjects.convertItems(inventories[inventory]);
			this.shopInventories[inventory] = itemObjects;
		}
		for(let shop in shops)
		{
			this.shops[shop] = Object.assign(new Shop(), shops[shop]);
			this.shops[shop].initializeShop(this.itemDictionary.getCategories());
			for(let shopInventory in this.shops[shop].getInventoryList())
			{
				this.shops[shop].addInventory(this.shopInventories[shopInventory]);
			}
		}
		this.setNewArea("inntown", "inn_entrance");
    }
}

class Lock {
	constructor()
	{

	}

	static testLock(key, value, flagValue)
	{
		if(key === "over")
		{
			return flagValue > Number(value);
		}
		else if(key === "equal")
		{
			return flagValue == value;
		}
		else if(key === "under")
		{
			return flagValue < Number(value);
		}
	}
}

class Character
{
	constructor(id, scenes, areas)
	{
		this.id = id;
		this.scenes = scenes;
		this.blurbs = areas;
	}

	checkAreaBlurbs(area, sceneID)
	{
		if(this.blurbs.hasOwnProperty(area))
		{
			if(this.blurbs[area].hasOwnProperty(sceneID))
			{
				return true;
			}
		}
		return false;
	}

	checkAreaScenes(area)
	{
		if(this.scenes.hasOwnProperty(area))
		{
			return true;
		}
		return false;
	}

	accessibleInScene(area, sceneID)
	{
		if(this.blurbs[area][sceneID].hasOwnProperty("button"))
		{
			return true;
		}
		return false;
	}

	getSceneButton(area, sceneID)
	{
		return this.blurbs[area][sceneID].button;
	}

	getDisplayText(area, sceneID)
	{
		return this.blurbs[area][sceneID].description;
	}
}

class Area
{
	constructor(id, cells)
	{
		this.id = id;
		this.cells = cells;
	} 

	initializeArea()
	{
		for(let cell in this.cells)
		{
			this.cells[cell] = Object.assign(new Scene(), this.cells[cell]);
			this.cells[cell].initializeScene();
		}
		//this.initializeInjectors();
		//this.initializeEvents();
		//this.initializeCharacterInjectors();
		//this.finalizeScenes();
	}

	getScene(sceneID)
	{
		return this.cells[sceneID];
	}
}



class Scene 
{
	constructor(id, type, description, buttons)
	{
		this.id = id;
		this.type = type;
		this.description = description;
		this.buttons = buttons;
		this.injectors = new Array();
		this.activeButtons = new Array();
		this.buttonDock = new Array();
		this.timeCost = null;
	}

	getButtonIds()
	{
		return this.buttonIDs;
	}

	initializeScene()
	{
		this.buildButtons();
	}

	getButtonDock()
	{
		return JSON.parse(JSON.stringify(this.buttonDock));
	}

	buildButtons()
	{
		for(let i = 0; i < 15; i++)
		{
			this.buttonDock.push(new DockButton(i));
		}
		for(let i = 0; i < this.buttons.length; i++)
		{
			let button = this.buttons[i];
			this.buttonDock[button.id] = Object.assign(new DockButton(), button);
			this.buttonDock[button.id].disabled = false;
		}
	}

	buildScene()
	{
		data.variables.lastSceneType = "free";
		if(data.variables.lastScene !== this.id)
		{
			data.variables.lastScene = data.variables.currentScene;
		}
		data.variables.currentScene = this.id;
    }
}

class DockButton
{
	constructor(id = -1, name = "", target = null, targetType = null, condition = null)
	{
        this.id = id;
		this.name = name;
		this.target = target;
		this.targetType = targetType;
		this.condition = condition;
		this.disabled = true;
		this.removed = false;
		this.timeCost = null;
		this.timeAvailable = null;
	}
}

export var data = new Data();