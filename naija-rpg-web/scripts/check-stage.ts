/**
 * Every scene in the server's scenario files needs an entry in the stage registry.
 *
 *   npm run stage:check                      # looks for ../../naijarpg-server/src/content/scenarios
 *   SCENARIOS_DIR=/path/to/scenarios npm run stage:check
 *
 * Exits with an error when a scene has no stage, or a stage points at a scene that no longer exists.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { STAGES, enterSeconds } from '../src/features/stage/registry';

const dir = process.env.SCENARIOS_DIR ?? path.join(process.cwd(), '..', '..', 'naijarpg-server', 'src', 'content', 'scenarios');
let bad = 0;

for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const s = JSON.parse(readFileSync(path.join(dir, f), 'utf8')) as { id: string; scenes: Record<string, unknown> };
  const mapped = STAGES[s.id];
  if (!mapped) {
    console.error(`✗ ${s.id}: no stages at all`);
    bad++;
    continue;
  }
  const missing = Object.keys(s.scenes).filter((k) => !mapped[k]);
  const extra = Object.keys(mapped).filter((k) => !s.scenes[k]);
  const slow = Object.entries(mapped).filter(([, v]) => enterSeconds(v) > 1.9);
  missing.forEach((k) => console.error(`✗ ${s.id}/${k}: scene has no stage`));
  extra.forEach((k) => console.error(`✗ ${s.id}/${k}: stage has no scene`));
  slow.forEach(([k, v]) => console.error(`✗ ${s.id}/${k}: opening is ${enterSeconds(v).toFixed(1)}s, keep it under 1.9s`));
  bad += missing.length + extra.length + slow.length;
  console.log(`${missing.length || extra.length || slow.length ? '·' : '✓'} ${s.id}: ${Object.keys(s.scenes).length} scenes, ${Object.keys(mapped).length} stages`);
}

process.exit(bad ? 1 : 0);
