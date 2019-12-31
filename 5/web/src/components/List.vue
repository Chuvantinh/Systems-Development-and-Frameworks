<template v-if="todos">
    <div class="list">
        <ul>
            <ListItem
                    v-for="todo in todos"
                    v-bind:todo="todo"
                    v-on:save="save"
                    v-on:remove="remove(todo.id)"
            />
        </ul>
    </div>
</template>

<script>
    import ListItem from './ListItem.vue'

    export default {
        name: 'List',
        components: {
            ListItem
        },
        props:['todos'],
        methods: {
            save : function(id, input) {
                this.$emit('save-list', id, input);
            },
            remove : function(id) {
                this.$emit('remove', id)
            }
        }
    }
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        display: grid;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

</style>
