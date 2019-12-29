const { jwt } = require('jsonwebtoken');

const decode = async (driver, req) => {
    console.log(req);

    try {
        //name is {name;vantinh}, security is angichua
        let decoded = await jwt.verify(token, 'angichua')
        if(decoded.name = "vantinh"){
            const session = driver.session()
            const cypherQuery = 'MATCH (a:Assignee) ' +
                'where a.token = $token ' +
                'RETURN a';
            const result = await session.run(cypherQuery, { token: token});
            const data = result.records.map(record => record.get('a').properties)[0];

            return {
                data
            }
        }
    } catch (err) {
        return null
    }
}

module.exports.decode = decode;