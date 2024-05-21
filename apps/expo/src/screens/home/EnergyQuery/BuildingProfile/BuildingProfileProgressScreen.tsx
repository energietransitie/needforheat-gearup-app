import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";

import Timeline from "@/components/common/Timeline";
import Box from "@/components/elements/Box";
import { NL_ADDRESS_REGEX } from "@/constants";
import useAPIKey from "@/hooks/API/useAPIKey";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { HomeStackParamList } from "@/types/navigation";
import { handleRequestErrors } from "@/utils/tools";

type BuildingProfileProgressScreenProps = NativeStackScreenProps<HomeStackParamList, "BuildingProfileProgressScreen">;

export default function BuildingProfileProgressScreen({ navigation, route }: BuildingProfileProgressScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { location, dataSource } = route.params;
  const { data: key } = useAPIKey("BAG");
  //Timeline items
  const [isBAGReceived, setisBAGReceived] = useState<boolean>(false);
  const [is3DBAGReceived, setis3DBAGReceived] = useState<boolean>(false);
  const [isCalculating, setisCalculating] = useState<boolean>(false);
  const [isSucces, setisSucces] = useState<boolean>(false);

  const timelineData = [
    {
      title: t("screens.home_stack.energy_query.building_profile.alert.sending.title"),
      description: t("screens.home_stack.energy_query.building_profile.alert.sending.message"),
      finished: isBAGReceived,
    },
    {
      title: t("screens.home_stack.energy_query.building_profile.alert.sending.title"),
      description: t("screens.home_stack.energy_query.building_profile.alert.sending.message"),
      finished: is3DBAGReceived,
    },
    {
      title: t("screens.home_stack.energy_query.building_profile.alert.calculating.title"),
      description: t("screens.home_stack.energy_query.building_profile.alert.calculating.message"),
      finished: isCalculating, // change to true when done
    },
    {
      title: t("screens.home_stack.energy_query.building_profile.alert.success.title"),
      description: t("screens.home_stack.energy_query.building_profile.alert.success.message"),
      finished: isSucces, // change to true when done
    },
  ];
  const onLeave = () => navigation.navigate("HomeScreen");

  const header = async () => {
    return {
      headers: {
        accept: "application/hal+json",
        "X-Api-Key": `${key?.api_key}`,
      },
    };
  };
  const getDataBAG = async () => {
    const match = location.match(NL_ADDRESS_REGEX);

    if (!match) return; //TODO properly error
    const houseNumber = match[2];
    const postalCode = match[3];

    if (!key?.api_key) return null;
    const response = await fetch(
      `https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?postcode=${postalCode}&huisnummer=${houseNumber}`,
      {
        ...(await header()),
      }
    );
    const data = await handleRequestErrors(response);
    const jsonData = await data.json();
    return jsonData;
  };

  const getData3dBAG = async (building_bag_id: any) => {
    if (!building_bag_id) return; //TODO properly error

    const response = await fetch(`https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.${building_bag_id}`, {
      headers: {
        accept: "application/json",
      },
    });
    const data = await handleRequestErrors(response);
    const jsonData = await data.json();
    return jsonData;
  };

  const MainFunction = async () => {
    //BAG INFO
    const BAGInfo = await getDataBAG();
    const building_bag_id = BAGInfo._embedded.adressen[0].pandIdentificaties[0];
    setisBAGReceived(true);

    //3D BAG INFO
    const BAG3DInfo = await getData3dBAG(building_bag_id);
    setis3DBAGReceived(true);

    //Map values

    //Calculate

    const formula = dataSource.item.Formula;
    if (formula) {
      //const result = await evaluate(formula, variables);
      setisCalculating(true);
      //TODO: Send data to database
      setisSucces(true);
    }
  };

  useEffect(() => {
    MainFunction();
  }, []);

  // Disable going back to force the user to use the buttons
  useDisableBackButton(true);

  return (
    <Box padded style={{ flex: 1, justifyContent: "space-between" }}>
      <Box>
        <Timeline items={timelineData} />
      </Box>
      <Box style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
        {/* Show when done */}
        <Button
          title={t("common.back_to_home")}
          containerStyle={{ width: "100%", marginTop: theme.spacing.md }}
          onPress={onLeave}
        />
      </Box>
    </Box>
  );
}
