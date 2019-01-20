/**axios封装升级后的http.js*/

/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import router from '../router';//引入路由用来跳转
import store from '../store'; //引入Vuex用来获取状态
import { Toast } from 'vant';
import Vue from 'vue'; //引入vue
//必须实例化 Vue
let vm = new Vue();
/*这里有个点需要注意，直接在这个js文件里，直接使用 console.log(vm),可以看到我在挂到Vue.prototype上的$loading自定义方法，
* 但是在console.log(vm.$loading); 时会显示 undefined , 输出vue上的自身方法时，不会显示undefined。
* 我在网上找到的解释如下：
* 注意不要在普通js中导入后，直接console.log()，这个时候组件还没创建肯定是undefined。 （应该是这个http.js在main.js之前加载了）
* 不过我经过经过测试,通过setTimeout()延时输出时，就不会有 就不会是undefined了。
* 这所说明这个方法不是这个js文件一加载就执行的话，这个这样通过 import 和 new的方式还是可以用的。
* 正好也可以满足了我的需求。嘻嘻！！
* */
setTimeout(()=>{
    console.log(vm.$loading); //不是undefined了
},4000);


/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
    Toast({
        message: msg,
        duration: 1000,
        forbidClick: true
    });
};

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        //这里根据你们项目中的具体返回的  状态码  进行编写。
        // 401: 未登录状态，跳转登录页
        case 401:
            toLogin();
            break;
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            tip('登录过期，请重新登录'); //调用提示函数
            //清楚token
            localStorage.removeItem('token');
            store.commit('loginSuccess', null); //将Vuex中的token赋值为null
            //1s后跳转登录页
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;
        // 404请求不存在
        case 404:
            tip('请求的资源不存在');
            break;
        default:
            console.log(other);
    }
};

// 创建axios实例
//如果请求花费了超过 `timeout` 的时间，请求将被中断
var instance = axios.create({timeout: 1000 * 12});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    //config 为axios实例后的的请求配置信息。
    config => {
        //只要发送请求就显示Loading(通过改变vuex的isLoading状态)
        // store.commit('changeIsLoading', true); //这是以前使用vuex时用的方法
        vm.$loading(); //调用我们封装好的loading插件
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        const token = store.state.token; ////获取vuex 中的token （要提前在vuex的store定义token）
        token && (config.headers.Authorization = token); ////token 存在的情况下， config.headers.Authorization = token
        return config;
    },
    //error 为错误信息
    error => Promise.error(error));

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功 (又分为是否正常返回数据)
    res => {
        // store.commit('changeIsLoading', false); //关闭loading  这是以前使用vuex时用的方法
        vm.$loading.close(); //调用我们封装好的loading插件,关闭loading函数
        return res.status === 200 ? Promise.resolve(res) : Promise.reject(res)
    },
    // 请求失败
    error => {
        // store.commit('changeIsLoading', false); //关闭loading
        vm.$loading.close(); //调用我们封装好的loading插件,关闭loading函数
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.message); //调用错误处理函数。
            return Promise.reject(response); //依然返回错误的信息
        } else {
            // 处理断网的情况
            //跳转到断网处理页面
            //在这个页面一般会有点击刷新，要在返回到用户原来停留的页面。
            router.replace({
                path: '/notnetwork',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            });
        }
    });

//暴露出封装的axios实例
export default instance;







































