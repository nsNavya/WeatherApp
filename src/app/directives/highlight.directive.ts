import { Directive, ElementRef, HostListener } from '@angular/core';
import { Colors } from '../Utils/Colors';

@Directive({
  selector: '[appHighlight]'
})

export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(Colors.GeneralColors.Text_HighLight);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.color = color;
  }
}
