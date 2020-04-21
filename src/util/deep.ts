/* eslint-disable  @typescript-eslint/no-explicit-any */
export const deepAssign: <T, U>(obj: T, ...otherObjects: U[]) => T & U = <T, U>(
  obj: T,
  ...otherObjects: U[]
) => {
  if (otherObjects.length > 1)
    return deepAssign(
      deepAssign(obj, otherObjects[0]),
      ...otherObjects.filter((_, index) => index !== 0)
    );
  if (otherObjects.length < 1) return deepAssign(obj, {} as any) as T & U;
  const otherObject = otherObjects[0];
  const newObj: any = {};

  const assign = (_obj: any) => {
    for (const key in _obj) {
      if (Object.prototype.hasOwnProperty.call(_obj, key)) {
        const value = _obj[key];
        // noinspection JSPrimitiveTypeWrapperUsage
        if (
          [String(), Number(), Boolean(), BigInt(1), Symbol(), void 0]
            .map(primitive => typeof primitive)
            .includes(typeof value) ||
          [Date, BigInt].some(
            frozenObjectConstructor => value instanceof frozenObjectConstructor
          )
        ) {
          newObj[key] = value;
        } else if (value instanceof Array) {
          newObj[key] = Array.from(value);
        } else {
          newObj[key] = deepAssign(newObj[key], value);
        }
      }
    }
  };
  if (typeof obj !== typeof void 0) assign(obj);
  if (typeof otherObject !== typeof void 0) assign(otherObject);
  return newObj as T & U;
};
