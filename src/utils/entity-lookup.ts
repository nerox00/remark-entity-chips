import entities from '../data/entities.js';
import type { Entity } from '../types.js';

export function getEntity(slug: string): Entity | undefined {
  return entities[slug];
}

export function getAllEntities(): Entity[] {
  return Object.values(entities);
}

export function getEntitiesByCategory(category: string): Entity[] {
  return Object.values(entities).filter(e => e.category === category);
}
