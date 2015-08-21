# rework-stripe-conformance

A [Rework](https://github.com/reworkcss/rework) plugin to check the conformance
of a component's CSS to the [SUIT CSS](https://github.com/suitcss/suit) methodology, with some modifications.


## Installation

```
npm install rework-stripe-conformance
```

## Usage

See [rework-suit-conformance](https://github.com/suitcss/rework-suit-conformance).

## Differences

* Always use "strict mode".
* Allow `%` selectors that *begin* with a class matching the defined
  `ComponentName`.

## Rules

### `:root`-specific

- Use hex values (`rgba(#fff, 0)`) instead of RGB values in RGB/HSL(A) (`rgba(255, 255, 255, 0)`).
