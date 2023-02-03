import React, { useState, useLayoutEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { View, Text } from 'react-native';
import { Container, Input, Button, ButtonText } from './styles';
import { AuthContext } from '../../contexts/auth';
export default function NewPost() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState('');



  useLayoutEffect(() => {
    const options = navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => handlePost()}>
          <ButtonText>Compartilhar</ButtonText>
        </Button>
      )
    })
  }, [navigation, post]);

  async function handlePost() {
    if (post === '') {
      return
    }

    let urlAvatar = null

    try {
      let response = await storage().ref('users').child(user?.uid).getDownloadURL();
      urlAvatar = response;

    } catch (error) {
      urlAvatar = null;
    }

    await firestore().collection('posts').add({
      created: new Date(),
      content: post,
      autor: user?.nome,
      userId: user?.uid,
      likes: 0,
      urlAvatar
    }).then(() => {
      setPost('')
      navigation.goBack();
    })
      .catch((error) => {
        console.log(error);
      })

  }
  return (
    <Container>
      <Input
        placeholder="O que está acontecendo?"
        value={post}
        onChangeText={(text) => setPost(text)}
        multiline
        autoCorrect={false}
        maxLength={300}
        placeholderTextColor="#BBB"
      />
    </Container>
  );
}