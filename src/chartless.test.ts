import Chartless from '.';
import { DataPoint, Point } from './models/point.model';

test('adds 2 points', () => {
  const chartless = new Chartless();
  const p1: Point = { x: 1, y: 2 };
  const p2: Point = { x: 3, y: 4 };
  const answer: Point = { x: 4, y: 6 };
  expect(chartless.add(p1, p2)).toStrictEqual(answer);
});

test('subtracts 2 points', () => {
  const chartless = new Chartless();
  const p1: Point = { x: 1, y: 2 };
  const p2: Point = { x: 3, y: 4 };
  const answer: Point = { x: 2, y: 2 };
  expect(chartless.sub(p2, p1)).toStrictEqual(answer);
});

test('scale a point', () => {
  const chartless = new Chartless();
  const p1: Point = { x: 1, y: 2 };
  const s: number = 5;
  const answer: Point = { x: 5, y: 10 };
  expect(chartless.scale(s, p1)).toStrictEqual(answer);
});

test('midpoint of 2 points', () => {
  const chartless = new Chartless();
  const p1: Point = { x: 2, y: 4 };
  const p2: Point = { x: 4, y: 8 };
  const answer: Point = { x: 3, y: 6 };
  expect(chartless.midpoint(p1, p2)).toStrictEqual(answer);
});

test('creates a document with an svg element', () => {
  const chartless = new Chartless();
  expect(chartless.document.children.length).toBe(1);
  expect(chartless.svg !== null).toBe(true);
});

test('creates an svg element and sets attributes', () => {
  const chartless = new Chartless();
  const path = chartless.createSvgElement('path');
  chartless.setAttributes(path, [{ key: 'id', value: 'path' }]);
  chartless.svg.appendChild(path);
  expect(chartless.svg.children.length).toBe(1);
  expect(!!chartless.document.getElementById('path')).toBe(true);
});

test('random number between 2 points', () => {
  const rand = Chartless.getRandomNumber(1, 100);
  expect(rand).toBeGreaterThanOrEqual(1);
  expect(rand).toBeLessThan(100);
});

test('generate hex', () => {
  const rand = Chartless.getRandomHexColor();
  expect(rand.includes('#')).toBe(true);
});

test('generates line', () => {
  const chartless = new Chartless();
  const point: Point = { x: 0, y: 0 };
  expect(chartless.line(point)).toBe('L 0 0');
});

test('generates smooth path', () => {
  const chartless = new Chartless();
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 20, y: 20 },
  ];
  const path = chartless.pathD(points, 'smooth');
  expect(path).toBe('M 0 0 C 1.5 1.5, 7 7, 10 10 C 13 13, 18.5 18.5, 20 20');
});

test('continues a path', () => {
  const chartless = new Chartless();
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 20, y: 20 },
  ];
  let path = chartless.pathD([points[0], points[1]], 'line');
  path += chartless.continuePathD([points[1], points[2]], 'line');
  expect(path).toBe('M 0 0 L 10 10 L 20 20');
});

test('generates line path', () => {
  const chartless = new Chartless();
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 20, y: 20 },
  ];
  const path = chartless.pathD(points, 'line');
  expect(path).toBe('M 0 0 L 10 10 L 20 20');
});

test('generates a bar graph', () => {
  const chartless = new Chartless();
  const data: DataPoint[] = [
    { label: 0, value: 0 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];
  chartless.createBarGraph({ data });
  const svg = chartless.svgHTML();
  expect(typeof svg).toBe('string');
});
