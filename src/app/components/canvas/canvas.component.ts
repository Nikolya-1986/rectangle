import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { filter, fromEvent, map, Observable, switchMap, takeUntil, tap } from 'rxjs';

import { 
  isLeftBottomPointTouched, 
  isLeftTopPointTouched, 
  isRightBottomPointTouched, 
  isRightTopPointTouched,
  calculatePerimeter 
} from '../../untils';
import { TouchedPoint } from '../../constants/touched-point';
import { Rectangle } from '../../intefaces/rectangle';
import { RectangleService } from '../../services/rectangle.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @ViewChild('canvas', { static: true }) public canvasRef!: ElementRef<SVGElement>;
  public rectangle!: Rectangle;
  public perimeter!: number;

  private lastValues = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  private delta = 3; // px
  private handlers: {
    [key: number]: (event: MouseEvent) => Rectangle
  } = {
    [TouchedPoint.LEFT_TOP]: this.leftTopPointMoveHandler.bind(this),
    [TouchedPoint.LEFT_BOTTOM]: this.leftBottomPointMoveHandler.bind(this),
    [TouchedPoint.RIGHT_BOTTOM]: this.rightBottomPointMoveHandler.bind(this),
    [TouchedPoint.RIGHT_TOP]: this.rightTopPointMoveHandler.bind(this),
  };

  constructor(
    private rectangleService: RectangleService,
  ) { }

  public ngOnInit(): void {
    this.getRectangle();
    const canvas = this.canvasRef.nativeElement;
    this.initializeMousedownListener(canvas);
  };

  private getRectangle() {
    this.rectangleService.getRectangle()
    .subscribe((result: Rectangle) => {
      this.rectangle = result;
    })
  };

  private initializeMousedownListener(canvas: SVGElement): void {
    fromEvent<MouseEvent>(this.canvasRef.nativeElement, 'mousedown')
    .pipe(
      map((event) => this.getTouchedPoint(event)),
      filter((point) => point !== TouchedPoint.NO_TOUCHED),
      tap(() => (this.lastValues = { ...this.rectangle })),
      switchMap((point) => this.mouseMoveHandler(canvas, point))
    )
    .subscribe();
  };

  private mouseMoveHandler(
    canvas: SVGElement,
    point: TouchedPoint
  ): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(canvas, 'mousemove').pipe(
      tap((event) => {
          const result = this.handlers[point](event);
          if(result.width > 10 && result.height > 10){
            this.rectangle = result;
          }
          this.getPerimeter(this.rectangle);
          this.rectangleService.saveRectangle(this.rectangle);
      }),
      takeUntil(fromEvent(document, 'mouseup')),
    );
  };
  
  private leftTopPointMoveHandler({ offsetX, offsetY }: MouseEvent): Rectangle {
    const rectangle: Rectangle =  {
      x: offsetX,
      y: offsetY,
      width: this.lastValues.width + this.lastValues.x - offsetX,
      height: this.lastValues.height + this.lastValues.y - offsetY,
    };
    return rectangle;
  };

  private rightTopPointMoveHandler({ offsetX, offsetY }: MouseEvent): Rectangle {
    const rectangle: Rectangle = {
      x: this.rectangle.x,
      y: offsetY,
      width: offsetX - this.lastValues.x,
      height: this.lastValues.height + this.lastValues.y - offsetY,
    };
    return rectangle;
  };

  private rightBottomPointMoveHandler({ offsetX, offsetY }: MouseEvent): Rectangle {
    const rectangle: Rectangle = { 
      ...this.rectangle,
      width: offsetX - this.lastValues.x,
      height: offsetY - this.lastValues.y,
    }
    return rectangle;
  };

  private leftBottomPointMoveHandler({ offsetX, offsetY }: MouseEvent): Rectangle {
    const rectangle: Rectangle = { 
      x: offsetX,
      y: this.rectangle.y,
      width: this.lastValues.width + this.lastValues.x - offsetX,
      height: offsetY - this.lastValues.y,
    }
    return rectangle;
  };

  private getTouchedPoint(event: MouseEvent): TouchedPoint {
    if (isLeftBottomPointTouched(this.rectangle, event, this.delta)) {
      return TouchedPoint.LEFT_BOTTOM;
    };
    if (isLeftTopPointTouched(this.rectangle, event, this.delta)) {
      return TouchedPoint.LEFT_TOP;
    };
    if (isRightBottomPointTouched(this.rectangle, event, this.delta)) {
      return TouchedPoint.RIGHT_BOTTOM;
    };
    if (isRightTopPointTouched(this.rectangle, event, this.delta)) {
      return TouchedPoint.RIGHT_TOP;
    };
    return TouchedPoint.NO_TOUCHED;
  };

  private getPerimeter({ width, height }: Rectangle): number {
    return this.perimeter = calculatePerimeter(width, height);
  };

}
