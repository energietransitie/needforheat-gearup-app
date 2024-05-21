import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";
import { evaluate } from "mathjs";
import { useEffect, useState } from "react";

import Timeline from "@/components/common/Timeline";
import Box from "@/components/elements/Box";
import { NL_ADDRESS_REGEX } from "@/constants";
import useAPIKey from "@/hooks/API/useAPIKey";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { bag3DSchema, bagSchema } from "@/types/api";
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

  const getDataBAG = async () => {
    const match = location.match(NL_ADDRESS_REGEX);

    if (!match) return; //TODO properly error
    const houseNumber = match[2];
    const postalCode = match[3];

    if (!key?.api_key) return null;
    const response = await fetch(
      `https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?postcode=${postalCode}&huisnummer=${houseNumber}`,
      {
        headers: {
          accept: "application/hal+json",
          "X-Api-Key": `${key?.api_key}`,
        },
      }
    );
    const data = await handleRequestErrors(response);
    const jsonData = await data.json();
    return bagSchema.parse(jsonData);
  };

  const getData3dBAG = async (building_bag_id: string) => {
    const response = await fetch(`https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.${building_bag_id}`, {
      headers: {
        accept: "application/json",
      },
    });
    const data = await handleRequestErrors(response);
    const jsonData = await data.json();
    return bag3DSchema.parse(jsonData);
  };

  const MainFunction = async () => {
    //BAG INFO
    const BAGInfo = await getDataBAG();
    const building_bag_id = BAGInfo?._embedded.adressen[0].pandIdentificaties[0];
    if (!building_bag_id) return; //TODO: properly error
    setisBAGReceived(true);

    //3D BAG INFO
    const BAG3DInfo = await getData3dBAG(building_bag_id);
    setis3DBAGReceived(true);

    //Mapped values, explained in EnergyDoctor docs
    const variables = {
      a: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_bag_bag_overlap,
      b: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_bouwlagen,
      c: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_h_dak_50p,
      d: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_h_dak_70p,
      e: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_h_dak_max,
      f: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_h_dak_min,
      g: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_h_maaiveld,
      h: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_nodata_fractie_ahn3,
      i: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_nodata_fractie_ahn4,
      j: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_nodata_radius_ahn3,
      k: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_nodata_radius_ahn4,
      l: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_opp_buitenmuur,
      m: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_opp_dak_plat,
      n: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_opp_dak_schuin,
      o: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_opp_grond,
      p: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_opp_scheidingsmuur,
      q: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_puntdichtheid_ahn3,
      r: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_puntdichtheid_ahn4,
      s: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_pw_datum,
      t: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_rmse_lod12,
      u: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_rmse_lod13,
      v: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_rmse_lod22,
      w: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_volume_lod12,
      x: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_volume_lod13,
      y: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.b3_volume_lod22,
      z: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.oorspronkelijkbouwjaar,
      aa: BAG3DInfo.feature.CityObjects[building_bag_id].attributes?.voorkomenidentificatie,
    };

    //Calculate with above values
    const formula = dataSource.item.Formula;
    if (!formula) return; //TODO: error
    const result = await evaluate(formula, variables);
    setisCalculating(true);

    //TODO: send
    setisSucces(true);
  };

  useEffect(() => {
    MainFunction();
  }, [key]);

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
