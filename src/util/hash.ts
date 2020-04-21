export function generateNonce(): bigint {
  let n = BigInt(Math.random() * 1000000000000000000000);
  n *= BigInt(new Date());
  return n;
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
