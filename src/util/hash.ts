export function generateNonce() {
  return Number(new Date()) * Math.random();
}

export const id = (function() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _hashRecord: Map<any, string> = new Map<any, string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (obj: any) => {
    if (_hashRecord.has(obj)) return _hashRecord.get(obj) as string;
    _hashRecord.set(obj, String(generateNonce()));
    return _hashRecord.get(obj) as string;
  };
})();
