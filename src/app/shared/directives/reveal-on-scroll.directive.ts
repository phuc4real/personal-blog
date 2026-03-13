import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, inject, input, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appRevealOnScroll]',
  host: {
    class: 'reveal-on-scroll',
    '[class.is-visible]': 'isVisible()',
    '[style.--reveal-delay]': 'delayValue()',
    '[style.--reveal-distance]': 'distanceValue()'
  }
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  readonly revealDelay = input(0, { alias: 'revealDelay' });
  readonly revealDistance = input('18px', { alias: 'revealDistance' });
  readonly isVisible = signal(!isPlatformBrowser(this.platformId));

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.isVisible.set(true);
          this.observer?.disconnect();
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  delayValue(): string {
    return `${this.revealDelay()}ms`;
  }

  distanceValue(): string {
    return this.revealDistance();
  }
}