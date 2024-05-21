import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const CircleMenu = ({ onClickEvent }: { onClickEvent: () => void }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onClickEvent}
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#45B97C",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="help-circle-outline" size={50} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
});

export default CircleMenu;
