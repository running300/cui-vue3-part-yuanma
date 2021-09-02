//vdom -> dom
export function mountElement(vnode, container) {
    const { tag, props, children } = vnode;
    //tag
    const el = (vnode.el = document.createElement(tag));
    //props
    if(props) {
        for(const key in props) {
            const val = props[key];
            //设置props
            el.setAttribute(key, val);
        }
    }

    //children
    //1.可以接受字符串类型的
    if(typeof children === 'string') {
        const textNode = document.createTextNode(children);
        el.append(textNode);
    }else if(Array.isArray(children)) {
        ////2.可以接受数组 - 递归渲染
        children.forEach(v => {
            mountElement(v, el);
        })
    }
    
    //插入
    container.append(el);
}

//老的虚拟节点
export function diff(n1, n2) {
    console.log(n1, n2)
    //tag
    if(n1.tag !== n2.tag) {
        //替换
        n1.el.replaceWith(document.createElement(n2.tag));
    }else {
        // 把之气那的el赋值一下,
        n2.el = n1.el;
        //props
        const {props: newProps} = n2;
        const {props: oldProps} = n1;
        console.log(oldProps, newProps)
        if(newProps && oldProps) {
            Object.keys(newProps).forEach(key => {
                const newVal = newProps[key];
                const oldVal = oldProps[key];
                if(newVal !== oldVal) {
                    //更新属性
                    n1.el.setAttribute(key, newVal);
                }
            })
        }

        if(oldProps) {
            Object.keys(oldProps).forEach(key => {
                // 如果老的在新的节点里面没有的话删除属性
                if(!newProps[key]) {
                    n1.el.removeAttribute(key);
                }
            })
        }
        //children -> 暴力的解法
        // 1.新的节点是一个字符串  -> 老的是String  or Arrar
        // 2.新的节点是array  -> 老的是String  or Arrar
        const { children: newChildren} = n2;
        const {children: oldChildren} = n1;

        if(typeof newChildren === 'string') {
            // if(typeof oldChildren === 'string') {
            //     if(newChildren !== oldChildren) {
            //         n2.el.textContent = newChildren;
            //     }
            // }else if(Array.isArray(oldChildren)) {
            //     n2.el.textContent = newChildren;
            // }
            n2.el.textContent = newChildren;
        }else if(Array.isArray(newChildren)) {
            if(typeof oldChildren === 'string') {
                n2.el.innerText = '';
                mountElement(n2, n2.el);
            }else if(Array.isArray(oldChildren)){
                //new
                //old
                const length = Math.min(newChildren.length, oldChildren.length);
                for(let index = 0; index < length; index++) {
                    const newVnode = newChildren[index];
                    const oldVnode = oldChildren[index];
                    diff(oldVnode, newVnode);
                }
                
                
                if(newChildren.length > length) {
                    //创建节点
                    for(let index = length; index < newChildren.length; index++) {
                        const newVnode = newChildren[index];
                        mountElement(newVnode);
                    }
                }

                if(oldChildren.length > length) {
                    // 删除节点
                    for(let index = length; index < oldChildren.length; index++) {
                        const oldVnode = oldChildren[index];
                        oldVnode.el.parent.removeChild(oldVnode.el);
                    }
                }
            }
        }
    }
    
}