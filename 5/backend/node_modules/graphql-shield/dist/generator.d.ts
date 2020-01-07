import { IMiddlewareGeneratorConstructor } from 'graphql-middleware';
import { IRules, IOptions } from './types';
/**
 *
 * @param ruleTree
 * @param options
 *
 * Generates middleware from given rules.
 *
 */
export declare function generateMiddlewareGeneratorFromRuleTree<TSource = any, TContext = any, TArgs = any>(ruleTree: IRules, options: IOptions): IMiddlewareGeneratorConstructor<TSource, TContext, TArgs>;
