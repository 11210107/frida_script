import time
import frida
import sys
def my_message_handler(message,payload):
    print(message)
    print(payload)
    if message["type"] == "send":
        print(message["payload"])
        data = message["payload"].split(":")[1].strip()

# jsCode = """"""
device = frida.get_usb_device()
print(device)
pid = device.spawn(["com.wz.cmake"])
device.resume(pid)
time.sleep(1)
session = device.attach(pid)
with open("hook_RegisterNatives.js") as f:
    script = session.create_script(f.read())
#script = session.create_script(jsCode)
script.on("message",my_message_handler)
script.load()
input()
# command = ""
# while True:
#     command = input("Enter command:\n1:Exit\n2:Call function\nchoice:")
#     if command == "1":
#         break
#     elif command == "2":#这这里调用
#         script.exports.hook_RegisterNatives()
    