export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).error || res.statusText;
    throw Object.assign(new Error(msg), { status: res.status });
  }
  return res.json();
}
