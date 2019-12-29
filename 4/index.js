const server = require('./server.js')

server.listen(3003, 'localhost').then(({ url }) => {
    console.log(`GraphQL API ready at ${url}`);
});