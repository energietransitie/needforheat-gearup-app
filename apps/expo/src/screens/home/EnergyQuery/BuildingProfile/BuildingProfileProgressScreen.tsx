import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, useTheme } from "@rneui/themed";
import { evaluate } from "mathjs";
import { useEffect, useState } from "react";
import { getTimeZone } from "react-native-localize";

import { postEnergyQuery } from "@/api/energyquery";
import { StatusMessage } from "@/components/common/StatusMessage";
import Timeline from "@/components/common/Timeline";
import Box from "@/components/elements/Box";
import { NL_ADDRESS_REGEX } from "@/constants";
import useAPIKey from "@/hooks/API/useAPIKey";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { EnergyQuery, bag3DSchema, bagSchema } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";
import { handleRequestErrors } from "@/utils/tools";

type BuildingProfileProgressScreenProps = NativeStackScreenProps<HomeStackParamList, "BuildingProfileProgressScreen">;

export default function BuildingProfileProgressScreen({ navigation, route }: BuildingProfileProgressScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { location, dataSource } = route.params;
  const { data: key, isError: isAPIKeyError } = useAPIKey("BAG");
  const [showButton, setShowButton] = useState<boolean>(false);
  //Timeline items
  const [isBAGReceived, setisBAGReceived] = useState<boolean>(false);
  const [isBAGReceivedError, setisBAGReceivedError] = useState<boolean>(false);

  const [is3DBAGReceived, setis3DBAGReceived] = useState<boolean>(false);
  const [is3DBAGReceivedError, setis3DBAGReceivedError] = useState<boolean>(false);

  const [isCalculating, setisCalculating] = useState<boolean>(false);
  const [isCalculatingError, setisCalculatingError] = useState<boolean>(false);

  const [isSucces, setisSucces] = useState<boolean>(false);
  const [isSuccesError, setisSuccesError] = useState<boolean>(false);
  //End timeline items

  const timelineData = [
    {
      title: t("screens.home_stack.energy_query.building_profile_progress.alert.initial_data.title"),
      description: t("screens.home_stack.energy_query.building_profile_progress.alert.initial_data.message"),
      finished: isBAGReceived,
      loading: !isBAGReceived,
      error: isAPIKeyError || isBAGReceivedError,
    },
    {
      title: t("screens.home_stack.energy_query.building_profile_progress.alert.data.title"),
      description: t("screens.home_stack.energy_query.building_profile_progress.alert.data.message"),
      finished: is3DBAGReceived,
      loading: !is3DBAGReceived,
      error: is3DBAGReceivedError,
    },
    {
      title: t("screens.home_stack.energy_query.building_profile_progress.alert.calculating.title"),
      description: t("screens.home_stack.energy_query.building_profile_progress.alert.calculating.message"),
      finished: isCalculating,
      loading: !isCalculating,
      error: isCalculatingError,
    },
    {
      title: t("screens.home_stack.energy_query.building_profile_progress.alert.success.title"),
      description: t("screens.home_stack.energy_query.building_profile_progress.alert.success.message"),
      finished: isSucces,
      loading: !isSucces,
      error: isSuccesError,
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
    let building_bag_id;
    try {
      const BAGInfo = await getDataBAG();
      building_bag_id = BAGInfo?._embedded.adressen[0].pandIdentificaties[0];
      if (!building_bag_id) {
        throw new Error();
      }
      setisBAGReceived(true);
    } catch {
      setShowButton(true);
      setisBAGReceivedError(true);
      return;
    }

    //3D BAG INFO
    let BAG3DInfo;
    try {
      BAG3DInfo = await getData3dBAG(building_bag_id);
      setis3DBAGReceived(true);
      if (!BAG3DInfo) {
        throw new Error();
      }
    } catch {
      setShowButton(true);
      setis3DBAGReceivedError(true);
      return;
    }

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
    if (!formula) {
      setisCalculatingError(true);
      setShowButton(true);
      return;
    }

    let result;
    try {
      result = await evaluate(formula, variables);
      if (!result) {
        throw new Error();
      }
      setisCalculating(true);
    } catch {
      setShowButton(true);
      setisCalculatingError(true);
      return;
    }

    if (!dataSource) {
      console.warn("No datasource available for posting energy query BP");
      setisSuccesError(true);
      setShowButton(true);
      return;
    }

    const currentLocaleTimeInUnix = Math.floor(Date.now() / 1000);

    const energyQuery: EnergyQuery = {
      energy_query_type: {
        id: dataSource.item.ID,
      },
      uploads: [
        {
          measurements: [
            {
              value: result,
              property: {
                name: "formula_result",
              },
              time: currentLocaleTimeInUnix,
            },
            {
              value: getTimeZone(),
              property: {
                name: "device_timezone__tmz",
              },
              time: currentLocaleTimeInUnix,
            },
          ],
          instance_id: dataSource.item.ID,
          instance_type: "energy_query_type",
          device_time: currentLocaleTimeInUnix,
          size: 2,
        },
      ],
    };

    try {
      await postEnergyQuery(energyQuery);
      setisSucces(true);
      setShowButton(true);
    } catch (error) {
      console.error("An error occurred posting Weather Energy Query:", error);
      setisSuccesError(true);
      setShowButton(true);
    }
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
      <Box padded>
        {isSucces ? (
          <StatusMessage
            label={t("screens.home_stack.energy_query.building_profile_progress.success.title")}
            message={t("screens.home_stack.energy_query.building_profile_progress.success.message")}
          />
        ) : null}

        {isAPIKeyError ? (
          <StatusMessage
            label={t("screens.home_stack.energy_query.building_profile_progress.fail.title")}
            message={t("screens.home_stack.energy_query.building_profile_progress.fail.api.message")}
          />
        ) : isBAGReceivedError ? (
          <StatusMessage
            label={t("screens.home_stack.energy_query.building_profile_progress.fail.title")}
            message={t("screens.home_stack.energy_query.building_profile_progress.fail.bag.message")}
          />
        ) : is3DBAGReceivedError ? (
          <StatusMessage
            label={t("screens.home_stack.energy_query.building_profile_progress.fail.title")}
            message={t("screens.home_stack.energy_query.building_profile_progress.fail.3dbag.message")}
          />
        ) : isCalculatingError ? (
          <StatusMessage
            label={t("screens.home_stack.energy_query.building_profile_progress.fail.title")}
            message={t("screens.home_stack.energy_query.building_profile_progress.fail.calculating.message")}
          />
        ) : isSuccesError ? (
          <StatusMessage
            label={t("screens.home_stack.energy_query.building_profile_progress.fail.title")}
            message={t("screens.home_stack.energy_query.building_profile_progress.fail.sending.message")}
          />
        ) : null}
      </Box>
      <Box style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
        {showButton ? (
          <Button
            title={t("common.back_to_home")}
            containerStyle={{ width: "100%", marginTop: theme.spacing.md }}
            onPress={onLeave}
          />
        ) : null}
      </Box>
    </Box>
  );
}
