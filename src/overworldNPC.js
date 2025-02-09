import overworldNPCs from "./resources/data/overworldNPCs.json"


export class OverworldNPCData
{
    constructor()
    {
        this.overworldNPCs = {};
    }

    initializeOverworldNPCs()
    {
        for(let overworldNPC in overworldNPCs)
        {
            this.overworldNPCs[overworldNPC] = Object.assign(new OverworldNPC(), overworldNPCs[overworldNPC]);
        }
    }

    getOverworldNPCButtons(zoneID, sceneID)
    {
        let buttonsToAdd = [];
        for(let overworldNPC in this.overworldNPCs)
        {
            if(this.overworldNPCs[overworldNPC].accessibleInScene(zoneID, sceneID))
            {
                buttonsToAdd.push(this.overworldNPCs[overworldNPC].getSceneButton(zoneID, sceneID));
            }
        }
        return buttonsToAdd;
    }

    getBlurbs(zoneID, sceneID)
    {
        let blurbs = "";
        for(let overworldNPC in this.overworldNPCs)
        {
            blurbs += this.overworldNPCs[overworldNPC].getBlurb(zoneID, sceneID);
        }
        return blurbs;
    }

    getNPCsByZone(zone)
    {
        let charList = [];
        for(let overworldNPC in this.overworldNPCs)
        {
            if(this.overworldNPCs[overworldNPC].checkZoneScenes(zone))
            {
                charList.push(overworldNPC);
            }
        }
        return charList;
    }

    getScenesByZone(overworldNPC, zone)
    {
        return this.overworldNPCs[overworldNPC].getScenesByZone(zone);
    }
}

class OverworldNPC
{
	constructor(id, scenes, blurbs)
	{
		this.id = id;
		this.scenes = scenes;
		this.blurbs = blurbs;
	}

	checkZoneBlurbs(zone, sceneID)
	{
		if(this.blurbs.hasOwnProperty(zone))
		{
			if(this.blurbs[zone].hasOwnProperty(sceneID))
			{
				return true;
			}
		}
		return false;
	}

	checkZoneScenes(zone)
	{
		if(this.scenes.hasOwnProperty(zone))
		{
			return true;
		}
		return false;
	}

	accessibleInScene(zoneID, sceneID)
	{
		if(this.blurbs.hasOwnProperty(zoneID))
        {
            if(this.blurbs[zoneID].hasOwnProperty(sceneID))
            {
                if(this.blurbs[zoneID][sceneID].hasOwnProperty("button"))
                {
                    return true;
                }
            }
        }    
		return false;
	}

    getBlurb(zoneID, sceneID)
    {
        if(this.blurbs.hasOwnProperty(zoneID))
        {
            if(this.blurbs[zoneID].hasOwnProperty(sceneID))
            {
                return this.blurbs[zoneID][sceneID].description;
            }
        }
        return "";
    }

    getScenesByZone(zone)
    {
        return this.scenes[zone];
    }

	getSceneButton(zoneID, sceneID)
	{
        return this.blurbs[zoneID][sceneID].button;
	}

	getDisplayText(area, sceneID)
	{
		return this.blurbs[area][sceneID].description;
	}
}