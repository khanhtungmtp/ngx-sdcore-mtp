import { Snotify } from '../interfaces/snotify.interface';
import { SnotifyTypeType } from '../types/snotify-type.type';
import { SnotifyStyle } from '../enums/snotify-style.enum';

/**
 * Transform arguments to Snotify object
 * @param target any
 * @param propertyKey SnotifyTypeType
 * @param descriptor PropertyDescriptor
 * @returns Snotify
 */
export function TransformArgument(
  target: any,
  propertyKey: SnotifyTypeType,
  descriptor: PropertyDescriptor
) {
  if (propertyKey === SnotifyStyle.async) {
    return {
      value(...args: any[]) {
        let result;
        if (args.length === 2) {
          result = {
            title: null,
            body: args[0],
            config: null,
            action: args[1],
          };
        } else if (args.length === 3) {
          if (typeof args[1] === 'string') {
            result = {
              title: args[1],
              body: args[0],
              config: null,
              action: args[2],
            };
          } else {
            result = {
              title: null,
              body: args[0],
              config: args[2],
              action: args[1],
            };
          }
        } else {
          result = {
            title: args[1],
            body: args[0],
            config: args[3],
            action: args[2],
          };
        }
        return descriptor.value.apply(this, [result as Snotify]);
      },
    };
  } else {
    return {
      value(...args: any[]) {
        let result;
        if (args.length === 1) {
          result = {
            title: null,
            body: args[0],
            config: null,
          };
        } else if (args.length === 3) {
          result = {
            title: args[1],
            body: args[0],
            config: args[2],
          };
        } else {
          result = {
            title: null,
            config: null,
            body: args[0],
            [typeof args[1] === 'string' ? 'title' : 'config']: args[1],
          };
        }
        return descriptor.value.apply(this, [result as Snotify]);
      },
    };
  }
}
