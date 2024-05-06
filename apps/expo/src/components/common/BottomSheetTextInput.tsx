import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { InputProps as InputPropsBase } from "@rneui/base";
import { Input, InputProps } from "@rneui/themed";
import { forwardRef, useCallback } from "react";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BottomSheetTextInput = forwardRef<InputProps, InputPropsBase & { component?: React.ComponentType<any> }>(
  ({ component, onFocus, onBlur, ...restProps }, ref) => {
    const Component = component || Input;
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

    const handleOnFocus = useCallback(
      (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
        shouldHandleKeyboardEvents.value = true;

        if (onFocus) {
          onFocus(args);
        }
      },
      [onFocus, shouldHandleKeyboardEvents]
    );

    const handleOnBlur = useCallback(
      (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
        shouldHandleKeyboardEvents.value = false;

        if (onBlur) {
          onBlur(args);
        }
      },
      [onBlur, shouldHandleKeyboardEvents]
    );

    return <Component ref={ref} onFocus={handleOnFocus} onBlur={handleOnBlur} {...restProps} />;
  }
);
