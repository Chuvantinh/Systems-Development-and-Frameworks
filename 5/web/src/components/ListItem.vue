<template v-if="todo">
    <li>
        <template v-if="editing">
            {{ todo.id }} . {{ todo.message }}
            <button v-on:click="editing=false">Edit</button>
        </template>
        <template v-else>
            <input placeholder="Type todo here..." v-model="input"/>
            <button v-on:click="save({id: todo.id, input: input})">Save</button>
            <button v-on:click="editing=true">Cancel</button>
        </template>
        <button v-on:click="remove(todo.id)">Remove</button>
    </li>
</template>

<script>
    export default {
        name: "ListItem",
        props: ['todo'],
        data: function () {
            return {
                editing: !(this.todo.message == ""),
                input: this.todo.message,
                identifier: this.todo.id
            }
        },
        methods: {
            save: function(id, input) {
                this.$emit('save',id, input);
                this.editing = true;
            },
            remove: function(id) {
                this.$emit('remove', id);
            }
        },
    }
</script>

<style scoped>

</style>