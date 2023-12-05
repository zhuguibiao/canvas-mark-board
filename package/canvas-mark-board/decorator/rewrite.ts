import type { IObject } from "../types";
function getDescriptor(object: IObject, name: string) {
  return Object.getOwnPropertyDescriptor(object, name);
}

function getNames(object: IObject): string[] {
  return Object.getOwnPropertyNames(object);
}

const excludeNames = ["destroy", "constructor"];

// class
export function useModule(module: IObject, exclude?: string[]): ClassDecorator {
  return (target: IObject) => {
    const names = module.prototype
      ? getNames(module.prototype)
      : Object.keys(module);
    names.forEach((name) => {
      if (
        !excludeNames.includes(name) &&
        (!exclude || !exclude.includes(name))
      ) {
        if (module.prototype) {
          const d = getDescriptor(module.prototype, name);
          if (d!.writable) target.prototype[name] = module.prototype[name];
        } else {
          target.prototype[name] = module[name];
        }
      }
    });
  };
}
