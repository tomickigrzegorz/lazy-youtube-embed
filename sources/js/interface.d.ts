interface ConstructorObject {
  background?: string;
  maxWidth?: number;
  overflow?: boolean;
  local?: boolean;
  picture?: boolean;
  createWatchIn?: () => void;
  onResize?: () => void;
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
  maxWidth: string;
}
