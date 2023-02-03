import React, { useLayoutEffect, useState, useCallback, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import PostsList from '../../components/PostsList';
import { Container, ListPosts } from './styles';
import { AuthContext } from '../../contexts/auth';
export default function PostsUser() {

  const route = useRoute();
  const navigation = useNavigation();
  const [title, setTitle] = useState(route.params?.title);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title === '' ? '' : title
    })
  }, [navigation, title])

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      firestore().collection('posts').where('userId', '==', route.params?.userId)
        .orderBy('created', 'desc').get()
        .then((snapshot) => {
          const postList = [];

          snapshot.docs.map(u => {
            postList.push({
              ...u.data(),
              id: u.id
            })
          })

          if (isActive) {
            setPosts(postList);
            setLoading(false)
          }
        })

      return () => {
        isActive = false
      }
    }, [])
  )
  return (
    <Container>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#E52246" size={50} />
        </View>
      ) : (
        <ListPosts
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({ item }) => <PostsList data={item} userId={user.uid} />}
        />
      )}
    </Container>
  );
}