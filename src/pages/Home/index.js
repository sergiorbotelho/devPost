import React, { useState, useContext, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import { Container, ButtonPost, ListPosts } from './styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import firestore from '@react-native-firebase/firestore';
import PostsList from '../../components/PostsList';

export default function Home() {
  const { user } = useContext(AuthContext)
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadingRefresh, setLoadRefresh] = useState(false);
  const [lastItem, setLastItem] = useState('');
  const [emptyList, setEmptyList] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      function fetchPosts() {
        firestore().collection('posts').orderBy('created', 'desc').limit(5).get()
          .then((snapshot) => {
            if (isActive) {
              setPosts([])
              const postList = [];

              snapshot.docs.map(u => {
                postList.push({
                  ...u.data(),
                  id: u.id
                })
              })
              setEmptyList(!!snapshot.empty);
              setPosts(postList);
              setLastItem(snapshot.docs[snapshot.docs.length - 1])
              setLoading(false);
            }
          })
      }
      fetchPosts();

      return () => {
        isActive = false
      }
    }, [])
  )
  async function handleRefresh() {
    setLoadRefresh(true)

    firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .limit(5)
      .get()
      .then((snapshot) => {

        setPosts([])
        const postList = [];

        snapshot.docs.map(u => {
          postList.push({
            ...u.data(),
            id: u.id
          })
        })
        setEmptyList(false);
        setPosts(postList);
        setLastItem(snapshot.docs[snapshot.docs.length - 1])
        setLoading(false);

      })
    setLoadRefresh(false)

  }

  //Buscar masi posts ao chegar no final
  async function getListPosts() {
    if (emptyList) {
      setLoading(false);
      return null
    }

    if (loading) return;

    firestore().collection('posts').orderBy('created', 'desc').limit(5).startAfter(lastItem).get()
      .then((snapshot) => {

        const postList = [];

        snapshot.docs.map(u => {
          postList.push({
            ...u.data(),
            id: u.id
          })
        })
        setEmptyList(!!snapshot.empty);
        setPosts(oldPost => [...oldPost, ...postList]);
        setLastItem(snapshot.docs[snapshot.docs.length - 1])
        setLoading(false);


      })

  }
  return (
    <Container>
      <Header />
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
          <ActivityIndicator size={50} color="#E52246" />
        </View>
      ) : (
        <ListPosts
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({ item }) => (
            <PostsList
              data={item}
              userId={user?.uid}
            />
          )}
          refreshing={loadingRefresh}
          onRefresh={handleRefresh}

          onEndReached={() => getListPosts()}
          onEndReachedThreshold={0.1}
        />
      )}

      <ButtonPost onPress={() => navigation.navigate('NewPost')} activeOpacity={0.8}>
        <Feather
          name="edit-2"
          color="#FFF"
          size={25}
        />
      </ButtonPost>

    </Container>
  );
}