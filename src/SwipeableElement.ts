import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * TODO:
 * - [] confirm[Start|End]Action: @property({ type: Boolean }) accessor confirmStartAction = false;
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
      --duration: 3.1s;
      --timing-function: ease-in-out;

      display: block;
    }

    :not(:defined) {
      visibility: hidden;
    }

    [part='card-holder'] {
      display: grid;
      grid-template-areas: 'card';

      &:focus-within {
        border: 1px solid red;
      }
    }

    [part='card-bg'] {
      display: grid;
      grid-area: card;
      grid-template-columns: [start] 1fr [end] 1fr;
    }

    [part='card-content'] {
      &.resetting {
        transition: var(--duration) var(--timing-function);
      }

      &.dragging {
        cursor: grabbing;
      }

      background-color: rgb(230, 230, 255);
      cursor: grab;
    }
  `;

  @state()
  accessor targetBCR!: DOMRect;

  @state()
  accessor target: EventTarget | null = null;

  @state()
  accessor startX: number = 0;

  @state()
  accessor currentX: number = 0;

  @state()
  accessor screenX: number = 0;

  @state()
  accessor targetX: number = 0;

  @state()
  accessor elementDragging = false;

  @state()
  accessor elementResetting = false;

  @state()
  accessor opacity: number = 1;

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

  resetTarget() {
    if (!this.target) return;

    (this.target as HTMLElement).style.transform = 'none';
    this.target = null;
  }

  onStart(event: PointerEvent) {
    if (event.button !== 0) return; // everything except main/left button was pressed
    if (this.target) return;

    const { pageX, target } = event;

    const eventTarget = target as HTMLElement;
    this.target = eventTarget;
    this.targetBCR = eventTarget.getBoundingClientRect();

    this.startX = pageX;
    this.currentX = this.startX;

    this.elementResetting = false;
    this.elementDragging = true;

    event.preventDefault();
  }

  onMove = (event: PointerEvent) => {
    this.currentX = event.pageX;

    if (!this.target) {
      return;
    }

    if (this.elementDragging) {
      this.elementResetting = false;
      this.screenX = this.currentX - this.startX;
    }

    this.opacity = calcOpacity(this.screenX, this.targetBCR?.width);

    if (this.elementDragging) {
      return;
    }

    const isNearlyAtStart = Math.abs(this.screenX) < 0.1;
    const isNearlyInvisible = this.opacity < 0.01;

    if (isNearlyInvisible) {
      if (!this.target || !(this.target as Node).parentNode) {
        return;
      }

      this.deleteElement();
    } else if (isNearlyAtStart) {
      this.elementResetting = true;
      this.resetTarget();
    }
  };

  onEnd = () => {
    this.targetX = 0;

    const treshold = calcTreshold(this.targetBCR?.width, this.treshold);

    if (Math.abs(this.screenX) > treshold) {
      this.targetX =
        this.screenX > 0 ? this.targetBCR?.width : -this.targetBCR?.width;

      this.deleteElement();
    } else {
      console.log('we are here');

      this.screenX = 0;

      this.elementResetting = true;
      this.resetTarget();
    }

    this.elementDragging = false;
  };

  render() {
    return html`
      <div part="card-holder">
        <div part="card-bg">
          <slot name="card-bg-action-start" part="card-bg-action-start"></slot>
          <slot name="card-bg-action-end" part="card-bg-action-end"></slot>
        </div>
        <div
          @pointerdown=${this.onStart}
          @touchstart=${(event: TouchEvent) => event.preventDefault()}
          @transitionend=${() => {
            this.elementResetting = false;
          }}
          class=${classMap({
            dragging: this.elementDragging,
            resetting: this.elementResetting,
          })}
          style=${styleMap({
            opacity: this.opacity,
            transform: `translateX(${this.screenX}px)`,
          })}
          part="card-content"
        >
          <span>${this.elementDragging ? '👀' : '🐸'}</span>
          <slot @click="${this.deleteElement}" name="card-delete"></slot>
        </div>
      </div>
    `;
  }
}
