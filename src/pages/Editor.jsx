import { useEffect, useState, useCallback, useReducer } from "react";
import GigaRect from "../Components/EditorParts/RectComponent" 
import { Layer, Rect, Stage } from "react-konva";
import { getAuds, userInfo, getComputers } from "../Components/ApiReqests/ApiRequests";
import { useNavigate } from 'react-router-dom'
import CommonBtn from "../Components/UI/CommonButton/CommonBtn";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import "../styles/Editor.css"

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

// function gridLinesReducer(state, action) {
//     switch (action.type) {
//         case 'init':
//             return action.payload
//         case 'resize':
//             break
//         default:
//             return state
//     }
// }

const Editor = () => {
    let snapSize = 25
    let floorOverSize = 20
    let canvasSize = {width: window.innerWidth, height: window.innerHeight}

    let buildings = {1: [{name: 1}, {name: 2}, {name: 3}, {name: 4}],
        2: [{name: 1}, {name: 2}, {name: 3}, {name: 4}, {name: 5}]}

    const [level, setLevel] = useState(1)

    const [building, setBuilding] = useState(1)

    const [editMode, setEditMode] = useState(false)

    const [scale, setScale] = useState(1)

    const [rooms, setRooms] = useState([])
    const [audSizes, setAudSizes] = useState({})
    const [shadows, dispatchShadows] = useReducer(shadowsReducer, [])
    const [floor, setFloor] = useState({})


    // const [gridLines, dispatchGridLines] = useReducer(gridLinesReducer, [])
    // Временно отключено в связи с отказом от веб-редактора.
    // const [limits, setLimits] = useState({})
    
    const [selectedId, setSelectedId] = useState([])

    const [stageId, setStageId] = useState('0')

    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate()

    const gigaRectParse = useCallback((rectsArr, isComputer, stageId) => {
        let parsedRects = []
        rectsArr.forEach(rect => {
            // Room example: {floor: 0, isComputer: true, name: "218", position: "0;0", size: "2;2", buildingId: 1}
            let coords = rect.position.split(";")
            let sizes = rect.size.split(";")
            let width = parseFloat(sizes[0].replace(",", ".")) * (isComputer ? 1000 : 100)
            let height = parseFloat(sizes[1].replace(",", ".")) * (isComputer ? 1000 : 100)

            let x = (parseFloat(coords[0].replace(",", ".")) * (isComputer ? 1000 : 100)) - width / 2
            let y = (parseFloat(coords[1].replace(",", ".")) * (isComputer ? 1000 : 100)) + height / 2

            let parsedRect = {id: rect.id.toString(), name: isComputer ? rect.serialNumber : rect.name,
                X: x, Y: -y, width: width, height: height, levelId: isComputer ? null : rect.floor, buildingId: isComputer ? null : rect.buildingId,
                fill: isComputer ? "gray" : rect.isComputer ? "red" : "blue", audId: isComputer ? rect.auditoriumId.toString() : null}
            if (isComputer){
                stageId === parsedRect.audId ? parsedRects.push(parsedRect) : parsedRect = {}
            } else {
                level === parsedRect.levelId && building === parsedRect.buildingId ? parsedRects.push(parsedRect) : parsedRect = {}
            } 
        })
        return parsedRects
    }, [level, building]);

    const getLimits = (rooms) => {
        let maxX = -Infinity
            let maxY = -Infinity
            let minX = Infinity
            let minY = Infinity
            rooms.forEach(room => {
                let xRight = room.X + room.width
                let yDown = room.Y + room.height

                maxX = Math.max(maxX, xRight)
                maxY = Math.max(maxY, yDown)
                minX = Math.min(minX, room.X)
                minY = Math.min(minY, room.Y)
        })
        return {maxX: maxX, minX:minX, maxY:maxY, minY:minY}
    }

    const collectFloor = useCallback((limitsInside) => {
        let height = limitsInside.maxY - limitsInside.minY + floorOverSize
        let width = limitsInside.maxX - limitsInside.minX + floorOverSize
        let x = limitsInside.minX - floorOverSize / 2
        let y = limitsInside.minY - floorOverSize / 2
        return {x, y, width, height}
    }, [floorOverSize])

    // Основной элемент
    useEffect(() => {
        async function collectInfo() {
            let res = await userInfo(localStorage.getItem('TOKEN'))

            if (res){
                let rects
                let isComputer
                if (stageId === '0'){
                    rects = await getAuds(localStorage.getItem('TOKEN'))
                    isComputer = false
                } else {
                    rects = await getComputers(localStorage.getItem('TOKEN'))
                    isComputer = true
                }
                if (!rects) {
                    navigate("/signin")
                }
                let parsedRects = gigaRectParse(rects.response, isComputer, stageId)
                setRooms(parsedRects)

                dispatchShadows({
                    type: 'init',
                    payload: parsedRects.map(rect => ({
                        id: rect.id + '_shadow',
                        X: rect.X,
                        Y: rect.Y,
                        width: rect.width,
                        height: rect.height,
                        fill: rect.fill
                    }))
                })
                let limitsTemp = getLimits(parsedRects)
                let collectedFloor;
                if (!isComputer){
                    collectedFloor = collectFloor(limitsTemp)
                } else collectedFloor = audSizes
                
                setFloor(collectedFloor)
                // setLimits(limitsTemp)
                setIsLoading(false)
            } else navigate("/signin")
        }
        collectInfo()
    }, [gigaRectParse, collectFloor, navigate, stageId, audSizes])

    const checkEditMode = () => {
        console.log("Войдите в режим редактирования, чтобы изменять объекты!")
        return editMode
    }

    const handleOpenAuditory = (id) => {
        let width = 0;
        let height = 0
        rooms.forEach(room => {
            if (room.id === id){
                width = (room.width * 10) + floorOverSize
                height = (room.height * 10) + floorOverSize
            } 
        });
        let x = -width / 2 
        let y = -height / 2
        setAudSizes({x, y, width, height})
        setStageId(id);
    }
    const handleClosedAuditory = (id) => {
        console.log(`Эта для кампутираф ${id}`)
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
        setScale(prev => {
            const delta = e.evt.wheelDelta > 0 ? 0.05 : -0.05;
            return Math.min(3, Math.max(0.25, prev + delta));
        });
    }
    const checkDeselect = (e) => {
        const clickedOnEMpty = e.target === e.target.getStage();
        if (clickedOnEMpty) {
            setSelectedId(null);
        }
    }

    const handleOnClickText = () => {
        setStageId('0')
        setAudSizes({})
    }

    const handleSwitchToEditMode = () => {
        setEditMode(!editMode)
        setSelectedId(null)
    }

    const handleBuildingSwitch = (id) => {
        if (id === building){
            console.log("Это то же здание")
        } else {
            setBuilding(id)
        }
    }   

    const handleLevelSwitch = (id) => {
        if (level === id){
            console.log("Это тот же этаж")
        } else {
            setLevel(id)
        }
    }

    const open = () => {
        setIsOpen(true)
    }
    const close = () => {
        setIsOpen(false)
    }

    if (!isLoading && level && building){
        return stageId === '0' ? (
            <div className="screenCont">
                <Button
                    onClick={open}
                    className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
                >
                    Open dialog
                </Button>
                <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                        <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                            Payment successful
                        </DialogTitle>
                        <p className="mt-2 text-sm/6 text-white/50">
                            Your payment has been successfully submitted. We’ve sent you an email with all of the details of your
                            order.
                        </p>
                        <div className="mt-4">
                            <Button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            onClick={close}
                            >
                            Got it, thanks!
                            </Button>
                        </div>
                        </DialogPanel>
                    </div>
                    </div>
                </Dialog>
                <Stage key='GigaStage' id='0' onMouseDown={checkDeselect} onWheel={handleWheel}
                    width={canvasSize.width} height={canvasSize.height * 0.85} offsetX={-canvasSize.width / 2} offsetY={-canvasSize.height / 2}
                    scaleX={scale} scaleY={scale} draggable={true}>
                    <Layer key='FloorLayer'>
                        <Rect 
                            key='Floor'
                            id='0'
                            x={floor.x}
                            y={floor.y}
                            width={floor.width}
                            height={floor.height}
                            fill='lightblue'
                        />
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
                        <GigaRect
                            key={room.id}
                            editMode={editMode}
                            snapSize={snapSize}
                            shapeProps={room}
                            isSelected={room.id === selectedId}
                            onDblClick={room.fill === "red" ? () => handleOpenAuditory(room.id) : () => handleClosedAuditory(room.id)}
                            onSelect={editMode ? () => {setSelectedId(room.id)} : checkEditMode}
                            changeShadow={changeShadow}
                            dragStart={editMode ? handleDragStart : checkEditMode}
                            dragMove={editMode ? handleDragMove : checkEditMode}
                            onChange={(newAttrs) => {
                                const rms = rooms.slice()
                                rms[i] = newAttrs
                                setRooms(rms)
                            }}
                        />
                    ))}
                    </Layer>    
                </Stage>
                <div onClick={handleSwitchToEditMode} style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    cursor: 'pointer'
                }}>
                    <p>{editMode ? 'Выйти из режима редактирования' : 'Войти в режим редактирования'}</p>

                </div>
                <div className="levelsMenu">
                    {buildings[building].map((btn, i) => (
                        <CommonBtn key={i + 1} value={btn.name} onClick={() => handleLevelSwitch(btn.name)}
                            style={i + 1 === level ? {height: "100px", width: "95%", marginTop: "5px", marginBottom: "5px", backgroundColor: "blue"} : {height: "100px", width: "95%", marginTop: "5px", marginBottom: "5px"}}/>
                    ))}
                </div>
                <div className="buildingsMenu">
                    <CommonBtn value="1 Копрус" inactive={building === 1} onClick={() => handleBuildingSwitch(1)}
                        style={building === 1 ? {width: "45%", height: "90%", backgroundColor: "blue"} : {width: "45%", height: "90%"}}
                    />
                    <CommonBtn value="2 Корпус" inactive={building === 2} onClick={() => handleBuildingSwitch(2)}
                        style={building === 2 ? {width: "45%", height: "90%", backgroundColor: "blue"} : {width: "45%", height: "90%"}}
                    /> 
                </div>
            </div>
        ) : (
            <div className="screenCont">
                <Stage key="AudStage"
                    id={stageId}
                    onMouseDown={checkDeselect}
                    onWheel={handleWheel}
                    width={canvasSize.width}
                    height={canvasSize.height * 0.85}
                    scaleX={scale}
                    scaleY={scale}
                    draggable={true} 
                    offsetX={-canvasSize.width / 2} offsetY={-canvasSize.height / 2}>
                    <Layer key='FloorLayer'>
                        <Rect 
                            key='Floor'
                            id='0'
                            x={floor.x}
                            y={floor.y}
                            width={floor.width}
                            height={floor.height}
                            fill='lightblue'
                        />
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
                        <GigaRect
                            key={room.id}
                            editMode={editMode}
                            snapSize={snapSize}
                            shapeProps={room}
                            isSelected={room.id === selectedId}
                            onDblClick={room.fill === "red" ? () => handleOpenAuditory(room.id) : () => handleClosedAuditory(room.id)}
                            onSelect={editMode ? () => {setSelectedId(room.id)} : checkEditMode}
                            changeShadow={changeShadow}
                            dragStart={editMode ? handleDragStart : checkEditMode}
                            dragMove={editMode ? handleDragMove : checkEditMode}
                            onChange={(newAttrs) => {
                                const rms = rooms.slice()
                                rms[i] = newAttrs
                                setRooms(rms)
                            }}
                        />
                    ))}
                    </Layer>
                </Stage>
                <div onClick={handleOnClickText} style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    cursor: 'pointer'
                }}>
                    <p>{'ЗАБЕРИТЕ МЕНЯ ДОМОЙЙЙЙЙ'}</p>
                </div>
            </div>
        )
}};

export default Editor