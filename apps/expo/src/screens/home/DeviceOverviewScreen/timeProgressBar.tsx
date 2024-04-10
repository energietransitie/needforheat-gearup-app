import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface TimeProgressBarProps {
  progress: string;
  onTimePassedByMinute: () => void;
  notificationSent: boolean;
}

const TimeProgressBar: React.FC<TimeProgressBarProps> = ({ progress, onTimePassedByMinute, notificationSent }) => {
  const { t } = useTranslation();
  const [elapsedTime, totalTime] = progress.split("/").map(Number);
  const [remainingTime, setRemainingTime] = useState(elapsedTime);
  const [tooLate, setTooLate] = useState(false);
  const [superLate, setSuperLate] = useState(false);

  useEffect(() => {
    setRemainingTime(elapsedTime);

    if (remainingTime === totalTime && remainingTime === 0 && totalTime === 0) setTooLate(true);
    else setTooLate(false);

    if (notificationSent) setSuperLate(true);
    else setSuperLate(false);

    const intervalId = setInterval(() => {
      if (remainingTime <= 0) {
        setTooLate(true);
      } else {
        setTooLate(false);
      }
      onTimePassedByMinute();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [progress]);

  const progressBarWidth = tooLate ? 100 : 100 - (remainingTime / totalTime) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            superLate ? styles.superLateProgress : tooLate ? styles.tooLateProgress : null,
            { width: `${progressBarWidth}%`, height: tooLate || superLate ? 5 : 15 },
          ]}
        >
          {!tooLate && !superLate && (
            <View style={styles.textWrapper}>
              {remainingTime === 0 ? (
                <Text style={styles.progressText}>{t("screens.device_overview.device_list.updating_now")}</Text>
              ) : (
                <Text style={styles.progressText}>{`${remainingTime}m`}</Text>
              )}
            </View>
          )}
        </View>
        <View style={[styles.remainingProgress, { width: `${progressBarWidth}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: "100%",
  },
  progressBar: {
    flexDirection: "row",
    backgroundColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    alignItems: "center",
  },
  progressText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  progress: {
    backgroundColor: "green",
  },
  tooLateProgress: {
    backgroundColor: "orange",
  },
  superLateProgress: {
    backgroundColor: "red",
  },
  remainingProgress: {
    backgroundColor: "#ddd",
  },
});

export default TimeProgressBar;
