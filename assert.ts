/**
 * @module assert
 *
 * @description This module provides functions to assert the type of a value at runtime.
 *
 * @example
 *
 * ```ts
 * import { isResult, assertResultOk, assertResultErr } from '@nnou/result/assert';
 * import { ok } from '@nnou/result';
 *
 * const result = ok(42);
 *
 * if (isResult(result)) {
 *  assertResultOk(result);
 *  console.log(result.value); // 42
 * }
 * ```
 */

import type { Result, ResultErr, ResultOk } from './result.ts';

/**
 * Checks if a value is a Result.
 *
 * @example
 * ```ts
 * import { isResult } from '@nnou/result/assert';
 *
 * function log(result: unknown) {
 *   if (isResult(result)) {
 *     console.log(result.ok ? result.value : result.error);
 *   }
 * }
 * ```
 *
 * @param value - The value to check.
 * @returns true if the value is a Result, false otherwise.
 */
export function isResult<
    T = unknown,
    E = unknown,
>(value: unknown): value is Result<T, E> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'ok' in value &&
        typeof value.ok === 'boolean'
    ) && (
        (value.ok && 'value' in value) ||
        (!value.ok && 'error' in value)
    );
}

/**
 * Asserts that a value is a successful Result.
 *
 * @example
 *
 * ```ts
 * import { assertResultOk } from '@nnou/result/assert';
 * import { ok, err } from '@nnou/result';
 *
 * const result = ok(42);
 *
 * assertResultOk(result); // Pass
 *
 * const error = err('An error occurred');
 *
 * assertResultOk(error); // Throws an error
 * ```
 *
 * @param result - The value to check.
 */
export function assertResultOk<T, E>(result: Result<T, E>): asserts result is ResultOk<T> {
    if (!result.ok) {
        throw new Error('Expected a successful result');
    }
}

/**
 * Asserts that a value is a failed Result.
 *
 * @example
 *
 * ```ts
 * import { assertResultErr } from '@nnou/result/assert';
 * import { ok, err } from '@nnou/result';
 *
 * const result = ok(42);
 *
 * assertResultErr(result); // Throws an error
 *
 * const error = err('An error occurred');
 *
 * assertResultErr(error); // Pass
 * ```
 *
 * @param result - The value to check.
 */
export function assertResultErr<T, E>(result: Result<T, E>): asserts result is ResultErr<E> {
    if (result.ok) {
        throw new Error('Expected a failed result');
    }
}

/**
 * Asserts that a successful Result has a specific value.
 *
 * @example
 *
 * ```ts
 * import { assertResultOkEqual } from '@nnou/result/assert';
 * import { ok } from '@nnou/result';
 *
 * const result = ok(42);
 *
 * assertResultOkEqual(result, 42); // Pass
 *
 * assertResultOkEqual(result, 43); // Throws an error
 *
 * const error = err(42);
 *
 * assertResultOkEqual(error, 42); // Throws an error
 * ```
 *
 * @param result - The value to check.
 * @param value - The value to compare.
 */
export function assertResultOkEqual<T, E>(result: Result<T, E>, value: T): asserts result is ResultOk<T> {
    assertResultOk(result);
    if (result.value !== value) {
        throw new Error(`Expected the value to be ${value}`);
    }
}

/**
 * Asserts that a failed Result has a specific error.
 *
 * @example
 *
 * ```ts
 * import { assertResultErrEqual } from '@nnou/result/assert';
 * import { err } from '@nnou/result';
 *
 * const result = err('An error occurred');
 *
 * assertResultErrEqual(result, 'An error occurred'); // Pass
 *
 * assertResultErrEqual(result, 'Another error occurred'); // Throws an error
 *
 * const error = ok(42);
 *
 * assertResultErrEqual(error, 'An error occurred'); // Throws an error
 * ```
 *
 * @param result - The value to check.
 * @param error - The error to compare.
 */
export function assertResultErrEqual<T, E>(result: Result<T, E>, error: E): asserts result is ResultErr<E> {
    assertResultErr(result);
    if (result.error !== error) {
        throw new Error(`Expected the error to be ${error}`);
    }
}
