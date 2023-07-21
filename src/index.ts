import { GraphType } from './models/graph.model';
import { DataPoint, Point } from './models/point.model';
import { JSDOM } from 'jsdom';

export default class Chartless {
  document: Document;
  svg: SVGElement;

  constructor() {
    this.document = new JSDOM().window.document;
    this.svg = this.createSvgElement('svg');
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.document.body.appendChild(this.svg);
  }

  createSvgElement(namespace: string): SVGElement {
    return this.document.createElementNS('http://www.w3.org/2000/svg', namespace);
  }

  setAttributes(element: Element, attributes: { key: string; value: string }[]): void {
    attributes.forEach((attr) => element.setAttribute(attr.key, attr.value));
  }

  line(point: Point): string {
    return `L ${point.x} ${point.y}`;
  }

  smooth(_: Point, i: number, points: Point[]): string {
    const smoothing = 0.15;
    const pStart = points[i - 1];
    const pEnd = points[i];

    const pPrev = points[i - 2] || pStart;
    const pNext = points[i + 1] || pEnd;

    const controlStart = this.add(pStart, this.scale(smoothing, this.sub(pEnd, pPrev)));
    const controlEnd = this.add(pEnd, this.scale(smoothing, this.sub(pStart, pNext)));

    return `C ${controlStart.x} ${controlStart.y}, ${controlEnd.x} ${controlEnd.y}, ${pEnd.x} ${pEnd.y}`;
  }

  pathD(points: Point[], command: 'line' | 'smooth'): string {
    return points.reduce(
      (d, point, i, a) =>
        i === 0
          ? `M ${point.x} ${point.y}`
          : `${d} ${command === 'line' ? this.line(point) : this.smooth(point, i, a)}`,
      '',
    );
  }

  continuePathD(points: Point[], command: 'line' | 'smooth'): string {
    return points.reduce(
      (d, point, i, a) =>
        i === 0 ? `` : `${d} ${command === 'line' ? this.line(point) : this.smooth(point, i, a)}`,
      '',
    );
  }

  add(pointA: Point, pointB: Point): Point {
    return { x: pointA.x + pointB.x, y: pointA.y + pointB.y };
  }

  sub(pointA: Point, pointB: Point): Point {
    return { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
  }

  scale(s: number, point: Point): Point {
    return { x: s * point.x, y: s * point.y };
  }

  midpoint(pointA: Point, pointB: Point): Point {
    return { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 };
  }

  static getRandomNumber(min: number, max: number): number {
    const randomDecimal = Math.random();
    const randomNumber = Math.floor(randomDecimal * max) + min;

    return randomNumber;
  }

  static getRandomHexColor(): string {
    const randomNum = Math.floor(Math.random() * 16777216);
    const hexColor = randomNum.toString(16).padStart(6, '0');
    return `#${hexColor}`;
  }

  appendToNode(namespace: string, node: SVGElement = this.svg): SVGElement {
    const svgElement = this.createSvgElement(namespace);
    return node.appendChild(svgElement);
  }

  createBarGraph({
    data,
    rounding = 0,
    width = 800,
  }: {
    data: DataPoint[];
    rounding?: number;
    width?: number;
  }): void {
    const g = this.appendToNode('g');
    const maxH = Math.ceil(Math.max(...data.map((d) => d.value)) / 100) * 100;
    const scale = 500;
    const barWidth = width / data.length;
    const gutter = barWidth * 0.2;

    const color = Chartless.getRandomHexColor();

    data.forEach((dp, i) => {
      const value = ((maxH - dp.value) / maxH) * scale;
      const line = this.appendToNode('path', g);
      const basePoint: Point = { y: scale, x: i * barWidth + gutter };
      const topLeftPoint: Point = {
        y: Math.min(value + rounding, scale),
        x: i * barWidth + gutter,
      };
      const topRightPoint: Point = {
        y: Math.min(value + rounding, scale),
        x: i * barWidth + barWidth - gutter,
      };
      const endPoint: Point = { y: scale, x: i * barWidth + barWidth - gutter };
      let path = this.pathD([basePoint, topLeftPoint], 'line');
      const tlA = this.add(topLeftPoint, { x: rounding, y: -rounding });
      const trA = this.add(topRightPoint, { x: -rounding, y: -rounding });
      path += ` A ${rounding} ${rounding} 0 0 1 ${tlA.x} ${tlA.y}`;
      path += this.continuePathD([tlA, trA], 'line');
      path += ` A ${rounding} ${rounding} 0 0 1 ${topRightPoint.x} ${topRightPoint.y}`;
      path += this.continuePathD([topRightPoint, endPoint, basePoint], 'line');

      line.setAttribute('d', path);
      line.setAttribute('fill', color);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '1');
    });
  }

  svgHTML(): string {
    return this.svg.outerHTML;
  }
}
