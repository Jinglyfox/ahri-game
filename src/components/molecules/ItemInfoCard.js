import React from 'react';
import { useState } from 'react';
import { DisplayCard } from '../atoms/DisplayCard';
import { CardText } from '../atoms/CardText';
import { CardHeader } from '../atoms/CardHeader';

export function ItemInfoCard(props){
    let item = props.item;
    if(item.getId() != "")
    {
        return(
            <DisplayCard classes={"itemInfoCard"} disabled={false}>
                <CardHeader>
                    {item.getName()}
                </CardHeader>
                <CardText>
                    {item.getDescription()}
                </CardText>
            </DisplayCard>
        )
        }
        else
        {
        return(
            <DisplayCard classes={"itemInfoCard disabled"} disabled={true}/>
        )
    }
}