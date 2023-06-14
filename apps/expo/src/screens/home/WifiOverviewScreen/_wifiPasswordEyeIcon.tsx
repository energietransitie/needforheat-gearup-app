import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function WifiPasswordEyeIcon(props: Props) {
  const { visible, setVisible } = props;

  return (
    <TouchableOpacity
      style={{
        aspectRatio: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => setVisible(!visible)}
    >
      <Icon name={visible ? "eye-off" : "eye"} size={20} />
    </TouchableOpacity>
  );
}
