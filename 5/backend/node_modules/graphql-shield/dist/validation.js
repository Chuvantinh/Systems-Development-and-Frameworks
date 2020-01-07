"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
/**
 *
 * @param ruleTree
 *
 * Validates the rule tree declaration by checking references of rule
 * functions. We deem rule tree valid if no two rules with the same name point
 * to different rules.
 *
 */
function validateRuleTree(ruleTree) {
    const rules = extractRules(ruleTree);
    const valid = rules.reduce(({ map, duplicates }, rule) => {
        if (!map.has(rule.name)) {
            return { map: map.set(rule.name, rule), duplicates };
        }
        else if (!map.get(rule.name).equals(rule) &&
            !duplicates.includes(rule.name)) {
            return {
                map: map.set(rule.name, rule),
                duplicates: [...duplicates, rule.name],
            };
        }
        else {
            return { map, duplicates };
        }
    }, { map: new Map(), duplicates: [] });
    if (valid.duplicates.length === 0) {
        return { status: 'ok' };
    }
    else {
        const duplicates = valid.duplicates.join(', ');
        return {
            status: 'err',
            message: `There seem to be multiple definitions of these rules: ${duplicates}`,
        };
    }
    /* Helper functions */
    /**
     *
     * @param ruleTree
     *
     * Extracts rules from rule tree.
     *
     */
    function extractRules(ruleTree) {
        const resolvers = utils_1.flattenObjectOf(ruleTree, utils_1.isRuleFunction);
        const rules = resolvers.reduce((rules, rule) => {
            if (utils_1.isLogicRule(rule)) {
                return [...rules, ...extractLogicRules(rule)];
            }
            else {
                return [...rules, rule];
            }
        }, []);
        return rules;
    }
    /**
     *
     * Recursively extracts Rules from LogicRule
     *
     * @param rule
     */
    function extractLogicRules(rule) {
        return rule.getRules().reduce((acc, shieldRule) => {
            if (utils_1.isLogicRule(shieldRule)) {
                return [...acc, ...extractLogicRules(shieldRule)];
            }
            else {
                return [...acc, shieldRule];
            }
        }, []);
    }
}
exports.validateRuleTree = validateRuleTree;
class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation.js.map