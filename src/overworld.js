import zones from "./resources/data/zones.json"
import { OverworldNPCData } from "./overworldNPC";
import { Gate } from "./gate";
import { player } from "./player";
import { FlagSetter } from "./flagsetter";


let overworldNPCData = new OverworldNPCData();

class OverworldData
{
    constructor(activeZoneId, activeSceneId)
    {
        this.activeZoneId = activeZoneId;
		this.activeSceneId = activeSceneId;
		this.zones = {};
    }

	initializeZones()
	{
		this.activeZoneId = "inntown"
		this.activeSceneId = "inn_entrance"

		overworldNPCData.initializeOverworldNPCs();

		for(let zone in zones) {
			let overworldNPCList = overworldNPCData.getNPCsByZone(zone);
			this.zones[zone] = new Zone(zone, zones[zone]);
			this.zones[zone].initializeZone(overworldNPCList);
		}
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
		let target = this.activeScene.getTarget(buttonId);
		this.setNewScene(target)
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
		if(!player.hasSeenScene(this.activeSceneId))
		{
			player.seenScene(this.activeSceneId)
		}
	}

	getButtonType(buttonID)
	{
		return this.activeScene.getButtonType(buttonID);
	}

	getSceneTarget(buttonID)
	{
		return this.activeScene.getSceneTarget(buttonID);
	}

	getTarget(buttonID)
	{
		return this.activeScene.getTarget(buttonID);
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
	}

	checkLocks()
	{
		for(let button in this.buttonDock)
		{
			this.buttonDock[button].checkLock();
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

	getID()
	{
		return this.id;
	}

	getButtonType(buttonID)
	{
		return this.buttonDock[buttonID].getType();
	}

	getSceneTarget(buttonID)
	{
		return this.buttonDock[buttonID].getSceneTarget();
	}

	getTarget(buttonID)
	{
		return this.buttonDock[buttonID].getTarget();
	}

	getButtonIds()
	{
		return this.buttonIDs;
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
		if(this.gate.checkLock())
		{
			switch(this.action)
			{
				case "add_item":
					player.addItems(this.items);
					break;
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

	checkLock()
	{
		if(this.hasOwnProperty("gate"))
		{
			this.gate = Object.assign(new Gate(), this.gate);
			this.gate.setLock();
			if(!this.gate.checkLock())
			{
				this.disabled = true;
			}
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

export var overworldData = new OverworldData();