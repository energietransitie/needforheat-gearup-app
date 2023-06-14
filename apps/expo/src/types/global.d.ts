declare module "react-native-esp-idf-provisioning";

declare interface ObjectConstructor extends Omit<ObjectConstructor, "keys" | "entries"> {
  /**
   * Returns the names of the enumerable string properties and methods of an object.
   * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  keys<O extends unknown[]>(obj: O): (keyof O)[];
  keys<O extends Record<Readonly<string>, unknown>>(obj: O): (keyof O)[];
  keys(obj: object): string[];

  /**
   * Returns an array of key/values of the enumerable properties of an object
   * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  entries<T extends { [K: Readonly<string>]: unknown }>(obj: T): [keyof T, T[keyof T]][];
  entries<T extends object>(obj: { [s: string]: T } | ArrayLike<T>): [string, T[keyof T]][];
  entries<T>(obj: { [s: string]: T } | ArrayLike<T>): [string, T][];
  entries(obj: object): [string, unknown][];
}

declare let Object: ObjectConstructor;
