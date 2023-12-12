import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { makeStyles, Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

import StatusIndicator from "@/components/common/StatusIndicator";
import PropertyBottomSheet from "@/components/common/bottomSheets/PropertyBottomSheet";
import Box from "@/components/elements/Box";
import useMeasurements from "@/hooks/device/useMeasurements";
import useTranslation from "@/hooks/translation/useTranslation";
import { DeviceProperty } from "@/types/api";
import { getAverageValuePerDay } from "@/utils/aggregate";

type DeviceGraphProps = {
  deviceName: string;
  dayRange?: number;
  property?: DeviceProperty;
  graphName?: string;
};

const BOX_HEIGHT = 250;

export default function DeviceGraph(props: DeviceGraphProps) {
  const { deviceName, dayRange = 14, graphName, property } = props;
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const styles = useStyles();
  const { theme } = useTheme();
  const [property, setProperty] = useState<DeviceProperty | undefined>();
  console.log("property:" + property?.id);
  const { data, isFetching } = useMeasurements(deviceName, {
    property: property?.id ?? 0,
    start: dayjs().subtract(dayRange, "d").startOf("day").toISOString(),
  });
  const [width, setWidth] = useState<number>(0);
  const { t } = useTranslation();

  const filteredData = data?.filter(measurement => !isNaN(parseFloat(measurement.value)));

  // get the aggregated average value of every day
  const aggregatedData = getAverageValuePerDay(filteredData ?? []);

  const generateDateRange = (dayRange: number) => {
    const dateArray = [];
    const currentDate = new Date();

    if (dayRange === 1) {
      for (let i = 0; i < 24; i++) {
        dateArray.unshift(currentDate.toISOString());
        currentDate.setHours(currentDate.getHours() - 1);
      }
    } else {
      for (let i = 0; i < dayRange; i++) {
        dateArray.unshift(dayjs(currentDate).format("DD-MM"));
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }

    return dateArray;
  };

  const hasMeasurements = Object.keys(aggregatedData ?? {}).length > 0;

  const dateRange = generateDateRange(dayRange);

  const chartData: LineChartData = {
    // get keys of aggregatedData object to string array
    labels: hasMeasurements
      ? Object.keys(aggregatedData).map(label => dayjs(label).format("DD-MM"))
      : dateRange.map(date => dayjs(date).format("DD-MM")),
    datasets: [
      {
        // all values of aggregatedData object to array without keys
        data: hasMeasurements ? Object.values(aggregatedData) : new Array(dateRange.length).fill(null),
      },
    ],
  };

  const emptyChartData: LineChartData = {
    labels: dateRange.map(date => dayjs(date).format("DD-MM")),
    datasets: [
      {
        data: [0],
      },
    ],
  };

  if (dayRange === 1) {
    chartData.labels = dateRange.filter((_, index) => index % 4 === 0).map(hour => dayjs(hour).format("HH:mm"));
    emptyChartData.labels = dateRange.filter((_, index) => index % 4 === 0).map(hour => dayjs(hour).format("HH:mm"));
    //console.log(chartData);
  } else if (dayRange === 7) {
    const today = dayjs(); // Get today's date
    const last7Days = Array.from({ length: 7 }, (_, i) => today.subtract(i, "day").format("DD-MM")).reverse(); // Generate an array of the last 7 days in the desired format

    chartData.labels = last7Days;
    emptyChartData.labels = last7Days;
    console.log(chartData.labels);
  } else if (dayRange === 30) {
    const today = dayjs(); // Get today's date
    const last30Days = Array.from({ length: 8 }, (_, i) => today.subtract(i * 4, "day").format("DD-MM")).reverse(); // Generate an array of the last 30 days, adding one date every 4 days

    chartData.labels = last30Days;
    emptyChartData.labels = last30Days;
    console.log(chartData.labels);
  }

  const chartConfig: AbstractChartConfig = {
    backgroundColor: "transparent",
    backgroundGradientTo: "white",
    backgroundGradientFromOpacity: 1,
    backgroundGradientFrom: "white",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => {
      const themeColor = theme.colors.blue;

      return `rgba(${parseInt(themeColor.slice(1, 3), 16)}, ${parseInt(themeColor.slice(3, 5), 16)}, ${parseInt(
        themeColor.slice(5, 7),
        16
      )}, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    fillShadowGradient: theme.colors.blue,
    fillShadowGradientOpacity: 1,
    fillShadowGradientTo: theme.colors.blue,
    fillShadowGradientToOpacity: 1,
  };

  return (
    <Box padded style={styles.container}>
      <Box style={styles.chart}>
        <View style={styles.title}>
          <Text bold>
            {graphName ?? t("screens.measurements.graph.timespan", { count: dayRange, unit: t("common.units.days") })}
          </Text>
          <TouchableOpacity style={{ flexGrow: 1 }} onPress={() => bottomSheetRef.current?.present()}>
            <Text style={{ fontSize: 14, textAlign: "right" }}>
              {t(`hooks.property_translation.${property?.name}`, {
                defaultValue: t("screens.measurements.graph.no_property"),
              })}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ overflow: "hidden", width: "100%" }} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
          {isFetching ? (
            <View style={{ height: BOX_HEIGHT }}>
              <StatusIndicator isLoading />
            </View>
          ) : (
            <>
              {hasMeasurements ? (
                <LineChart
                  data={chartData}
                  width={width}
                  height={BOX_HEIGHT}
                  verticalLabelRotation={35}
                  xLabelsOffset={-10}
                  formatXLabel={label => label}
                  chartConfig={chartConfig}
                  bezier
                  withDots={false}
                />
              ) : (
                <LineChart
                  data={emptyChartData}
                  width={width}
                  height={BOX_HEIGHT}
                  verticalLabelRotation={35}
                  xLabelsOffset={-10}
                  formatXLabel={label => label}
                  chartConfig={chartConfig}
                  bezier
                  withDots={false}
                />
              )}
            </>
          )}
        </View>
      </Box>
      <PropertyBottomSheet
        bottomSheetRef={bottomSheetRef}
        deviceName={deviceName}
        propertyId={property?.id}
        onPropertySelect={setProperty}
      />
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    margin: 0,
  },
  title: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: theme.spacing.md,
  },
  chart: {
    marginBottom: theme.spacing.md,
    backgroundColor: "white",
    padding: theme.spacing.lg,
    borderRadius: theme.spacing.lg,
    width: "100%",
    overflow: "hidden",
  },
}));
