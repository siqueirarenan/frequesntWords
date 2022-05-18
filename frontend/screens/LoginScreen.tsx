import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [login, setLogin] = React.useState('');
  const [password, setPawssword] = React.useState('');

  function auth() {
    fetch('http://localhost:3000/api/users/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: login,
        password,
      }),
    }).then((res) => {
      navigation.navigate('Languages');
      res.json().then((res) => {
        AsyncStorage.setItem('token', res.accessToken);
      });
    });
  }

  return (
    <SafeAreaView>
      <Text>Email</Text>
      <TextInput style={styles.input} onChangeText={setLogin} value={login} />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPawssword}
        value={password}
      />
      <Button title="Login" color="#f194ff" onPress={auth} />
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
});

export default LoginScreen;
