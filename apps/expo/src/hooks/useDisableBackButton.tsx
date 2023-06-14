import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { BackHandler } from "react-native";

export function useDisableBackButton(isDisabled: boolean) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => isDisabled);

      if (navigation) {
        navigation.setOptions({
          headerBackVisible: !isDisabled,
          gestureEnabled: !isDisabled,
        });
      }

      return () => backHandler.remove();
    }, [isDisabled])
  );
}
