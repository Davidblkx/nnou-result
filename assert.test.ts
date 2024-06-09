import { assert, assertThrows } from '@std/assert';
import { err, ok } from './result.ts';
import { assertResultErr, assertResultErrEqual, assertResultOk, assertResultOkEqual, isResult } from './assert.ts';

Deno.test('.isResult', async (t) => {
    await t.step('when ResultSuccess, return true', () => {
        const result = ok(42);
        assert(isResult(result));
    });

    await t.step('when ResultError, return true', () => {
        const result = err('An error occurred');
        assert(isResult(result));
    });

    await t.step('when undefined, return false', () => {
        assert(!isResult(undefined));
    });

    await t.step('when null, return false', () => {
        assert(!isResult(null));
    });

    await t.step('when object without boolean ok, return false', () => {
        assert(!isResult({ ok: 'potato' }));
    });

    await t.step('when object with ok true', async (t2) => {
        await t2.step('and value, return true', () => {
            const result = { ok: true, value: 42 };
            assert(isResult(result));
        });

        await t2.step('and error, return false', () => {
            const result = { ok: true, error: 'An error occurred' };
            assert(!isResult(result));
        });
    });

    await t.step('when object with ok false', async (t2) => {
        await t2.step('and value, return false', () => {
            const result = { ok: false, value: 42 };
            assert(!isResult(result));
        });

        await t2.step('and error, return true', () => {
            const result = { ok: false, error: 'An error occurred' };
            assert(isResult(result));
        });
    });
});

Deno.test('.assertResultOk', async (t) => {
    await t.step('when ResultSuccess, return void', () => {
        const result = ok(42);
        assertResultOk(result);
    });

    await t.step('when ResultError, throw error', () => {
        const result = err('An error occurred');
        assertThrows(() => assertResultOk(result));
    });
});

Deno.test('.assertResultErr', async (t) => {
    await t.step('when ResultSuccess, throw error', () => {
        const result = ok(42);
        assertThrows(() => assertResultErr(result));
    });

    await t.step('when ResultError, return void', () => {
        const result = err('An error occurred');
        assertResultErr(result);
    });
});

Deno.test('.assertResultOkEqual', async (t) => {
    await t.step('when ResultSuccess and equal value, return void', () => {
        const result = ok(42);
        assertResultOkEqual(result, 42);
    });

    await t.step('when ResultSuccess and different value, throw error', () => {
        const result = ok(42);
        assertThrows(() => assertResultOkEqual(result, 43));
    });

    await t.step('when ResultError, throw error', () => {
        const result = err('An error occurred');
        assertThrows(() => assertResultOkEqual(result, 42));
    });
});

Deno.test('.assertResultErrEqual', async (t) => {
    await t.step('when ResultSuccess, throw error', () => {
        const result = ok(42);
        assertThrows(() => assertResultErrEqual(result, 'An error occurred'));
    });

    await t.step('when ResultError and equal error, return void', () => {
        const result = err('An error occurred');
        assertResultErrEqual(result, 'An error occurred');
    });

    await t.step('when ResultError and different error, throw error', () => {
        const result = err('An error occurred');
        assertThrows(() => assertResultErrEqual(result, 'Another error occurred'));
    });
});
