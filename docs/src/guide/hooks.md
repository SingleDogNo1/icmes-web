# 为什么使用 hooks

无论你是否了解，是否使用过 hooks，但作为前端开发相信你一定或多或少听过这个名词。那么在开始之前，我们先来了解一下什么是 hooks，以及为什么 hooks 已经变得大势所趋。

:::warning

本文默认你已经有了一定的`Component API`基础，至少明白 vue3 的书写语法和规范

:::

## 什么是 hooks

hooks 翻译为“钩子”，他并不是前端专业的术语。事实上在所有开发行业中，hooks 都是一个很常见的术语。它指的是

:::tip

系统运行到某一时期时，会调用被注册到该时机的回调函数。

:::

在`vue2`中，并没有明确的 hooks 的概念，但看到解释你也应该意识到他的概念类似于“生命周期函数”。而且即使是在`vue3`中，hooks 的概念也不像`react`那么明确，它的定义比较模糊，大致为

:::tip

以 `use` 开头的一系列提供了组件复用、状态管理等开发能力的方法。比如`useSlot`、`useAttrs`、`useRouter`等。

:::

之所以说他的概念比较模糊，是因为它的钩子函数依然保持了`vue2`的命名方式而没有使用`use`开头。比如`onMounted`、`onUpdated`等。

至于为什么使用`use`开头，是因为`react` 对 hooks 的定义作了[规范](https://zh-hans.reactjs.org/docs/hooks-rules.html)。诚然，**这并不是一个强制的规范**，我们依然可以随心所欲的将自己的 hooks 命名为任何合法的格式。但是作为开发者我们最好去遵守，因为他可以让我们**在看到一个函数时，甚至不需要去仔细研究实现逻辑，也可以一眼看懂他是什么东西**。

## 为什么需要使用 hooks

### 代码组织

`vue2`语法中，明确的将代码分成了几个大块，乍一看代码是明确和方便维护的，然而实际上:

- html 结构中使用到一个`name`字段。他可能来自`data`、`computed`、`props`、`mixins`、`vuex store`，甚至根本没有声明而是后来才声明赋值的。并且如果是`vuex mapState`的语法注入的，还需要花时间翻文件夹去找他的定义。
- filters 代码块的逻辑，其实同样可以放到 methods 去实现。看到以下代码，你可以马上找到它在哪里实现的吗？

  ```vue
  <template>
    <span>{{ getDIctName(this.code) }}</span>
  </template>
  ```

### this

没错，就是 this。`Component API`语法放弃了 this，所有的实现都是从函数中来，到函数中去。如此，就解决了困扰已久的`func.bind(this)`难题。并且，`vue2`中无论`router`、`vuex`都使用`this`指针调用，方法的来源去路都非常的模糊。下面这段代码，你能马上定位到他做了什么吗？

```js
this.$store.$dispatch('getPagedProductionList').then(() => {});
```

并且，组件之间的耦合性也为此大幅增加，父组件可以通过`this.$refs.childComp.setName`直接调用子组件方法，导致了代码逻辑其实异常混乱，这并不是我们想要看到的。

### 复用状态

没错，说的就是 `mixin`。在之前，如果我们需要复用某个状态或者方法，最好的办法就是使用 mixins。然而，`mixins`反而造成了更多的困扰

#### 难以追溯的方法和属性

```js
export default {
  mixins: [a, b, c, d, e],
  mounted() {
    // name从哪里来？？？
    console.log(this.name);
  },
};
```

#### 方法和属性的同名覆盖

当我想同时混合`mixin-a.js`和`mixins-b.js`时，悲剧发生了: 由于两个功能点上类似，导致里面都出现了`name`属性和`setName`的方法，这势必会导致后写入的会覆盖之前写入的。如果你说只需要改个命名就可以解决，那么如果两个方法不是一个人写的，而大家又刚好都写了同样的属性和方法名呢？无论如何，`mixins`确实会导致这类型的隐患

```js
// mixin-device.js，这个文件其实是操作设备
export default {
  data() {
    return {
      name: '' // 设备名称
    }
  },
  methods: {
    setName() {
      this.name = name // 修改设备名称
    }
  }
}

// mixin-user.js，这个文件其实是操作员工
export default {
  data() {
    return {
      name: '' // 员工名称
    }
  },
  methods: {
    setName() {
      this.name = name // 修改员工名称
    }
  }
}

export default {
  mixins: [mixinA, mixinB],
  mounted() {
    console.log(this.name) // 完蛋....
  }
}
```

#### 修改逻辑代价巨大

仍然举例`name`。之前的逻辑需要的是展示`name`。但是现在需求变了，需要的是`firstName`和`lastName`。此时，`mixin`的处境就变得非常尴尬，我可以将文件中的`name`字段重命名为`firstName`或`lastName`中的某一个，但另一个变量怎么办？同一个文件是无法混入两次的。难道要新建一个，与之前的文件除了 `firstName` 不同之外，其他完全相同的文件，继续混入？如此一来既降低了可读性，又增加了代码的复杂程度。

## 说回 hooks

现在，有了 hooks，以上的问题就都可以解决了。首先，hooks 是纯函数，不存在 this 指针，而且，你需要用到它的时候，必须要导入才能使用。另外，作为函数，直接引用如果出现了同名的情况，只需要修改变量名就可以了。

```js
// 要使用方法，自然需要先引入。不会发生找不到方法来源的尴尬
import { useName } from '@/hooks/useName';

// 如果没有出现变量冲突
const { name, stName } = useName();

// 如果变量重名了
const { name: firstName, stName: setFirstName } = useName();
const { name: lastName, stName: setLastName } = useName();
```

是不是已经清晰很多了？

## 封装自己的 hook

还是那句话，hook 只是进行了约束的纯函数。他的本质就是函数，没有什么特别的。只要你认为有必要的方法都可以把它封装起来，沿用上面的例子:

```js
import { ref } from 'vue';

export const useName = () => {
  const name = ref('');

  function setName(val) {
    name.value = val;
  }

  return {
    name,
    setName,
  };
};
```
