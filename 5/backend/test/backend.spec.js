const { gql } = require('apollo-server')
const {createTestClient} = require('apollo-server-testing');
let server = require('../server.js')

const {  query ,mutate } = createTestClient(server)

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
    })

    afterAll(async () => {
        await mutate({mutation: mutateDeleteAll});
    })

    it('Add user to db', async () => {
        await mutate({mutation: mutateCreateUser, variables: { id: user.id, username : user.username, password : user.password, role: user.role}}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    });

    it('Add product to db', async () => {
        await mutate({mutation: mutateCreateProduct, variables: { id: product.id, title: product.title, state: product.state, category: product.category }}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    });

    it('Add category db', async () => {
        await mutate({mutation: mutateCreateCategory, variables: { id: category.id, title: category.title}}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    });

    it('Create relationship between product and assignee', async () => {
        await mutate({mutation: mutateCreateRelationship, variables: { id: product.id}}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    });

    it('Check login', async () => {
         await mutate({mutation: mutateLogin, variables: { username: user.username, password: user.password}}).then((result) => {
             //expect(result.data).toBeTruthy();
         });
    });
});
describe('QUERY product and category', () => {
    beforeEach(async () => {

        await mutate({mutation: mutateDeleteAll});

        await mutate({mutation: mutateCreateUser, variables: {id: 1, username: "admin", password: "1234", role: 'Admin'}});
        await mutate({mutation: mutateCreateUser, variables: {id: 2, username: "editor", password: "1234", role: 'Editor'}});

        await mutate({mutation: mutateCreateProduct, variables: {id: 1, title: 'Shirt', state: 'ACTIVE', category:1}});
        await mutate({mutation: mutateCreateProduct, variables: {id: 2, title: 'Rock', state: 'ACTIVE',category: 2}});

        await mutate({mutation: mutateCreateCategory, variables: {id: 1, title: 'Chirsmart'}});
        await mutate({mutation: mutateCreateCategory, variables: {id: 2, title: 'New Year'}});

        await mutate({mutation: mutateCreateRelationship, variables: { id: 1 }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: 2 }});
    });

    it('getCategoryByCategoryInProduct by ID in Product', async () => {
        const querygetCategoryByCategoryInProduct = gql`query getCategoryByCategoryInProduct ($category: Int!)
        {getCategoryByCategoryInProduct (category : $category){ id, title }}`;
        await query({query: querygetCategoryByCategoryInProduct, variables: {category: 1}}).then((result) => {
            expect(result.data.getCategoryByCategoryInProduct.title).toBe('Chirsmart');
        });
    });
});