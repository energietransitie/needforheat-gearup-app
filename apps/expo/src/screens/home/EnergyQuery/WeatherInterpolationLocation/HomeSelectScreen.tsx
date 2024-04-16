import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";
import MapView from "react-native-maps";

import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";

type HomeSelectScreenProps = NativeStackScreenProps<HomeStackParamList, "HomeSelectScreen">;

export default function HomeSelectScreen({ navigation, route }: HomeSelectScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const onAddDevice = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <Box padded style={{ flex: 1 }}>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* <Marker draggable coordinate={this.state.x} onDragEnd={e => this.setState({ x: e.nativeEvent.coordinate })} /> */}
      </MapView>
      <Box style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
        <Button
          containerStyle={{ flex: 1, marginLeft: theme.spacing.md }}
          title={t("common.connect")}
          color="primary"
          onPress={onAddDevice}
          icon={{
            name: "wifi-outline",
            type: "ionicon",
            color: theme.colors.white,
          }}
        />
      </Box>
    </Box>
  );
}
