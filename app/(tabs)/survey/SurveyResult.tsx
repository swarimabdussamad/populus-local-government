import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  ScrollView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

type Plot = {
  id: string;
  image: string;
  type: string;
};

type SurveyResult = {
  image?: string;
};

const SurveyResults = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { surveyId } = route.params as { surveyId: string };
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const fetchAnalytics = async (endpoint: string) => {
    try {
      setLoadingType(endpoint);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError("User token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${API_URL}/analytics/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ surveyId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.image) {
        // Update the plots array, replacing any existing plot of the same type
        setPlots(prevPlots => {
          // Filter out any existing plot of the same type
          const filteredPlots = prevPlots.filter(plot => plot.type !== endpoint);
          // Add the new plot
          return [
            ...filteredPlots,
            {
              id: `${endpoint}-${Date.now()}`,
              image: data.image,
              type: endpoint
            }
          ];
        });
      }
    } catch (err: any) {
      setError(err.message || `Failed to fetch ${endpoint} analytics`);
    } finally {
      setLoadingType(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setError("User token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/analytics/result`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ surveyId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.image) {
          setPlots([{
            id: `initial-${Date.now()}`,
            image: data.image,
            type: 'result'
          }]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch survey results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surveyId]);

  // Individual Plot component that handles its own pinch scale
  const PlotItem = ({ plot }: { plot: Plot }) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const pinchHandler = useAnimatedGestureHandler({
      onStart: (_, ctx: any) => {
        ctx.startScale = scale.value;
      },
      onActive: (event: any, ctx: any) => {
        scale.value = Math.max(0.5, Math.min(ctx.startScale * event.scale, 4));
      },
      onEnd: () => {
        savedScale.value = scale.value;
      },
    });

    const imageStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withSpring(scale.value) }],
      };
    });

    return (
      <View style={styles.plotContainer}>
        <Text style={styles.plotTitle}>
          {plot.type === 'result' ? 'Overall Results' : plot.type.charAt(0).toUpperCase() + plot.type.slice(1) + ' Analysis'}
        </Text>
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.Image
            source={{ uri: plot.image }}
            style={[styles.image, imageStyle]}
            resizeMode="contain"
          />
        </PinchGestureHandler>
        {loadingType === plot.type && (
          <View style={styles.overlayLoader}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    );
  };

  if (loading && plots.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error && plots.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {plots.map(plot => (
          <PlotItem key={plot.id} plot={plot} />
        ))}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loadingType === 'gender' && styles.disabledButton]}
          onPress={() => fetchAnalytics('gender')}
          disabled={loadingType !== null}
        >
          <Text style={styles.buttonText}>Gender</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, loadingType === 'age' && styles.disabledButton]}
          onPress={() => fetchAnalytics('age')}
          disabled={loadingType !== null}
        >
          <Text style={styles.buttonText}>Age</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  plotContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
    position: 'relative',
  },
  overlayLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 10,
  },
});

export default SurveyResults;