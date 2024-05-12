import socket
import subprocess

SERVICE_UUID = "00001101-0000-1000-8000-00805F9B34FB"
PORT = 1  # RFCOMM port number

def handle_client(client_socket, client_info):
    print(f"Accepted connection from {client_info}")

    try:
        while True:
            data = client_socket.recv(1024)
            if not data:
                break
            print("Received:", data)
            client_socket.send(data)
    except Exception as e:
        print("Error:", e)
    finally:
        print("Connection closed")
        client_socket.close()

try:
    print("Initializing Bluetooth socket...")
    server_socket = socket.socket(socket.AF_BLUETOOTH, socket.SOCK_STREAM, socket.BTPROTO_RFCOMM)
    print("Bluetooth socket initialized.")
    
    print("Binding socket...")
    server_socket.bind(("", PORT))
    print(f"Socket bound to port {PORT}.")

    print("Listening for connections...")
    server_socket.listen(1)

    print("Advertising service...")
    subprocess.run(["sdptool", "add", "SP"])
    print("Service advertised.")

    print("Waiting for connection...")
    client_socket, client_info = server_socket.accept()
    handle_client(client_socket, client_info)
except KeyboardInterrupt:
    print("Keyboard interrupt")
finally:
    if 'server_socket' in locals():
        server_socket.close()
