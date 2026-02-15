export interface Entity {
  name: string;
  domain?: string;
  url: string;
  category: string;
  type: 'company' | 'person' | 'platform' | 'project';
  x?: string;
  github?: string;
  /** Custom icon URL or local path (e.g. "/entities/my-company.webp" or "https://cdn.example.com/icon.png") */
  icon?: string;
}

/** Custom function to resolve icon URL for an entity. Return a string to override, or null to fallback to default. */
export type IconResolver = (slug: string, entity?: Entity) => string | null;

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
  /** Custom icon resolver function. Takes priority over entity.icon and Google Favicon API. */
  iconResolver?: IconResolver;
}
