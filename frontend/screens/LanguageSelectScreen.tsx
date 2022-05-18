import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';

const LanguageSelectScreen = ({ navigation }: { navigation: any }) => {
  async function gotoCards() {
    navigation.navigate('Cards', { languageId: 2 });
  }

  return (
    <SafeAreaView>
      <Pressable style={styles.button} onPress={gotoCards}>
        <Text style={styles.text}>Polish</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 24,
    lineHeight: 60,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default LanguageSelectScreen;
