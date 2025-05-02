'use client';
import { TbRectangle } from "react-icons/tb";
import { IoMdDownload, IoMdSave } from "react-icons/io";
import { FaLongArrowAltRight, FaStar } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor, GiTriangleTarget } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import { BiEraser } from "react-icons/bi";
import { MdUndo, MdRedo, MdClear } from "react-icons/md";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
  Star,
} from "react-konva";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "./constants";
import axios from "axios";
import toast from "react-hot-toast";

const Whiteboard = ({ lectureId }) => {
  const stageRef = useRef();
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#5b21b6");
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);
  const [triangles, setTriangles] = useState([]);
  const [stars, setStars] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const strokeColor = "#000";
  const isPaining = useRef();
  const currentShapeId = useRef();
  const transformerRef = useRef();

  const isDraggable = action === ACTIONS.SELECT;

  function handleUndo() {
    if (history.length > 0) {
      const lastState = history.pop();
      setRedoStack([...redoStack, lastState]);
      setScribbles(lastState.scribbles);
      setRectangles(lastState.rectangles);
      setCircles(lastState.circles);
      setTriangles(lastState.triangles);
      setStars(lastState.stars);
    }
  }

  function handleRedo() {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setHistory([...history, nextState]);
      setScribbles(nextState.scribbles);
      setRectangles(nextState.rectangles);
      setCircles(nextState.circles);
      setTriangles(nextState.triangles);
      setStars(nextState.stars);
    }
  }

  function clearCanvas() {
    setHistory([...history, { scribbles, rectangles, circles, triangles, stars }]);
    setScribbles([]);
    setRectangles([]);
    setCircles([]);
    setTriangles([]);
    setStars([]);
  }

  function onPointerDown() {
    if (action === ACTIONS.SELECT || isErasing) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();

    currentShapeId.current = id;
    isPaining.current = true;

    setHistory([...history, { scribbles, rectangles, circles, triangles, stars }]);

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) => [
          ...rectangles,
          {
            id,
            x,
            y,
            height: 20,
            width: 20,
            fillColor,
          },
        ]);
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 20,
            fillColor,
          },
        ]);
        break;
      case ACTIONS.TRIANGLE:
        setTriangles((triangles) => [
          ...triangles,
          {
            id,
            x,
            y,
            size: 30,
            fillColor,
          },
        ]);
        break;
      case ACTIONS.STAR:
        setStars((stars) => [
          ...stars,
          {
            id,
            x,
            y,
            points: 5,
            innerRadius: 10,
            outerRadius: 20,
            fillColor,
          },
        ]);
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
          },
        ]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) => [
          ...scribbles,
          {
            id,
            points: [x, y],
            fillColor,
            brushSize,
          },
        ]);
        break;
    }
  }

  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPaining.current || isErasing) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
              };
            }
            return rectangle;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.TRIANGLE:
        setTriangles((triangles) =>
          triangles.map((triangle) => {
            if (triangle.id === currentShapeId.current) {
              return {
                ...triangle,
                size: Math.abs(x - triangle.x),
              };
            }
            return triangle;
          })
        );
        break;
      case ACTIONS.STAR:
        setStars((stars) =>
          stars.map((star) => {
            if (star.id === currentShapeId.current) {
              return {
                ...star,
                outerRadius: Math.abs(x - star.x),
              };
            }
            return star;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
        break;
    }
  }

  function onPointerUp() {
    if (isErasing) {
      const stage = stageRef.current;
      const { x, y } = stage.getPointerPosition();

      setRectangles((rectangles) =>
        rectangles.filter(
          (rect) =>
            !(
              x >= rect.x &&
              x <= rect.x + rect.width &&
              y >= rect.y &&
              y <= rect.y + rect.height
            )
        )
      );
      setCircles((circles) =>
        circles.filter(
          (circle) =>
            Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2) > circle.radius
        )
      );
      setTriangles((triangles) =>
        triangles.filter((triangle) => Math.abs(x - triangle.x) > triangle.size)
      );
      setStars((stars) =>
        stars.filter((star) => Math.abs(x - star.x) > star.outerRadius)
      );
      setScribbles((scribbles) =>
        scribbles.filter(
          (scribble) =>
            !scribble.points.some(
              (point, index) =>
                index % 2 === 0 &&
                Math.abs(point - x) < 5 &&
                Math.abs(scribble.points[index + 1] - y) < 5
            )
        )
      );
    }
    isPaining.current = false;
  }

  function handleExport() {
    const uri = stageRef.current.toDataURL();
    var link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleSaveToLecture() {
    if (!lectureId) {
      toast.error("Lecture ID is missing");
      return;
    }

    setIsSaving(true);
    try {
      const uri = stageRef.current.toDataURL();
      
      // Convert base64 to blob
      const res = await fetch(uri);
      const blob = await res.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('material', blob, 'whiteboard.png');
      
      const token = localStorage.getItem('teacher');
      
      // Upload to lecture materials
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/lectures/material/${lectureId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token
          },
        }
      );
      
      toast.success('Whiteboard saved to lecture materials!');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save whiteboard');
    } finally {
      setIsSaving(false);
    }
  }

  function onClick(e) {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  }

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* Header */}
        <div className="absolute top-0 z-10 w-full py-3 bg-white shadow-md">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
            Interactive Whiteboard
          </h1>
        </div>
        
        {/* Controls */}
        <div className="absolute top-16 z-10 w-full py-2">
          <div className="flex flex-wrap justify-center items-center gap-3 py-3 px-4 w-fit mx-auto bg-white border border-purple-200 shadow-lg rounded-xl">
            <button
              className={`transition-all p-2 rounded-lg flex items-center gap-1 ${
                isErasing
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow"
                  : "hover:bg-red-100 text-red-600"
              }`}
              onClick={() => setIsErasing(!isErasing)}
            >
              <BiEraser size={"1.3rem"} />
              <span className="text-sm">Eraser</span>
            </button>
            <button
              className={`transition-all p-2 rounded-lg ${
                action === ACTIONS.SELECT
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "hover:bg-purple-100 text-purple-600"
              }`}
              onClick={() => setAction(ACTIONS.SELECT)}
            >
              <GiArrowCursor size={"1.3rem"} />
            </button>
            <button
              className={`transition-all p-2 rounded-lg ${
                action === ACTIONS.RECTANGLE
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "hover:bg-purple-100 text-purple-600"
              }`}
              onClick={() => setAction(ACTIONS.RECTANGLE)}
            >
              <TbRectangle size={"1.3rem"} />
            </button>
            <button
              className={`transition-all p-2 rounded-lg ${
                action === ACTIONS.CIRCLE
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "hover:bg-purple-100 text-purple-600"
              }`}
              onClick={() => setAction(ACTIONS.CIRCLE)}
            >
              <FaRegCircle size={"1.2rem"} />
            </button>
            <button
              className={`transition-all p-2 rounded-lg ${
                action === ACTIONS.TRIANGLE
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "hover:bg-purple-100 text-purple-600"
              }`}
              onClick={() => setAction(ACTIONS.TRIANGLE)}
            >
              <GiTriangleTarget size={"1.3rem"} />
            </button>
            <button
              className={`transition-all p-2 rounded-lg ${
                action === ACTIONS.STAR
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "hover:bg-purple-100 text-purple-600"
              }`}
              onClick={() => setAction(ACTIONS.STAR)}
            >
              <FaStar size={"1.3rem"} />
            </button>
            <button
              className={`transition-all p-2 rounded-lg ${
                action === ACTIONS.ARROW
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "hover:bg-purple-100 text-purple-600"
              }`}
              onClick={() => setAction(ACTIONS.ARROW)}
            >
              <FaLongArrowAltRight size={"1.3rem"} />
            </button>
            <button
              className={`transition-all p-2 rounded-lg ${
                action === ACTIONS.SCRIBBLE
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "hover:bg-purple-100 text-purple-600"
              }`}
              onClick={() => setAction(ACTIONS.SCRIBBLE)}
            >
              <LuPencil size={"1.2rem"} />
            </button>

            <div className="flex items-center ml-2">
              <input
                className="w-6 h-6 rounded-full border-2 border-purple-300 cursor-pointer"
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
            </div>

            <div className="h-8 w-0.5 bg-gray-200 mx-1"></div>

            <button 
              onClick={handleExport}
              className="transition-all p-2 rounded-lg hover:bg-blue-100 text-blue-600 flex items-center gap-1"
            >
              <IoMdDownload size={"1.3rem"} />
              <span className="text-sm">Download</span>
            </button>
            
            <button 
              onClick={handleSaveToLecture}
              disabled={isSaving}
              className="transition-all p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white shadow flex items-center gap-1"
            >
              <IoMdSave size={"1.3rem"} />
              <span className="text-sm">{isSaving ? "Saving..." : "Save to Lecture"}</span>
            </button>

            <div className="h-8 w-0.5 bg-gray-200 mx-1"></div>

            <button 
              onClick={handleUndo} 
              className="transition-all p-2 rounded-lg hover:bg-purple-100 text-purple-600"
              title="Undo"
            >
              <MdUndo size={"1.3rem"} />
            </button>
            <button 
              onClick={handleRedo} 
              className="transition-all p-2 rounded-lg hover:bg-purple-100 text-purple-600"
              title="Redo"
            >
              <MdRedo size={"1.3rem"} />
            </button>
            <button 
              onClick={clearCanvas} 
              className="transition-all p-2 rounded-lg hover:bg-red-100 text-red-600"
              title="Clear All"
            >
              <MdClear size={"1.3rem"} />
            </button>
            
            <div className="flex items-center gap-2 ml-2">
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 accent-purple-600"
              />
              <span className="text-xs font-medium text-gray-600">Size: {brushSize}</span>
            </div>
          </div>
        </div>
        
        {/* Canvas */}
        <div className="pt-28">
          <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight - 112}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="bg-white shadow-lg rounded-lg"
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                height={window.innerHeight}
                width={window.innerWidth}
                fill="#ffffff"
                id="bg"
                onClick={() => {
                  transformerRef.current.nodes([]);
                }}
              />

              {rectangles.map((rectangle) => (
                <Rect
                  key={rectangle.id}
                  x={rectangle.x}
                  y={rectangle.y}
                  stroke={strokeColor}
                  strokeWidth={2}
                  fill={rectangle.fillColor}
                  height={rectangle.height}
                  width={rectangle.width}
                  draggable={isDraggable}
                  onClick={onClick}
                />
              ))}

              {circles.map((circle) => (
                <Circle
                  key={circle.id}
                  radius={circle.radius}
                  x={circle.x}
                  y={circle.y}
                  stroke={strokeColor}
                  strokeWidth={2}
                  fill={circle.fillColor}
                  draggable={isDraggable}
                  onClick={onClick}
                />
              ))}
              {triangles.map((triangle) => (
                <Line
                  key={triangle.id}
                  points={[
                    triangle.x,
                    triangle.y,
                    triangle.x + triangle.size,
                    triangle.y,
                    triangle.x + triangle.size / 2,
                    triangle.y - triangle.size,
                  ]}
                  closed
                  fill={triangle.fillColor}
                  stroke={strokeColor}
                  strokeWidth={2}
                  draggable={isDraggable}
                  onClick={onClick}
                />
              ))}
              {stars.map((star) => (
                <Star
                  key={star.id}
                  x={star.x}
                  y={star.y}
                  numPoints={star.points}
                  innerRadius={star.innerRadius}
                  outerRadius={star.outerRadius}
                  fill={star.fillColor}
                  stroke={strokeColor}
                  strokeWidth={2}
                  draggable={isDraggable}
                  onClick={onClick}
                />
              ))}
              {arrows.map((arrow) => (
                <Arrow
                  key={arrow.id}
                  points={arrow.points}
                  stroke={strokeColor}
                  strokeWidth={2}
                  fill={arrow.fillColor}
                  draggable={isDraggable}
                  onClick={onClick}
                />
              ))}

              {scribbles.map((scribble) => (
                <Line
                  key={scribble.id}
                  lineCap="round"
                  lineJoin="round"
                  points={scribble.points}
                  stroke={scribble.fillColor}
                  strokeWidth={scribble.brushSize}
                  draggable={isDraggable}
                  onClick={onClick}
                />
              ))}

              <Transformer ref={transformerRef} />
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  );
}

export default Whiteboard;