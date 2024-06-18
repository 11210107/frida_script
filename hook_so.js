console.log("Script loaded successfully")

function callSecretFun(){
    Java.perform(function(){
        Java.choose("com.wz.cmake.MainActivity",{
            onMatch:function(instance){
                 console.log("Found instance:" + instance);
                 var result = instance.doAction("hello frida");
                 console.log("Result of secret func:" + result );
                 send("js result:" + result)
            },
            onComplete:function(){
                console.log("Hook complete");
            } 
         });
    });
    
}

function hookNativeFun(){
    console.log("start native hook");
    var baseAddress = Module.findBaseAddress("libcmake.so");
    console.log("baseAddress:",baseAddress);
    var exports = Module.enumerateExports("libcmake.so");
    console.log("exports size:",exports.length);
    var get_funcaddress = null;
    var exe_func_address = null;
    var mvaddress = null;
    var exe_name = "add";
    var funcName = "_Z8doActionP7_JNIEnvP8_jobjectP8_jstring";
    for(var i = 0; exports[i] != null; i++){
        console.log("function name:",exports[i]["name"]);
        if(exports[i]["name"] == funcName){
            console.log("function",funcName,exports[i]["address"]);
            console.log("偏移地址：",(exports[i]["address"] - baseAddress).toString(16));
            get_funcaddress = exports[i]["address"];
        }
        if(exports[i]["name"] == exe_name){
            
            exe_func_address = exports[i]["address"];
            console.log("exe_name:",exe_name,exports[i]["address"]); 
        }
    }
    Interceptor.attach(get_funcaddress,{
        onEnter:function(args){
            console.log("onEnter ",funcName);
            // var args1 = Memory.readUtf8String(args[0]);
            // var func = Memory.readUtf8String(args[2]);
            // console.log("func:",func);
            console.log("arg1:",args[1]);
            var args2 = Java.vm.getEnv().getStringUtfChars(args[2], null).readCString();
            console.log("args2:",args2);
            var exe_ptr = new NativePointer(exe_func_address);
            console.log("exe_func_addr:",exe_func_address);
            const exe_func = new NativeFunction(exe_ptr,'int',['int','int']);
            console.log(exe_func);
            var exe_result = exe_func(1,5);
            console.log("exe_result:",exe_result);
        },
        onLeave:function(retval){
            console.log("onLeave ",funcName);
            console.log("Origin retval:",retval);
            var env = Java.vm.getEnv();
            var jstr = env.newStringUtf("Hello Frida!");
            // retval.replace(jstr);
            retval.replace(1);
        }
    });
    var targetAddress = Module.findExportByName("libc.so","pthread_create");
    console.log("pthread address:",targetAddress.toString(16));
    
    Interceptor.attach(targetAddress,{
        onEnter:function(args){
            console.log("onEnter");
            
            // var context = Memory.readUtf8String(args[3]);
            // var func = Memory.readUtf8String(args[2]);
            // console.log("func:",func);
            // console.log("context:",context);
        },
        onLeave:function(retval){
            console.log("onLeave");
        }
    });
    console.log("success")
}
function main(){
    Java.perform(function(){
        hookNativeFun();
    });
}
// setImmediate(main);
function callNativeFun(){
    var baseAddress = Module.findBaseAddress("libcmake.so");
    var exports = Module.enumerateExports("libcmake.so");
    var add_func_address = null;
    var mvaddress = null;
    for(var i = 0;exports[i] != null;i++){
        if(exports[i]["name"] == "add"){
            console.log("function add_func:",exports[i]["address"]);
            console.log((exports[i]["address"] - baseAddress).toString(16));
            add_func_address = exports[i]["address"];
        }
    }
    console.log(ptr.toString(16));
    var add_func_ptr = new NativePointer(add_func_address);
    const add_func = new NativeFunction(add_func_ptr,'int',['int','int']);
    var result = add_func(1,5);
    console.log(result);
}
rpc.exports = {
    callsecretfunction:callSecretFun, //把callSecretFun函数导出为callsecretfunction符号，导出名不可以有大写字母或者下划线
    hooknativefunction:main,
    callnativefun:callNativeFun
};