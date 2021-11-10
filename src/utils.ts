export function removeProperties<T, K extends keyof T>(
  payload: T,
  properties: K[]
): Partial<T> {
  properties.forEach((p) => delete payload[p]);
  return payload;
}

export function convertToExpression<T>(payload: T, join: string) {
  let items: string[] = [];

  Object.keys(payload).forEach((key: string): void => {
    if (key.match(/^_/)) {
      items.push(payload[key as keyof T] as any);
      return;
    }
    items.push(`${key}=${payload[key as keyof T]}`);
  });

  return items.join(join);
}