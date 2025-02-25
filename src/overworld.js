import zones from "./resources/data/zones.json"
import { OverworldNPCData } from "./overworldNPC";
import { overworldEventData } from "./OverworldEvents";
import { Gate } from "./gate";
import { gameDataAPI } from "./GameData";
import { player } from "./player";
import { FlagSetter } from "./FlagSetter";
import { shopAPI } from "./shop";
import { inventoryAPI } from "./inventory";

let overworldNPCData = new OverworldNPCData();

class OverworldAPI
{
    constructor(activeZoneId ="inntown", activeSceneId="inn_entrance", uiToRender = "overworld")
    {
        this.activeZoneId = activeZoneId;
		this.activeSceneId = activeSceneId;
		this.uiToRender = uiToRender;
		this.eventLockout = false;
		this.zones = {};
    }

	menuClosed()
	{
		gameDataAPI.setUiToRender("overworld");
		this.setNewScene({zone: this.activeZoneId, scene: this.activeSceneId})
	}

	initializeOverworld()
	{
		this.activeZoneId = "inntown"
		this.activeSceneId = "inn_entrance"

		overworldEventData.initializeEvents();
		overworldNPCData.initializeOverworldNPCs();

		for(let zone in zones) {
			let overworldNPCList = overworldNPCData.getNPCsByZone(zone);
			this.zones[zone] = new Zone(zone, zones[zone]);
			this.zones[zone].initializeZone(overworldNPCList);
		}
		overworldEventData.loadEventsInZone(this.activeZoneId);
		this.setNewScene({zone: this.activeZoneId, scene: this.activeSceneId});
	}
	
	saveGame()
	{
		return {activeZoneId: this.activeZoneId, activeSceneId: this.activeSceneId}
	}

	loadGame(saveFile)
	{
		this.setNewScene({zone: saveFile.activeZoneId, scene: saveFile.activeSceneId});
	}

	buttonPressed(buttonId)
	{
		this.activeScene.buttonPressed(buttonId);
		let buttonType = this.getButtonType(buttonId);
		let target = this.activeScene.getTarget(buttonId);
		gameDataAPI.setUiToRender(buttonType);
		switch(buttonType)
		{
			case "overworld":
				this.checkEvents(target)
				break;
			case "shop":
				shopAPI.setShop(this.getSceneTarget(buttonId));
				break;
			case "player_inventory":
				inventoryAPI.setInventory(player.getUnsortedItems());
				break;
			case "sleep":
				gameDataAPI.playerSlept();
				break;
			default:
				Error(`Button Id ${buttonId} returned type ${buttonType} which is not a valid type.`)
		}
		
		
	}

	checkEvents(target)
	{
		let newTarget = target;
		if(target.zone != this.activeZoneId)
		{
			overworldEventData.loadEventsInZone(target.zone);
		}
		if(this.eventLockout)
		{
			this.eventLockout = false;
		}
		else if(overworldEventData.checkForAvailableEvents(target.zone, target.scene))
		{
			newTarget = overworldEventData.getEventTarget(target.zone, target.scene);
		}

		this.setNewScene(newTarget);
	}

	setNewScene(target)
	{
		this.activeZoneId = target.zone
		this.activeZone = this.zones[this.activeZoneId];
		this.activeScene = Object.assign(new Scene(), JSON.parse(JSON.stringify(this.activeZone.getScene(target.scene))));
		this.activeScene.initializeScene();
		this.activeSceneId = this.activeScene.getID();
		let buttonsToAdd = overworldNPCData.getOverworldNPCButtons(this.activeZoneId, this.activeSceneId);
		this.activeScene.addButtons(buttonsToAdd);
		this.activeScene.checkLocks();
		this.activeScene.checkCosts();
		if(!gameDataAPI.hasSeenScene(this.activeSceneId))
		{
			gameDataAPI.seenScene(this.activeSceneId)
		}
		if(this.activeScene.hasFlag("set_event_lockout"))
		{
			this.eventLockout = true;
		}
	}

	getButtonType(buttonId)
	{
		return this.activeScene.getButtonType(buttonId);
	}

	getSceneTarget(buttonId)
	{
		return this.activeScene.getSceneTarget(buttonId);
	}

	getTarget(buttonId)
	{
		return this.activeScene.getTarget(buttonId);
	}

    getScene(sceneID, zone = this.activeZone)
    {
		return this.zones[zone].getScene(sceneID);
	}

	getButtonDock()
	{
		return this.activeScene.getButtonDock();
	}

	getDisplayText()
	{
		let displayText = this.activeScene.getDisplayText();
		let overworldNPCBlurbs = overworldNPCData.getBlurbs(this.activeZoneId, this.activeSceneId)
		return displayText + overworldNPCBlurbs;
	}
	
}

