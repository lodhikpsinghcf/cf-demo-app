// Registers the app's dynamic blocks in ContentFlow so their fields are editable in the dashboard.
// Run: npm run register-blocks   (reads .env; needs CF_WRITE_KEY)
import { buildBlockManifest } from '../constants/blocks';

const baseUrl = process.env.EXPO_PUBLIC_CF_BASE_URL || 'https://api.contentflow.click/sdk/v1';
const tenantId = process.env.EXPO_PUBLIC_CF_TENANT_ID || '';
const publicKey = process.env.EXPO_PUBLIC_CF_SDK_KEY || '';
const writeKey = process.env.CF_WRITE_KEY || '';

async function main() {
  if (!writeKey) {
    console.error('CF_WRITE_KEY is not set. Add it to .env (no EXPO_PUBLIC_ prefix, so it never ships in the app).');
    process.exit(1);
  }

  const blocks = buildBlockManifest();
  console.log(`Registering ${blocks.length} blocks at ${baseUrl}/cards/sync ...`);

  const res = await fetch(`${baseUrl}/cards/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CF-Write-Key': writeKey,
      'X-CF-Key': publicKey,
      'X-Tenant-Id': tenantId,
    },
    body: JSON.stringify({ blocks, prune: false }),
  });

  const body: any = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    console.error(`Failed (${res.status}):`, body.error || body);
    process.exit(1);
  }

  const data = body.data ?? body;
  console.log(`Active:  ${data.active?.length ?? 0}`);
  console.log(`Created: ${data.created?.length ? data.created.join(', ') : 'none'}`);
  if (data.archived?.length) {
    console.warn(`ARCHIVED (not in constants/blocks.ts): ${data.archived.join(', ')}`);
  }
  if (data.archiveRefused?.length) {
    console.warn('Kept (sponsored content):', data.archiveRefused.map((r: any) => r.key).join(', '));
  }
  if (data.errors?.length) {
    console.error('Errors:');
    for (const e of data.errors) console.error(`  ${e.key}: ${e.error}`);
    process.exit(1);
  }
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
