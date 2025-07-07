import { useEffect, useState, useCallback, useReducer } from "react";
import GigaRect from "../Components/EditorParts/RectComponent" 
import { Layer, Rect, Stage } from "react-konva";
import { getAuds, userInfo, getComputers, addBreakdown, getBreakdowns } from "../Components/ApiReqests/ApiRequests";
import { useNavigate } from 'react-router-dom'
import { Button, Dialog, DialogPanel, DialogTitle, Fieldset, Field, Textarea, Label, Listbox, ListboxOptions, ListboxOption, ListboxButton} from '@headlessui/react'
import ProfileStatistic from "../Components/ProfileStatistic";
import clsx from 'clsx'
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
    let hardnesses = [
        {value: "all", name: ["Все"]},
        {value: "easy", name: ["Незначительные", "Незначительная"]},
        {value: "medium", name: ["Стандартные", "Стандартная"]},
        {value: "hard", name: ["Критические", "Критическая"]}
    ]
    let statuses = [
        {value: "all", name: "Все"},
        {value: "solved", name: "Исправленные"},
        {value: "notSolved", name: "Неисправленные"}
    ]
    let theme = localStorage.getItem('THEME')

    const [isLoading, setIsLoading] = useState(true)
    const [currentUserId, setCurrentUserId] = useState()

    const [scale, setScale] = useState(1)
    const [level, setLevel] = useState(1)
    const [stageId, setStageId] = useState('0')
    const [building, setBuilding] = useState(1)
    const [editMode, setEditMode] = useState(false)
    const [rooms, setRooms] = useState([])
    const [shadows, dispatchShadows] = useReducer(shadowsReducer, [])
    const [audSizes, setAudSizes] = useState({})
    const [floor, setFloor] = useState({})
    const [selectedId, setSelectedId] = useState([])

    // const [gridLines, dispatchGridLines] = useReducer(gridLinesReducer, [])
    // Временно отключено в связи с отказом от веб-редактора.
    // const [limits, setLimits] = useState({})

    const [isComputerOpen, setisComputerOpen] = useState(false)
    const [openComputerId, setOpenComputerId] = useState(null)
    const [openComputerName, setOpenComputerName] = useState(null)
    const [openComputerAud, setOpenComputerAud] = useState(null)
    const [isBreakdownAdd, setIsBreakdownAdd] = useState(false)

    const [hardnessInput, setHardnessInput] = useState(hardnesses[1])
    const [breakdownTextInput, setBreakdownTextInput]  = useState()
    const [addBreakdownFlag, setAddBreakdownFlag] = useState()
    const [isMistake, setIsMistake] = useState(false)

    const [statusFilter, setStatusFilter] = useState(statuses[0])
    const [hardnessFilter, setHardnessFilter] = useState(hardnesses[0])

    const navigate = useNavigate()

    const gigaRectParse = useCallback((rectsArr, isComputer, stageId, breakdowns, comps) => {
        let parsedRects = []
        rectsArr.forEach(rect => {
            // Room example: {floor: 0, isComputer: true, name: "218", position: "0;0", size: "2;2", buildingId: 1}
            let circles = {1: {color: "yellow", count: 0}, 2: {color: "orange", count: 0}, 3: {color: "red", count: 0}}
            let coords = rect.position.split(";")
            let sizes = rect.size.split(";")
            let width = parseFloat(sizes[0].replace(",", ".")) * (isComputer ? 1000 : 100)
            let height = parseFloat(sizes[1].replace(",", ".")) * (isComputer ? 1000 : 100)

            let x = (parseFloat(coords[0].replace(",", ".")) * (isComputer ? 1000 : 100)) - width / 2
            let y = (parseFloat(coords[1].replace(",", ".")) * (isComputer ? 1000 : 100)) + height / 2

            if (isComputer){
                breakdowns.forEach(brk => {
                    if (brk.computerId === rect.id) {
                        circles[brk.level].count += 1;
                    }
                });
            } else {
                let compsIds = []
                comps.forEach(comp => {
                    if (comp.auditoriumId === rect.id){
                        compsIds.push(comp.id)
                    }
                });
                breakdowns.forEach(brk => {
                    if (compsIds.includes(brk.computerId)) {
                        circles[brk.level].count += 1;
                    }
                });
            }
            Object.keys(circles).forEach(key => {
                if (circles[key].count === 0) {
                    delete circles[key]
                }
            });
            let parsedRect = {id: rect.id.toString(),
                name: isComputer ? rect.serialNumber : rect.name,
                X: x, Y: -y, width: width, height: height,
                levelId: isComputer ? null : rect.floor,
                buildingId: isComputer ? null : rect.buildingId,
                audId: isComputer ? rect.auditoriumId.toString() : null,
                compId: isComputer ? rect.id : null,
                circles,
                isComputer,
                openable: isComputer ? null : rect.isComputer ? true : false
            }
            
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

    const collectBreakDownInfo = useCallback(() => {
        let hardnessLevel
        switch (hardnessInput.value){
            case "easy":
                hardnessLevel = 1
                break;
            case "medium":
                hardnessLevel = 2
                break;
            case "hard":
                hardnessLevel = 3
                break;
            default:
                break;
        }
        return {
                description: breakdownTextInput,
                isSolved: false,
                level: hardnessLevel,
                computerId: openComputerId,
                userId: currentUserId
                }
    }, [breakdownTextInput, openComputerId, currentUserId, hardnessInput])

    // Основной элемент
    useEffect(() => {
        async function collectInfo() {
            let res = await userInfo(localStorage.getItem('TOKEN'))

            if (res){
                let isComputer
                if (stageId === '0'){
                    isComputer = false
                } else {
                    isComputer = true
                }
                let rects = await getAuds(localStorage.getItem('TOKEN'))
                let comps = await getComputers(localStorage.getItem('TOKEN'))
                if (!rects || !comps) {
                    navigate("/signin")
                }

                let breakdowns = await getBreakdowns(localStorage.getItem('TOKEN'))
                let parsedRects
                if (isComputer){
                    parsedRects = gigaRectParse(comps.response, isComputer, stageId, breakdowns.response, comps.response)
                } else{
                    parsedRects = gigaRectParse(rects.response, isComputer, stageId, breakdowns.response, comps.response)
                }

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
                setCurrentUserId(res.id)

                if (addBreakdownFlag) {
                    let info = collectBreakDownInfo()
                    let addBrdRes = await addBreakdown(localStorage.getItem("TOKEN"), info)
                    if (!addBrdRes) {
                        setIsMistake(true)
                    } else {
                        handleBreakdownAddClose()
                        setIsMistake(false)
                    }
                    setAddBreakdownFlag(false)
                }
                // setLimits(limitsTemp)
                setIsLoading(false)
            } else navigate("/signin")
        }
        collectInfo()
    }, [gigaRectParse, collectFloor, navigate, stageId, audSizes, addBreakdownFlag])

    const checkEditMode = () => {
        console.log("Войдите в режим редактирования, чтобы изменять объекты!")
        return editMode
    }

    const handleOpenAuditory = (id) => {
        setIsLoading(true)
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
        console.log({x, y, width, height})
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
        setIsLoading(true)
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

    const handleOpenComputer = (id, name, aud) => {
        setisComputerOpen(true)
        setOpenComputerId(id)
        setOpenComputerName(name)
        setOpenComputerAud(aud)
    }
    const handleCloseComputer = () => {
        setisComputerOpen(false)
        setOpenComputerId(null)
        setOpenComputerName(null)
        setOpenComputerAud(null)
        setStatusFilter({value: "all", name: "Все"})
        setHardnessFilter({value: "all", name: ["Все"]})
    }
    const handleBreakdownAddClose = () => {
        setIsBreakdownAdd(false)
        setHardnessInput(hardnesses[1])
        setBreakdownTextInput()
    }
    const handleAddBreakdown = () => {
        setAddBreakdownFlag(true)
    }
    if (!isLoading && level && building){
        return stageId === '0' ? (
            <div className="relative w-full h-full bg-bgMiddle dark:bg-bgMiddleD transition ease-in-out duration-500">   
                <Stage key='GigaStage' id='0' onMouseDown={checkDeselect} onWheel={handleWheel}
                    width={canvasSize.width} height={canvasSize.height - 144} offsetX={-canvasSize.width / 2} offsetY={-canvasSize.height / 2}
                    scaleX={scale} scaleY={scale} draggable={true}>
                    <Layer key='FloorLayer'>
                        <Rect
                            key='Floor'
                            id='0'
                            x={floor.x}
                            y={floor.y}
                            width={floor.width}
                            height={floor.height}
                            fill={theme === 'light' ? "#eff6ff" : "#28272D"} 
                            cornerRadius={8}
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
                            fill={shadow.isComputer ? theme === 'light' ? "#60a5fa" : "#5696FD" : shadow.openable ? theme === "light" ? "#60a5fa" : "#5696FD" : "#646A7C"}
                            cornerRadius={8}
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
                            fillC={room.isComputer ? theme === 'light' ? "#60a5fa" : "#5696FD" : room.openable ? theme === "light" ? "#60a5fa" : "#5696FD" : "#646A7C"}
                            onDblClick={room.openable ? () => handleOpenAuditory(room.id) : () => handleClosedAuditory(room.id)}
                            onDbTap={room.openable ? () => handleOpenAuditory(room.id) : () => handleClosedAuditory(room.id)}
                            onSelect={editMode ? () => {setSelectedId(room.id)} : checkEditMode}
                            changeShadow={changeShadow}
                            dragStart={editMode ? handleDragStart : checkEditMode}
                            dragMove={editMode ? handleDragMove : checkEditMode}
                            circles={room.circles}
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
                <div className="absolute top-[50%] translate-y-[-50%] w-[60px] h-[420px] bg-bgDark dark:bg-bgDarkD
                    flex flex-col items-start gap-[20px] transition ease-in-out duration-500
                    rounded-r-[8px] pt-[20px] pb-[20px]
                    ">
                    {buildings[building].map((btn, i) => (
                        <Button className={i + 1 === level ? "transition ease-in-out duration-500 h-[80px] w-[40px] rounded-r-[8px] font-bold text-tLight dark:text-tLightD text-[32px] align-middle bg-primary dark:bg-primaryD hover:duration-75 hover:scale-105 active:scale-110" :
                            "transition ease-in-out duration-500 h-[80px] w-[40px] rounded-r-[8px] font-bold text-tLight dark:text-tLightD text-[32px] align-middle bg-bgLight dark:bg-bgLightD hover:duration-75 hover:scale-105 active:scale-110"
                        } key={i + 1} value={btn.name} onClick={() => handleLevelSwitch(btn.name)}>{btn.name}</Button>
                    ))}
                </div>
                <div className="absolute bottom-[5px] left-[50%] translate-x-[-50%] h-[85px] w-[380px] rounded-[16px] bg-bgDark dark:bg-bgDarkD
                    flex flex-col transition ease-in-out duration-500
                ">
                    <div className="flex items-center justify-center w-full h-[45px]">
                        <p className="font-bold text-tLight dark:text-tLightD text-[24px]">Корпус</p>
                    </div>
                    <div className="pl-[20px] pr-[20px] flex flex-row gap-[20px] pb-[10px]">
                        <Button className={building === 1 ? "flex items-center justify-center transition ease-in-out duration-500 w-[160px] h-[40px] rounded-[8px] bg-primary dark:bg-primaryD hover:duration-75 hover:scale-105 active:scale-110" :
                            "flex items-center justify-center transition ease-in-out duration-500 w-[160px] h-[40px] rounded-[8px] bg-bgLight dark:bg-bgLightD hover:duration-75 hover:scale-105 active:scale-110"} value="1 Копрус" onClick={() => handleBuildingSwitch(1)}
        
                        ><p className="font-bold text-tLight dark:text-tLightD text-[32px] transition ease-in-out duration-500">1</p></Button>
                        <Button className={building === 2 ? "flex items-center justify-center transition ease-in-out duration-500 w-[160px] h-[40px] rounded-[8px] bg-primary dark:bg-primaryD hover:duration-75 hover:scale-105 active:scale-110" :
                            "flex items-center justify-center transition ease-in-out duration-500 w-[160px] h-[40px] rounded-[8px] bg-bgLight dark:bg-bgLightD hover:duration-75 hover:scale-105 active:scale-110"} value="2 Корпус" onClick={() => handleBuildingSwitch(2)}
                            
                        ><p className="font-bold text-tLight dark:text-tLightD text-[32px] transition ease-in-out duration-500">2</p></Button> 
                    </div>
                </div>
            </div>
        ) : (
            <div className="relative w-full h-full bg-bgMiddle dark:bg-bgMiddleD transition ease-in-out duration-500">
                <Stage key="AudStage"
                    id={stageId}
                    onMouseDown={checkDeselect}
                    onWheel={handleWheel}
                    width={canvasSize.width}
                    height={canvasSize.height - 144}
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
                            fill={localStorage.getItem("THEME") === 'light' ? "#E2E8F0" : "#28272D"}
                            cornerRadius={8}
                            
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
                            fill={theme === 'light' ? "#60a5fa" : "#5696FD"}
                            cornerRadius={8}
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
                            onDblClick={() => handleOpenComputer(room.id, room.name, room.audId)}
                            onDbTap={() => handleOpenComputer(room.id, room.name, room.audId)}
                            onSelect={editMode ? () => setSelectedId(room.id) : checkEditMode}
                            changeShadow={changeShadow}
                            fillC={theme === 'light' ? "#60a5fa" : "#5696FD"}
                            dragStart={editMode ? handleDragStart : checkEditMode}
                            dragMove={editMode ? handleDragMove : checkEditMode}
                            circles={room.circles}
                            onChange={(newAttrs) => {
                                const rms = rooms.slice()
                                rms[i] = newAttrs
                                setRooms(rms)
                            }}
                        />
                    ))}
                    </Layer>
                </Stage>
                <Dialog open={isComputerOpen} as="div" data-theme={theme} className="absolute z-10 focus:outline-none" onClose={handleCloseComputer}>
                    <div className="relative focus:outline-none">
                        <div className="fixed h-[720px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] inset-0 flex items-center justify-center">
                            <DialogPanel transition
                                className="w-full space-y-[30px] p-4 max-w-3xl h-full rounded-[16px] bg-bgModal dark:bg-bgModalD
                                    duration-500 ease-in-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                            >
                                <DialogTitle className="flex flex-col gap-[20px] mb-[30px]">
                                    <p className="font-semibold text-[32px] text-tLight dark:text-tLightD">{openComputerName}</p>
                                    <p className="text-[24px] text-tLight dark:text-tLightD ">Аудитория: {openComputerAud}</p>
                                </DialogTitle>

                                <div className="flex flex-row min-w-full items-end justify-between">
                                    <div className="flex flex-row min-w-8/12 gap-2">
                                        <Listbox value={hardnessFilter} onChange={setHardnessFilter}>
                                            <ListboxButton
                                                className=
                                                    'relative w-[190px] h-[40px] py-1.5 rounded-lg bg-bgLight dark:bg-bgLightD pl-[10px] text-tLight dark:text-tLightD text-left text-[20px]'
                                                >
                                                {hardnessFilter.name[0]}
                                                <ChevronDownIcon
                                                    className="group pointer-events-none absolute top-3.5 right-2.5 size-4 fill-tLight dark:fill-tLightD"
                                                    aria-hidden="true"
                                                />
                                            </ListboxButton>
                                            <ListboxOptions anchor="bottom" transition 
                                                className={clsx(
                                                    'w-(--button-width) rounded-[8px] bg-bgLight dark:bg-bgLightD p-1 [--anchor-gap:--spacing(1)] focus:outline-none',
                                                    'transition duration-100 ease-in data-leave:data-closed:opacity-0 flex flex-col gap-1'
                                                )}
                                            >   
                                                {hardnesses.map((hardness) => (
                                                    <ListboxOption
                                                        key={hardness.name[0]}
                                                        value={hardness} 
                                                        className="hover:scale-105 group flex cursor-pointer items-center gap-2
                                                            rounded-[8px] bg-bgModal dark:bg-bgModalD px-3 py-1.5 select-none"
                                                    >
                                                        {/* <CheckIcon className="invisible size-4 group-data-selected:visible"/> */}
                                                        <div className="text-tLight dark:text-tLightD text-[20px] h-full w-full">{hardness.name[0]}</div>
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </Listbox>
                                        <Listbox value={statusFilter} onChange={setStatusFilter}>
                                            <ListboxButton
                                                className=
                                                    'relative w-[190px] h-[40px] py-1.5 rounded-lg bg-bgLight dark:bg-bgLightD pl-[10px] text-tLight dark:text-tLightD text-left text-[20px]'
                                                >
                                                {statusFilter.name}
                                                <ChevronDownIcon
                                                    className="group pointer-events-none absolute top-3.5 right-2.5 size-4 fill-tLight dark:fill-tLightD"
                                                    aria-hidden="true"
                                                />
                                            </ListboxButton>
                                            <ListboxOptions anchor="bottom" transition 
                                                className={clsx(
                                                    'w-(--button-width) rounded-[8px] bg-bgLight dark:bg-bgLightD p-1 [--anchor-gap:--spacing(1)] focus:outline-none',
                                                    'transition duration-100 ease-in data-leave:data-closed:opacity-0 flex flex-col gap-1'
                                                )}
                                            >   
                                                {statuses.map((status) => (
                                                    <ListboxOption
                                                        key={status.name}
                                                        value={status} 
                                                        className="hover:scale-105 group flex cursor-pointer items-center gap-2
                                                            rounded-[8px] bg-bgModal dark:bg-bgModalD px-3 py-1.5 select-none"
                                                    >
                                                        {/* <CheckIcon className="invisible size-4 fill-black group-data-selected:visible"/> */}
                                                        <div className="text-tLight dark:text-tLightD text-[20px] h-full w-full ">{status.name}</div>
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </Listbox>
                                    </div>
                                    <div className="w-[190px] h-[40px]">
                                        <Button className="w-full h-full bg-red hover:bg-red-600 rounded-[8px]" onClick={() => setIsBreakdownAdd(true)}>
                                            <p className="w-full h-full text-tLight dark:text-tLightD text-[20px] py-1">Добавить ошибку</p>
                                        </Button>
                                    </div>
                                </div>
                                <div className="min-h-[480px]">
                                    <ProfileStatistic key={statusFilter.value + hardnessFilter.value + openComputerId}
                                        statusFilter={statusFilter.value} hardnessFilter={hardnessFilter.value}
                                        isComputer={true} computerId={openComputerId}/>
                                </div>
                                
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
                <Dialog open={isBreakdownAdd} as="div" data-theme={theme} className="absolute z-20 focus:outline-none" onClose={handleBreakdownAddClose}>
                    <div className="relative focus:outline-none">
                        <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] inset-0 overflow-y-auto flex items-center justify-center">
                            <DialogPanel transition
                                className="w-full h-full max-w-2xl flex flex-col items-center justify-center
                                    rounded-[16px] bg-bgModal dark:bg-bgModalD duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                            >
                                <DialogTitle className="w-full pl-[30px] pr-[30px] pt-[30px] flex flex-row justify-between gap-[20x] mb-[30px]">
                                    <p className="font-semibold text-[32px] text-tLight dark:text-tLightD py-1.5">Добавление ошибки</p>
                                    <div className="size-[60px] bg-bgLight dark:bg-bgLightD rounded-[8px] hover:scale-110 active:scale-105" onClick={handleBreakdownAddClose}>
                                        <XMarkIcon className="size-[60px] fill-black dark:fill-white" />
                                    </div>
                                </DialogTitle>
                                <Fieldset className="odd:space-y-[30px] h-full even:space-y-[15px] w-full pl-[30px] pr-[30px] ">
                                    <Field>
                                        <Label className="font-bold text-[20px] text-tLight dark:text-tLightD">
                                            Тип ошибки
                                        </Label>
                                        <div className="relative mt-3">
                                            <Listbox value={hardnessInput} onChange={setHardnessInput}>
                                                <ListboxButton
                                                    className=
                                                    'relative w-[220px] h-[40px] py-1 rounded-lg bg-bgLight dark:bg-bgLightD pl-[10px] text-tLight dark:text-tLightD text-left text-[20px]'
                                                    >
                                                    {hardnessInput.name[1]}
                                                    <ChevronDownIcon
                                                        className="group pointer-events-none absolute top-3.5 right-2.5 size-4 fill-tLight dark:fill-tLightD"
                                                        aria-hidden="true"
                                                    />
                                                </ListboxButton>
                                                <ListboxOptions anchor="bottom" transition 
                                                    className={clsx(
                                                        'w-[220px] rounded-[8px] bg-bgLight dark:bg-bgLightD p-1 [--anchor-gap:--spacing(1)] focus:outline-none',
                                                        'transition duration-100 ease-in data-leave:data-closed:opacity-0 flex flex-col gap-1'
                                                    )}
                                                >   
                                                    {hardnesses.slice(1).map((hardness) => (
                                                        <ListboxOption
                                                            key={hardness.name[1]}
                                                            value={hardness} 
                                                            className="hover:scale-102 group flex cursor-pointer items-center gap-2
                                                                rounded-[8px] bg-bgModal dark:bg-bgModalD px-3 py-1.5 select-none"
                                                        >
                                                            {/* <CheckIcon className="invisible size-4 fill-black group-data-selected:visible"/> */}
                                                            <div className="text-tLight dark:text-tLightD text-[20px] h-full w-full ">{hardness.name[1]}</div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                            </Listbox>
                                        </div>
                                    </Field>
                                    <Field>
                                        <Label className="font-bold text-[20px] text-tLight dark:text-tLightD outline-none">Описание ошибки</Label>
                                        <Textarea placeholder="Введите описание ошибки" onChange={e => setBreakdownTextInput(e.target.value)}
                                            className="placeholder-tDark text-[20px] text-tLight
                                                dark:text-tLightD w-full outline-none bg-bgMiddle dark:bg-bgMiddleD
                                                rounded-[8px] p-[10px] mt-[15px] resize-none"
                                            rows={4}/>
                                    </Field>
                                    <Field>
                                        <Button className="bg-primary dark:bg-primaryD h-[40px] w-[190px] rounded-[8px] active:scale-105 hover:scale-110
                                            text-[20px] text-tLight dark:text-tLightD" onClick={handleAddBreakdown}>
                                            Добавить
                                        </Button>
                                    </Field>
                                </Fieldset>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog> 
                <div onClick={handleOnClickText} className="absolute transition-colors duration-500 ease-in-out top-[15px] right-[15px] size-[80px]
                    rounded-[8px] bg-bgDark dark:bg-bgDarkD hover:scale-110 active:scale-105">
                    <XMarkIcon className="size-[80px] fill-white py-0.5"/>
                </div>
            </div>
        )
    } else {
        return (
            <div className="bg-bgMiddle dark:bg-bgMiddleD h-[calc(100vh-144px)]">Шкилет</div>
        )
    }

};

export default Editor