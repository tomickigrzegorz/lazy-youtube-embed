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

interface LooseObject {
  [key: string]: any;
}

interface lightboxObject {
  id: string;
  maxWidth?: number;
}
