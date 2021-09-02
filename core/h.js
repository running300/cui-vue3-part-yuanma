// 创建一个虚拟节点 vdom
export function h(tag, props, children) {
    return {
        tag,
        props,
        children
    };
}