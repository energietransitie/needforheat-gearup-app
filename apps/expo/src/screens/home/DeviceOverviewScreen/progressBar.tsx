import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProgressBar = ({ progress }: { progress: string }) => {
  const [connectedCount, totalCount] = progress.split("/").map(Number);

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { flex: connectedCount }]}>
          <View style={styles.textWrapper}>
            <Text style={styles.progressText}>{progress}</Text>
          </View>
        </View>
        <View style={[styles.remainingProgress, { flex: totalCount - connectedCount }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  progressBar: {
    flexDirection: "row",
    height: 20,
    backgroundColor: "#e3e4e6",
    borderRadius: 5,
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 5,
  },
  progressText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
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
  remainingProgress: {
    backgroundColor: "#ddd",
  },
});

export default ProgressBar;
