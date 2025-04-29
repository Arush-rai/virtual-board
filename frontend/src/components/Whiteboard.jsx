'use client';
import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight, FaStar } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor, GiTriangleTarget } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
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

const Whiteboard = () => {
  const stageRef = useRef();
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#ff0000");
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
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function onClick(e) {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  }

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Controls */}
        <div className="absolute top-0 z-10 w-full py-2 ">
          <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
            <button
              className={
                isErasing
                  ? "bg-red-300 p-1 rounded"
                  : "p-1 hover:bg-red-100 rounded"
              }
              onClick={() => setIsErasing(!isErasing)}
            >
              Eraser
            </button>
            <button
              className={
                action === ACTIONS.SELECT
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.SELECT)}
            >
              <GiArrowCursor size={"2rem"} />
            </button>
            <button
              className={
                action === ACTIONS.RECTANGLE
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.RECTANGLE)}
            >
              <TbRectangle size={"2rem"} />
            </button>
            <button
              className={
                action === ACTIONS.CIRCLE
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.CIRCLE)}
            >
              <FaRegCircle size={"1.5rem"} />
            </button>
            <button
              className={
                action === ACTIONS.TRIANGLE
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.TRIANGLE)}
            >
              <GiTriangleTarget size={"2rem"} />
            </button>
            <button
              className={
                action === ACTIONS.STAR
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.STAR)}
            >
              <FaStar size={"2rem"} />
            </button>
            <button
              className={
                action === ACTIONS.ARROW
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.ARROW)}
            >
              <FaLongArrowAltRight size={"2rem"} />
            </button>
            <button
              className={
                action === ACTIONS.SCRIBBLE
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.SCRIBBLE)}
            >
              <LuPencil size={"1.5rem"} />
            </button>

            <button>
              <input
                className="w-6 h-6"
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
            </button>

            <button onClick={handleExport}>
              <IoMdDownload size={"1.5rem"} />
            </button>

            <button onClick={handleUndo} className="p-1 hover:bg-gray-100 rounded">Undo</button>
            <button onClick={handleRedo} className="p-1 hover:bg-gray-100 rounded">Redo</button>
            <button onClick={clearCanvas} className="p-1 hover:bg-gray-100 rounded">Clear</button>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
            <span>Brush Size: {brushSize}</span>
          </div>
        </div>
        {/* Canvas */}
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
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
    </>
  );
}

export default Whiteboard;