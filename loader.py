import time
import frida

# device = frida.get_device_manager().add_remote_device("47.101.212.51:5555")
device = frida.get_usb_device()
print(device)
pid = device.spawn("com.wz.cmake")
device.resume(pid)
time.sleep(1)
session = device.attach(pid)
with open("hook_java.js") as f:
    script = session.create_script(f.read())
script.load()
input()