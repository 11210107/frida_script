function main(){
    console.log("js main function execute");
    Java.perform(function(){
        console.log("java perform");
        var MainActivity = Java.use("com.wz.cmake.MainActivity");
        // 重载找到指定的函数
        MainActivity.runThread.overload().implementation = function(){
            console.log("MainActivity runThread run")
        };
        Java.choose("com.wz.cmake.MainActivity",{
            onMatch:function(activity){
                console.log("find instance:" + activity);
                activity.runThread();
            },
            onComplete:function(){
                console.log("end");
            }
        });
    });
}
setImmediate(main);