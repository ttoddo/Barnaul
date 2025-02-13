import React, { useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";


class Room {
    constructor(id, centerX, centerY, width, height){
        this.id = id
        this.centerX = centerX
        this.centerY = centerY
        this.width = width
        this.height = height
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

}


const Editor = () => {
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth , height: window.innerHeight });
    const [rooms, setRooms] = useState([
        new Room(1, 100, 0, 200, 100),
        new Room(2, 100, 300, 150, 300),
        new Room(3, 100, 800, 300, 100)
    ])
    console.log(rooms[0].Id())
    return (
        <Stage width={canvasSize.width} height={canvasSize.height * 0.85} scaleX={1} scaleY={1} draggable={true}>
            <Layer>
                <Text text={"Я сосал меня ебали"}></Text>
                {rooms.map((room) => (
                    <Rect
                        key={room.Id()}
                        id={String(room.Id())}
                        X={room.X()}
                        Y={room.Y()}
                        width={room.Width()}
                        height={room.Height()}
                        fill="red"
                    />
                    
                    
                ))}
            </Layer>
        </Stage>
    )
};

export default Editor