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
    Key(){
        return this.key
    }
    Id(){
        return this.id
    }
    X(){
        return this.x
    }
    Y(){
        return this.y
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
    const [snapSize, setSnapSize] = useState(30)
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth , height: window.innerHeight });
    const [gridlines, setGridLines] = useState([])
    const [scale, setScale] = useState(1)
    const [rooms, setRooms] = useState([])
    useEffect(() => {
      setRooms([
        new Room(1, '1', 100, 0, snapSize*4, snapSize*2, 'red'),
        new Room(2, '2', 100, 300, snapSize*4, snapSize*6, 'red'),
        new Room(3, '3', 100, 800, snapSize*6, snapSize*2, 'red'),
      ])
      let gridlinesTemp = []
      for (let x = 0; x <= canvasSize.width / snapSize; x++){
        gridlinesTemp = [...gridlinesTemp, {key: x, points: [Math.round(x * snapSize), 0, Math.round(x * snapSize), canvasSize.height]}]
      }
      for (let y = 0; y <= canvasSize.height / snapSize; y++){
        gridlinesTemp = [...gridlinesTemp, {key: y+100, points: [0, Math.round(y * snapSize), canvasSize.width, Math.round(y * snapSize)]}]
      }
      setGridLines(gridlinesTemp)
    }, [])
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
                if (String(room.Id()) === id) {
                    room.setColor(room.Color() === 'red' ? 'blue' : 'red')
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
              {rooms.map((room) => (
                <Rect
                  key={room.Key()+1000}
                  id={room.Id()+'_shadow'}
                  X={room.X()}
                  Y={room.Y()}
                  width={room.Width()}
                  height={room.Height()}
                  fill={room.Color()}
                  opacity={0.45}
                />
              ))}
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