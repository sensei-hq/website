declare global {
  namespace App {
    // No server-side locals — static site
  }
}

// @rokkit/states ships JS source; its package `types` points at an unpublished
// dist/, so it resolves untyped here. Shim until rokkit ships declarations.
declare module '@rokkit/states';

// @rokkit/ui's ButtonProps lacks `rel`; `rel="noopener"` is required on
// target="_blank" links. Augment until rokkit adds it upstream.
declare module '@rokkit/ui' {
  interface ButtonProps {
    rel?: string;
  }
}

export {};
