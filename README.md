# \<swipeable-element>

This web component explores the possibilities of a swipeable element. Existing code from Paul Lewis[^1][^2] is adapted and implemented with additional options as a Lit Web Component. Project is still a work in progress.

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Key differences
- Uses [view-transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) to animate the deletion of items
- Uses pointer-events to unify different input methods
- Is a web component made with [Lit](https://lit.dev/) and works per element
- Can be configured with attributes, variables and CSS parts

## Accessiblity considerations

A horizontal swipe gesture as used in this component is interpreted by <abbr>WCAG</abbr> (Web Content Accessibility Guidelines):[^3] as a so-called path-based gesture and therefore:

> All functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture, unless a multipoint or path-based gesture is essential.

TODO: name Apps and how they handle this^

## Installation

```bash
npm i swipeable-element
```

## Usage

```html
<script type="module">
  import 'swipeable-element/swipeable-element.js';
</script>

<swipeable-element></swipeable-element>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`


[^1]: [GitHub: GoogleChromeLabs - swipeable-cards](https://github.com/GoogleChromeLabs/ui-element-samples/blob/gh-pages/swipeable-cards/cards.js)  
[^2]: [YouTube: Swipeable Cards: TL;DW - Supercharged](https://www.youtube.com/watch?v=F3A6Skckh9c)  
[^3]: [WCAG: Pointer Gestures (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html)  
[^4]: [Flutter: Dismissible widget](https://docs.flutter.dev/cookbook/gestures/dismissible)
