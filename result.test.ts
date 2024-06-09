import { assertEquals } from '@std/assert';
import { err, ok } from './result.ts';

Deno.test('.ok', () => {
    const result = ok(42);

    assertEquals(result, { ok: true, value: 42 });
});

Deno.test('.err', () => {
    const result = err('An error occurred');

    assertEquals(result, { ok: false, error: 'An error occurred' });
});
