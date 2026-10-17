import React from 'react';

// Rendu Markdown minimal et sûr : produit des éléments React (jamais de HTML brut),
// et n'accepte que les liens http(s), mailto et relatifs.
// Syntaxe : # / ## titres, ### sous-titres, listes - et 1., > citation, ``` code,
// --- séparateur, ![alt](url) image, **gras**, *italique*, `code`, [lien](url).

const SAFE_URL = /^(https?:\/\/|mailto:|\/(?!\/))/i;
const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+?\*\*)|(\*[^*\s][^*\n]*?\*|_[^_\s][^_\n]*?_)|(\[[^\]\n]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix = 'i'): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(INLINE)) {
    const [token] = match;
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const key = `${keyPrefix}-${n++}`;
    if (match[1]) out.push(<code key={key}>{token.slice(1, -1)}</code>);
    else if (match[2]) out.push(<strong key={key}>{renderInline(token.slice(2, -2), key)}</strong>);
    else if (match[3]) out.push(<em key={key}>{renderInline(token.slice(1, -1), key)}</em>);
    else {
      const [, label, url] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/) ?? [];
      out.push(SAFE_URL.test(url)
        ? <a key={key} href={url} {...(url.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>{renderInline(label, key)}</a>
        : label);
    }
    last = start + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let i = 0;

  const flush = () => {
    if (paragraph.length) {
      const key = `p-${blocks.length}`;
      blocks.push(<p key={key}>{renderInline(paragraph.join(' '), key)}</p>);
      paragraph = [];
    }
  };

  const collect = (test: RegExp) => {
    const items: string[] = [];
    while (i < lines.length && test.test(lines[i])) items.push(lines[i++].replace(test, ''));
    return items;
  };

  while (i < lines.length) {
    const line = lines[i];
    const key = `b-${blocks.length}`;

    if (/^```/.test(line)) {
      flush();
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      blocks.push(<pre key={key}><code>{code.join('\n')}</code></pre>);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flush();
      blocks.push(heading[1].length === 3
        ? <h3 key={key}>{renderInline(heading[2], key)}</h3>
        : <h2 key={key}>{renderInline(heading[2], key)}</h2>);
      i++;
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)\s*$/);
    if (image) {
      flush();
      blocks.push(<figure key={key}><img src={image[2]} alt={image[1]} loading="lazy" />{image[1] && <figcaption>{image[1]}</figcaption>}</figure>);
      i++;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { flush(); blocks.push(<hr key={key} />); i++; continue; }

    if (/^>\s?/.test(line)) {
      flush();
      const quote = collect(/^>\s?/);
      blocks.push(<blockquote key={key}>{renderInline(quote.join(' '), key)}</blockquote>);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      flush();
      const items = collect(/^\s*[-*]\s+/);
      blocks.push(<ul key={key}>{items.map((item, j) => <li key={j}>{renderInline(item, `${key}-${j}`)}</li>)}</ul>);
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      flush();
      const items = collect(/^\s*\d+[.)]\s+/);
      blocks.push(<ol key={key}>{items.map((item, j) => <li key={j}>{renderInline(item, `${key}-${j}`)}</li>)}</ol>);
      continue;
    }

    if (!line.trim()) { flush(); i++; continue; }

    paragraph.push(line.trim());
    i++;
  }
  flush();

  return <>{blocks}</>;
}
