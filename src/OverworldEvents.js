import overworldEvents from "./resources/data/overworldEvents.json"
import { Gate } from "./gate"

class OverworldEventData {
    constructor(availableEvents = [], eventsInZone = [], overworldEvents = {})
    {
        this.availableEvents = availableEvents;
        this.eventsInZone = eventsInZone;
        this.overworldEvents = overworldEvents;
    }

    initializeEvents()
    {
        for(let event in overworldEvents)
        {
            this.overworldEvents[event] = Object.assign(new Event(), overworldEvents[event])
        }
    }

    loadEventsInZone(zone)
    {
        this.eventsInZone = [];
        for(let event in this.overworldEvents)
        {
            if(this.overworldEvents[event].availableInZone(zone))
            {
                this.eventsInZone.push(event);
            }
        }
    }

    checkForAvailableEvents(zone, scene)
    {
        for(let event of this.eventsInZone)
        {
            if(this.overworldEvents[event].availableInScene(zone, scene))
            {
                return true;
            }
        }
        return false;
    }

    getEventTarget(zone, scene)
    {
        this.availableScenes = [];
        let highestPriority = 0;
        let target;
        for(let event of this.eventsInZone)
        {
            if(this.overworldEvents[event].availableInScene(zone, scene))
            {
                this.availableScenes.push(this.overworldEvents[event]);
                if(this.overworldEvents[event].hasFlag("story"))
                {
                    return this.overworldEvents[event].getTarget();
                }
                if(this.overworldEvents[event].getPriority() >= highestPriority)
                {
                    highestPriority = this.overworldEvents[event].getPriority()
                    target = this.overworldEvents[event].getTarget();
                }
            }
        }
        return target;
    }
}

class Event {
    constructor(priority = 0, availableTargets = [], target = {}, gate = new Gate(), flags = [])
    {
        this.priority = priority;
        this.availableTargets = availableTargets;
        this.target = target;
        this.gate = gate;
        this.flags = flags;
    }

    hasFlag(flag)
    {
        return this.flags.includes(flag);
    }

    availableInZone(zone)
    {
        for(let target of this.availableTargets)
        {
            if(target.zone == zone)
            {
                return true;
            }
        }
        return false;
    }

    getPriority()
    {
        return this.priority;
    }

    getTarget()
    {
        return this.target
    }

    availableInScene(zone, scene)
    {
        this.gate = Object.assign(new Gate(), this.gate);
        if(!this.gate.checkLocks())
        {
            return false;
        }
        for(let target of this.availableTargets)
        {
            if(target.zone == zone && target.scene == scene)
            {
                return true;
            }
        }
        return false;
    }
}



export var overworldEventData = new OverworldEventData();