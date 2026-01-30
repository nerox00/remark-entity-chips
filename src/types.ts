export interface Entity {
  name: string;
  domain?: string;
  url: string;
  category: string;
  type: 'company' | 'person' | 'platform' | 'project';
  twitter?: string;
  github?: string;
}

export interface EntityChipsOptions {
  cdnUrl?: string;
  classNames?: {
    chip?: string;
    favicon?: string;
    name?: string;
  };
}
