import { Point } from "./models/point.model";
import { JSDOM } from "jsdom";

class Chartless {
  static generateDocument(): [Document, SVGSVGElement] {
    const document = new JSDOM().window.document;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return [document, document.body.appendChild(svg)];
  }

  static createSvgElement(document: Document, namespace: string): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", namespace);
  }

  static setAttributes(
    element: Element,
    attributes: { key: string; value: string }[]
  ): void {
    attributes.forEach((attr) => element.setAttribute(attr.key, attr.value));
  }

  static line(point: Point): string {
    return `L ${point.x} ${point.y}`;
  }

  static smooth(_: Point, i: number, points: Point[]): string {
    const smoothing = 0.15;
    const pStart = points[i - 1];
    const pEnd = points[i];

    const pPrev = points[i - 2] || pStart;
    const pNext = points[i + 1] || pEnd;

    const controlStart = this.add(
      pStart,
      this.scale(smoothing, this.sub(pEnd, pPrev))
    );
    const controlEnd = this.add(
      pEnd,
      this.scale(smoothing, this.sub(pStart, pNext))
    );

    return `C ${controlStart.x} ${controlStart.y}, ${controlEnd.x} ${controlEnd.y}, ${pEnd.x} ${pEnd.y}`;
  }

  static pathD(points: Point[], command: "line" | "smooth"): string {
    return points.reduce(
      (d, point, i, a) =>
        i === 0
          ? `M ${point.x} ${point.y}`
          : `${d} ${
              command === "line" ? this.line(point) : this.smooth(point, i, a)
            }`,
      ""
    );
  }

  static add(pointA: Point, pointB: Point): Point {
    return { x: pointA.x + pointB.x, y: pointA.y + pointB.y };
  }

  static sub(pointA: Point, pointB: Point): Point {
    return { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
  }

  static scale(s: number, point: Point): Point {
    return { x: s * point.x, y: s * point.y };
  }

  static getRandomNumber(min: number, max: number): number {
    const randomDecimal = Math.random();
    const randomNumber = Math.floor(randomDecimal * max) + min;

    return randomNumber;
  }

  static getRandomHexColor(): string {
    const randomNum = Math.floor(Math.random() * 16777216);
    const hexColor = randomNum.toString(16).padStart(6, "0");
    return `#${hexColor}`;
  }
}

export default Chartless;
