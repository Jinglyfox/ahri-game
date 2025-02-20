import React from 'react';
import { DisplayCard } from '../atoms/DisplayCard';
import { useState } from 'react';
import { CardHeader } from '../atoms/CardHeader';
import { CardText } from '../atoms/CardText';

export function VendorCard(props) {
    let vendorName = props.vendorName;
    let vendorBlurb = props.vendorBlurb;
    return (
        <DisplayCard classes="vendorCard">
            <CardHeader>
                {vendorName}
            </CardHeader>
            <CardText>
                {vendorBlurb}
            </CardText>
        </DisplayCard>
    )
}