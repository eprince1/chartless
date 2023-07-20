import * as Chartless from ".";
import { Point } from "./models/point.model";

test("adds 2 points", () => {
  const p1: Point = { x: 1, y: 2 };
  const p2: Point = { x: 3, y: 4 };
  const answer: Point = { x: 4, y: 6 };
  expect(Chartless.add(p1, p2)).toStrictEqual(answer);
});

test("subtracts 2 points", () => {
  const p1: Point = { x: 1, y: 2 };
  const p2: Point = { x: 3, y: 4 };
  const answer: Point = { x: 2, y: 2 };
  expect(Chartless.sub(p2, p1)).toStrictEqual(answer);
});

test("scale a point", () => {
  const p1: Point = { x: 1, y: 2 };
  const s: number = 5;
  const answer: Point = { x: 5, y: 10 };
  expect(Chartless.scale(s, p1)).toStrictEqual(answer);
});

test("creates a document with an svg element", () => {
  const [document, svg] = Chartless.generateDocument();
  expect(document.children.length).toBe(1);
  expect(svg !== null).toBe(true);
});

test("creates an svg element and sets attributes", () => {
  const [document, svg] = Chartless.generateDocument();
  const path = Chartless.createSvgElement(document, "path");
  Chartless.setAttributes(path, [{ key: "id", value: "path" }]);
  svg.appendChild(path);
  expect(svg.children.length).toBe(1);
  expect(!!document.getElementById("path")).toBe(true);
});

test("random number between 2 points", () => {
  const rand = Chartless.getRandomNumber(1, 100);
  expect(rand).toBeGreaterThanOrEqual(1);
  expect(rand).toBeLessThan(100);
});

test("generate hex", () => {
  const rand = Chartless.getRandomHexColor();
  expect(rand.includes("#")).toBe(true);
});

test("generates line", () => {
  const point: Point = { x: 0, y: 0 };
  expect(Chartless.line(point)).toBe("L 0 0");
});

test("generates smooth path", () => {
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 20, y: 20 },
  ];
  const path = Chartless.pathD(points, "smooth");
  expect(path).toBe("M 0 0 C 1.5 1.5, 7 7, 10 10 C 13 13, 18.5 18.5, 20 20");
});

test("generates line path", () => {
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 20, y: 20 },
  ];
  const path = Chartless.pathD(points, "line");
  expect(path).toBe("M 0 0 L 10 10 L 20 20");
});
