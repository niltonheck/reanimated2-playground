import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import {View, Dimensions, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {PanGestureHandler} from 'react-native-gesture-handler';

const style = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#f3f3f3',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: 'absolute',
    transform: [{translateY: Dimensions.get('window').height}],
  },
});

const CustomBottomSheet = (props) => {
  const {children, header, headerSize, onClose} = props;

  const [bottomSettings, setBottomSettings] = useState({
    position: 'initial',
    headerSize: headerSize,
    modalHeight: 0,
  });

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const randomWidth = useSharedValue(
    Dimensions.get('window').height - bottomSettings.headerSize,
  );

  useEffect(() => {
    resize(randomWidth);
  });

  const resize = useCallback(
    (h) => {
      if (bottomSettings.position === 'initial') {
        h.value = Dimensions.get('window').height - bottomSettings.headerSize;
      } else {
        h.value =
          Dimensions.get('window').height -
          (bottomSettings.modalHeight + bottomSettings.headerSize);
      }
    },
    [bottomSettings],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      translateY: withTiming(randomWidth.value, config),
    };
  });

  return (
    <View>
      {bottomSettings.position === 'open' && (
        <Animated.View
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: '#000000',
            opacity: 0.8,
          }}
        />
      )}

      <Animated.View style={[style.container, animatedStyle]}>
        <PanGestureHandler
          shouldCancelWhenOutside={false}
          onGestureEvent={(e) => {
            if (e.nativeEvent.translationY < -10) {
              if (bottomSettings.position === 'initial') {
                setBottomSettings({
                  ...bottomSettings,
                  position: 'open',
                });
              }
            }

            if (e.nativeEvent.translationY > 10) {
              if (bottomSettings.position === 'open') {
                setBottomSettings({
                  ...bottomSettings,
                  position: 'initial',
                });

                props.onClose && props.onClose();
              }
            }
          }}>
          <View
            style={{
              paddingLeft: 40,
              paddingRight: 40,
              paddingTop: 35,
              paddingBottom: 24,
            }}
            onLayout={(e) => {
              console.log(e.nativeEvent.layout.height);
            }}>
            <Text style={{color: '#121212', fontSize: 18}}>{header}</Text>
          </View>
        </PanGestureHandler>

        <View
          onLayout={(e) => {
            setBottomSettings({
              ...bottomSettings,
              modalHeight: e.nativeEvent.layout.height,
            });
          }}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

export default CustomBottomSheet;
