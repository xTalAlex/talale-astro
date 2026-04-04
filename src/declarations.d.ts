// @fontsource packages are CSS-only and ship no TypeScript declarations.
// TypeScript 6 requires declarations for side-effect imports.
declare module "@fontsource/*";

// simple-parallax-js ships types only for the React module, not the vanilla submodule.
// No @types package exists. This manual declaration is the standard TypeScript solution.
declare module "simple-parallax-js/vanilla" {
  interface SimpleParallaxOptions {
    orientation?:
      | "up"
      | "down"
      | "left"
      | "right"
      | "up left"
      | "up right"
      | "down left"
      | "down right";
    scale?: number;
    overflow?: boolean;
    delay?: number;
    transition?: string;
    customContainer?: string | HTMLElement;
    customWrapper?: string;
    maxTransition?: number | null;
  }
  class SimpleParallax {
    constructor(
      elements:
        | Element
        | Element[]
        | HTMLCollectionOf<Element>
        | NodeListOf<Element>,
      options?: SimpleParallaxOptions,
    );
    destroy(): void;
  }
  export default SimpleParallax;
}
