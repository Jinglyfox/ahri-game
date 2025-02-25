
import globals from "./resources/data/globals.json"
import { overworldAPI } from "./overworld"
import { player } from "./player"
import { Money } from "./money"
//import { ShopData } from "./shop"
import { itemData } from "./items"
import { gameDataAPI } from "./GameData"
//import { InventoryData } from "./inventory"

let shopData;
let inventoryData;
let uiToRender = "overworld";

class Request
{
	constructor()
	{

	}

	getPlayerWalletDenoms()
	{
		return Money.convertRawToDenoms(player.getMoney());
	}

	getPlayerStats()
	{
		return player.getStats();
	}

	initializeData()
	{
		itemData.initializeDictionary();
		gameDataAPI.gameStarted();
		overworldAPI.initializeOverworld();
		
	}

	getDenomNames()
	{
		return globals.denomNames;
	}
}

class Input
{
	constructor()
	{

	}

	menuClosed()
	{
		overworldAPI.menuClosed();
		uiToRender = "overworld";
	}

	saveGame()
	{
		localStorage.setItem("foo", JSON.stringify({...overworldAPI.saveGame(), ...player.saveGame()}));
	}

	loadGame()
	{
		let saveFile = JSON.parse(localStorage.getItem("foo"));
		player.loadGame(saveFile);
		overworldAPI.loadGame(saveFile);
	}

	addMoney(amount)
	{
		player.addMoney(amount);
	}

	removeMoney(amount)
	{
		player.removeMoney(amount);
	}
}

export var input = new Input();
export var request = new Request();