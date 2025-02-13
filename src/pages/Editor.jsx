import React, { useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";


class Room {
    constructor(key, id, centerX, centerY, width, height, color){
        this.key = key
        this.id = id
        this.centerX = centerX
        this.centerY = centerY
        this.width = width
        this.height = height
        this.color = color
    } 
    Key(){
        return this.key
    }
    Id(){
        return this.id
    }
    X(){
        return this.centerX - this.width/2
    }
    Y(){
        return this.centerY - this.height/2
    }
    Width(){
        return this.width
    }
    Height(){
        return this.height
    }
    Color(){
        return this.color
    }
    Drag(){
        return this.drag
    }
    setX(x){
        this.x = x
    }
    setY(y){
        this.y = y
    }

    setColor(color){
        this.color = color
    }
    setDrag(drag){
        this.drag = drag
    }

}


const Editor = () => {
    const [snapSize, setSnapSize] = useState(550)
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth , height: window.innerHeight });
    const [scale, setScale] = useState(1)
    const [rooms, setRooms] = useState([
        new Room(1, '1', 100, 0, 200, 100, 'red'),
        new Room(2, '2', 100, 300, 150, 300, 'red'),
        new Room(3, '3', 100, 800, 300, 100, 'red'),
    ])
    
    const handleDragStart = (e) => {
        const id = e.target.id()
        setRooms(
            rooms.map((room) => {
                return room
            })
        )
    }
    const handleDragEnd = (e) => {
        const id = e.target.id()
        setRooms(
            rooms.map((room) => {
                if (String(room.Id()) === id){
                    room.setX(Math.round(room.X()/snapSize) * snapSize)
                    room.setY(Math.round(room.Y()/snapSize) * snapSize)
                }
                return room
            })
        )
    }
    
    const handleWheel = (e) => {
        if (e.evt.wheelDelta > 0){
            setScale(scale < 3 ? scale + 0.25 : scale)
        }
        else {setScale(scale > 1 ? scale - 0.25 : scale)}
    }
    const handleClick = (e) => {
        const id = e.target.id()
        setRooms(
            rooms.map((room) => {
                if (String(room.Id()) === id) {
                    room.setColor(room.Color() === 'red' ? 'blue' : 'red')
                }
                return room
            })
        )
    }

    return (
        <Stage id='0' onWheel={handleWheel} width={canvasSize.width} height={canvasSize.height * 0.85} scaleX={scale} scaleY={scale} draggable={true}>
            <Layer>
                {rooms.map((room) => (
                    <Rect
                        key={room.Key()}
                        id={room.Id()}
                        X={room.X()}
                        Y={room.Y()}
                        width={room.Width()}
                        height={room.Height()}
                        fill={room.Color()}
                        draggable={true}
                        onClick={handleClick}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                    
                    
                ))}
            </Layer>
        </Stage>
    )
};

export default Editor