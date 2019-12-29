const { rule, shield , and , or, not} = require('graphql-shield')
const { ApolloError } = require('apollo-server');
//rule
const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return ctx.assignee.name + "-" +ctx.assignee.role;
})

const isAdmin = rule({cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        if(ctx.user.data.role === "admin"){
            return true
        }else{
            return new ApolloError("vao day");
        }
    },
)

const permissions = shield({
    Query: {
        getTodobyID: true
    },
})

module.exports = permissions