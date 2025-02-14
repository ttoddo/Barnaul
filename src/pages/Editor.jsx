import React, { useEffect, useState } from "react";
import { Layer, Line, Rect, Stage, Text } from "react-konva";


class Room {
    constructor(key, id, x, y, width, height, color){
        this.key = key
        this.id = id
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    } 
    getKey(){
        return this.key
    }
    getId(){
        return this.id
    }
    getX(){
        return this.x
    }
    getY(){
        return this.y
    }
    getWidth(){
        return this.width
    }
    getHeight(){
        return this.height
    }
    getColor(){
        return this.color
    }
    getDrag(){
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

class Shadow extends Room{
    constructor(room){
        super(room.getKey(), room.getId() + '_shadow', room.getX(), room.getY(), room.getWidth(), room.getHeight(), room.getColor())
    }
}


const Editor = () => {
    const [snapSize, setSnapSize] = useState(50)
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth , height: window.innerHeight });
    const [gridlines, setGridLines] = useState([])
    const [scale, setScale] = useState(1)
    const [rooms, setRooms] = useState([])
    const [shadows, setShadows] = useState([])
    useEffect(() => {
        setRooms([
            new Room('1room', '1room', 100, 0, snapSize*4, snapSize*2, 'red'),
            new Room('2room', '2room', 100, 300, snapSize*4, snapSize*6, 'red'),
            new Room('3room', '3room', 100, 800, snapSize*6, snapSize*2, 'red'),
        ])
        let gridlinesTemp = []
        for (let x = 0; x <= canvasSize.width / snapSize; x++){
            gridlinesTemp = [...gridlinesTemp, {key: x+'gridLineX', points: [Math.round(x * snapSize), 0, Math.round(x * snapSize), canvasSize.height]}]
        }
        for (let y = 0; y <= canvasSize.height / snapSize; y++){
            gridlinesTemp = [...gridlinesTemp, {key: y+'gridLineY', points: [0, Math.round(y * snapSize), canvasSize.width, Math.round(y * snapSize)]}]
        }
        setGridLines(gridlinesTemp)
    }, [canvasSize.height, canvasSize.width, snapSize])
    useEffect(() => {
        setShadows(rooms.map((room) =>{
            return new Shadow(room)
        }))
    }, [rooms])

    const handleDragMove = (e) => {
        const id = e.target.id() + '_shadow'
        setShadows(
            shadows.map((shadow) => {
                if (String(shadow.getId()) === id){
                    let x = Math.round(e.target.x()/snapSize) * snapSize
                    let y = Math.round(e.target.y()/snapSize) * snapSize
                    shadow.setX(x)
                    shadow.setY(y)
                }
                return shadow
            })
        )
        
    }
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
                if (String(room.getId()) === id){
                    console.log('Прокнуло')
                    let x = Math.round(e.target.x()/snapSize) * snapSize
                    let y = Math.round(e.target.y()/snapSize) * snapSize
                    room.setX(x)
                    room.setY(y)
                    e.target.to({
                        x: x,
                        y: y
                    })
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
                if (String(room.getId()) === id) {
                    room.setColor(room.getColor() === 'red' ? 'blue' : 'red')
                }
                return room
            })
        )
    }
    return (
        <Stage key='GigaStage' id='0' onWheel={handleWheel} width={canvasSize.width} height={canvasSize.height * 0.85} scaleX={scale} scaleY={scale} draggable={true}>
            <Layer key='GridLayer'>
                {gridlines.map((line) =>(
                    <Line
                        key={line.key + ' line'}
                        points={line.points}
                        stroke="#ddd"
                        strokeWidth={2}
                    />
                ))}
            </Layer>
            <Layer>
                {shadows.map((shadow) => (
                <Rect
                    key={shadow.getKey()+1000}
                    id={shadow.getId()+'_shadow'}
                    X={shadow.getX()}
                    Y={shadow.getY()}
                    width={shadow.getWidth()}
                    height={shadow.getHeight()}
                    fill={shadow.getColor()}
                    cornerRadius={15}
                    opacity={0.45}
                />
            ))}
            {rooms.map((room) => (
                <Rect
                    key={room.getKey()}
                    id={room.getId()}
                    X={room.getX()}
                    Y={room.getY()} 
                    width={room.getWidth()}
                    height={room.getHeight()}
                    fill={room.getColor()}
                    cornerRadius={15}
                    draggable={true}
                    onClick={handleClick}
                    onDragMove={handleDragMove}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                />
            ))}
            </Layer>     
        </Stage>
    )
};

export default Editor