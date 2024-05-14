import bluetooth
from bluetooth.ble import BeaconService

# Define the service UUID
SERVICE_UUID = "0000180d-0000-1000-8000-00805f9b34fb"  # Example UUID for a standard BLE service

# Define the characteristics UUIDs
CHARACTERISTIC_READ_UUID = "00002a37-0000-1000-8000-00805f9b34fb"  # Example UUID for a standard read characteristic
CHARACTERISTIC_WRITE_UUID = "00002a38-0000-1000-8000-00805f9b34fb"  # Example UUID for a standard write characteristic

# Define the callback function for handling incoming write requests
def handle_write(data):
    print("Received data:", data.decode())
    # You can process the received data here as needed

# Create a BLE service instance
service = BeaconService()

# Register the service
service.start_advertising(SERVICE_UUID, bluetooth._bluetooth.advertise_flags['limited_discoverable'], 9, 0, 200)

# Main loop to handle incoming connections and data
try:
    while True:
        # Wait for incoming connection
        client_socket, address = bluetooth.BluetoothSocket.accept()
        print("Accepted connection from", address)

        # Receive data from the connected device
        data = client_socket.recv(1024)
        if not data:
            break

        # Process received data
        handle_write(data)

        # Send response back to the client
        response = "Data received successfully"
        client_socket.send(response.encode())

        # Close the client socket
        client_socket.close()

except KeyboardInterrupt:
    print("Keyboard interrupt received. Stopping...")
    service.stop_advertising()