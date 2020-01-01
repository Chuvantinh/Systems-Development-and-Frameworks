<template v-if="todos">
    <div id="app">
        <img src="./assets/logo.png">
        <List v-bind:todos="todos" v-on:remove="remove" v-on:save-list="savelist"/>
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
                    {id: '1', message: 'Foo',},
                    {id: '2', message: 'Bar',},
                    {id: '3', message: 'Pub',}
                ],
                cId: 3
            }
        },
        methods: {
            add: function () {
                this.todos.push({id: this.getId(), message: ""});
                this.cId++;
            },
            savelist: function (index, input) {
                console.log(input)
                if(input != undefined){
                    this.todos[index].message = input;
                }
            },
            remove: function (id) {
                this.todos.forEach((currentElement, index_inside) => {
                    if(currentElement.id == id){
                        this.todos.splice(index_inside, 1)
                    }
                })
            },
            getId: function () {
                return this.cId + 1;
            }
        },
        created: function () {
                this.cId = this.todos.length;
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
