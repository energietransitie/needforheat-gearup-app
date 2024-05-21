import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Text, useTheme } from "@rneui/themed";
import { format } from "date-fns";
import { enUS, nl } from "date-fns/locale";
import { evaluate } from "mathjs";
import { useEffect, useState } from "react";

import DelayedButton from "@/components/common/DelayedButton";
import Timeline from "@/components/common/Timeline";
import Box from "@/components/elements/Box";
import { BASE_FETCH_HEADERS } from "@/constants";
import useAPIKey from "@/hooks/API/useAPIKey";
import useTranslation from "@/hooks/translation/useTranslation";
import { useDisableBackButton } from "@/hooks/useDisableBackButton";
import { HomeStackParamList } from "@/types/navigation";
import { getJwtPayload } from "@/utils/jwt";
import { handleRequestErrors } from "@/utils/tools";

type BuildingProfileProgressScreenProps = NativeStackScreenProps<HomeStackParamList, "BuildingProfileProgressScreen">;

export default function BuildingProfileProgressScreen({ navigation, route }: BuildingProfileProgressScreenProps) {
  const { theme } = useTheme();
  const { t, resolvedLanguage } = useTranslation();
  const { location, dataSource } = route.params;
  const [isReceived, setisReceived] = useState<boolean>(false);
  const [isCalculating, setisCalculating] = useState<boolean>(false);
  const [isSucces, setisSucces] = useState<boolean>(false);
  const { isError: isProvisioningError, data: key } = useAPIKey("BAG");
  const showBackButton = isProvisioningError;

  const timelineData = [
    {
      title: t("screens.home_stack.energy_query.building_profile.alert.sending.title"),
      description: t("screens.home_stack.energy_query.building_profile.alert.sending.message"),
      finished: isReceived,
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
  // {
  //   title: t("screens.home_stack.energy_query.building_profile.alert.fail.title"),
  //   description: t("screens.home_stack.energy_query.building_profile.alert.fail.message"),
  //   finished: isError, // change to true when done
  // },
  const onLeave = () => navigation.navigate("HomeScreen");

  const onRetry = () => {
    //navigation.navigate("SearchDeviceScreen");
  };
  // const getDataBAG = async () => {
  //   const { x, y, q } = { x: 1, y: 2, q: 3 };
  //   return { x, y, q };
  // };
  // const getDataBAG = async () => {
  //   const headers: {
  //     ...BASE_FETCH_HEADERS,
  //     Authorization: `Bearer ${key}`,
  //   }
  //   const response = await fetch("https://api.bag.acceptatie.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?postcode=2631CR&huisnummer=15&huisletter=C&exacteMatch=true&page=1&pageSize=20&inclusiefEindStatus=true");
  //   const data = await response.json();
  //   return data;
  // };
  const header = async () => {
    console.log(key?.api_key);
    return {
      headers: {
        accept: "application/hal+json",
        "X-Api-Key": `${key?.api_key}`,
      },
    };
  };
  const getDataBAG = async () => {
    const regexPostcode = /\b\d{4}\s?[A-Z]{2}\b/;
    console.log(location + "location");
    const postcodeMatch = location.match(regexPostcode);
    let postcode;
    if (postcodeMatch) {
      postcode = postcodeMatch[0];
      console.log(postcode);
    }
    const huisnummer = location;
    if (!key?.api_key) return null;
    const response = await fetch(
      `https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?postcode=8303HH&huisnummer=4`,
      {
        ...(await header()),
      }
    );
    const data = await handleRequestErrors(response);
    const jsonData = await data.json();
    const addresses = jsonData._embedded.adressen;
    addresses.forEach((address: any) => {
      // Access and log properties of each address object
      console.log('Address:', address);
    });
    return jsonData;
  };
  // Get data BAG use formula
  //"https://api.bag.acceptatie.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?postcode=2631CR&huisnummer=15&huisletter=C&exacteMatch=true&page=1&pageSize=20&inclusiefEindStatus=true"

  const MainFunction = async () => {
    const variables = await getDataBAG();
    setisReceived(true);
    console.log(variables + "info");
    console.log(key);
    const formula = dataSource.item.Formula;
    if (formula) {
      console.log("formula" + formula);
      //const result = await evaluate(formula, variables);
      setisCalculating(true);
      //Send data to database
      setisSucces(true);
      //console.log(result);
    }
  };
  MainFunction();

  // const locales: Record<string, Locale> = {
  //   "en-US": enUS,
  //   "nl-NL": nl,
  // };

  // function formatDateAndTime(date?: Date) {
  //   const inputDate = date || new Date();
  //   const locale = locales[resolvedLanguage] || enUS;

  //   let formatString = "cccccc, LLL d, yyy HH:mm";

  //   if (resolvedLanguage === "nl-NL") {
  //     formatString = "cccccc d LLL yyy HH:mm";
  //   }

  //   return format(inputDate, formatString, { locale });
  // }

  useEffect(() => {
    //provisionDevice();
  }, []);

  // Disable going back to force the user to use the buttons
  useDisableBackButton(true);

  return (
    <Box padded style={{ flex: 1, justifyContent: "space-between" }}>
      <Box>
        <Timeline items={timelineData} />

        {/* <Box padded>
          {isReceivingMeasurements ? (
            <StatusMessage
              label={t("screens.home_stack.provision.success.title")}
              message={t("screens.home_stack.provision.success.message", {
                // date: latestMeasurement ? formatDateAndTime(latestMeasurement) : formatDateAndTime(),
              })}
            />
          ) : isWifiError ? (
            <StatusMessage
              label={t("screens.home_stack.provision.wifi_error.title")}
              message={t("screens.home_stack.provision.wifi_error.message")}
            />
          ) : isProvisioningError ? (
            <StatusMessage
              label={t("screens.home_stack.provision.provisioning_error.title")}
              message={t("screens.home_stack.provision.provisioning_error.message")}
            />
          ) : isReceivingMeasurementsError ? (
            <StatusMessage
              label={t("screens.home_stack.provision.measurements_error.title")}
              message={t("screens.home_stack.provision.measurements_error.message")}
            />
          ) 
          : null}
        </Box> */}
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

type StatusMessageProps = {
  label: string;
  message: string;
};

function StatusMessage({ label, message }: StatusMessageProps) {
  return (
    <Box>
      <Text bold style={{ marginBottom: 6 }}>
        {label}
      </Text>
      <Text>{message}</Text>
    </Box>
  );
}
