import React from 'react';
import {Rect} from 'react-konva';   

export const Eraser = (props) => {
    return (
        <Rect width={50} height={50} fill={'red'} onClick={props.changeMode}/>
    )
} 