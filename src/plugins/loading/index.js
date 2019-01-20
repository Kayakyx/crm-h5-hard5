import Loading from "./Loading";

let loadingPlugin = {
    //写vue插件必须要与 install 这个函数（固定写法）
    //参数 Vue 就是 Vue实例
    //config 是你在 main.js 使用插件是 通过 Vue.use() 时传过来的参数，可以用来配置你这个插件。
    // 比如 Vue.use("Loading",{time: 1000}),之后这个 config 就是 {time：1000} 这个对象。
    //我这里先用到这个配置.知道怎么回事就好了。
    //其实main.js 里的 Vue.use()就相当于调用了这个install函数。
    //页面上只能同时显示一个loading，这只flag 标志位
    flag: false,  //提取到外面，就变成了可控制的了。因为就成了组件 的选项了。
    install(Vue, config){
        // console.log(config);
        // 给Vue原型上自定义一个$loading属性。
        let self = this; // install 初始化之后就有this了，this为新创建出来的插件(就是这个loadingPlugin对象)。{flag: false, install: ƒ}
        // console.log(self);
        Vue.prototype.$loading = function (DOM) { //不能使用箭头函数，用了这个里面的this就不会是vue实例了。
            //判断上一次Loading是否正在显示
            if(self.flag) return;
            //不传DOM默认为 body元素节点对象
            DOM = DOM || document.body;
            //创建一个div元素节点对象，主要的所有是把我们的 Loading.vue 这个组件挂载到这上面（说简单一点，你得知道这个Loading.vue文件得在哪里显示啊）
            let oDiv = document.createElement('div');
            //这里Loading也就是我们Loading.vue实例暴露出来的东西，他其实是一个 构建组件的 一些选项。
            //需要我们通过Vue.extend()扩展实例构造器来生产组件, 然后通过new实例化这个组件。
            // new 完并挂载到一个元素上，返回的就是一个完整的vue实例了。
            //然后我们就可以把他挂载到要元素上,进行显示了。
            let ExtendLoading = Vue.extend(Loading);
            let vm = new ExtendLoading().$mount(oDiv);
            //vm.$el 就相当于我们实例化后的HTML部分了。
            DOM.appendChild(vm.$el);
            self.flag = true;//标志页面中已经存在Loading组件
            // console.log(this);  // this就是vue实例。
            //function本质上也是一个对象，所以能给它添加属性(属性值当然可以是函数了)
            this.$loading.close = function () {
                DOM.removeChild(vm.$el);
                self.flag = false; //初始化标志位
            }


        }
    }
};
export default loadingPlugin;