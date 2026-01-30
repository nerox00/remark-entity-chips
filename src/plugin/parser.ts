import { getEntity } from '../utils/entity-lookup.js';
import type { Entity } from '../types.js';

export interface ParsedMention {
  slug: string;
  entity: Entity | undefined;
  displayName: string;
  url: string | undefined;
  fullMatch: string;
  index: number;
}

const entityPattern = /@\[([^\]]+)\](?:\(([^)]+)\))?/g;

export function parseMentions(text: string): ParsedMention[] {
  const mentions: ParsedMention[] = [];
  let match: RegExpExecArray | null;

  while ((match = entityPattern.exec(text)) !== null) {
    const slug = match[1];
    const customUrl = match[2];
    const entity = getEntity(slug.toLowerCase());

    mentions.push({
      slug: slug.toLowerCase(),
      entity,
      displayName: entity?.name ?? slug,
      url: customUrl ?? entity?.url,
      fullMatch: match[0],
      index: match.index,
    });
  }

  return mentions;
}
