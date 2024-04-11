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
      if (remainingTime === totalTime && remainingTime === 0 && totalTime === 0) {
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
        {/* Progress bar */}
        <View
          style={[
            styles.progress,
            superLate ? styles.superLateProgress : tooLate ? styles.tooLateProgress : null,
            { width: `${progressBarWidth}%`, height: tooLate || superLate ? 5 : 15 },
          ]}
        />

        {/* Text or remaining time */}
        {!tooLate && !superLate && (
          <View style={[styles.textWrapper]}>
            {remainingTime === 0 ? (
              <Text style={[styles.progressText, progressBarWidth >= 50 && styles.textWrapperWhite]}>
                {t("screens.device_overview.device_list.updating_now")}
              </Text>
            ) : (
              <Text style={[styles.progressText, progressBarWidth >= 50 && styles.textWrapperWhite]}>
                {t("screens.device_overview.device_list.next_update") + ` ${remainingTime}m`}
              </Text>
            )}
          </View>
        )}

        {/* Remaining progress */}
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
    position: "relative", // Ensure positioning context
  },
  progressText: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    zIndex: 2, // Ensure text is above remainingProgress
  },
  textWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    zIndex: 2, // Ensure text is above remainingProgress
  },
  textWrapperWhite: {
    color: "white",
  },
  progress: {
    backgroundColor: "green",
    zIndex: 1, // Ensure progress is below text and remainingProgress
  },
  tooLateProgress: {
    backgroundColor: "orange",
    zIndex: 1, // Ensure tooLateProgress is below text and remainingProgress
  },
  superLateProgress: {
    backgroundColor: "red",
    zIndex: 1, // Ensure superLateProgress is below text and remainingProgress
  },
  remainingProgress: {
    backgroundColor: "#ddd",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 0, // Behind progress and text
  },
});

export default TimeProgressBar;
