import React, { useEffect, useRef } from "react";
import { Group, Rect, Text, Circle, Transformer, Image } from "react-konva";
import { useImage } from 'react-konva-utils';
import computerSVG from "../../icons/computer.svg"
import tvSVG from "../../icons/tv.svg"
import projectorSVG from "../../icons/projector.svg"
import printerSVG from "../../icons/printer.svg"

const GigaRect = ({ shapeProps, isSelected, onSelect, onChange, snapSize, dragStart, dragMove, changeShadow, onDblClick, editMode, circles, fillC, onDbTap }) => {
    const shapeRef = useRef();
    const trRef = useRef();
    const [computer] = useImage(computerSVG)
    const [tv] = useImage(tvSVG)
    const [projector] = useImage(projectorSVG)
    const [printer] = useImage(printerSVG)

  
    useEffect(() => {
      if (isSelected) {
        // we need to attach transformer manually
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);
  
    return (
      <React.Fragment>
        <Group
          onDblClick={onDblClick}
          onClick={onSelect}
          onDblTap={onDbTap}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable={editMode}
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
        >
            <Rect fill={fillC} width={shapeProps.width} height={shapeProps.height} cornerRadius={8}/>
            <Rect height={((shapeProps.width + shapeProps.height) / 20)*1.2} width={((shapeProps.width + shapeProps.height) / 20) * 1.25 * Object.keys(circles).length } fill={"#1C1C21"}
              x={shapeProps.width - ((shapeProps.width + shapeProps.height) / 20 * 0.625 * (Object.keys(circles).length * 2 - 1))}
              y={((shapeProps.width + shapeProps.height) / 20)/(-2)*1.2} cornerRadius={8}/>
            {Object.keys(circles).reverse().map((circle, i) => (    
              <Group height={(shapeProps.width + shapeProps.height) / 20} width={(shapeProps.width + shapeProps.height) / 20}
                  x={shapeProps.width - ((shapeProps.width + shapeProps.height) / 20 * 1.25) * i} key={"group " + i}>
                

                <Circle key={"circle " + i} fill={circles[circle].color} listening={false}
                  height={(shapeProps.width + shapeProps.height) / 20} width={(shapeProps.width + shapeProps.height) / 20}/>
                
                <Text listening={false} height={(shapeProps.width + shapeProps.height) / 20} width={(shapeProps.width + shapeProps.height) / 20}
                  key={"text " + i} text={circles[circle].count} fontSize={(((shapeProps.width + shapeProps.height) / 20)/10)*7.5}
                  x={((shapeProps.width + shapeProps.height) / 20)/(-2)}
                  y={((shapeProps.width + shapeProps.height) / 20)/(-2)}
                  verticalAlign="middle" align="center" fontStyle="bold"
                />
              </Group>
            ))}  
            {
              shapeProps.isComputer ? <Image image={computer}
                width={shapeProps.width / 2} height={shapeProps.height / 2}
                x={shapeProps.width / 4}
                y={shapeProps.height / 4} /> : 
              <Text text={shapeProps.name} fontSize={(shapeProps.width + shapeProps.height) / 20}
                width={shapeProps.width} height={shapeProps.height} verticalAlign="middle" align="center"/>
            }
        </Group>
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

export default GigaRect