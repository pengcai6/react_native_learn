import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const Flex = () => {
  return (
    <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'column',
        },
      ]}
    >
      <View style={{ flex: 1, backgroundColor: 'red' }} />
      <View style={{ flex: 2, backgroundColor: 'darkorange' }} />
      <View style={{ flex: 3, backgroundColor: 'green' }} />
      <Image
        source={{ uri: 'https://legacy.reactjs.org/logo-og.png' }}
        style={{ width: 400, height: 400 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Flex;
