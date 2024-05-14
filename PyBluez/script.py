import bluetooth

# Define the service UUID
SERVICE_UUID = "0000180d-0000-1000-8000-00805f9b34fb"  # Example UUID for a standard BLE service

# Create a Bluetooth socket
server_socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)

# Bind the socket to a port
server_socket.bind(("", bluetooth.PORT_ANY))

# Start advertising the service
server_socket.listen(1)
bluetooth.advertise_service(server_socket, "SampleService", service_id=SERVICE_UUID)

print("Waiting for connection...")

try:
    while True:
        # Accept incoming connections
        client_socket, client_info = server_socket.accept()
        print("Accepted connection from", client_info)

        # Send data to the client
        client_socket.send("Hello, client!")

        # Receive data from the client
        data = client_socket.recv(1024)
        print("Received data:", data.decode())

        # Close the client socket
        client_socket.close()

except KeyboardInterrupt:
    print("Keyboard interrupt received. Stopping...")
    server_socket.close()
