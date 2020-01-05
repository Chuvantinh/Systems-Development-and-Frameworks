const { gql } = require('apollo-server')
const server = require('../server.js')
const {createTestClient} = require('apollo-server-testing');
//const jwt = require('jsonwebtoken');

const { query, mutate } = createTestClient(server);

const mutateDeleteAllTodos = gql`mutation deleteAllTodos { deleteAllTodos }`;
const mutateDeleteAllAssignees = gql`mutation deleteAllAssignees { deleteAllAssignees }`;

const mutateCreateAssignee = gql`mutation createAssignee($id: ID, $name: String!, $role: String, $token : String) {
    createAssignee(id: $id, name: $name, role: $role, token: $token) { id, name, role, token }
}`;

const mutateCreateTodo = gql`mutation createTodo($id: ID, $message: String!, $state: State, $assignee: String) {
    createTodo(id: $id, message: $message, state: $state, assignee: $assignee) { id, message } 
}`;

const mutateCreateRelationship = gql`mutation createRelationship($id: ID!, $name: String!) {
    createRelationship(id: $id, name: $name) { id } 
}`;

describe('Creation of assignees and todo items', () => {
    const string_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmFudGluaCJ9.kGNtLU173eM6kA7IVcGLJvLSXVlEeUXl8mnSBPZ3KF0"
    const assignee = { id: '100', name: 'SomeoneElse', role: 'admin', token: string_token};
    const todo = { id: '200', message: 'Just another new task', state: 'IN_PROGRESS', assignee: '1'};

    beforeAll(async () => {
        await mutate({mutation: mutateDeleteAllTodos});
        await mutate({mutation: mutateDeleteAllAssignees});
    })

    afterAll(async () => {
        await mutate({mutation: mutateDeleteAllTodos});
        await mutate({mutation: mutateDeleteAllAssignees});
    })

    it('Add assignee to db', async () => {
        await mutate({mutation: mutateCreateAssignee, variables: { id: assignee.id, name: assignee.name, role: assignee.role, token: assignee.token }}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })

    it('Add todo item to db', async () => {
        await mutate({mutation: mutateCreateTodo, variables:
                {id: todo.id, message: todo.message, state: todo.state, assignee: todo.assignee }}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })

    it('Create relationship between todo and assignee', async () => {
        await mutate({mutation: mutateCreateRelationship, variables: { id: todo.id, name: assignee.name }}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })
})

const querygetTodoByAssigneeID = gql`query getAssigneeByTodo($id: String!) { getAssigneeByTodo(id: $id) { name, role }}`;
//const queryTodosAssigneeShield = gql`query getAssigneeByAssigneeIDwithShield($assignee: String!) { getAssigneeByAssigneeIDwithShield(assignee: $assignee) { id, name, role}}`;

describe('Query assignees and todo items', () => {

    beforeEach(async () => {
        await mutate({mutation: mutateDeleteAllTodos});
        await mutate({mutation: mutateDeleteAllAssignees});
        const string_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmFudGluaCJ9.kGNtLU173eM6kA7IVcGLJvLSXVlEeUXl8mnSBPZ3KF0"
        await mutate({mutation: mutateCreateAssignee, variables: {id: '1', name: 'Tinh', role: 'admin', token: string_token}});
        await mutate({mutation: mutateCreateAssignee, variables: {id: '2', name: 'Micha', role: 'editor', token: "abcdef"}});

        await mutate({mutation: mutateCreateTodo, variables: {id: '1', message: 'Clean up', state: 'UNDONE',assignee: "1"}});
        await mutate({mutation: mutateCreateTodo, variables: {id: '2', message: 'Go shopping', state: 'UNDONE',assignee: "1"}});
        await mutate({mutation: mutateCreateTodo, variables: {id: '3', message: 'Make homework', state: 'IN_PROGRESS',assignee: "1"}});
        await mutate({mutation: mutateCreateTodo, variables: {id: '4', message: 'Work', state: 'IN_PROGRESS',assignee: "2"}});
        await mutate({mutation: mutateCreateTodo, variables: {id: '5', message: 'Do sport2', state: 'UNDONE',assignee: "2"}});

        await mutate({mutation: mutateCreateRelationship, variables: { id: '1', name: 'Tinh' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '2', name: 'Micha' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '3', name: 'Tinh' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '3', name: 'Micha' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '4', name: 'Tinh' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '4', name: 'Micha' }});
    })

    it('Test return Assignee Object with parameter `String assignee` ', async () => {
        await query({query: querygetTodoByAssigneeID, variables: {assignee: "1"}}).then((result) => {
            console.log(result.data)
            expect(result.data).toBeTruthy();
        });
    })
})