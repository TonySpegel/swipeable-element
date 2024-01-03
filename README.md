# \<swipeable-element>

This web component explores the possibilities of a swipeable element. Existing code from Paul Lewis[^1][^2] is adapted and implemented with additional options as a Lit Web Component.  
It is primarily there to demonstrate interaction through swiping and is not necessarily intended to be used in production. Please make sure to use the right [patterns](#ux--accessiblity-considerations) to make a component like this as accessible as possible.


This web component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Key differences

A few notable differences compared to Paul Lewis' solution:

- Uses [view-transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) to animate the deletion of items
- Uses pointer-events to unify different input methods
- Is a web component made with [Lit](https://lit.dev/)
- An update method or `requestAnimationFrame` isn't needed as Lit handles that
- Can be configured with [slots](#slots), [CSS variables](#css-custom-properties-variables), [classes](#css-classes) and [CSS parts](#css-parts)
- Has a "leave behind" indicator for each direction

## UX & accessiblity considerations

A horizontal swipe gesture as used in this component is interpreted by the <abbr>WCAG</abbr> (Web Content Accessibility Guidelines):[^3] as a so-called path-based gesture and therefore:

> All functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture, unless a multipoint or path-based gesture is essential.

For example, Outlook, GMail and Discord all offer alternatives in the form of a context menu that can be activated by a long press or in the form of a submenu/detail view. It is also common to offer an indicator which makes it clear which action is hidden behind a swipe direction.

## Usage

```html
<swipeable-element style="view-transition-name: c1">
  <span slot="action-indicator-left">Swipe to set up actions</span>
  <span slot="action-indicator-right" class="material-symbols-outlined">mail</span>
  <button slot="card-delete">Del</button>
</swipeable-element>
```

### Slots

| Name                   | Description                                                         |
|------------------------|---------------------------------------------------------------------|
|`action-indicator-left` | The component’s indicator for a left swipe, usually text or an icon |
|`action-indicator-right`| The component’s indicator for a right swipe, usually text or an icon|

### CSS custom properties (variables)
The following variables can be set to adjust the behaviour of the swipeable part of the component.

| Name                        | Description                                        | Default     |
|-----------------------------|----------------------------------------------------|-------------|
|`--duration`                 | Length of time that the animation takes to complete|`0.3s`       |
|`--timing-function`          | How the swipeable element animation progresses     |`ease-in-out`|
|`--action-indicator-bg-color`| Background color for the action indicator wrapper  |`ease-in-out`|
|`--action-indicator-bg-color`| How the swipeable element animation progresses     |`ease-in-out`|

### CSS parts
| Name                   | Description                         |
|------------------------|-------------------------------------|
|`element-wrapper`       | The component’s wrapper element     |
|`action-indicator`      | Provides a "leave behind" indicator |
|`action-indicator-left` | What happens if you swipe left      |
|`action-indicator-right`| What happens if you swipe right     |
|`content`               | The swipeable part of the component |

Example usage:
```css
swipeable-element::part(content) {
  /* Bouncy animation */ 
  --timing-function: cubic-bezier(0, 1.5, 1, 1.5);
}
```

### CSS classes

| Name      | Description                                    |
|-----------|------------------------------------------------|
|`dragging` | Present when `content` is dragged              |
|`resetting`| Present while `content`'s transition is playing|

Example usage:
```css
swipeable-element::part(content) {
  &.dragging {
    cursor: grabbing;
  }
}
```

## Project related commands

### Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

### Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```


### Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

### Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`


[^1]: [GitHub: GoogleChromeLabs - swipeable-cards](https://github.com/GoogleChromeLabs/ui-element-samples/blob/gh-pages/swipeable-cards/cards.js)  
[^2]: [YouTube: Swipeable Cards: TL;DW - Supercharged](https://www.youtube.com/watch?v=F3A6Skckh9c)  
[^3]: [WCAG: Pointer Gestures (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html)  
[^4]: [Flutter: Dismissible widget](https://docs.flutter.dev/cookbook/gestures/dismissible)  
[^5]: [Draggable objects from Red Blob Games](https://www.redblobgames.com/making-of/draggable/)
