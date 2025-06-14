// 定义自定义指令
const defineDirective = (app) => {
    app.directive('lazy', {
        mounted(el, bindings) {
            // el表示使用指令的DOM元素
            // 指令的功能：实现图片的懒加载
            // 1、监听图片是否进入可视区
            const observer = new IntersectionObserver(([entry]) => {
                const isIntersecting = entry.isIntersecting;
                // true：进入可视区域，false：未进入可视区域
                if (isIntersecting) {
                    // 1、给图片的src属性赋值图片的地址
                    el.src = bindings.value;
                    // 2、取消图片的监听，默认是会一直监听的，如果不取消，就会一直执行
                    observer.unobserve(el);
                }
            });
            // 监听dom元素
            observer.observe(el);
        }
    });
};

export default {
    install(app) {
        // 自定义指令
        defineDirective(app);
    }
};