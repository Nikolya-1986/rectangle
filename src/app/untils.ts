import { Rectangle } from "./intefaces/rectangle";

export function isLeftTopPointTouched(
  rectangle: Rectangle,
  { offsetX, offsetY }: MouseEvent,
  delta: number
): boolean {
  const { x, y } = rectangle;
  return (
    offsetX <= x + delta &&
    offsetX >= x - delta &&
    offsetY <= y + delta &&
    offsetY >= y - delta
  );
};

export function isRightTopPointTouched(
  rectangle: Rectangle,
  { offsetX, offsetY }: MouseEvent,
  delta: number
): boolean {
  const { x, y, width } = rectangle;
  return (
    offsetX <= x + width + delta &&
    offsetX >= x + width - delta &&
    offsetY <= y + delta &&
    offsetY >= y - delta
  );
};

export function isRightBottomPointTouched(
  rectangle: Rectangle,
  { offsetX, offsetY }: MouseEvent,
  delta: number
): boolean {
  const { x, y, width, height } = rectangle;
  return (
    offsetX <= x + width + delta &&
    offsetX >= x + width - delta &&
    offsetY <= y + height + delta &&
    offsetY >= y + height - delta
  );
};

export function isLeftBottomPointTouched(
  rectangle: Rectangle,
  { offsetX, offsetY }: MouseEvent,
  delta: number
): boolean {
  const { x, y, height } = rectangle;
  return (
    offsetX <= x + delta &&
    offsetX >= x - delta &&
    offsetY <= y + height + delta &&
    offsetY >= y + height - delta
  );
};

export function calculatePerimeter(width: number, height: number): number {
  return 2 * Math.abs(width + height);
}
