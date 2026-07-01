const DEFAULT_PAYLOAD_BYTES = 128684;
const MIN_PAYLOAD_BYTES = 1024;
const MAX_PAYLOAD_BYTES = 512 * 1024;

function clampPayloadSize(value) {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed)) return DEFAULT_PAYLOAD_BYTES;
  return Math.min(MAX_PAYLOAD_BYTES, Math.max(MIN_PAYLOAD_BYTES, parsed));
}

function noCacheHeaders(contentType, bytes) {
  const headers = new Headers({
    'content-type': contentType,
    'cache-control': 'no-store, no-cache, max-age=0, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0',
    'access-control-allow-origin': '*',
    'x-gg-keeper-bytes': String(bytes)
  });
  if (bytes >= 0) headers.set('content-length', String(bytes));
  return headers;
}

function makePayload(bytes, seedText) {
  const data = new Uint8Array(bytes);
  let x = 0x811c9dc5;
  for (let i = 0; i < seedText.length; i++) {
    x ^= seedText.charCodeAt(i);
    x = Math.imul(x, 0x01000193) >>> 0;
  }
  for (let i = 0; i < bytes; i++) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    data[i] = x & 0xff;
  }
  return data;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: noCacheHeaders('application/json; charset=utf-8', -1)
  });
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, HEAD, OPTIONS',
        'access-control-allow-headers': 'cache-control, pragma'
      }
    });
  }

  if (path === '/api/meta') {
    return jsonResponse({
      name: 'gg-keeper',
      defaultBytes: DEFAULT_PAYLOAD_BYTES,
      minBytes: MIN_PAYLOAD_BYTES,
      maxBytes: MAX_PAYLOAD_BYTES,
      payloadPath: '/api/payload'
    });
  }

  if (path === '/api/payload' || path === '/payload.bin') {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const bytes = clampPayloadSize(url.searchParams.get('size'));
    const headers = noCacheHeaders('application/octet-stream', bytes);
    headers.set('content-disposition', 'inline; filename="payload.bin"');
    headers.set('content-encoding', 'identity');

    if (request.method === 'HEAD') return new Response(null, { headers });
    return new Response(makePayload(bytes, url.search), { headers });
  }

  return jsonResponse({ error: 'Not Found' }, 404);
}

export default {
  async fetch(request) {
    return handleRequest(request);
  }
};
