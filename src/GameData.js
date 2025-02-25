import { player } from "./player";
import { Time } from "./Time";

class GameDataAPI
{
    constructor(flags = new FlagContainer(), visitedShops = {}, externalInventories = {}, time = new Time())
    {
        this.flags = flags;
        this.visitedShops = visitedShops;
        this.externalInventories = externalInventories;
        this.time = time;
        this.uiToRender = "blank";
    }

    gameStarted()
    {
        player.initializePlayer();
    }

    setUiToRender(type)
    {
        this.uiToRender = type;
    }

    getUiToRender()
    {
        return this.uiToRender;
    }

    getExternalInventory(inventory)
    {
        if(!this.externalInventories.hasOwnProperty(inventory))
        {
            this.externalInventories[inventory] = {};
        }
        return this.externalInventories[inventory];
    }

    hasSeenScene(sceneId)
    {
        return this.flags.checkFlagExists("player_seen_" + sceneId);
    }

    seenScene(sceneId)
    {
        this.flags.setFlag("player_seen_" + sceneId, true);
    }

    advanceTime(cost)
    {
        this.time.advanceTime(cost);
    }

    playerHasTime(cost)
    {
        return this.time.canAdvanceTime(cost);
    }

    checkLock(lock)
    {
        return this.flags.checkLock(lock);
    }

    getCurrentTime()
    {
        return this.time.getCurrentTime();
    }

    getCurrentDay()
    {
        return this.time.getCurrentDay();
    }

    playerSlept()
    {
        this.time.advanceDay();
        player.addMoney(1000);
    }

    getExternalInventory(inventory)
    {
        if(!this.externalInventories.hasOwnProperty(inventory))
        {
            this.externalInventories[inventory] = {};
        }
        return this.externalInventories[inventory];
    }

    saveGame()
    {
        return {flags: this.flags, visitedShops: this.visitedShops};
    }

    loadGame(saveFile)
    {
        this.visitedShops = saveFile.visitedShops;
        this.flags = saveFile.flags;
    }

    setMoneyFlag(money)
    {
        this.flags["playerMoney"] = money;
    }

    setVisitedShop(shopId, items)
    {
        this.visitedShops[shopId] = items;
    }

    checkPurchasedFromShop(shopId)
    {
        return this.visitedShops.hasOwnProperty(shopId);
    }

    getFlag(flag)
    {
        return this.flags.getFlag(flag);
    }

    incrementFlag(flag, value)
    {
        this.flags.incrementFlag(flag, value);
    }

    setFlag(flag, value)
    {
        this.flags.setFlag(flag, value);
    }

    setFlags(flags)
    {
        this.flags.setFlags(flags);
    }

    getVisitedShopInventory(shopId)
    {
        return this.visitedShops[shopId]
    }
}


class FlagContainer {
    constructor(flags = {})
    {
        this.flags = flags;
    }

    incrementFlag(flag, value)
    {
        if(!this.checkFlagExists(flag))
        {
            this.flags[flag] = 0;
        }
        this.flags[flag] += value;
    }


    setFlags(flags)
    {
        for(let flag in flags)
        {
            this.flags[flag] = flags[flag].value;
        }
    }

    getFlag(flag)
    {
        if(this.checkFlagExists(flag))
        {
            return this.flags[flag];
        }
    }

    checkFlagExists(flag)
    {
        return this.flags.hasOwnProperty(flag);
    }

    setFlag(flag, value)
    {
        this.flags[flag] = value;
    }

    getVisitedShopInventory(shopId)
    {
        return this.visitedShops[shopId]
    }
}

export var gameDataAPI = new GameDataAPI();