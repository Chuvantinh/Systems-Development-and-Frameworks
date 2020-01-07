const { gql } = require('apollo-server')
const neo4j = require('neo4j-driver');
const {createTestClient} = require('apollo-server-testing');

//const jwt = require('jsonwebtoken');
//const { setContext } = require('apollo-link-context');
//const server = require('../server.js')


let driver;
let query;
let mutate;
let token;

const mutateCreateUser = gql`mutation createUser($id: ID, $username: String, $password: String, $role: String!) {
    createUser(id: $id, username : $username, password: $password, role: $role) { id, role } 
}`;

const mutateCreateProduct = gql`mutation createProduct($id: ID, $title: String!, $state: String, $category: Int) {
    createProduct(id: $id, title: $title, state: $state, category: $category) { id, title } 
}`;

const mutateCreateCategory = gql`mutation createCategory($id: ID, $title: String!) {
    createCategory(id: $id, title: $title) { id, title } 
}`;

const mutateCreateRelationship = gql`mutation createRelationship($id: ID!) {
    createRelationship(id: $id) { id } 
}`;

const mutateLogin = gql`mutation login($username: String, $password: String){
    login(username: $username, password : $password){ id,username, password, role }
}`

const mutateDeleteAll = gql`mutation deleteAll { deleteAll }`;

describe('MUTATION Creation of product , category and user', () => {
    const user = { id: 1, username: 'admin',password: '1234',role: 'admin'};
    const product = { id: 1, title: 'Tshirt', state: 'ACTIVE', category: 1};
    const category = { id: 1, title: 'Clothes'};

    beforeAll(async () => {
        await mutate({mutation: mutateDeleteAll});

        CreateTestServer()
    })

    afterAll(async () => {
        await mutate({mutation: mutateDeleteAll});

        CreateTestServer()
    })

    it('Add user to db', async () => {
        await mutate({mutation: mutateCreateUser, variables: { id: user.id, username : user.username, password : user.password, role: user.role}}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })

    it('Add product to db', async () => {
        await mutate({mutation: mutateCreateProduct, variables: { id: product.id, title: product.title, state: product.state, category: product.category }}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })

    it('Add category db', async () => {
        await mutate({mutation: mutateCreateCategory, variables: { id: category.id, title: category.title}}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })

    it('Create relationship between product and assignee', async () => {
        await mutate({mutation: mutateCreateRelationship, variables: { id: product.id}}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })

    it('Check login', async () => {
        await mutate({mutation: mutateLogin, variables: { username: user.username, password: user.password}}).then((result) => {
            expect(result.data.login).toBeTruthy();
        });
    })
})

describe('QUERY product and category', () => {
    beforeEach(async () => {
        await mutate({mutation: mutateDeleteAll});

        CreateTestServer()
    })

    it('getCategoryByCategoryInProduct by ID in Product', async () => {
        const querygetCategoryByCategoryInProduct = gql`query getCategoryByCategoryInProduct ($category: Int!)
        {getCategoryByCategoryInProduct (category : $category){ id, title }}`;
        await query({query: querygetCategoryByCategoryInProduct, variables: {category: 1}}).then((result) => {
            expect(result.data.getCategoryByCategoryInProduct.title).toBe('Chirsmart');
        });
    })

    it('getProduct by ID with true token', async () => {

        const querygetProduct = gql`query getProduct ($id: String!)
        {getProduct (id : $id){ id, title }}`;
        await query({query: querygetProduct, variables: {id: "1"}}).then((result) => {
            console.log(result.data);
            expect(result.data.getProduct.title).toBe('Shirt');
        });
    })

    it('getCategory by ID with true token', async () => {
        const token = "adfaf";
    })

})

const CreateTestServer =  async () => {
    await mutate({mutation: mutateLogin, variables: { username: "admin", password: "1234" }}).then((result) => {
        token = result.data.login
    });
    driver = neo4j.driver(
        "bolt://localhost:7687",
        neo4j.auth.basic('neo4j', '1234')
    );

    const { testServer } = constructTestServer();
    testServer.requestOptions = {
        context: async ({  }) => {
            let user = null

            if(typeof req.headers.authorization == "undefined" || typeof req == "undefined"){
                user = null
            }else{
                user = await decode(driver, token);
            }
            return {
                driver,
                user
            }
        },
    };
    query = createTestClient(testServer).query;
    mutate = createTestClient(testServer).mutate;
    return {
        query,
        mutate,
        token,
        driver
    }
}