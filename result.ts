/**
 * @module core
 *
 * @description This module provides a simple Result type that can be used to represent the result of an operation that can fail.
 *
 * @example
 *
 * ```ts
 * import { Result, ok, err } from '@nnou/result';
 *
 * function divide(a: number, b: number): Result<number, string> {
 *    if (b === 0) {
 *       return err('Division by zero');
 *    }
 *       return ok(a / b);
 *    }
 * }
 *
 * const result = divide(10, 2);
 */

/**
 * Represents a successful result of an operation.
 */
export interface ResultOk<T> {
    ok: true;
    value: T;
}

/**
 * Represents a failed result of an operation.
 */
export interface ResultErr<E> {
    ok: false;
    error: E;
}

/**
 * Represents the result of an operation that can fail.
 */
export type Result<T, E> = ResultOk<T> | ResultErr<E>;

/**
 * Represents the result of an async operation that can fail.
 */
export type ResultAsync<T, E> = Promise<Result<T, E>>;

/**
 * Creates a successful result.
 *
 * @example
 * ```ts
 * const result = ok(42);
 * if (result.ok) {
 *   console.log(result.value); // 42
 * }
 * ```
 *
 * @param value - The value of the result.
 * @returns - A successful result.
 */
export function ok<T>(value: NonNullable<T>): ResultOk<T> {
    return { ok: true, value };
}

/**
 * Creates a failed result.
 *
 * @example
 * ```ts
 * const result = err('An error occurred');
 * if (!result.ok) {
 *  console.log(result.error); // 'An error occurred'
 * }
 * ```
 *
 * @param error - The error of the result.
 * @returns - A failed result.
 */
export function err<E>(error: NonNullable<E>): ResultErr<E> {
    return { ok: false, error };
}
