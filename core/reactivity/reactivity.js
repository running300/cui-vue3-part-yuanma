//依赖
let currentEffect;
class Dep {
  constructor(val) {
    this.effects = new Set();//依赖不能重复收集
    this._val = val;
  }
  
  get value() {
    this.depend();
    return this._val;
  }
  set value(newValue) {
    this._val = newValue;
    this.notice();
  }
  //1.收集依赖
  depend() {
    if(currentEffect) {
      this.effects.add(currentEffect)
    }
  }
  
  //2.触发依赖
  notice() {
    //触发我们之前收集到的依赖
    this.effects.forEach((effect) => {
      effect();
    })
  }
}

export function effectWatch(effect) {
  //收集依赖
  currentEffect = effect;
  effect();
  currentEffect = null;
}

const dep = new Dep(10);
// let b;

// effectWatch(() => {  
//   b = dep.value + 10;
//   console.log(b)
// })

// //值发生变更
// dep.value = 20;
// dep.notice();
//1.对象什么时候改变
//2.proxy的好处不管对象里面有多少的属性只需要设置一次
const targetMap = new Map();
function getDep(target, key) {
    let depsMap = targetMap.get(target);
    //如果取不到值得时候
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if(!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
    }

    return dep;
}

export function reactive(row) {
    return new Proxy(row, {
        get(target, key) {
            console.log(key);
            //key -- dep 
            //dep 存在哪里
            const dep = getDep(target, key);

            //收集依赖
            dep.depend();
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            //需要获取到dep
            const dep = getDep(target, key);
            const result = Reflect.set(target, key, value);
            dep.notice();
            return result;
        }
    })
}

// const user = reactive({
//     age: 19
// })

// let double;
// effectWatch(() => {
//     console.log('--reactive--')
//     double = user.age;
//     console.log(double);
// })
// user.age = 20;