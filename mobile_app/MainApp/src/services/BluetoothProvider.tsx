import React, {
  FC,
  useState
} from "react";
import {
  BluetoothContext,
  BluetoothContextType,
  defaultDeviceInfo
} from './BluetoothContext';

import BluetoothService from './BluetoothService';

// export const BluetoothProvider: FC = ({ children }) => {
//   // todo
//   return (
//     <BluetoothContext.Provider value={{ deviceIsConnected: deviceInfo.peripheralBasicInfo != null, deviceInfo }}>
//       {children}
//     </BluetoothContext.Provider>
//   );
// };

// export default BluetoothProvider;