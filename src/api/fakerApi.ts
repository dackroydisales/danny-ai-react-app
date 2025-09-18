import { ApiResponse, Person } from '../types/faker';

const BASE = 'https://fakerapi.it/api/v1';

// Accepts an optional AbortSignal so callers can cancel in-flight requests
export async function fetchPeople(quantity = 10, signal?: AbortSignal) {
  const url = `${BASE}/persons?_quantity=${quantity}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  const json = (await res.json()) as ApiResponse<Person>;
  return json;
}
