import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why this app matters</Text>
      <Text style={styles.body}>
        Carbon Tracker turns your everyday movement into a simple environmental snapshot. By observing
        motion and location, it gives a lightweight estimate of whether you are walking, cycling,
        or driving.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How it works</Text>
        <Text style={styles.cardText}>1. The app requests location access.</Text>
        <Text style={styles.cardText}>2. Motion data is sampled from the device sensors.</Text>
        <Text style={styles.cardText}>3. A basic carbon estimate is shown for the current activity.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fbff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  body: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
});
