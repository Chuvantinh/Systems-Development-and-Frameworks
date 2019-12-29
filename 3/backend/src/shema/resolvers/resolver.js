const uid = require('uuid/v4');
const assignees = require('../../datasource/datasource.js').assignees;
const todos = require('../../datasource/datasource.js').todos;
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
        assignees: (parent, {token}) => {
            var decode = jwt.verify(token, 'shhhhh')
            if(decode.auth == 'der richtige inhalt') {
                return assignees;
            } else {
                return null;
            }
        },
        assignee: (parent, {id}) => { return assignees.filter(x => x.id = id); },
        todos: () => { return todos; },
        todo: (parent, {id} ) => { return todos.filter(x => x.id === id)[0]; },
        todosForAssigneeId: (parent, {id}) => { return todos.filter(x => x.assigneeId === id); },
        countTodos: () => { return todos != null? todos.length : 0; },
        countAssignees: () => { return assignees != null? assignees.length : 0; },
        todosByState: (parent, {state}) => { return todos.filter(x => x.state === state); }
    },
    Mutation: {
        createTodo: (parent, args) => {

            if(args.id != null) {
                if(todos.some(obj => obj.id === args.id)) {
                    return null;
                } else {
                    const todo = { id: args.id,
                        message: args.message,
                        state: args.state,
                        assigneeId: args.id};
                    todos.push(todo);
                    return todo;
                }
            } else {
                const todo = { id: uid(),
                    message: args.message,
                    state: args.state,
                    assigneeId: args.id};
                todos.push(todo);
                return todo;
            }
        },
        createAssignee: (parent, args) => {
            const assignee = {
                id: uid(),
                name: args.name,
            }
            assignees.push(assignee);
            return assignee;
        },
        updateTodo: (parent, args) => {
            const index = todos.findIndex(obj => obj.id === args.id);
            if(args.message != null) todos[index].message = args.message;
            if(args.state != null) todos[index].state = args.state;
            if(args.id != null) todos[index].assigneeId = args.assigneeId;
            return todos[index];
        },
        updateAssignee: (parent, args) => {
            const index = assignees.findIndex(obj => obj.id === args.id);
            if(args.name != null) assignees[index].name = args.name;
            return assignees[index];
        },
        deleteTodo: (parent, args) => {
            const index = todos.findIndex(obj => obj.id === args.id);
            if(index === null) return false;
            todos.splice(index,  1);
            return true;
        },
        deleteTodosForAssignee: (parent, args) => {
            const indices = todos.findIndex(obj => obj.assigneeId = args.assigneeId);
            if(indices === null) return false;
            indices.array.forEach(element => {
                todos.splice(element, 1);
            });
            return true;
        },
        deleteAssignee: (parent, args) => {
            const index = assignees.findIndex(obj => obj.id === args.id)
            if(index === null) return false;
            assignees.splice(index, 1);
            return true;
        }
    }
};

module.exports = resolvers;