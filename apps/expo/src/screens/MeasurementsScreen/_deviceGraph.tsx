import { makeStyles, Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useState } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

import StatusIndicator from "@/components/common/StatusIndicator";
import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import useMeasurements from "@/hooks/upload/useMeasurements";
import { Measurement, Property } from "@/types/api";
import { getAverageValuePerDay } from "@/utils/aggregate";

type DeviceGraphProps = {
  deviceName: string;
  dayRange?: number;
  property: Property | undefined;
};

const BOX_HEIGHT = 250;

export default function DeviceGraph(props: DeviceGraphProps) {
  const { deviceName, dayRange = 14, property } = props;
  const styles = useStyles();
  const { theme } = useTheme();
  const { data, isFetching } = useMeasurements(deviceName, "device", {
    property: property?.id ?? 0,
    start: dayjs().subtract(dayRange, "d").startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS"),
  });
  const measurements: Measurement[] = Array.isArray(data) ? data : [];
  const [width, setWidth] = useState<number>(0);
  const { t } = useTranslation();

  const filteredData = measurements?.filter(measurement => !isNaN(parseFloat(measurement.value)));

  // get the aggregated average value of every day
  const aggregatedData = getAverageValuePerDay(filteredData ?? []);

  const chartData: LineChartData = {
    // get keys of aggregatedData object to string array
    labels: Object.keys(aggregatedData).map(label => label.toString()),
    datasets: [
      {
        // all values of aggregatedData object to array without keys
        data: aggregatedData ? Object.values(aggregatedData) : [],
      },
    ],
  };

  const hasMeasurements = Object.keys(aggregatedData ?? {}).length > 0;

  const chartConfig: AbstractChartConfig = {
    backgroundColor: "transparent",
    backgroundGradientTo: "white",
    backgroundGradientFromOpacity: 0,
    backgroundGradientFrom: "white",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => {
      const themeColor = theme.colors.primary;

      return `rgba(${parseInt(themeColor.slice(1, 3), 16)}, ${parseInt(themeColor.slice(3, 5), 16)}, ${parseInt(
        themeColor.slice(5, 7),
        16
      )}, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <Box padded style={styles.container}>
      <Box style={styles.chart}>
        <View style={styles.title}>
          <Text bold>
            {t("screens.measurements.graph.timespan", { count: dayRange, unit: t("common.units.days") })}
          </Text>
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
                  formatXLabel={label => dayjs(label).format("DD-MM")}
                  chartConfig={chartConfig}
                  bezier
                />
              ) : (
                <Text>{t("screens.measurements.graph.no_data")}</Text>
              )}
            </>
          )}
        </View>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
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
