import { IRules } from './types';
/**
 *
 * @param ruleTree
 *
 * Validates the rule tree declaration by checking references of rule
 * functions. We deem rule tree valid if no two rules with the same name point
 * to different rules.
 *
 */
export declare function validateRuleTree(ruleTree: IRules): {
    status: 'ok';
} | {
    status: 'err';
    message: string;
};
export declare class ValidationError extends Error {
    constructor(message: string);
}
