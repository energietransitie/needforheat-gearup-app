import { useState } from "react";
import { LayoutChangeEvent } from "react-native";

type UseLayoutReturnType = [(event: LayoutChangeEvent) => void, number];

export default function useLayoutWidth(defaultWidth = 0): UseLayoutReturnType {
  const [width, setWidth] = useState<number>(defaultWidth);

  function onLayout(event: LayoutChangeEvent): void {
    if (event.nativeEvent.layout.width === width) return;
    setWidth(event.nativeEvent.layout.width);
  }

  return [onLayout, width];
}
