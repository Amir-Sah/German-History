// Search index for the dictionary pages (fetched on first search): compact, one row per entry.
import { dictionary } from '../../lib/content';

export function GET() {
  const rows = dictionary.map((e) => [e.id, e.name, e.kind, e.letter, e.forms.filter((f) => f !== e.name).join(' · '), e.german ?? '', e.short]);
  return new Response(JSON.stringify(rows), { headers: { 'content-type': 'application/json' } });
}
