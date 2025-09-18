import { fetchPeople } from './fakerApi';

describe('fetchPeople', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns parsed data when API responds ok', async () => {
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'OK', code: 200, total: 1, data: [{ firstname: 'Alice', lastname: 'Smith', email: 'a@b.com' }] })
    });

    const res = await fetchPeople(1);
    expect(res).toBeDefined();
    expect(res.data).toHaveLength(1);
    expect(res.data[0].firstname).toBe('Alice');
  });

  it('throws when response is not ok', async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchPeople(1)).rejects.toThrow('API error 500');
  });
});
