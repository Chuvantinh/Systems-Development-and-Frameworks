const { jwt } = require('jsonwebtoken');

const decode = async (driver, authorizationHeader) => {
    if (!authorizationHeader) return null

    const string_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmFudGluaCJ9.kGNtLU173eM6kA7IVcGLJvLSXVlEeUXl8mnSBPZ3KF0"

    /*
    const token = authorizationHeader.replace('Bearer ', '')
    let decoded
    try {
        decoded = await jwt.verify(token, 'Security-abc-123')
    } catch (err) {
        return null
    }
    */

    const session = driver.session()
    const cypherQuery = 'MATCH (a:Assignee) ' +
        'where a.token = $token ' +
        'RETURN a';
    const result = await session.run(cypherQuery, { token: string_token});
    const data = result.records.map(record => record.get('a').properties)[0];

    return {
        data
    }
}

module.exports.decode = decode;