export class StatBlock {
    constructor(stats = {}, statOrder = [])
    {
        this.stats = stats;
        this.statOrder = statOrder;
    }

    getStatOrder()
    {
        return this.statOrder;
    }

    addStats(stats)
    {
        for(let stat of stats)
        {
            
            if(this.stats.hasOwnProperty(stat.stat))
            {
                return this.stats[stat.stat].addStat(stat.value);
            }
            else
            {
                Error("Attempted to access invalid stat: " + stat);
            }
        }
    }

    getStatValue(stat)
    {
        if(this.stats.hasOwnProperty(stat))
        {
            return this.stats[stat].getStatValue();
        }
        else
        {
            Error("Attempted to access invalid stat: " + stat);
        }
    }

    initializeStatBlock()
    {
        for(let stat in this.stats)
        {
            this.stats[stat] = Object.assign(new Stat(), this.stats[stat])
        }
    }

    getStat(stat)
    {
        if(this.stats.hasOwnProperty(stat))
        {
            return this.stats[stat];
        }
        else
        {
            Error("Attempted to access invalid stat: " + stat);
        }
    }
}

class Stat {
    constructor(value = 0, statCap, name, abbreviaton)
    {
        this.value = value;
        this.statCap = statCap;
        this.name = name;
        this.abbreviation = abbreviaton;
    }

    getPercentToCap()
    {
        return this.value/this.statCap * 100;
    }

    getStatCap()
    {
        return this.statCap;
    }

    getName()
    {
        return this.name;
    }

    getAbbreviation()
    {
        return this.abbreviation;
    }

    getStatValue()
    {
        return this.value;
    }

    addStat(amount)
    {
        if(this.value + amount > this.statCap)
        {
            this.value = this.statCap;
        }
        else if(this.value + amount < 0)
        {
            this.value = 0;
        }
        else
        {
            this.value += amount;
        }
    }
}