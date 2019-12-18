const { gql } = require('apollo-server')
const server = require('../server.js')
const {createTestClient} = require('apollo-server-testing');
//const jwt = require('jsonwebtoken');

const { query, mutate } = createTestClient(server);

const mutateDeleteAllTodos = gql`mutation deleteAllTodos { deleteAllTodos }`;
const mutateDeleteAllAssignees = gql`mutation deleteAllAssignees { deleteAllAssignees }`;

const mutateCreateAssignee = gql`mutation createAssignee($id: ID, $name: String!) {
    createAssignee(id: $id, name: $name) { id, name } 
}`;

const mutateCreateTodo = gql`mutation createTodo($id: ID, $message: String!, $state: State) {
    createTodo(id: $id, message: $message, state: $state) { id, message } 
}`;

const mutateCreateRelationship = gql`mutation createRelationship($id: ID!, $name: String!) {
    createRelationship(id: $id, name: $name) { id } 
}`;

describe('Creation of assignees and todo items', () => {

    const assignee = { id: '100', name: 'SomeoneElse'};
    const todo = { id: '200', message: 'Just another new task', state: 'IN_PROGRESS'};  

    beforeAll(async () => {
        await mutate({mutation: mutateDeleteAllTodos});
        await mutate({mutation: mutateDeleteAllAssignees});
    })

    afterAll(async () => {
        await mutate({mutation: mutateDeleteAllTodos});
        await mutate({mutation: mutateDeleteAllAssignees});
    })

    it('Add assignee to db', async () => {
        await mutate({mutation: mutateCreateAssignee, variables: { id: assignee.id, name: assignee.name }}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })

    it('Add todo item to db', async () => {
        await mutate({mutation: mutateCreateTodo, variables: 
            {id: todo.id, message: todo.message, state: todo.state }}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })
    
    it('Create relationship between todo and assignee', async () => {
        await mutate({mutation: mutateCreateRelationship, variables: { id: todo.id, name: assignee.name }}).then((result) => {
            expect(result.data).toBeTruthy();
        });
    })
})

const queryTodos = gql`query todos {todos { id, message, state }}`;
const queryTodoByID = gql`query todo($id: ID!) { todo(id: $id) { id, message, state }}`;
const queryTodosOrdered = gql`query todosOrderedByState($sortOrder: Order!) { todosOrderedByState(sortOrder: $sortOrder) { id, message, state }}`;
const querySkipAndLimit = gql`query skipAndLimitTodos($skip: Int, $limit: Int) { skipAndLimitTodos(skip: $skip, limit: $limit) { id, message, state }}`;

const mutateSetTodoState = gql`mutation setTodoState($id: ID!, $state: State!) { setTodoState(id: $id, state: $state) {id, message, state }}`;

describe('Query assignees and todo items', () => {

    beforeEach(async () => {
        await mutate({mutation: mutateDeleteAllTodos});
        await mutate({mutation: mutateDeleteAllAssignees});

        await mutate({mutation: mutateCreateAssignee, variables: {id: '1', name: 'Tinh'}});
        await mutate({mutation: mutateCreateAssignee, variables: {id: '2', name: 'Micha'}});

        await mutate({mutation: mutateCreateTodo, variables: {id: '1', message: 'Clean up', state: 'UNDONE'}});
        await  mutate({mutation: mutateCreateTodo, variables: {id: '2', message: 'Go shopping', state: 'UNDONE'}});
        await mutate({mutation: mutateCreateTodo, variables: {id: '3', message: 'Make homework', state: 'IN_PROGRESS'}});
        await mutate({mutation: mutateCreateTodo, variables: {id: '4', message: 'Work', state: 'IN_PROGRESS'}});
        await mutate({mutation: mutateCreateTodo, variables: {id: '5', message: 'Do sport', state: 'UNDONE'}});

        await mutate({mutation: mutateCreateRelationship, variables: { id: '1', name: 'Tinh' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '2', name: 'Micha' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '3', name: 'Tinh' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '3', name: 'Micha' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '4', name: 'Tinh' }});
        await mutate({mutation: mutateCreateRelationship, variables: { id: '4', name: 'Micha' }});
    })

    it('Get all todo items', async () => {
        await query({query: queryTodos}).then((result) => {
            expect(result.data.todos.length).toBe(5);
        });
    })

    it('Get todo item by ID', async () => {
        await query({query: queryTodoByID, variables: { id: '1' }}).then((result) => {
            expect(result.data.todo).toMatchObject({ id: '1', message: 'Clean up', state: 'UNDONE'});
        });
    })

    it('Order todo by state ASC', async () => {
        await query({query: queryTodosOrdered, variables: {sortOrder: 'ASC'}}).then((result) => {
            expect(result.data.todosOrderedByState[0].state).toBe('IN_PROGRESS');
        });
    })

    it('Order todo by state DESC', async () => {
        await query({query: queryTodosOrdered, variables: {sortOrder: 'DESC'}}).then((result) => {
            expect(result.data.todosOrderedByState[0].state).toBe('UNDONE');
        });
    })

    it('Set todo state', async () => {
        await mutate({mutation: mutateSetTodoState, variables: { id: '1', state: 'DONE' }}).then((result) => {
            expect(result.data.setTodoState).toMatchObject({id: '1', state: 'DONE'});
        });
    })

    it('Skip and limit todos', async () => {
        await mutate({mutation: querySkipAndLimit, variables: { skip: 1, limit: 2}}).then((result) => {
            expect(result.data.skipAndLimitTodos.length).toBe(2);
        });
    })
})