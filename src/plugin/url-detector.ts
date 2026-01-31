export interface DetectedUrl {
  platform: string;
  slug: string;
  url: string;
  fullMatch: string;
  index: number;
}

const urlPatterns: Record<string, RegExp> = {
  youtube: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  github: /github\.com\/([^\/\s]+)\/([^\/\s]+)/,
  x: /(?:twitter\.com|x\.com)\/([^\/\s]+)/,
  linkedin: /linkedin\.com\/(?:in|company)\/([^\/\s]+)/,
};

const bareUrlPattern = /https?:\/\/[^\s<>)\]]+/g;

export function detectUrls(text: string): DetectedUrl[] {
  const detected: DetectedUrl[] = [];
  let match: RegExpExecArray | null;

  while ((match = bareUrlPattern.exec(text)) !== null) {
    const url = match[0];
    for (const [platform, pattern] of Object.entries(urlPatterns)) {
      if (pattern.test(url)) {
        detected.push({
          platform,
          slug: platform,
          url,
          fullMatch: match[0],
          index: match.index,
        });
        break;
      }
    }
  }

  return detected;
}
