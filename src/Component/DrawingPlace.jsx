import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Image } from 'react-konva';
import Konva from 'konva';

export default class ColoredRect extends React.Component {
  constructor() {
    super();
    this.state = {
      mode: 'brush',
      isDrawing: false,
    };
  }

  componentDidMount() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    const context = canvas.getContext('2d');

    this.setState({canvas, context});
  }

  mouseUp() {
    this.setState({
      isDrawing: false,
    });
  }

  mouseDown() {
    this.setState({
      isDrawing: true,
    });

    const stage = this.image.parent.parent;
    this.lastPointerPosition = stage.getPointerPosition();
  }

  mouseMove() {
    const {context, isDrawing, mode} = this.state;
    if (!isDrawing) {
      return;
    }

    if (mode === 'brush') {
      context.globalCompositeOperation = 'source-over';
    }

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
    context.beginPath();

    let localPos = {
      x: this.lastPointerPosition.x - this.image.x(),
      y: this.lastPointerPosition.y - this.image.y(),
    }

    context.moveTo(localPos.x, localPos.y);
    const stage = this.image.parent.parent;
    let pos = stage.getPointerPosition();

    localPos = {
      x: pos.x - this.image.x(),
      y: pos.y - this.image.y(),
    }

    context.lineTo(localPos.x, localPos.y);
    context.closePath();
    context.stroke();

    this.lastPointerPosition = pos;
    this.image.getLayer().draw();
  }

  render() {
    const {canvas} = this.state;
    return (
      <Image ref={node => {this.image = node}}
      image={canvas}
      stroke={'blue'}
      x={window.innerWidth / 4}
      y={window.innerHeight / 4}
      fill={'black'}
      onMouseDown={this.mouseDown.bind(this)}
      onMouseUp={this.mouseUp.bind(this)} 
      onMouseMove={this.mouseMove.bind(this)}/>
    );
  }
}