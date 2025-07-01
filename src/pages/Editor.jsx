import { useEffect, useState, useCallback, useReducer } from "react";
import Audithorium from "../Components/EditorParts/AudComponent" 
import { Layer, Line, Rect, Stage, Text, } from "react-konva";
import { getAuds } from "../Components/ApiReqests/ApiRequests";
import { useNavigate } from 'react-router-dom'

function shadowsReducer(state, action) {
    switch (action.type) {
        case 'init':
            return action.payload
        case 'move':
            return state.map(shadow => 
                shadow.id === action.payload.id
                ? { ...shadow, X: action.payload.x, Y: action.payload.y } : shadow
            );
        case 'resize':
            return state.map(shadow => 
                shadow.id === action.payload.id 
                ? {
                    ...shadow,
                    X: action.payload.x,
                    Y: action.payload.y,
                    width: action.payload.width,
                    height: action.payload.height
                } : shadow
            );
        default:
            return state
    }
}

const Editor = () => {
    let snapSize = 25
    let canvasSize = {width: window.innerWidth, height: window.innerHeight}

    const [gridlines, setGridLines] = useState([])
    const [scale, setScale] = useState(1)

    const [rooms, setRooms] = useState([])
    const [shadows, dispatchShadows] = useReducer(shadowsReducer, [])
    
    const [selectedId, setSelectedId] = useState([])

    const [stageId, setStageId] = useState(0)

    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    const roomsParse = useCallback((roomsArr) => {
        let parsedRooms = []
        roomsArr.forEach(room => {
            // Room example: {floor: 0, isComputer: true, name: "218", position: "0;0", size: "2*2", buildingId: 1}
            let coords = room.position.split(";")
            let x = parseFloat(coords[0]) * 100
            let y = parseFloat(coords[1]) * 100
            let sizes = room.size.split("*")
            let widthMultiplicator = parseFloat(sizes[0]) / 0.25
            let heightMultiplicator = parseFloat(sizes[1]) / 0.25
            let parsedRoom = {id: room.name, X: x, Y: y, width: snapSize*widthMultiplicator, height: snapSize*heightMultiplicator, fill: room.isComputer ? "red" : "blue"}
            parsedRooms.push(parsedRoom)
        })
        return parsedRooms
    }, [snapSize]);

    useEffect(() => {
        async function getAudithoriums() {
            let auds = await getAuds(localStorage.getItem('TOKEN'))
            if (!auds) {
                navigate("/signin")
            }
            let parsedRooms = roomsParse(auds)
            setRooms(parsedRooms)
            console.log(parsedRooms)
            dispatchShadows({
                type: 'init',
                payload: parsedRooms.map(room => ({
                    id: room.id + '_shadow',
                    X: room.X,
                    Y: room.Y,
                    width: room.width,
                    height: room.height,
                    fill: room.fill
                }))
            })
            setIsLoading(false)
        }
        getAudithoriums()
    }, [roomsParse, navigate])

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

    const handleOpenAuditory = (id) => {
        setStageId(id);
    }
    const handleClosedAuditory = (id) => {
        console.log(`Эта для кампутираф ${id}"`)
    }

    const handleDragMove = (e) => {
        const id = e.target.id() + '_shadow'
        let x = Math.round(e.target.x()/snapSize) * snapSize
        let y = Math.round(e.target.y()/snapSize) * snapSize
        dispatchShadows({type: 'move', payload: { id, x, y }})
    }
    const handleDragStart = (e) => {
        setRooms(
            rooms.map((room) => {
                return room
            })
        )
    }
    const changeShadow = (shadowPipe) => {
        dispatchShadows({
            type: 'resize',
            payload: {
                id: shadowPipe.id + '_shadow',
                x: shadowPipe.x,
                y: shadowPipe.y,
                width: shadowPipe.width,
                height: shadowPipe.height
            }
        })
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

    const handleOnClickText = () => {
        setStageId(0)
    }

    if (!isLoading){
    return stageId === 0 ? (
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
                    x={shadow.X}
                    y={shadow.Y}
                    width={shadow.width}
                    height={shadow.height}
                    fill={shadow.fill}
                    cornerRadius={15}
                    opacity={0.45}
                />
            ))}
                {rooms.map((room, i) => (
                <Audithorium
                    key={room.id}
                    snapSize={snapSize}
                    shapeProps={room}
                    isSelected={room.id === selectedId}
                    onDblClick={room.fill === "red" ? () => handleOpenAuditory(room.id) : () => handleClosedAuditory(room.id)}
                    onSelect={() => {setSelectedId(room.id)}}
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
    ) : (
        <Stage key="AudStage"
            id={stageId}
            onMouseDown={checkDeselect}
            onWheel={handleWheel}
            width={canvasSize.width}
            height={canvasSize.height * 0.85}
            scaleX={scale}
            scaleY={scale}
            draggable={true}>
            <Layer>
                <Text text="Назад"
                    x={100}
                    y={100}
                    fontSize={16}
                    onClick={handleOnClickText}
                />
            </Layer>
            
            
        </Stage>
    )

}};

export default Editor