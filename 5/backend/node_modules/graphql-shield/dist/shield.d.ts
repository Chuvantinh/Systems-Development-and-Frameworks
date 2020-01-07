import { IMiddlewareGenerator } from 'graphql-middleware';
import { IRules, IOptionsConstructor } from './types';
/**
 *
 * @param ruleTree
 * @param options
 *
 * Validates rules and generates middleware from defined rule tree.
 *
 */
export declare function shield<TSource = any, TContext = any, TArgs = any>(ruleTree: IRules, options?: IOptionsConstructor): IMiddlewareGenerator<TSource, TContext, TArgs>;
