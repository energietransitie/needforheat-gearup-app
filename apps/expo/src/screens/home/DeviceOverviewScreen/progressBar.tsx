import React from "react";
import { View, ProgressBarAndroidComponent } from "react-native";

export default function Progressbar() {
  return (
    <View style={{ flex: 0, justifyContent: "center", alignItems: "center" }}>
      <ProgressBarAndroidComponent styleAttr="Horizontal" indeterminate={false} progress={20} color="#FF5733" />
    </View>
  );
}
