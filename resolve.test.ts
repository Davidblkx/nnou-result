import { assertEquals } from '@std/assert';
import { err, ok } from './result.ts';
import { assertResultErrEqual } from './assert.ts';
import { resolve, resolveAsync } from './resolve.ts';

Deno.test('.resolve', async (t) => {
    await t.step('when target returns ok, return result', () => {
        const result = resolve(() => {
            return ok(42);
        });

        assertEquals(result, { ok: true, value: 42 });
    });

    await t.step('when target returns err, return result', () => {
        const result = resolve(() => {
            return err('An error occurred');
        });

        assertEquals(result, { ok: false, error: 'An error occurred' });
    });

    await t.step('when target throws', async (t2) => {
        await t2.step('when error handler is not provided, return error message', () => {
            const result = resolve(() => {
                throw new Error('An error occurred');
            });

            assertResultErrEqual(result, 'An error occurred');
        });

        await t2.step('when default error is provided, return error', () => {
            const myError = { code: 'err-code' };
            const result = resolve(() => {
                throw new Error('An error occurred');
            }, myError);

            assertResultErrEqual(result, myError);
        });

        await t2.step('when custom error handler is provided', async (t3) => {
            await t3.step('when error handler does not return a Result, returns result', () => {
                const myError = new Error('An error occurred');
                const result = resolve(() => {
                    throw myError;
                }, (e) => e instanceof Error ? e : new Error('Another error'));

                assertResultErrEqual(result, myError);
            });

            await t3.step('when error handler returns a Result, returns result', () => {
                const myError = new Error('An error occurred');
                const result = resolve(() => {
                    throw myError;
                }, (e) => err(e instanceof Error ? e : new Error('Another error')));

                assertResultErrEqual(result, myError);
            });
        });
    });
});

Deno.test('.resolveAsync', async (t) => {
    await t.step('when target returns ok, return result', async () => {
        const result = await resolveAsync(() => {
            return Promise.resolve(ok(42));
        });

        assertEquals(result, { ok: true, value: 42 });
    });

    await t.step('when target returns err, return result', async () => {
        const result = await resolveAsync(() => {
            return Promise.resolve(err('An error occurred'));
        });

        assertEquals(result, { ok: false, error: 'An error occurred' });
    });

    await t.step('when target rejects', async (t2) => {
        await t2.step('when error handler is not provided, return error message', async () => {
            const result = await resolveAsync(() => {
                return Promise.reject(new Error('An error occurred'));
            });

            assertResultErrEqual(result, 'An error occurred');
        });

        await t2.step('when default error is provided, return error', async () => {
            const myError = { code: 'err-code' };
            const result = await resolveAsync(() => {
                return Promise.reject(new Error('An error occurred'));
            }, myError);

            assertResultErrEqual(result, myError);
        });

        await t2.step('when custom error handler is provided', async (t3) => {
            await t3.step('when error handler does not return a Result, returns result', async () => {
                const myError = new Error('An error occurred');
                const result = await resolveAsync(() => {
                    return Promise.reject(myError);
                }, (e) => e instanceof Error ? e : new Error('Another error'));

                assertResultErrEqual(result, myError);
            });

            await t3.step('when error handler returns a Result, returns result', async () => {
                const myError = new Error('An error occurred');
                const result = await resolveAsync(() => {
                    return Promise.reject(myError);
                }, (e) => err(e instanceof Error ? e : new Error('Another error')));

                assertResultErrEqual(result, myError);
            });
        });
    });
});
