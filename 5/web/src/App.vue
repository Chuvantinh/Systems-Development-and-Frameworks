<template v-if="todos">
    <div id="app">
        <img src="./assets/logo.png">
        <List v-bind:todos="todos" v-on:remove="remove" v-on:save="save"/>
        <button v-on:click="add">Add new todo</button>
    </div>
</template>

<script>
    import List from './components/List.vue'

    export default {
        name: 'App',
        components: {
            List
        },
        data () {
            return {
                todos: [
                    {id: '0', message: 'Foo',},
                    {id: '1', message: 'Bar',},
                    {id: '2', message: 'Pub',}
                ]
            }
        },
        methods: {
            add:  () => {
                this.todos.push({id: this.getId(), message: ''});
            },
            save: function (index, input) {
                this.todos[index].message = input;
            },
            remove: (id) => {
                this.todos.splice(id, 1);
            },
            getId:  () => {
                return this.cId++;
            }
        },
        created: () => {
            if (this.cId === -1) {
                this.cId = this.todos.length + 1;
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
