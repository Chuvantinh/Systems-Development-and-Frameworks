const { rule, shield , and , or, not} = require('graphql-shield')

const isAdmin = rule({cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        return ctx.user.data.role === "Admin";
    }
)

const permissions = shield({
    Query: {
        getProduct: isAdmin
    },
})

module.exports = permissions