class Zone
{
	constructor(id, scenes)
	{
		this.id = id;
		this.scenes = scenes;
	} 

	initializeZone(overworldNPCList)
	{
		this.overworldNPCList = overworldNPCList;
		for(let overworldNPC in this.overworldNPCList)
		{
			let overworldNPCScenes = overworldNPCData.getScenesByZone(this.overworldNPCList[overworldNPC], this.id)
			for(let overworldNPCScene in overworldNPCScenes)
			{
				this.scenes[overworldNPCScene] = overworldNPCScenes[overworldNPCScene]
			}
		}
		for(let scene in this.scenes)
		{
			this.scenes[scene] = Object.assign(new Scene(), this.scenes[scene]);
		}
	}

	getNPCList()
	{
		return this.overworldNPCList;
	}

	getScene(sceneID)
	{
		return this.scenes[sceneID];
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
		this.buttonDock = new Array();
		this.timeCost = null;
		this.setFlags = [];
		this.sceneActions = [];
		this.flags = [];
	}

	hasFlag(flag)
	{
		return this.flags.includes(flag);
	}

	checkLocks()
	{
		for(let button in this.buttonDock)
		{
			this.buttonDock[button].checkLocks();
		}
	}

	checkCosts()
	{
		for(let button in this.buttonDock)
		{
			this.buttonDock[button].checkCost();
		}
	}

	initializeScene()
	{
		this.buildButtons();
		this.processSceneActions();
		this.processFlags();
	}

	processSceneActions()
	{
		for(let i = 0; i < this.sceneActions.length; i++)
		{
			this.sceneActions[i] = Object.assign(new SceneAction(), this.sceneActions[i]);
			this.sceneActions[i].performAction();
		}
	}

	processFlags()
	{
		let flagSetter = new FlagSetter(this.setFlags)
		flagSetter.setFlags();
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
			this.buttonDock[i].disabled = true;
		}
		for(let i = 0; i < this.buttons.length; i++)
		{
			let button = this.buttons[i];
			this.buttonDock[button.id] = Object.assign(new DockButton(), button);
			this.buttonDock[button.id].disabled = false;
		}
	}

	addButtons(buttonsToAdd)
	{
		for(let i = 0; i < buttonsToAdd.length; i++)
		{
			buttonsToAdd[i] = Object.assign(new DockButton(), buttonsToAdd[i])
			for(let j = 0; j < this.buttonDock.length; j++)
			{
				if(this.buttonDock[j].name == "")
				{
					this.buttonDock[j] = buttonsToAdd[i];
					break;
				}
				if(j == this.buttonDock.length - 1)
				{
					console.log("Error: Too many buttons added to this scene.");
				}
			}
		}
	}

	buttonPressed(buttonId)
	{
		this.buttonDock[buttonId].applyCost();
	}

	getID()
	{
		return this.id;
	}

	getButtonType(buttonId)
	{
		return this.buttonDock[buttonId].getType();
	}

	getSceneTarget(buttonId)
	{
		return this.buttonDock[buttonId].getSceneTarget();
	}

	getTarget(buttonId)
	{
		return this.buttonDock[buttonId].getTarget();
	}
	
	getDisplayText()
	{
		return this.description;
	}
	
	getButton(buttonID)
	{
		return this.buttonDock[buttonID]
	}
}

class SceneAction
{
	constructor()
	{
		this.action = "";
		this.gate = {};
	}

	performAction()
	{
		this.gate = Object.assign(new Gate(), this.gate);
		if(this.gate.checkLocks())
		{
			switch(this.action)
			{
				case "add_item":
					player.addItems(this.items);
					break;
				case "add_stat":
					player.addStats(this.stats);
					break;
				case "set_flag":
					gameDataAPI.setFlags(this.flags)
			}
		}
	}
}

class DockButton
{
	constructor(id = -1, name = "", target = null)
	{
        this.id = id;
		this.name = name;
		this.target = target;
		this.disabled = false;
	}

	checkCost()
	{
		if(this.hasOwnProperty("actionCost"))
		{
			if(!gameDataAPI.playerHasTime(this.actionCost.time))
			{
				this.disabled = true;
			}
		}
	}

	checkLocks()
	{
		if(this.hasOwnProperty("gate"))
		{
			this.gate = Object.assign(new Gate(), this.gate);
			if(!this.gate.checkLocks())
			{
				this.disabled = true;
			}
		}
	}

	applyCost()
	{
		if(this.hasOwnProperty("actionCost"))
		{
			gameDataAPI.advanceTime(this.actionCost.time);
		}
	}

	getSceneTarget()
	{
		return this.target.scene;
	}

	getTarget()
	{
		return this.target;
	}

	getType()
	{
		return this.type;
	}
}

export var overworldAPI = new OverworldAPI();