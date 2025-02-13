import React, { useRef, useEffect, useState } from "react";

// Сделать новую Room, как было в запросе у Дани, сделать курсоры, разобраться со скейлом, 



class University {
    constructor(worldX, worldY, width, height){
      this.worldX = worldX; 
      this.worldY = worldY;
      this.width = width;
      this.height = height;
    }

    drawRect(ctx, centerX, centerY, width, height){
      ctx.fillRect(centerX-width/2, centerY-height/2, width, height)
    }

    drawGrid(ctx, centerX, centerY, width, height){
      for (let x = centerX-width/2; x <= centerX+width/2; x+=50){
        for (let y = centerY+height/2; y >= centerY-height/2; y-=50)
          this.drawRect(ctx, x, y, 2, 2)
      }
    }

    draw(ctx, offsetX, offsetY) {
      const xCoord = this.worldX + offsetX;
      const yCoord = this.worldY + offsetY;
      ctx.fillStyle = "lightblue"
      this.drawRect(ctx, xCoord, yCoord, this.width, this.height)
      ctx.fillStyle = "black"
      this.drawRect(ctx, 0, 0, 5, 5)
      this.drawGrid(ctx, 0, 0, this.width, this.height)
    }
}

class Room {
    constructor(id, worldX, worldY, width, height) {
      this.id = id;
      this.worldX = worldX; 
      this.worldY = worldY;
      this.width = width;
      this.height = height;
    }
  
    draw(ctx, offsetX, offsetY) {
      const x = this.worldX + offsetX;
      const y = this.worldY + offsetY;
  
      ctx.fillStyle = "blue";
      ctx.fillRect(x, y, this.width, this.height);
      ctx.strokeStyle = "black";
      ctx.strokeRect(x, y, this.width, this.height);
      ctx.fillStyle = "black";
      ctx.fillText(`Ауд. ${this.id}`, x + 10, y + 20);
    }
  
    isClicked(mouseX, mouseY, offsetX, offsetY, scale) {
      const x = this.worldX + offsetX;
      const y = this.worldY + offsetY;
      return mouseX >= x && mouseX <= x + this.width && mouseY >= y && mouseY <= y + this.height;
    }
}

const PanningCanvas = ({ width, height }) => {
  const canvasRef = useRef(null);
  const [currentCursor, setCurrentCursor] = useState('pointer')
  const [rooms] = useState([
    new Room(101, 100, 100, 200, 150),
    new Room(102, 400, 100, 200, 150),
    new Room(103, 100, 400, 200, 150),
  ]);
  const [University1] = useState([new University(0, 0, 1000, 1000)])
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width + offset.x, -canvas.height + offset.y);
      ctx.font = "16px Arial";
      University1[0].draw(ctx, 0, 0)
      rooms.forEach((room) => room.draw(ctx, 0, 0));
      
      ctx.restore();
    };
    draw();
  }, [width, height, offset, scale, rooms]);

  const handleMouseDown = (event) => {
    if (event.button !== 1) return; 
    console.log(currentCursor)
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (isDragging){
      const dx = event.clientX - lastMousePos.x;
      const dy = event.clientY - lastMousePos.y;
      setOffset((prev) => ({ x: prev.x + dx / scale, y: prev.y + dy / scale }));
      setLastMousePos({ x: event.clientX, y: event.clientY });
      let canvas = canvasRef.current
      canvas.style.cursor='grab'


    }
    else {
      let canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect();
      let offsetX = rect.left;
      let offsetY = rect.top;
      const mouseX = parseInt(event.clientX - offsetX);
      const mouseY = parseInt(event.clientY - offsetY);

    }


  };

  const handleMouseUp = () => {
    let canvas = canvasRef.current
    canvas.style.cursor = 'default'
    setIsDragging(false);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setScale((prevScale) => Math.max(0.5, Math.min(2, prevScale * zoomFactor)));
  };

  const handleClick = (event) => {  
    let canvas = canvasRef.current
    let rect = canvas.getBoundingClientRect();
    let offsetX = rect.left;
    let offsetY = rect.top;
    const mouseX = parseInt(event.clientX - offsetX);
    const mouseY = parseInt(event.clientY - offsetY);
    
    const clickedRoom = rooms.find((room) => room.isClicked(mouseX, mouseY, offset.x, offset.y, scale));

    if (clickedRoom) {
      alert(`Открываем аудиторию ${clickedRoom.id}`);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleClick}
      style={{ border: "1px solid black", cursor: {currentCursor} }}
    />
  );
};

const Editor = () => {
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth , height: window.innerHeight });

  return <PanningCanvas width={canvasSize.width} height={canvasSize.height * 0.85} />;
};

export default Editor