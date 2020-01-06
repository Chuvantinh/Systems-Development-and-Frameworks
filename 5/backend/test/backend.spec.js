const { gql } = require('apollo-server')
const server = require('../server.js')
const {createTestClient} = require('apollo-server-testing');
//const jwt = require('jsonwebtoken');

const { query, mutate } = createTestClient(server);

const mutateCreateUser = gql`mutation createUser($id: ID, $role: String!, $token: String) {
    createUser(id: $id, role: $role, token: $token) { id, role, token } 
}`;

const mutateCreateProduct = gql`mutation createProduct($id: ID, $title: String!, $state: State, $category: Int) {
    createProduct(id: $id, title: $title, state: $state, category: $category) { id, title, state, category } 
}`;

const mutateCreateCategory = gql`mutation createCategory($id: ID, $title: String!) {
    createCategory(id: $id, title: $title) { id, title } 
}`;

const mutateCreateRelationship = gql`mutation createRelationship($id: ID!) {
    createRelationship(id: $id) { id } 
}`;

const mutateDeleteAll = gql`mutation deleteAll { deleteAll }`;

describe('Creation of product , category and user', () => {
    const string_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmFudGluaCJ9.kGNtLU173eM6kA7IVcGLJvLSXVlEeUXl8mnSBPZ3KF0"
    const user = { id: 100, role: 'admin', token: string_token};
    const product = { id: 1, title: 'Tshirt', state: 'ACTIVE', category: 1};
    const category = { id: 1, title: 'Clothes'};

    beforeAll(async () => {
        await mutate({mutation: mutateDeleteAll});
    })

    afterAll(async () => {
        await mutate({mutation: mutateDeleteAll});
    })

    it('Add user to db', async () => {
        await mutate({mutation: mutateCreateUser, variables: { id: user.id, role: user.role ,token: user.token}}).then((result) => {
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
})

describe('Query product and category', () => {
    beforeEach(async () => {
        await mutate({mutation: mutateDeleteAll});
        const string_token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmFudGluaCJ9.kGNtLU173eM6kA7IVcGLJvLSXVlEeUXl8mnSBPZ3KF0"
        const string_token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmFudGluaCJ9.kGNtLU173eM6kA7IVcGLJvLSXVlEeUXl8mnSBPZ3KF2"

        await mutate({mutation: mutateCreateUser, variables: {id: 1, role: 'Admin', token: string_token1}});
        await mutate({mutation: mutateCreateUser, variables: {id: 2, role: 'Editor', token: string_token2}});

        await mutate({mutation: mutateCreateProduct, variables: {id: 1, title: 'Shirt', state: 'ACTIVE', category:1}});
        await mutate({mutation: mutateCreateProduct, variables: {id: 2, message: 'Rock', state: 'ACTIVE',category: 2}});

        await mutate({mutation: mutateCreateCategory, variables: {id: 1, title: 'Chirsmart'}});
        await mutate({mutation: mutateCreateCategory, variables: {id: 2, message: 'New Year'}});

        await mutate({mutation: mutateCreateRelationship, variables: { id: 1 }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: 2 }});
    })
})