// Launch Chromium for QA. Uses PW_CHROMIUM, else the cloud-session Chromium at /opt/pw-browsers/chromium,
// else Playwright's own download (npx playwright install chromium — ask before downloading).
import fs from 'node:fs';
import { chromium } from 'playwright';

export function launch() {
  const candidates = [process.env.PW_CHROMIUM, '/opt/pw-browsers/chromium'].filter(Boolean);
  const executablePath = candidates.find((p) => fs.existsSync(p));
  return chromium.launch({ ...(executablePath ? { executablePath } : {}), args: ['--disable-background-networking', '--disable-component-update', '--no-default-browser-check'] });
}
