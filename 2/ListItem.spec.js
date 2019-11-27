import {mount} from '@vue/test-utils'
import ListItem from './ListItem.js'

const wrapper = mount(ListItem)

describe('given a `todo`', () => {
    it('renders Edit button', () => {
        expect(wrapper.text()).toContain('Edit');
    })

    it('does not show input field', () => {
        expect(wrapper.emitted('edit', () => {
            wrapper.contains('input').tobe(true)
        }))
    })

    describe('Click on Edit button', () => {
        it('check to exist of the input field', () => {
            wrapper.find('.edit-button').trigger('click')
            wrapper.vm.editing = true
            expect(wrapper.vm.editing).toEqual(true)
            const input = wrapper.find('input')
            expect(input.is('input')).toBe(true)
        })

        describe('Edit text and Submit', () => {
            it('$emit save with edited todo', () => {
                const textInput = wrapper.find('.input-class')
                textInput.element.value = "text1"

                const button_save = wrapper.find('.save-button')
                button_save.trigger('click')

                expect(textInput.element.value).toEqual('text1')
            })
        })
    })

    describe("Click on Remove button", () => {
        it('$emits remove', () => {
            wrapper.find(".remove").trigger("click");
            expect(wrapper.emitted()).toBeTruthy()
        });
    });
})