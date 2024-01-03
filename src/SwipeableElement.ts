import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * TODO:
 * - [] confirm[Start|End]Action: @property({ type: Boolean }) accessor confirmStartAction = false;
 * - [] button can't be clicked on touch because of preventDefault
 */

const calcTreshold = (targetWidth: number, treshold: number) => {
  return targetWidth * treshold;
};

const calcOpacity = (screenX: number, elementWidth: number) => {
  const normalizedDragDistance = Math.abs(screenX) / elementWidth;

  return 1 - normalizedDragDistance ** 3;
};

export class SwipeableElement extends LitElement {
  static styles = css`
    :host {
      --base-gap: 1rem;
      --base-radius: 0.6rem;

      --duration: 3.1s;
      --timing-function: ease-in-out;

      display: block;
    }

    :not(:defined) {
      visibility: hidden;
    }

    [part='element-wrapper'] {
      display: grid;
      grid-template-areas: 'card';
      direction: ltr;

      &:focus-within {
        border: 1px solid red;
      }
    }

    [part='action-indicator'] {
      display: grid;
      grid-area: card;
      grid-template-columns: [start] 1fr [end] 1fr;
    }

    [part='content'] {
      &.resetting {
        transition-duration: var(--duration);
        transition-property: 'transition';
        transition-timing-function: var(--timing-function);
      }

      &.dragging {
        cursor: grabbing;
      }

      background-color: rgb(230, 230, 255);
      cursor: grab;
    }
  `;

  targetBCR!: DOMRect;
  target: EventTarget | null = null;
  targetX: number = 0;
  startX: number = 0;
  currentX: number = 0;

  @state()
  accessor #elementDragging = false;

  @state()
  accessor #elementResetting = false;

  @state()
  accessor #screenX: number = 0;

  @state()
  accessor #opacity: number = 1;

  @property({ type: Number })
  accessor treshold = 0.35;

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

    this.#elementResetting = true;
    this.#opacity = 1;
    this.#screenX = 0;
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

    this.#elementDragging = true;

    event.preventDefault(); // TODO problems w/ touch
  }

  onMove = (event: PointerEvent) => {
    this.currentX = event.pageX;

    if (!this.target) {
      return;
    }

    if (this.#elementDragging) {
      this.#elementResetting = false;
      this.#screenX = this.currentX - this.startX;
    }

    this.#opacity = calcOpacity(this.#screenX, this.targetBCR?.width);

    if (this.#elementDragging) {
      return;
    }

    const isNearlyAtStart = Math.abs(this.#screenX) < 0.1;
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

    if (Math.abs(this.#screenX) > treshold) {
      this.targetX =
        this.#screenX > 0 ? this.targetBCR?.width : -this.targetBCR?.width;

      this.deleteElement();
    } else {
      this.resetElement();
    }

    this.#elementDragging = false;
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
            this.#elementResetting = false;
          }}
          class=${classMap({
            dragging: this.#elementDragging,
            resetting: this.#elementResetting,
          })}
          style=${styleMap({
            opacity: this.#opacity,
            transform: `translateX(${this.#screenX}px)`,
          })}
          part="content"
        >
          <span>${this.#elementDragging ? '👀' : '🐸'}</span>
          <slot @click="${this.deleteElement}" name="card-delete"></slot>
        </div>
      </div>
    `;
  }
}
