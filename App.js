import {View, Button, Text, Dimensions} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import CustomBottomSheet from './src/components/templates/CustomBottomSheet';

const MyContent = () => {
  const [content, setContent] = useState(false);

  return (
    <View>
      <Button
        title={'Expanddddir'}
        onPress={() => {
          setContent(!content);
        }}
      />

      <Text style={{fontSize: 20}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
        ullamcorper sodales ante at mattis. Praesent congue ac risus et posuere.
        Vestibulum non ligula ut sapien hendrerit rhoncus id id est. Morbi
        ligula lorem, semper ac suscipit quis, lobortis vitae tellus. Vestibulum
        ullamcorper consectetur vulputate. Donec eget fermentum nisl.
      </Text>

      {content && (
        <Text style={{fontSize: 20}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          ullamcorper sodales ante at mattis. Praesent congue ac risus et
          posuere. Vestibulum non ligula ut sapien hendrerit rhoncus id id est.
          Morbi ligula lorem, semper ac suscipit quis, lobortis vitae tellus.
          Vestibulum ullamcorper consectetur vulputate. Donec eget fermentum
          nisl.
        </Text>
      )}
    </View>
  );
};

const App = () => (
  <View>
    <CustomBottomSheet
      onClose={() => {}}
      header={'Como acesso o código?'}
      headerSize={108}>
      <MyContent />
    </CustomBottomSheet>
  </View>
);

export default App;
