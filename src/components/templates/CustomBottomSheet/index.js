import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
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

const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block,
} = Animated;

const clock = new Clock();

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 5000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        set(config.toValue, dest),
      ],
      [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ],
    ),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // we made the block return the updated position
    state.position,
  ]);
}

const CustomBottomSheet = (props) => {
  const {children, header, headerSize, onClose} = props;

  const [bottomSettings, setBottomSettings] = useState({
    position: 'initial',
    headerSize: headerSize,
    modalHeight: 0,
  });

  const [overlay, setOverlay] = useState(false);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const randomWidth = useSharedValue(
    Dimensions.get('window').height - bottomSettings.headerSize,
  );

  const reset = () => {
    setBottomSettings({
      ...bottomSettings,
      position: 'initial',
    });
  };

  const opacityControl = useSharedValue(0);

  useEffect(() => {
    resize(randomWidth, opacityControl);
  });

  const resize = useCallback(
    (h, o) => {
      if (bottomSettings.position === 'initial') {
        h.value = Dimensions.get('window').height - bottomSettings.headerSize;
        o.value = 0.0;
      } else {
        h.value =
          Dimensions.get('window').height -
          (bottomSettings.modalHeight + bottomSettings.headerSize);
        o.value = 0.8;

        setOverlay(true);
      }
    },
    [bottomSettings],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      translateY: withTiming(randomWidth.value, config),
    };
  });

  const animatedStyleOverlay = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacityControl.value, {
        duration: 200,
      }),
    };
  });

  return (
    <View>
      {bottomSettings.position !== 'initial' && (
        <TouchableWithoutFeedback
          style={{
            zIndex: 9999,
            position: 'absolute',
          }}
          onPress={() => reset()}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: '#000000',
                opacity: 0.0,
                display: 'none',
              },
              animatedStyleOverlay,
            ]}
          />
        </TouchableWithoutFeedback>
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
