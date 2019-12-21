const { gql } = require('apollo-server')
const server = require('../server.js')
const {createTestClient} = require('apollo-server-testing');
const jwt = require('jsonwebtoken');

const { query, mutate } = createTestClient(server);

describe('Query: Given a list of todos and assignees', () => {

    const queryTodoLength = gql`query getCountTodos {countTodos}`;
    const queryAssigneeLength = gql`query getCountAssignees {countAssignees}`;
    
    it('get all todo items at startup', () => {
        query({query: queryTodoLength}).then((result) => {
            expect(result.data.countTodos).toBe(6);
        })
    })
    it('get all assignees at startup', () => {
        query({query: queryAssigneeLength}).then((result) => {
            expect(result.data.countAssignees).toBe(3);
        })
    })

    const querySignedAssignee = gql`query getSigneAssignee($token: String!) { assignees(token: $token) {id, name} }`;   
    const tokenMessage = jwt.sign({auth: 'der richtige inhalt'}, 'shhhhh');

    it('get all assignees signed', () => {
        query({query: querySignedAssignee, variables: {token: tokenMessage}}).then((result) => {
            expect(result.data.assignees.length).toBe(3);
        })
    })
})

describe('Query: Given todos with different states', () => {

    const queryTodosByState = gql`query getTodosByState($state: State!) { todosByState(state: $state) {id, message} }`;

    it('return done todos', () => {
        query({query: queryTodosByState, variables: {state: 'DONE'}}).then((result) => {
            expect(result.data.todosByState.length).toBe(3);
        })
    })
    it('return undone todos', () => {
        query({query: queryTodosByState, variables: {state: 'UNDONE'}}).then((result) => {
            expect(result.data.todosByState.length).toBe(2);
        })
    })
    it('return in progress todos', () => {
        query({query: queryTodosByState, variables: {state: 'IN_PROGRESS'}}).then((result) => {
            expect(result.data.todosByState.length).toBe(1);
            expect(result.data.todosByState[0].message).toBe('Go shopping')
        })
    })
})

describe('Mutation: Given a new todo', () => {

    const mutateCreateTodo = gql`mutation createNewTodo($id: ID, $message: String!, $state: State, $assigneeId: ID) {
        createTodo(id: $id, message: $message, state: $state, assigneeId: $assigneeId) { id, message } 
    }`;

    describe('Add todo item with existing unique id to list', () => {
        it('reject duplicate id entry', () => {
            mutate({mutation: mutateCreateTodo, variables: 
                {id: 1, message: 'Do something', state: "UNDONE", assigneeId: 1}}).then((result) => {
                expect(result.data.createTodo).toBeNull();
            })
        })
    })
    describe('Add todo item with new unique id to list', () => {
        it('todo item was added to list', () => {
            mutate({mutation: mutateCreateTodo, variables: 
                {id: 23, message: 'Do something', state: 'UNDONE', assigneeId: 1}}).then((result) => {
                expect(result.data.createTodo).not.toBeNull();
                expect(result.data.createTodo.id).toBe('23');
                expect(result.data.createTodo.message).toEqual('Do something');
            })
        })
    })
})

describe('Mutation: Update an existing todo', () => {
    
    const mutateUpdateTodo = gql`mutation updateTodo($id: ID!, $message: String, $state: State, $assigneeId: ID) {
        updateTodo(id: $id, message: $message, state: $state, assigneeId: $ assigneeId) { id, message }}`;
    const queryTodo = gql`query getTodo($id: ID!) { todo(id: $id) { id, message, state, assigneeId } }`;

    it('todo item is updated', () => {
        mutate({mutation: mutateUpdateTodo, variables: {id: 1, message: 'New TODO', state: 'IN_PROGRESS', assigneeId: 3}}).then((result) => {
            expect(result.data.updateTodo).toBeTruthy();
        })
        query({query: queryTodo, variables: {id: 1}}).then((result) => {
            expect(result.data.todo).toMatchObject({id: '1', message: 'New TODO', state: 'IN_PROGRESS', assigneeId: '3'})
        })
    })
})

describe('Mutation: Delete an existing todo', () => {
    const mutateDeleteTodo = gql`mutation deleteTodo($id: ID!) { deleteTodo(id: $id) }`;
    const queryTodos = gql`query getTodos {todos { id, message, state }}`;

    it('todo removed from list', () => {
        mutate({mutation: mutateDeleteTodo, variables: {id: 3}}).then((result) => {
            expect(result.data.deleteTodo).toBeTruthy();
        })
        query({query: queryTodos}).then((result) => {
            expect(result.data.todos.length).toBe(6);
        })
    })
})