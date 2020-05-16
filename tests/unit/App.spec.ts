import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  it('generateMatrix', () => {
    const wrapper = shallowMount(App)
    const vm = wrapper.vm

    /* Fix the error */
    // expect(vm.matrix).toBe(0)
    
  })
})
