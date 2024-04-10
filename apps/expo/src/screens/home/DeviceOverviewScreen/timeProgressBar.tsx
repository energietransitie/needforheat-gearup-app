import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const TimeProgressBar = ({ progress }: { progress: string }) => {
  let [elapsedTime, totalTime] = progress.split("/").map(Number);
  const [remainingTime, setRemainingTime] = useState(0);
  let tooLate = false;
  if (elapsedTime === totalTime) {
    tooLate = true;
  } else {
    if (elapsedTime === 0) {
      elapsedTime = 1
    }
  }
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
  
    const updateRemainingTime = () => {
      intervalId = setInterval(() => {
        // setRemainingTime(prevRemainingTime => {
        //   console.log(prevRemainingTime + "hi")
        //   if (prevRemainingTime < 0) {
        //     //return prevRemainingTime + 1;
        //   // } else {
        //     if (elapsedTime === totalTime) {
        //       tooLate = true;
        //     } else {
        //       if (elapsedTime === 0) {
        //         elapsedTime = 1
        //       }
        //     }
        //     clearInterval(intervalId);
        //     return prevRemainingTime;
        //   }
        //   return 0;
        // });
        const newTime = totalTime - elapsedTime;
        console.log(newTime);
        setRemainingTime(totalTime - elapsedTime);
      }, 60000);
    };
  
    setRemainingTime(totalTime - elapsedTime);
    updateRemainingTime();
  
    return () => clearInterval(intervalId);
  }, [progress]);

  const progressBarWidth = tooLate ? 100 : ((remainingTime / totalTime) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progress, tooLate ? styles.tooLateProgress : null, { width: `${progressBarWidth}%`, height: tooLate ? 5 : 15 }]}>
          <View style={styles.textWrapper}>
            <Text style={styles.progressText}>{tooLate ? "" : `${remainingTime}m`}</Text>
          </View>
        </View>
        <View style={[styles.remainingProgress, { width: `${100 - progressBarWidth}%` }]} />
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
  remainingProgress: {
    backgroundColor: "#ddd",
  },
});

export default TimeProgressBar;
