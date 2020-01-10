const { rule, shield , and , or, not} = require('graphql-shield')

const isAdmin = rule({cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        if(ctx.user == null){
            return new Error('ERORR NOT ADMIN')
        }else{
            return ctx.user.data.role === "Admin";
        }

    }
)

const permissions = shield({
    Query: {
        getProduct: isAdmin,
        getCategory: isAdmin
    },
})

module.exports = permissions