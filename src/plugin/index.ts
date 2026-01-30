import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, RootContent, Link, Text, PhrasingContent } from 'mdast';
import type { EntityChipsOptions } from '../types.js';
import { parseMentions } from './parser.js';
import { detectUrls } from './url-detector.js';
import { renderEntityChip, renderUrlChip } from './renderer.js';
import { getEntity } from '../utils/entity-lookup.js';

const remarkEntityChips: Plugin<[EntityChipsOptions?], Root> = (options = {}) => {
  return (tree) => {
    // Pass 1: Handle @[text](url) — remark-parse turns [text](url) into a link node,
    // so we look for a text node ending with "@" followed by a link node.
    visit(tree, 'link', (node: Link, index, parent) => {
      if (parent == null || index == null || index === 0) return;

      const prev = parent.children[index - 1];
      if (prev.type !== 'text') return;

      const textNode = prev as Text;
      if (!textNode.value.endsWith('@')) return;

      // Extract the link text
      const linkText = (node.children[0] as Text)?.value ?? '';
      const slug = linkText.toLowerCase();
      const entity = getEntity(slug);
      const displayName = entity?.name ?? linkText;
      const url = node.url;

      const mention = {
        slug,
        entity,
        displayName,
        url,
        fullMatch: `@[${linkText}](${url})`,
        index: 0,
      };

      const html = renderEntityChip(mention, options);
      const htmlNode: RootContent = { type: 'html', value: html };

      // Remove the trailing @ from the preceding text node
      const newNodes: RootContent[] = [];
      const trimmed = textNode.value.slice(0, -1);
      if (trimmed.length > 0) {
        newNodes.push({ type: 'text', value: trimmed } as RootContent);
      }
      newNodes.push(htmlNode);

      // Replace prev text node + link node with new nodes
      parent.children.splice(index - 1, 2, ...newNodes as PhrasingContent[]);
      return index - 1 + newNodes.length;
    });

    // Pass 2: Handle @[entity] (no custom URL) and auto-detect URLs in text
    visit(tree, 'text', (node, index, parent) => {
      if (parent == null || index == null) return;

      const text = (node as Text).value;
      const mentions = parseMentions(text);
      const urls = detectUrls(text);

      if (mentions.length === 0 && urls.length === 0) return;

      interface Replacement {
        index: number;
        length: number;
        html: string;
      }

      const replacements: Replacement[] = [];

      for (const m of mentions) {
        if (!m.entity && !m.url) continue;
        replacements.push({
          index: m.index,
          length: m.fullMatch.length,
          html: renderEntityChip(m, options),
        });
      }

      for (const u of urls) {
        const isInsideMention = mentions.some(
          m => u.index >= m.index && u.index < m.index + m.fullMatch.length
        );
        if (isInsideMention) continue;

        replacements.push({
          index: u.index,
          length: u.fullMatch.length,
          html: renderUrlChip(u, options),
        });
      }

      if (replacements.length === 0) return;

      replacements.sort((a, b) => a.index - b.index);

      const newNodes: RootContent[] = [];
      let cursor = 0;

      for (const r of replacements) {
        if (r.index > cursor) {
          newNodes.push({ type: 'text', value: text.slice(cursor, r.index) } as RootContent);
        }
        newNodes.push({ type: 'html', value: r.html } as RootContent);
        cursor = r.index + r.length;
      }

      if (cursor < text.length) {
        newNodes.push({ type: 'text', value: text.slice(cursor) } as RootContent);
      }

      parent.children.splice(index, 1, ...newNodes as PhrasingContent[]);
      return index + newNodes.length;
    });
  };
};

export default remarkEntityChips;
