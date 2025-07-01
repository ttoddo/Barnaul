import React, { useEffect, useRef } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";

const Audithorium = ({ shapeProps, isSelected, onSelect, onChange, snapSize, dragStart, dragMove, changeShadow, onDblClick}) => {
    const shapeRef = useRef();
    const trRef = useRef();
  
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
          onTap={onSelect}
          ref={shapeRef}
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
        >
            <Rect fill={shapeProps.fill} width={shapeProps.width} height={shapeProps.height} cornerRadius={15}/>
            <Text text={shapeProps.id} fontSize={(shapeProps.width + shapeProps.height) / 20} x={20} y={20}></Text>
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

export default Audithorium