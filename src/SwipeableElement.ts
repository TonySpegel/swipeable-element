import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

const calcTreshold = (targetWidth: number, treshold: number) =>
  targetWidth * treshold;

const calcOpacity = (screenX: number, elementWidth: number) => {
  const normalizedDragDistance = Math.abs(screenX) / elementWidth;

  return 1 - normalizedDragDistance ** 3;
};

type SwipeDirection = 'all' | 'left' | 'right';

/**
 * @summary An experimental web component which can be horizontally swiped to trigger actions
 *
 * @slot (default) - The content of the component
 * @slot action-indicator-left -  The component’s indicator for a left swipe, usually text or an icon
 * @slot action-indicator-right - The component’s indicator for a right swipe, usually text or an icon
 *
 * @attribute allowDirection - Sets a direction that can be swiped: all, left, right
 * @attribute treshold - Used to determine how far the element has been dragged
 * @attribute dragging - Present when content is dragged
 * @attribute resetting - Present while content's transition is playing
 *
 * @cssproperty --duration - Length of time that the animation takes to complete
 * @cssproperty --timing-function - How the swipeable element animation progresses
 * @cssproperty --action-indicator-bg-color - Background color for the action indicator wrapper
 * @cssproperty --content-bg-color - How the swipeable element animation progresses
 *
 * @csspart element-wrapper - The component’s wrapper element
 * @csspart action-indicator - Provides a "leave behind" indicator
 * @csspart action-indicator-left - What happens if you swipe left
 * @csspart action-indicator-right - What happens if you swipe right
 * @csspart content - The swipeable part of the component
 *
 * Copyright © 2024 Tony Spegel
 */
export class SwipeableElement extends LitElement {
  static styles = css`
    :host {
      --duration: 0.3s;
      --timing-function: ease-in-out;

      --action-indicator-bg-color: #e3f2fd;
      --content-bg-color: #e6e6ff;

      display: block;
    }

    :not(:defined) {
      visibility: hidden;
    }

    [part='element-wrapper'] {
      display: grid;
      grid-template-areas: 'stack';
      direction: ltr;
    }

    [part='action-indicator'] {
      display: grid;
      grid-area: stack;
      grid-template-columns: [indicator-left] 1fr [indicator-right] 1fr;
      align-items: center;

      background-color: var(--action-indicator-bg-color);
    }

    [part='content'] {
      grid-area: stack;
      justify-content: center;

      &.resetting {
        transition-duration: var(--duration);
        transition-property: 'transition';
        transition-timing-function: var(--timing-function);
      }

      &.dragging {
        cursor: grabbing;
      }

      background-color: var(--content-bg-color);
      cursor: grab;
    }
  `;

  targetBCR!: DOMRect;
  target: EventTarget | null = null;
  targetX: number = 0;
  startX: number = 0;
  currentX: number = 0;

  @property({ type: Boolean, reflect: true })
  accessor dragging = false;

  @property({ type: Boolean, reflect: true })
  accessor resetting = false;

  @property({ type: String })
  accessor allowDirection: SwipeDirection = 'all';

  @property({ type: Number })
  accessor treshold = 0.35;

  @state()
  accessor #elementPosition: number = 0;

  @state()
  accessor #opacity: number = 1;

  connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onEnd);
    window.addEventListener('pointercancel', this.onEnd);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onEnd);
    window.removeEventListener('pointercancel', this.onEnd);
  }

  deleteElement() {
    if (document.startViewTransition) {
      document.startViewTransition(() => this.remove());
    }
  }

  resetElement() {
    if (!this.target) return;

    (this.target as HTMLElement).style.willChange = 'initial';
    (this.target as HTMLElement).style.transform = 'none';
    this.target = null;

    this.resetting = true;
    this.#opacity = 1;
    this.#elementPosition = 0;
  }

  onStart(event: PointerEvent) {
    if (event.button !== 0) return; // everything except main/left button was pressed
    if (this.target) return;

    const { pageX, target } = event;
    const eventTarget = target as HTMLElement;

    if (eventTarget.getAttribute('part') !== 'content') return;

    this.target = eventTarget;
    this.targetBCR = eventTarget.getBoundingClientRect();

    this.startX = pageX;
    this.currentX = this.startX;

    this.dragging = true;

    event.preventDefault(); // TODO problems w/ touch
  }

  calcElementPosition(current: number, start: number): number {
    const dir = this.allowDirection;
    const position = current - start;

    if (dir === 'left' && current > start) return 0;
    if (dir === 'right' && current < start) return 0;

    // dir = 'all'
    return position;
  }

  onMove = (event: PointerEvent) => {
    this.currentX = event.pageX;

    if (!this.target) {
      return;
    }

    if (this.dragging) {
      this.resetting = false;
      this.#elementPosition =
        this.calcElementPosition(this.currentX, this.startX) || 0;
    }

    this.#opacity = calcOpacity(this.#elementPosition, this.targetBCR?.width);

    if (this.dragging) {
      return;
    }

    const isNearlyAtStart = Math.abs(this.#elementPosition) < 0.1;
    const isNearlyInvisible = this.#opacity < 0.01;

    if (isNearlyInvisible) {
      if (!this.target || !(this.target as Node).parentNode) {
        return;
      }

      this.deleteElement();
    } else if (isNearlyAtStart) {
      this.resetElement();
    }
  };

  onEnd = () => {
    this.targetX = 0;

    const treshold = calcTreshold(this.targetBCR?.width, this.treshold);

    if (Math.abs(this.#elementPosition) > treshold) {
      this.targetX =
        this.#elementPosition > 0
          ? this.targetBCR?.width
          : -this.targetBCR?.width;

      this.deleteElement();
    } else {
      this.resetElement();
    }

    this.dragging = false;
  };

  render() {
    return html`
      <div part="element-wrapper">
        <div part="action-indicator">
          <slot
            name="action-indicator-left"
            part="action-indicator-left"
          ></slot>
          <slot
            name="action-indicator-right"
            part="action-indicator-right"
          ></slot>
        </div>
        <div
          @pointerdown=${this.onStart}
          @touchstart=${(event: TouchEvent) => event.preventDefault()}
          @transitionend=${() => {
            this.resetElement();
            this.resetting = false;
          }}
          class=${classMap({
            dragging: this.dragging,
            resetting: this.resetting,
          })}
          style=${styleMap({
            opacity: this.#opacity,
            transform: `translateX(${this.#elementPosition}px)`,
          })}
          part="content"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}
