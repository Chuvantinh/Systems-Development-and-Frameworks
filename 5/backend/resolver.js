const uuid = require('uuid/v1');
const jwt = require('jsonwebtoken');
const SECRET = "Friday for future";
const resolvers = {
    Query: {
        getCategoryByCategoryInProduct : async (object, args, context) => {
            const session = context.driver.session();
            try{
                const cypherQuery = 'MATCH (p:Product { category: $category })-[:ASSIGNED_TO]->(c:Category)' +
                    'RETURN c';
                const result = await session.run(cypherQuery, { category: args.category });
                const data = result.records.map(record => record.get('c').properties)[0];
                return data;
            } finally {
                session.close();
            }
        },
        getProduct: async (object, args, context) => {
            const session = context.driver.session();
            try{
                const cypherQuery = '' +
                    'MATCH (p:Product)' +
                    'where p.id = $id ' +
                    'RETURN p';
                const result = await session.run(cypherQuery, { id: args.id });
                const data = result.records.map(record => record.get('p').properties)[0];
                return data;
            } finally {
                session.close();
            }
        },
        getCategory: async (object, args, context) => {
            const session = context.driver.session();
            try{
                const cypherQuery = '' +
                    'MATCH (c:Category)' +
                    'where c.id = $id ' +
                    'RETURN c';
                const result = await session.run(cypherQuery, { id: args.id });
                const data = result.records.map(record => record.get('c').properties)[0];
                return data;
            } finally {
                session.close();
            }
        }
    },
    Mutation: {
        createUser: async (object, args, context, resolveInfo) => {
            const id = args.id || uuid();
            const session = context.driver.session();
            try {
                const cypherCreation = 'CREATE (u:User { id: $id, username : $username , password : $password ,role: $role })';

                await session.run(cypherCreation, {
                    id: id,
                    username: args.username,
                    password: args.password,
                    role: args.role,
                });
                return true;
            }
            finally {
                session.close();
            }
        },
        createProduct: async (object, args, context, resolveInfo) => {
            const id = args.id || uuid();

            const session = context.driver.session();
            try {
                const cypherCreation = 'CREATE (p:Product { id: $id, title: $title, state: $state, category: $category })';

                await session.run(cypherCreation, {
                    id: id,
                    title: args.title,
                    state: args.state,
                    category: args.category
                });
                return true;
            }
            finally {
                session.close();
            }
        },
        createCategory: async (object, args, context, resolveInfo) => {
            const catID = args.id || uuid();
            const session = context.driver.session();
            try {
                const cypherCreation = 'CREATE (c:Category { id: $id, title: $title})';

                await session.run(cypherCreation, {
                    id: catID,
                    title: args.title,
                });
                return true;
            }
            finally {
                session.close();
            }
        },
        createRelationship: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();

            try {
                const cypherRelation = 'MATCH (a:Product), (c:Category) ' +
                    'WHERE a.id = $id AND c.id = $id ' +
                    'CREATE (a)-[r:ASSIGNED_TO]->(c) RETURN type(r)';

                await session.run(cypherRelation, {
                    name: args.name,
                    id: args.id
                });
                return true;
            } finally {
                session.close();
            }
        },
        deleteAll: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();
            try {
                const cypherDelete = 'MATCH (n) DETACH DELETE n';
                await session.run(cypherDelete, { id: args.id });
                return true;
            } finally {
                session.close();
            }
        },
        login: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();
            try {
                const cypherQuery = '' +
                    'MATCH (u:User) ' +
                    'where u.username = $username and u.password = $password ' +
                    'RETURN u';
                const result = await session.run(cypherQuery, { username: args.username, password: args.password });
                const data = result.records.map(record => record.get('u').properties)[0];
                if(data) {
                    let tokenMessage = jwt.sign({username: args.username, password: args.password}, SECRET);
                    return tokenMessage
                }else{
                    if (!data) {
                        throw new Error('No user with that email')
                    }
                }

            } finally {
                session.close();
            }
        },
    },
};

module.exports = resolvers;