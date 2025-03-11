import React, { useEffect, useRef, useState } from "react";
import { Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, snapSize, dragStart, dragMove, changeShadow}) => {
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
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          cornerRadius={15}
          {...shapeProps}
          draggable
          onDragMove={dragMove}
          onDragStart={dragStart}
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: Math.round(e.target.x()/snapSize) * snapSize,
              y: Math.round(e.target.y()/snapSize) * snapSize,
              
            });
            e.target.to({
                x: Math.round(e.target.x()/snapSize) * snapSize,
                y: Math.round(e.target.y()/snapSize) * snapSize,
            })
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
              x: Math.round(node.x()/snapSize) * snapSize,
              y: Math.round(node.y()/snapSize) * snapSize,
              // set minimal value
              width: Math.max(5, Math.round((node.width() * scaleX)/snapSize) * snapSize),
              height: Math.max(Math.round((node.height() * scaleY)/snapSize) * snapSize),
            });
            node.to({
                x: Math.round(node.x()/snapSize) * snapSize,
                y: Math.round(node.y()/snapSize) * snapSize
            })
            let shadowPipe = {
                id: node.id(),
                x: Math.round(node.x()/snapSize) * snapSize,
                y: Math.round(node.y()/snapSize) * snapSize,
                width: Math.max(5, Math.round((node.width() * scaleX)/snapSize) * snapSize),
                height: Math.max(Math.round((node.height() * scaleY)/snapSize) * snapSize),
            }
            changeShadow(shadowPipe)
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            keepRatio={false}
            flipEnabled={false}
            rotateEnabled={false}
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
            {id: '1room', X: 100, Y: 0, width: snapSize*4, height: snapSize*2, fill:'red'},
            {id: '2room', X: 100, Y: 300, width: snapSize*4, height: snapSize*6, fill:'red'},
            {id: '3room', X: 100, Y: 800, width: snapSize*6, height: snapSize*2, fill:'red'},
        ])
    } else if (shadows.length !== rooms.length){
        setShadows(rooms.map((room) => {
            return {id: room.id+'_shadow', X: room.X, Y: room.Y, width: room.width, height: room.height, fill: room.fill}
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
    const changeShadow = (pipe) => {
        const id = pipe.id + '_shadow'
        console.log(pipe.height)
        setShadows(
            shadows.map((shadow) => {
                if (String(shadow.id) === id){
                    let x = pipe.x
                    let y = pipe.y
                    let height = pipe.height
                    let width = pipe.width
                    shadow.X = x
                    shadow.Y = y
                    shadow.height = height
                    shadow.width = width
                }
                return shadow
            })
        )
    }
    const handleWheel = (e) => {
        if (e.evt.wheelDelta > 0){
            setScale(scale < 3 ? scale + 0.25 : scale)
        }
        else {setScale(scale > 1 ? scale - 0.25 : scale)}
    }
    const checkDeselect = (e) => {
        const clickedOnEMpty = e.target === e.target.getStage();
        if (clickedOnEMpty) {
            setSelectedId(null);
        }
    }
    if (rooms && shadows){
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
                    key={shadow.id+1000}
                    id={shadow.id}
                    X={shadow.X}
                    Y={shadow.Y}
                    width={shadow.width}
                    height={shadow.height}
                    fill={shadow.fill}
                    cornerRadius={15}
                    opacity={0.45}
                />
            ))}
                {rooms.map((room, i) => (
                <Rectangle
                    key={room.id}
                    snapSize={snapSize}
                    shapeProps={room}
                    isSelected={room.id === selectedId}
                    onSelect={() => {
                        setSelectedId(room.id)
                    }}
                    changeShadow={changeShadow}
                    dragStart={handleDragStart}
                    dragMove={handleDragMove}
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
}};

export default Editor