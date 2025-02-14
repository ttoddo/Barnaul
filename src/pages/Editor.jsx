import React, { useEffect, useRef, useState } from "react";
import { Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";


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


const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();
  
    React.useEffect(() => {
      if (isSelected) {
        // we need to attach transformer manually
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);
  
    return (
      <React.Fragment>
        <Rect
            {...shapeProps}
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          key={shapeProps.key}
          draggable
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
  
            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </React.Fragment>
    );
  };



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
    const [selectedId, setSelectedId] = useState([])



    if (gridlines.length === 0){
        let gridlinesTemp = []
        for (let x = 0; x <= canvasSize.width / snapSize; x++){
            gridlinesTemp = [...gridlinesTemp, {key: x+'gridLineX', points: [Math.round(x * snapSize), 0, Math.round(x * snapSize), canvasSize.height]}]
        }
        for (let y = 0; y <= canvasSize.height / snapSize; y++){
            gridlinesTemp = [...gridlinesTemp, {key: y+'gridLineY', points: [0, Math.round(y * snapSize), canvasSize.width, Math.round(y * snapSize)]}]
        }
        setGridLines(gridlinesTemp)
    }
    if (rooms.length === 0){
        setRooms([
            {key: '1room', id: '1room', x: 100, y: 0, width: snapSize*4, height: snapSize*2, color:'red'},
            {key: '2room', id: '2room', x: 100, y: 300, width: snapSize*4, height: snapSize*6, color:'red'},
            {key: '3room', id: '3room', x: 100, y: 800, width: snapSize*6, height: snapSize*2, color:'red'},
        ])
        console.log(rooms)
    } else if (shadows.length !== rooms.length){
        setShadows(rooms.map((room) => {
            return {key: room.key+'_shadow', id: room.id+'_shadow', x: room.x, y: room.y, width: room.width, height: room.height, color: room.color}
        }))
    }
    const handleDragMove = (e) => {
        const id = e.target.id() + '_shadow'
        setShadows(
            shadows.map((shadow) => {
                if (String(shadow.id) === id){
                    let x = Math.round(e.target.x()/snapSize) * snapSize
                    let y = Math.round(e.target.y()/snapSize) * snapSize
                    shadow.X = x
                    shadow.Y = y
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
                if (String(room.id) === id){
                    console.log('Прокнуло')
                    let x = Math.round(e.target.x()/snapSize) * snapSize
                    let y = Math.round(e.target.y()/snapSize) * snapSize
                    room.X = x
                    room.Y = y
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
                if (String(room.id) === id) {
                    room.color = room.getColor() === 'red' ? 'blue' : 'red'
                    setShadows(shadows.map((shadow) => {
                        if (shadow.id === id+'_shadow'){
                            shadow.color = shadow.getColor() === 'red' ? 'blue' : 'red'
                        }
                        return shadow
                    }))
                }
                return room
            })
        )
    }
    const checkDeselect = (e) => {
        const clickedOnEMpty = e.target === e.target.getStage();
        if (clickedOnEMpty) {
            setSelectedId(null);
        }
    }
    return (
        <Stage key='GigaStage' id='0' onMouseDown={checkDeselect} onWheel={handleWheel} width={canvasSize.width} height={canvasSize.height * 0.85} scaleX={scale} scaleY={scale} draggable={true}>
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
                    key={shadow.key+1000}
                    id={shadow.id+'_shadow'}
                    X={shadow.X}
                    Y={shadow.Y}
                    width={shadow.width}
                    height={shadow.height}
                    fill={shadow.color}
                    cornerRadius={15}
                    opacity={0.45}
                />
            ))}
            {rooms.map((room, i) => (
                <Rectangle
                    key={room.key+'_rectangle'}
                    shapeProps={room}
                    isSelected={room.id === selectedId}
                    onSelect={() => {
                        setSelectedId(room.id)
                    }}
                    onChange={(newAttrs) => {
                        const rms = rooms.slice()
                        rms[i] = newAttrs
                        setRooms(rms)
                    }}
                />
            ))}
            </Layer>     
        </Stage>
    )
};

export default Editor