const { rule, shield , and , or, not} = require('graphql-shield')
//rule
const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return ctx.user.name + "-" +ctx.user.role;
})

const isAdmin = rule({cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        return ctx.user.role === "admin"
    },
)

const permissions = shield({
    Query: {
        countTodos: and(isAuthenticated,isAdmin),
        todosByState: isAdmin
    },
})

module.exports = permissions