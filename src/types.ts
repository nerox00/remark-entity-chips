export interface Entity {
  name: string;
  domain?: string;
  url: string;
  category: string;
  type: 'company' | 'person' | 'platform' | 'project';
  x?: string;
  github?: string;
}

export interface EntityChipsOptions {
  /** Transform bare URLs into chips (default: true) */
  autoDetectUrls?: boolean;
  /** Transform markdown links [text](url) into chips (default: false) */
  transformMarkdownLinks?: boolean;
  classNames?: {
    chip?: string;
    favicon?: string;
    name?: string;
  };
}
