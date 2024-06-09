import { err, type Result, type ResultAsync } from './result.ts';
import { isResult } from './assert.ts';

/**
 * A function that returns a Result.
 */
export type ResultFn<T, E> = () => Result<T, E>;

/**
 * A function that returns a ResultAsync.
 */
export type ResultAsyncFn<T, E> = () => ResultAsync<T, E>;

/**
 * Resolves a Result from a function. If the function throws an error, it will be caught and returned as a ResultError.
 *
 * @param fn - The function to resolve.
 * @returns The resolved Result.
 *
 * @example
 * ```ts
 * import { resolve, ok, err } from '@nnou/result';
 *
 * const result = resolve(() => {
 *    if (Math.random() > 0.5) {
 *       return ok(42);
 *    }
 *
 *   throw new Error('An error occurred');
 * }); // Returns Result<number, string>
 * ```
 */
export function resolve<T>(fn: ResultFn<T, string>): Result<T, string>;
/**
 * Resolves a Result from a function. If the function throws an error, it will be caught and passed to the error handler.
 *
 * @param fn - The function to resolve.
 * @param handler - The error handler.`
 *
 * @example using custom error handler
 * ```ts
 * import { resolve, ok, err } from '@nnou/result';
 *
 * type MyError = { code: string, error: unknown };
 *
 * const result = resolve(() => {
 *  if (Math.random() > 0.5) {
 *    return ok(42);
 *  }
 *  throw new Error('An error occurred');
 * }, (e) => {
 *  return { code: 'error', error: e };
 * }); // Returns Result<number, MyError>
 * ```
 */
export function resolve<T, E>(
    fn: ResultFn<T, E>,
    handler: (e: unknown) => NonNullable<E> | Result<T, E>,
): Result<T, E>;
/**
 * Resolves a Result from a function. If the function throws an error, it will be caught and passed to the error handler.
 *
 * @param fn - The function to resolve.
 * @param handler - The error handler.
 *
 * @example using default custom error
 * ```ts
 * import { resolve, ok, err } from '@nnou/result';
 *
 * type MyError = { code: string };
 *
 * const result = resolve(() => {
 *   if (Math.random() > 0.5) {
 *     return ok(42);
 *   }
 *
 *   throw new Error('An error occurred');
 * }, { code: '' }); // Returns Result<number, MyError>
 * ```
 */
export function resolve<T, E>(
    fn: ResultFn<T, E>,
    handler: NonNullable<E>,
): Result<T, E>;
export function resolve<T, E>(
    fn: ResultFn<T, E>,
    handler?: NonNullable<E> | ((e: unknown) => NonNullable<E> | Result<T, E>),
): Result<T, E> {
    try {
        return fn();
    } catch (error) {
        return handleError(error, handler);
    }
}

/**
 * resolves a ResultAsync from an async function. If the promise rejects, it will be caught and returned as a ResultError.
 *
 * @param fn - The function to resolve.
 * @returns The resolved ResultAsync.
 *
 * @example
 * ```ts
 * import { resolveAsync, ok, err } from '@nnou/result';
 *
 * const result = await resolveAsync(async () => {
 *  if (Math.random() > 0.5) {
 *   return ok(42);
 * }
 *
 * throw new Error('An error occurred');
 * }); // Returns ResultAsync<number, string>
 * ```
 */
export function resolveAsync<T>(fn: ResultAsyncFn<T, string>): ResultAsync<T, string>;
/**
 * Resolves a ResultAsync from an async function. If the promise rejects, it will be caught and passed to the error handler.
 *
 * @param fn - The function to resolve.
 * @param handler - The error handler.
 *
 * @example using custom error handler
 * ```ts
 * import { resolveAsync, ok, err } from '@nnou/result';
 *
 * type MyError = { code: string, error: unknown };
 *
 * const result = await resolveAsync(async () => {
 *  if (Math.random() > 0.5) {
 *   return ok(42);
 * }
 *
 * throw new Error('An error occurred');
 * }, (e) => {
 *  return { code: 'error', error: e };
 * }); // Returns ResultAsync<number, MyError>
 * ```
 */
export function resolveAsync<T, E>(
    fn: ResultAsyncFn<T, E>,
    handler: (e: unknown) => NonNullable<E> | Result<T, E>,
): ResultAsync<T, E>;
/**
 * Resolves a ResultAsync from an async function. If the promise rejects, it will be caught and passed to the error handler.
 *
 * @param fn - The function to resolve.
 * @param handler - The error handler.
 *
 * @example using default custom error
 * ```ts
 * import { resolveAsync, ok, err } from '@nnou/result';
 *
 * type MyError = { code: string };
 *
 * const result = await resolveAsync(async () => {
 *  if (Math.random() > 0.5) {
 *   return ok(42);
 * }
 *
 * throw new Error('An error occurred');
 * }, { code: '' }); // Returns ResultAsync<number, MyError>
 * ```
 */
export function resolveAsync<T, E>(
    fn: ResultAsyncFn<T, E>,
    handler: NonNullable<E>,
): ResultAsync<T, E>;
export async function resolveAsync<T, E>(
    fn: ResultAsyncFn<T, E>,
    handler?: NonNullable<E> | ((e: unknown) => NonNullable<E> | Result<T, E>),
): ResultAsync<T, E> {
    try {
        return await fn();
    } catch (error) {
        return handleError(error, handler);
    }
}

function handleError<T, E>(
    error: unknown,
    handler?: NonNullable<E> | ((e: unknown) => NonNullable<E> | Result<T, E>),
): Result<T, E> {
    const errMessage = typeof error === 'string' ? error : error instanceof Error ? error.message : 'An error occurred';

    if (typeof handler === 'undefined' || typeof handler === null) {
        return err(errMessage as unknown as NonNullable<E>);
    }

    if (handler instanceof Function) {
        const e = handler(error);
        return isResult(e) ? e : err(e);
    }

    return err(handler);
}
