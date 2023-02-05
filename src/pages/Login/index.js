import React, { useState, useContext } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { Container, Title, Input, Button, ButtonText, SignUpBotton, SignUpText } from './styles';
import { AuthContext } from '../../contexts/auth';

import * as Animatable from 'react-native-animatable'

const TitleAnimated = Animatable.createAnimatableComponent(Title);
export default function Login() {


  const [login, setLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { signUp, signIn, loadingAuth } = useContext(AuthContext);

  function toogleLogin() {
    setLogin(!login);
    setEmail('');
    setPassword('');
    setName('');
  }
  async function handleSignIn() {
    if (email === '' || password === '') {
      alert("Preencha todos os campos")
      return
    }
    await signIn(email, password)
  }
  async function handleSignUp() {
    if (email === '' || password === '' || name === '') {
      alert("Preencha todos os campos")
      return
    }
    await signUp(email, password, name);

  }


  if (login) {

    return (
      <Container>
        <TitleAnimated animation='flipInY'>
          Dev<Text style={{ color: '#E52246' }}>Post</Text>
        </TitleAnimated>
        <Input
          placeholder="seuemail@dominio.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="******"
          placeholderTextColor="#999"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
        <Button onPress={handleSignIn}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#FFF" />
          ) : (
            <ButtonText>Acessar</ButtonText>
          )}
        </Button>
        <SignUpBotton onPress={toogleLogin}>
          <SignUpText>Criar sua conta</SignUpText>
        </SignUpBotton>
      </Container>
    );
  }

  return (
    <Container>
      <TitleAnimated animation='zoomIn'>
        Dev<Text style={{ color: '#E52246' }}>Post</Text>
      </TitleAnimated>
      <Input
        placeholder="Seu nome"
        placeholderTextColor="#999"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Input
        placeholder="seuemail@dominio.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="******"
        placeholderTextColor="#999" 
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <Button onPress={handleSignUp}>
        {loadingAuth ? (
          <ActivityIndicator size={20} color="#FFF" />
        ) : (
          <ButtonText>Cadastrar</ButtonText>
        )}
      </Button>
      <SignUpBotton onPress={toogleLogin}>
        <SignUpText>Ja possuo uma conta</SignUpText>
      </SignUpBotton>
    </Container>
  );
}