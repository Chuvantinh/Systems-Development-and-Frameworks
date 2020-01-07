"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash = require("object-hash");
const graphql_middleware_1 = require("graphql-middleware");
const validation_1 = require("./validation");
const generator_1 = require("./generator");
const constructors_1 = require("./constructors");
const utils_1 = require("./utils");
/**
 *
 * @param options
 *
 * Makes sure all of defined rules are in accord with the options
 * shield can process.
 *
 */
function normalizeOptions(options) {
    if (typeof options.fallbackError === 'string') {
        options.fallbackError = new Error(options.fallbackError);
    }
    return {
        debug: options.debug !== undefined ? options.debug : false,
        allowExternalErrors: utils_1.withDefault(false)(options.allowExternalErrors),
        fallbackRule: utils_1.withDefault(constructors_1.allow)(options.fallbackRule),
        fallbackError: utils_1.withDefault(new Error('Not Authorised!'))(options.fallbackError),
        hashFunction: utils_1.withDefault(hash)(options.hashFunction),
    };
}
/**
 *
 * @param ruleTree
 * @param options
 *
 * Validates rules and generates middleware from defined rule tree.
 *
 */
function shield(ruleTree, options = {}) {
    const normalizedOptions = normalizeOptions(options);
    const ruleTreeValidity = validation_1.validateRuleTree(ruleTree);
    if (ruleTreeValidity.status === 'ok') {
        const generatorFunction = generator_1.generateMiddlewareGeneratorFromRuleTree(ruleTree, normalizedOptions);
        return graphql_middleware_1.middleware(generatorFunction);
    }
    else {
        throw new validation_1.ValidationError(ruleTreeValidity.message);
    }
}
exports.shield = shield;
//# sourceMappingURL=shield.js.map