
import globals from "./resources/data/globals.json"
import inventories from "./resources/data/inventories.json"
import { OverworldData } from "./overworld"
import { Wallet, Money } from "./money"
import { player } from "./player"
import { ShopData, ShopInventory } from "./shop"
import {ItemData } from "./items"

let overworldData = new OverworldData();
let shopData;
let itemData = new ItemData();
let uiToRender = "overworld";

class Request
{
	constructor()
	{

	}

	getPlayerWalletDenoms()
	{
		return player.getWalletDenoms();
	}

	initializeData()
	{
		overworldData.initializeZones();
		itemData.initializeDictionary();
		player.addItem("woodbow")
	}

	getDenomNames()
	{
		return globals.denomNames;
	}

	getUiToRender()
	{
		return uiToRender;
	}

	getButtonDock()
	{
		return overworldData.getButtonDock();
	}

	getDisplayText()
	{
		return overworldData.getDisplayText();
	}

	requestCanChangeQuantity(item, quantity)
	{
		return shopData.requestCanChangeQuantity(item, quantity);
	}

	getDisplayedPage()
	{
		return shopData.getDisplayedPage();
	}

	getEmptyCategories()
	{
		return shopData.getEmptyCategories();
	}

	getItemCategories()
	{
		return itemData.getItemCategories();
	}

	getItemSubcategories()
	{
		return shopData.getItemSubcategories();
	}

	getCategoryFilter()
	{
		return shopData.getCategoryFilter();
	}

	getSubcategoryFilter()
	{
		return shopData.getSubcategoryFilter();
	}

	areItemsAdded()
	{
		return shopData.areItemsAdded();
	}

	getDisabledMenu()
	{
		return shopData.getDisabledMenu();
	}

	getVendorName()
	{
		return shopData.getVendorName();
	}

	getVendorBlurb()
	{
		return shopData.getVendorBlurb();
	}

	getShopHeader()
	{
		return shopData.getShopHeader();
	}

	getActiveShopItem()
	{
		return shopData.getActiveItem();
	}

	getShopInventory()
	{
		return shopData.getShopInventory();
	}

	getRunningTotal()
	{
		return shopData.getFormattedRunningTotal();
	}
}

class Input
{
	constructor()
	{

	}

	buttonPress(buttonID)
	{
		let buttonType = overworldData.getButtonType(buttonID);
		switch(buttonType)
		{
			case "overworld":
				uiToRender = "overworld";
				overworldData.buttonPressed(buttonID);
				break;
			case "shop":
				uiToRender = "shop";
				shopData = new ShopData();
				shopData.setShop(overworldData.getSceneTarget(buttonID));
				break;
		}
	}

	shopReturn()
	{
		overworldData.setNewScene(shopData.getShopReturn());
		uiToRender = "overworld";
	}

	shopCheckout()
	{
		shopData.checkout();
	}

	addMoney(amount)
	{
		player.addMoney(amount);
	}

	removeMoney(amount)
	{
		player.removeMoney(amount);
	}

	swapShopInventory(buyOrSell)
	{
		shopData.swapShopInventory(buyOrSell);
	}

	setShopItemQuantity(item, quantity)
	{
		return shopData.setShopItemQuantity(item, quantity);
	}

	setActiveShopItem(item)
	{
		shopData.setActiveShopItem(item);
	}

	setCategoryFilter(category)
	{
		shopData.setCategoryFilter(category);
	}

	setSubcategoryFilter(subcategory)
	{
		shopData.setSubcategoryFilter(subcategory);
	}
}

export var input = new Input();
export var request = new Request();