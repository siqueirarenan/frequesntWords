import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';

const CardsScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [data, setData] = useState({
    word: '',
    id: 0,
    pt_br: '',
    de_de: '',
    en_us: '',
    type: '',
    reverse: false,
  });
  const [token, setToken] = useState('');
  const [words, setWords] = useState({
    word: '',
    pt_br: '',
    de_de: '',
    en_us: '',
  });

  const setVariables = (res: Response): void => {
    if (res.status >= 400) {
      throw Error();
    }
    res.json().then((res) => {
      setData(res);
      setWords({
        word: !data.reverse ? res.word : '',
        pt_br: data.reverse ? res.pt_br : '',
        de_de: data.reverse ? res.de_de : '',
        en_us: data.reverse ? res.en_us : '',
      });
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('token').then((token: any) => {
      if (!token) navigation.navigate('Login');
      setToken(token);

      fetch(
        `http://localhost:3000/api/words/next?languageId=${route.params.languageId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        },
      )
        .then(setVariables)
        .catch((e) => navigation.navigate('Login'));
    });
  }, []);

  async function wrong() {
    fetch(`http://localhost:3000/api/words/${data.id}/wrong`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(setVariables);
  }

  async function half() {
    fetch(`http://localhost:3000/api/words/${data.id}/right?percent=5`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(setVariables);
  }

  async function right() {
    fetch(`http://localhost:3000/api/words/${data.id}/right?percent=10`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(setVariables);
  }

  function show() {
    setWords(data);
  }

  return (
    <SafeAreaView style={{ padding: 10, alignContent: 'center' }}>
      <Text
        style={{
          padding: 10,
          fontSize: 42,
          backgroundColor: '#EEE',
          borderWidth: 10,
          borderColor: '#EEE',
          height: 100,
        }}
      >
        {words.word}
      </Text>
      <Text style={{ padding: 10, fontSize: 17, textAlign: 'right' }}>
        {data.type}
      </Text>
      <Text style={styles.translation}>{words.en_us}</Text>
      <Text style={styles.translation}>{words.pt_br}</Text>
      <Text style={styles.translation}>{words.de_de}</Text>
      <View style={{ height: 20, backgroundColor: '#FFF' }} />
      <Pressable
        style={{ ...styles.button, backgroundColor: 'black' }}
        onPress={show}
      >
        <Text style={styles.text}>Show Answer</Text>
      </Pressable>
      <Pressable
        style={{ ...styles.button, backgroundColor: 'blue' }}
        onPress={wrong}
      >
        <Text style={styles.text}>Right</Text>
      </Pressable>
      <Pressable
        style={{ ...styles.button, backgroundColor: 'green' }}
        onPress={half}
      >
        <Text style={styles.text}>Almost Right</Text>
      </Pressable>
      <Pressable
        style={{ ...styles.button, backgroundColor: 'red' }}
        onPress={right}
      >
        <Text style={styles.text}>Wrong</Text>
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
  translation: {
    padding: 10,
    fontSize: 36,
    backgroundColor: '#FFF',
    borderWidth: 10,
    borderColor: '#FFF',
    height: 60,
  },
  button: {
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 20,
    lineHeight: 60,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    padding: 5,
  },
});

export default CardsScreen;
