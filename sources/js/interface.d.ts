interface WatchInParams {
  index: number;
  link: string;
  template: (template: string) => void;
}

interface ConstructorObject {
  background?: string;
  maxWidth?: number;
  overflow?: boolean;
  local?: boolean;
  picture?: boolean;
  createWatchIn?: (params: WatchInParams) => void;
  onResize?: () => boolean | undefined;
}

interface ConfigObject {
  media: string;
  srcset: string;
}

interface AttrMap {
  [key: string]: string;
}

interface LightboxObject {
  id: string;
  maxWidth?: number;
  title?: string;
}

interface IframeAttrs extends AttrMap {
  frameborder: string;
  allowfullscreen: string;
  allow: string;
  src: string;
  title: string;
}
