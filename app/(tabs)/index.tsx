import { Accelerometer } from "expo-sensors";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function SensorScreen() {
  const [accelData, setAccelData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    speed: number | null;
  } | null>(null);

  useEffect(() => {
    Accelerometer.setUpdateInterval(250);

    const accelSubscription = Accelerometer.addListener((data) => {
      setAccelData(data);
    });

    let locationSubscription: Location.LocationSubscription;

    async function startLocationTracking() {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      locationSubscription =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (loc) => {
            console.log(loc.coords)
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text>Carbon Tracker 🌎</Text>

      <Text>
        X: {accelData.x.toFixed(2)}
      </Text>

      <Text>
        Y: {accelData.y.toFixed(2)}
      </Text>

      <Text>
        Z: {accelData.z.toFixed(2)}
      </Text>

      <Text>
        Latitude: {location?.latitude?.toFixed(6) ?? "Loading..."}
      </Text>

      <Text>
        Longitude: {location?.longitude?.toFixed(6) ?? "Loading..."}
      </Text>

      <Text>
        Speed: {location?.speed?.toFixed(2) ?? "0"} m/s
      </Text>
    </View>
  );
}