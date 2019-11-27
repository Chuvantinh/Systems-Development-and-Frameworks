//todo_item
export default {
    template: `<li>
	<template v-if="!editing">
		<button v-on:click="editing=false" class="edit-button">Edit</button>
	</template>
	<template v-else>
		<input placeholder="Type todo here..." class="input-class" v-model="input"/>
		<button v-on:click="save" class="save-button">Save</button>\
		<button v-on:click="editing=true">Cancel</button>
	</template>
	<button v-on:click="remove" class="remove">Remove</button>
    </li>`,
    props: ['todo'],
    data: function() {
        return {
            editing: false,
            input: 'test',
            identifier: 1
        }
    },
    methods: {
        save: function() {
            this.$emit('save', this.input);
            this.editing = true;
        },
        remove: function() {
            this.$emit('remove', this.identifier)
        }
    }
}
