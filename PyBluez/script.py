import bluetooth

# Define the UUID for the custom BLE service
SERVICE_UUID = "00001101-0000-1000-8000-00805F9B34FB"

# Callback function to handle incoming connections
def handle_client(client_socket, client_info):
    print(f"Accepted connection from {client_info}")

    while True:
        # Receive data from the central device
        data = client_socket.recv(1024)
        if not data:
            break

        # Echo back the received data
        print("Received:", data)
        client_socket.send(data)

    print("Connection closed")
    client_socket.close()

# Set up Bluetooth socket
server_socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)

# Bind socket to any available port
server_socket.bind(("", bluetooth.PORT_ANY))

# Start listening for incoming connections
server_socket.listen(1)

# Advertise the custom service
bluetooth.advertise_service(
    server_socket,
    "MyBLEService",
    service_id=SERVICE_UUID,
)

print("Waiting for connection...")

try:
    # Accept incoming connections
    client_socket, client_info = server_socket.accept()
    handle_client(client_socket, client_info)
except KeyboardInterrupt:
    pass
finally:
    # Clean up
    server_socket.close()

