// Launch Chromium for QA. Uses PW_CHROMIUM, else the cloud-session Chromium at /opt/pw-browsers/chromium,
// else Playwright's own download (npx playwright install chromium — ask before downloading).
//
// Cloud sessions route HTTPS through an agent proxy whose CA is not in Chromium's (empty) NSS store.
// Certificate checks stay ON: we only add trust for that one CA, pinned by the SHA-256 of its public key
// (equivalent to installing the CA). On machines without /root/.ccr this does nothing.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const PROXY_CA = '/root/.ccr/agent-proxy-ca.crt';

function proxyCaPin() {
  if (!fs.existsSync(PROXY_CA)) return null;
  const cert = new crypto.X509Certificate(fs.readFileSync(PROXY_CA));
  const spki = cert.publicKey.export({ type: 'spki', format: 'der' });
  return crypto.createHash('sha256').update(spki).digest('base64');
}

export function launch() {
  const candidates = [process.env.PW_CHROMIUM, '/opt/pw-browsers/chromium'].filter(Boolean);
  const executablePath = candidates.find((p) => fs.existsSync(p));
  const pin = proxyCaPin();
  const args = ['--disable-background-networking', '--disable-component-update', '--no-default-browser-check'];
  if (pin) args.push(`--ignore-certificate-errors-spki-list=${pin}`);
  return chromium.launch({ ...(executablePath ? { executablePath } : {}), args });
}
