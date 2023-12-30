import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SwipeableElement } from '../src/SwipeableElement.js';
import '../src/swipeable-element.js';

describe('SwipeableElement', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<SwipeableElement>(html`<swipeable-element></swipeable-element>`);

    expect(el.title).to.equal('Hey there');
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<SwipeableElement>(html`<swipeable-element></swipeable-element>`);
    el.shadowRoot!.querySelector('button')!.click();
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<SwipeableElement>(html`<swipeable-element title="attribute title"></swipeable-element>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SwipeableElement>(html`<swipeable-element></swipeable-element>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
