import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  OnDestroy,
  Directive
} from "@angular/core";

import { SkyhookDndService } from "@angular-skyhook/core";

interface Card {
  id: number;
  text: string;
  height: number;
}

interface DraggingCard {
  id: number;
  index: number;
}

@Directive({
  selector: "[cardInner]"
})

export class CardInnerDirective { }


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CardComponent implements OnDestroy {
  @Output() beginDrag: EventEmitter<void> = new EventEmitter<void>();
  @Output() endDrag: EventEmitter<boolean> = new EventEmitter();
  @Output() onMove: EventEmitter<[number, number]> = new EventEmitter();

  @ContentChild(CardInnerDirective, { read: TemplateRef }) cardInnerTemplate;

  @Input() card: Card;

  @Input() index: number;
  @Input() id: number;
  @Input() text: string;
  @Input() height: number;

  cardSource = this.dnd.dragSource<DraggingCard>("CARD", {
    beginDrag: () => {
      this.beginDrag.emit();
      return {
        id: this.id,
        index: this.index
      };
    },
    endDrag: monitor => {
      const didDrop = monitor.didDrop();
      this.endDrag.emit(didDrop);
    }
  });

  cardTarget = this.dnd.dropTarget<DraggingCard>("CARD", {
    hover: monitor => {
      const dragIndex = monitor.getItem().index;
      const hoverIndex = this.index;

      console.log("IN dropTarget");
      console.log(this.elRef);

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = this.elRef.nativeElement.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      console.log("moving card");
      console.log("drag: ", dragIndex, " hover: ", hoverIndex);

      // Time to actually perform the action
      this.onMove.emit([dragIndex, hoverIndex]);
      console.log(monitor.getItem());

      // Note: we're mutating the item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    }
  });

  isDragging$ = this.cardSource.listen(m => m.isDragging());

  opacity$ = this.cardSource.listen(
    monitor => (monitor.isDragging() ? 0.2 : 1)
  );

  constructor(
    private elRef: ElementRef,
    private dnd: SkyhookDndService
  ) { }

  moveCard(a, b) {
    this.onMove.emit([a, b]);
  }

  ngOnDestroy() {
    this.cardSource.unsubscribe();
    this.cardTarget.unsubscribe();
  }
}