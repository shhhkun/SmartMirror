import React, {
  FC,
  useState,
  PropsWithChildren,
} from "react";

import {
  BluetoothContext,
  BluetoothContextType,
  defaultDeviceInfo,
  defaultBluetoothContext,
} from './BluetoothContext';
import BluetoothService from './BluetoothService';



const BluetoothProvider: FC<PropsWithChildren> = ({ children }) => {
  // states will go here
  const [state, setState] = useState<BluetoothContextType>(defaultBluetoothContext);

  // functions to actually do bluetooth stuff will go here

  return (
    <BluetoothContext.Provider value={state}>
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothProvider;


// the plan is for this to have methods like "get connected devices, write, read, etc."
// and then under the hood, this would be calling bluetooth service.
// but states would be saved in here.