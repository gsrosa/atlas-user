import { getApiUrl } from '@/lib/env';

export type ItineraryDoc = Record<string, unknown>;

export async function applyPlanModification(
  itinerary: ItineraryDoc,
  request: string,
): Promise<ItineraryDoc> {
  const res = await fetch(`${getApiUrl()}/plans/modify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ itinerary, request }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Modify failed ${res.status}: ${text}`);
  }
  const updated = await res.json() as ItineraryDoc;
  if (!updated.destination || !Array.isArray(updated.days)) {
    throw new Error('Invalid updated plan: missing required fields');
  }
  return updated;
}
