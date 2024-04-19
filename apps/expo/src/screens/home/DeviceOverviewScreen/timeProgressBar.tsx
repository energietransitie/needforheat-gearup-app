import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

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

  const progressPercentage = (remainingTime / totalTime) * 100;

  //formattime hours and minutes
  const formatTime = (time: number) => {
    if (time >= 60) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return minutes === 0
        ? hours + t("screens.device_overview.device_list.hours")
        : hours + t("screens.device_overview.device_list.hours") + " " + minutes + "m";
    } else {
      return time + "m";
    }
  };

  return (
    <View style={styles.container}>
      <Svg width="50%" height="50%" viewBox="0 0 42 42">
        <Circle cx="21" cy="21" r="15.91549430918954" strokeWidth="4" stroke="#ccc" fill="none" />
        <Circle
          cx="21"
          cy="21"
          r="15.91549430918954"
          strokeWidth="4"
          stroke={superLate ? "red" : tooLate ? "orange" : "green"}
          strokeDasharray={`${progressPercentage}, 100`}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90, 21, 21)"
        />
      </Svg>
      <Text style={styles.progressText}>
        {remainingTime === 0 ? t("screens.device_overview.device_list.updating_now") : formatTime(remainingTime)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    position: "absolute",
    right: -40,
    top: -30,
  },
  progressText: {
    position: "absolute",
    fontSize: 8,
    textAlign: "center",
    zIndex: 2,
  },
});

export default TimeProgressBar;
