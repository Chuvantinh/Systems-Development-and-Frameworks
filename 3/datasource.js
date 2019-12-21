const assignees = [
    {
        id: '1',
        name: 'Tinh',
    },
    {
        id: '2',
        name: 'Arnauld',
    },
    {
        id: '3',
        name: 'Micha',
    },
];

const todos = [
    {
        id: '1',
        message: 'Clean up',
        state: "DONE",
        assigneeId: '1',
    },
    {
        id: '2',
        message: 'Make homework',
        state: "UNDONE",
        assigneeId: '1',
    },
    {
        id: '3',
        message: 'Cook',
        state: "DONE",
        assigneeId: '2',
    },
    {
        id: '4',
        message: 'Go shopping',
        state: "IN_PROGRESS",
        assigneeId: '2',
    },
    {
        id: '5',
        message: 'See friends',
        state: "DONE",
        assigneeId: '3',
    },
    {
        id: '6',
        message: 'Do sth else',
        state: "UNDONE",
        assigneeId: '3',
    },
];

module.exports.assignees = assignees;
module.exports.todos = todos;