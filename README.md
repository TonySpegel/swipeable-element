# \<swipeable-element>

This web component explores the possibilities of a swipeable element. Existing code from Paul Lewis[^1][^2] is adapted and implemented with additional options as a Lit Web Component. Project is still a work in progress.

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

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


[^1]: [GitHub repository](https://github.com/GoogleChromeLabs/ui-element-samples/blob/gh-pages/swipeable-cards/cards.js)  
[^2]: [YouTube: Swipeable Cards: TL;DW - Supercharged](https://www.youtube.com/watch?v=F3A6Skckh9c)
