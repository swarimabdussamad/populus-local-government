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
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PinchGestureHandler } from 'react-native-gesture-handler';
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
  insights?: string;
};

const SurveyResultsd = () => {
  const route = useRoute();
  const { surveyId } = route.params as { surveyId: string };
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingType, setLoadingType] = useState<string | null>(null);

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
        setPlots(prevPlots => {
          const filteredPlots = prevPlots.filter(plot => plot.type !== endpoint);
          return [
            ...filteredPlots,
            {
              id: `${endpoint}-${Date.now()}`,
              image: data.image,
              type: endpoint,
              insights: data.insights
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
            type: 'result',
            insights: data.insights
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
        {plot.insights && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Insights:</Text>
            <Text style={styles.insightsText}>{plot.insights}</Text>
          </View>
        )}
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

      {/* Drawer-like Button Container */}
      <View style={styles.drawerContainer}>
        <TouchableOpacity
          style={[styles.drawerButton, loadingType === 'gender' && styles.disabledButton]}
          onPress={() => fetchAnalytics('gender')}
          disabled={loadingType !== null}
        >
          <Text style={styles.drawerButtonText}>Gender</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.drawerButton, loadingType === 'age' && styles.disabledButton]}
          onPress={() => fetchAnalytics('age')}
          disabled={loadingType !== null}
        >
          <Text style={styles.drawerButtonText}>Age</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.drawerButton, loadingType === 'income' && styles.disabledButton]}
          onPress={() => fetchAnalytics('income')}
          disabled={loadingType !== null}
        >
          <Text style={styles.drawerButtonText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.drawerButton, loadingType === 'ward' && styles.disabledButton]}
          onPress={() => fetchAnalytics('ward')}
          disabled={loadingType !== null}
        >
          <Text style={styles.drawerButtonText}>Ward</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.drawerButton, loadingType === 'rationcard' && styles.disabledButton]}
          onPress={() => fetchAnalytics('rationcard')}
          disabled={loadingType !== null}
        >
          <Text style={styles.drawerButtonText}>Ration Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  plotContainer: {
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 20,
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
    height: Dimensions.get('window').height * 0.35,
  },
  insightsContainer: {
    width: '90%',
    padding: 15,
    marginTop: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  insightsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  drawerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  drawerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  drawerButtonText: {
    color: 'white',
    fontSize: 14,
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

export default SurveyResultsd;