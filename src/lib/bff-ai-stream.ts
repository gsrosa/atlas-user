import { getApiUrl } from '@/lib/env';

interface BffAiStreamOptions {
  systemPrompt?: string;
  maxOutputTokens?: number;
  temperature?: number;
  responseMimeType?: 'text/plain' | 'application/json';
}

export async function callBffAiStream(
  userPrompt: string,
  options: BffAiStreamOptions = {},
): Promise<string> {
  const response = await fetch(`${getApiUrl()}/plans/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      userPrompt,
      systemPrompt: options.systemPrompt,
      maxOutputTokens: options.maxOutputTokens,
      temperature: options.temperature,
      responseMimeType: options.responseMimeType ?? 'application/json',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`BFF AI stream error ${response.status}: ${body}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Response body is not readable');

  const decoder = new TextDecoder();
  let buffer = '';
  let result = '';
  let done = false;

  while (!done) {
    const { done: streamDone, value } = await reader.read();
    if (streamDone) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw) continue;

      let event: { type: string; delta?: string; message?: string };
      try {
        event = JSON.parse(raw) as typeof event;
      } catch {
        continue;
      }

      if (event.type === 'text' && event.delta) {
        result += event.delta;
      } else if (event.type === 'error') {
        throw new Error(`AI stream error: ${event.message ?? 'unknown'}`);
      } else if (event.type === 'done') {
        done = true;
        break;
      }
    }
  }

  return result;
}
