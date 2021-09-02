import { reactive, effectWatch } from './core/reactivity/reactivity.js';
import { h } from './core/h.js';

// const a = reactive({
//     value: 19
// })

// let b;
// effectWatch(() => {
//     b = a.value;
//     console.log(b);
// })
// a.value = 20;


export default {
    render(context) {
        // 构建视图 view
        //计算出最小得更新点 -> vdom(diff算法)
        // const div = document.createElement('div');
        // div.innerText = context.state.count;
        // return div;
        return h(
            'div', 
            {id: 'root-'+ context.state.count},
            [h('div', {id: 'app-id', class: "show"}, String(context.state.count)), h('p', null, 'haha')]
        );    
    },
    setup() {
        //响应式数据
        const state = reactive({
            count: 0
        })
        window.state = state;
        return {
            state
        }

    }
}

// App.render(App.setup());