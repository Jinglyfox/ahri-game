import globals from "./resources/data/globals.json"

export class Time
{
    constructor()
    {
        this.currentTime = globals.dayStartsAtTime;
        this.dayStartsAtTime = globals.dayStartsAtTime;
        this.timeSliceNames = globals.timeSliceNames;
        this.timeFormat = globals.timeFormat;
        this.dayNames = globals.dayNames;
        this.currentDay = 0;
    }

    getCurrentTime()
    {
        if(this.timeFormat == "slices")
        {
            return this.timeSliceNames[this.currentTime];
        }
        return this.currentTime;
    }

    getCurrentDay()
    {
        return this.currentDay;
    }

    forceSetTime(time)
    {
        this.currentTime = time;
        if(time < this.currentTime)
        {
            this.advanceDay();
        }
    }

    advanceTime(timeAmount)
    {
        if(this.canAdvanceTime(timeAmount))
        {
            this.currentTime += timeAmount;
        }
    }

    canAdvanceTime(timeAmount)
    {
        if(this.timeFormat == "slices")
        {
            return timeAmount + this.currentTime < this.timeSliceNames.length;
        }
    }

    advanceDay()
    {
        this.currentDay += 1;
        this.currentTime = this.dayStartsAtTime;
    }
}