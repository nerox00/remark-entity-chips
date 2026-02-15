import { readFileSync } from 'fs';
import { join } from 'path';
import builtinEntities from '../data/entities.js';
import type { Entity } from '../types.js';

function loadCustomEntities(): Record<string, Entity> {
  try {
    const filePath = join(process.cwd(), 'entity-chips.json');
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

let resolvedEntities: Record<string, Entity> | null = null;

export function resolveEntities(): Record<string, Entity> {
  if (!resolvedEntities) {
    const custom = loadCustomEntities();
    resolvedEntities = { ...builtinEntities, ...custom };
  }
  return resolvedEntities;
}

/** @internal Reset cached entities (for testing) */
export function _resetResolvedEntities(): void {
  resolvedEntities = null;
}

export function getEntity(slug: string): Entity | undefined {
  return resolveEntities()[slug];
}

export function getAllEntities(): Entity[] {
  return Object.values(resolveEntities());
}

export function getEntitiesByCategory(category: string): Entity[] {
  return Object.values(resolveEntities()).filter(e => e.category === category);
}
