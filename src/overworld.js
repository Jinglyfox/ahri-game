import zones from "./resources/data/zones.json"
import { OverworldNPCData } from "./overworldNPC";

let overworldNPCData = new OverworldNPCData();

export class OverworldData
{
    constructor(activeZoneID, activeSceneID)
    {
        this.activeZoneID = activeZoneID;
		this.activeSceneID = activeSceneID;
		this.zones = {};
    }

	initializeZones()
	{
		this.activeZoneID = "inntown"
		this.activeSceneID = "inn_entrance"

		overworldNPCData.initializeOverworldNPCs();

		for(let zone in zones) {
			let overworldNPCList = overworldNPCData.getNPCsByZone(zone);
			this.zones[zone] = new Zone(zone, zones[zone]);
			this.zones[zone].initializeZone(overworldNPCList);
		}
		this.activeZone = this.zones[this.activeZoneID];
		this.activeScene = Object.assign(new Scene(), JSON.parse(JSON.stringify(this.activeZone.getScene(this.activeSceneID))));
		this.activeScene.initializeScene();
	}
	
	setNewScene(buttonID)
	{
		let target = this.activeScene.getTarget(buttonID);
		if(target.zone !== this.activeZoneID)
		{
			this.activeZoneID = target.zone
			this.activeZone = this.zones[this.activeZoneID]
		}
		this.activeScene = Object.assign(new Scene(), JSON.parse(JSON.stringify(this.activeZone.getScene(target.scene))));
		this.activeScene.initializeScene();
		this.activeSceneID = this.activeScene.getID();
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
		let buttonsToAdd = overworldNPCData.getOverworldNPCButtons(this.activeZoneID, this.activeSceneID);
		this.activeScene.addButtons(buttonsToAdd);
		return this.activeScene.getButtonDock();
	}

	getDisplayText()
	{
		let displayText = this.activeScene.getDisplayText();
		let overworldNPCBlurbs = overworldNPCData.getBlurbs(this.activeZoneID, this.activeSceneID)
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
		this.injectors = new Array();
		this.activeButtons = new Array();
		this.buttonDock = new Array();
		this.timeCost = null;
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

class DockButton
{
	constructor(id = -1, name = "", target = null, condition = null)
	{
        this.id = id;
		this.name = name;
		this.target = target;
		//this should be cleaned up and changed into just flags. the code in general here is pretty wtf
		this.condition = condition;
		this.disabled = false;
		this.removed = false;
		this.timeCost = null;
		this.timeAvailable = null;
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