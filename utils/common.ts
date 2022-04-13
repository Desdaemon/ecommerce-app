/** Plain JavaScript utilities for both client and server. */

export function identity<T>(_: T): _ is NonNullable<T> {
  return _ as any as boolean;
}

export const enum Cookies {
  userId = 'ecom-user-id',
}
