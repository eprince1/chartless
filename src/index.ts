import { Point } from './models/point.model';
import { JSDOM } from 'jsdom';

export function generateDocument(): [Document, SVGSVGElement] {
  const document = new JSDOM().window.document;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return [document, document.body.appendChild(svg)];
}

export function createSvgElement(document: Document, namespace: string): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', namespace);
}

export function setAttributes(
  element: Element,
  attributes: { key: string; value: string }[],
): void {
  attributes.forEach((attr) => element.setAttribute(attr.key, attr.value));
}

export function line(point: Point): string {
  return `L ${point.x} ${point.y}`;
}

export function smooth(_: Point, i: number, points: Point[]): string {
  const smoothing = 0.15;
  const pStart = points[i - 1];
  const pEnd = points[i];

  const pPrev = points[i - 2] || pStart;
  const pNext = points[i + 1] || pEnd;

  const controlStart = add(pStart, scale(smoothing, sub(pEnd, pPrev)));
  const controlEnd = add(pEnd, scale(smoothing, sub(pStart, pNext)));

  return `C ${controlStart.x} ${controlStart.y}, ${controlEnd.x} ${controlEnd.y}, ${pEnd.x} ${pEnd.y}`;
}

export function pathD(points: Point[], command: 'line' | 'smooth'): string {
  return points.reduce(
    (d, point, i, a) =>
      i === 0
        ? `M ${point.x} ${point.y}`
        : `${d} ${command === 'line' ? line(point) : smooth(point, i, a)}`,
    '',
  );
}

export function add(pointA: Point, pointB: Point): Point {
  return { x: pointA.x + pointB.x, y: pointA.y + pointB.y };
}

export function sub(pointA: Point, pointB: Point): Point {
  return { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
}

export function scale(s: number, point: Point): Point {
  return { x: s * point.x, y: s * point.y };
}

export function getRandomNumber(min: number, max: number): number {
  const randomDecimal = Math.random();
  const randomNumber = Math.floor(randomDecimal * max) + min;

  return randomNumber;
}

export function getRandomHexColor(): string {
  const randomNum = Math.floor(Math.random() * 16777216);
  const hexColor = randomNum.toString(16).padStart(6, '0');
  return `#${hexColor}`;
}
