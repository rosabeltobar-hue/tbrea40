// Node 18+ has built-in fetch; no need to import
const RC_API_BASE = "https://api.revenuecat.com/v1";

export async function fetchPurchaserInfo(apiKey: string, appUserId: string) {
  const url = `${RC_API_BASE}/subscribers/${encodeURIComponent(appUserId)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RevenueCat fetch failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  // RevenueCat returns { subscriber: { ... } }
  return json;
}
