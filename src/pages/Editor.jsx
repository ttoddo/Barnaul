import React, { useRef, useEffect, useState } from "react";

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
  
      ctx.fillStyle = "lightblue";
      ctx.fillRect(x, y, this.width, this.height);
      ctx.strokeStyle = "black";
      ctx.strokeRect(x, y, this.width, this.height);
      ctx.fillStyle = "black";
      ctx.fillText(`Ауд. ${this.id}`, x + 10, y + 20);
    }
  
    isClicked(mouseX, mouseY, offsetX, offsetY) {
      const x = this.worldX + offsetX;
      const y = this.worldY + offsetY;
      return mouseX >= x && mouseX <= x + this.width && mouseY >= y && mouseY <= y + this.height;
    }
}

const PanningCanvas = ({ width, height }) => {
  const canvasRef = useRef(null);
  const [rooms] = useState([
    new Room(101, 100, 100, 200, 150),
    new Room(102, 400, 100, 200, 150),
    new Room(103, 100, 400, 200, 150),
  ]);

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

      rooms.forEach((room) => room.draw(ctx, 0, 0));

      ctx.restore();
    };

    draw();
  }, [width, height, offset, scale, rooms]);

  const handleMouseDown = (event) => {
    if (event.button !== 1) return; 

    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const dx = event.clientX - lastMousePos.x;
    const dy = event.clientY - lastMousePos.y;
    setOffset((prev) => ({ x: prev.x + dx / scale, y: prev.y + dy / scale }));
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setScale((prevScale) => Math.max(0.5, Math.min(2, prevScale * zoomFactor)));
  };

  const handleClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left - width / 2) / scale + width / 2 - offset.x;
    const mouseY = (event.clientY - rect.top - height / 2) / scale + height / 2 - offset.y;

    const clickedRoom = rooms.find((room) => room.isClicked(mouseX, mouseY, 0, 0));

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
      style={{ border: "1px solid black", cursor: isDragging ? "grabbing" : "grab" }}
    />
  );
};

const Editor = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  return <PanningCanvas width={canvasSize.width} height={canvasSize.height} />;
};

export default Editor