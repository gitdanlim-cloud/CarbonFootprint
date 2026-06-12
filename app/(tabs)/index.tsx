import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LocationSnapshot = {
  latitude: number;
  longitude: number;
  speed: number | null;
};

function getActivityLabel(speed: number | null, magnitude: number) {
  if (speed === null) {
    return "Waiting for GPS signal";
  }

  if (speed < 1.5 && magnitude < 1.6) {
    return "Walking";
  }

  if (speed < 8) {
    return "Cycling";
  }

  return "Driving";
}

function getCarbonEstimate(speed: number | null, magnitude: number) {
  const baseEstimate = speed === null ? 0.02 : speed < 1.5 ? 0.08 : speed < 8 ? 0.04 : 0.18;
  const movementBoost = magnitude > 1.8 ? 0.02 : 0;

  return Number((baseEstimate + movementBoost).toFixed(2));
}

export default function SensorScreen() {
  const [accelData, setAccelData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [location, setLocation] = useState<LocationSnapshot | null>(null);

  useEffect(() => {
    Accelerometer.setUpdateInterval(250);

    const accelSubscription = Accelerometer.addListener((data) => {
      setAccelData(data);
    });

    let locationSubscription: Location.LocationSubscription | undefined;

    async function startLocationTracking() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            speed: loc.coords.speed,
          });
        }
      );
    }

    startLocationTracking();

    return () => {
      accelSubscription.remove();

      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const magnitude = useMemo(
    () => Math.sqrt(accelData.x ** 2 + accelData.y ** 2 + accelData.z ** 2),
    [accelData]
  );

  const activityLabel = useMemo(
    () => getActivityLabel(location?.speed ?? null, magnitude),
    [location?.speed, magnitude]
  );

  const estimatedCarbon = useMemo(
    () => getCarbonEstimate(location?.speed ?? null, magnitude),
    [location?.speed, magnitude]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Carbon Tracker</Text>
          <Text style={styles.title}>Live movement overview</Text>
          <Text style={styles.subtitle}>
            Your phone is sampling motion and location to estimate a simple carbon footprint signal.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionLabel}>Current activity</Text>
          <Text style={styles.summaryValue}>{activityLabel}</Text>
          <Text style={styles.summaryHint}>
            Estimated footprint: {estimatedCarbon.toFixed(2)} kg CO₂e / hour
          </Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Speed</Text>
            <Text style={styles.metricValue}>{location?.speed?.toFixed(2) ?? "0.00"} m/s</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Acceleration</Text>
            <Text style={styles.metricValue}>{magnitude.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Latitude</Text>
            <Text style={styles.metricValue}>{location?.latitude?.toFixed(4) ?? "--"}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Longitude</Text>
            <Text style={styles.metricValue}>{location?.longitude?.toFixed(4) ?? "--"}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  heroCard: {
    backgroundColor: "#1f6b4f",
    borderRadius: 20,
    padding: 20,
  },
  eyebrow: {
    color: "#d8f3e2",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    color: "#e6f7eb",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  summaryValue: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  summaryHint: {
    color: "#475569",
    fontSize: 13,
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    minWidth: "47%",
    flexGrow: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metricValue: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
});