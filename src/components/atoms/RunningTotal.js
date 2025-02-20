import React from 'react';
import { useState } from 'react';

export function RunningTotal(props) {
    let total = props.total;
    return(
      <div id="totalPrice">
          <span>Running Total:</span>
          <div id="runningTotal">{total}</div>
      </div>
    )
  }