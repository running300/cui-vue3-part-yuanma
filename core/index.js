import { effectWatch } from './reactivity/reactivity.js';
import {mountElement, diff} from './renderer/index.js';

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const context = rootComponent.setup();
            let isMounted = false;
            let preSubTree;

            effectWatch(() => {
                if(!isMounted) {//初始化的过程
                    //第一个走过后,说明已经渲染过了,下一次走diff算法
                    isMounted = true;
                    rootContainer.innerHTML = ``;
                    // const element = rootComponent.render(context);
                    // rootContainer.append(element);
                    const subTree = rootComponent.render(context);
                    // rootContainer.append(element);

                    // 把虚拟dom构建成真实得dom
                    // 虚拟节点 容器 参数
                    mountElement(subTree, rootContainer);
                    preSubTree = subTree;//保留老的节点
                }else {
                    const subTree = rootComponent.render(context);
                    diff(preSubTree, subTree);//diff一下老节点 和 新节点
                    preSubTree = subTree;//更新老节点
                }
                
            })
            
        }
    }
}