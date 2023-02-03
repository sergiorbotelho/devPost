import React, { useState } from "react";

import {
    Container,
    Header,
    Avatar,
    Name,
    ContentView,
    Content,
    Actions,
    LikeButton,
    Like,
    TimePost
} from "./styles";
import { formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from "@react-navigation/native";
export default function PostsList({ data, userId }) {

    const navigation = useNavigation();
    function formatTimePost() {
        const datePost = new Date(data.created.seconds * 1000);

        return formatDistance(
            new Date(),
            datePost,
            {
                locale: ptBR
            }
        )
    }

    const [likepost, setLikepost] = useState(data?.likes);

    async function handleLikePost(id, likes) {
        const docId = `${userId}_${id}`;

        const doc = await firestore().collection('likes').doc(docId).get();

        if (doc.exists) {

            await firestore().collection('posts').doc(id).update({
                likes: likes - 1
            })
            await firestore().collection('likes').doc(docId).delete()
                .then(() => {
                    setLikepost(likes - 1)
                })
            return

        }

        await firestore().collection('likes').doc(docId).set({
            postId: id,
            userId: userId
        })
        await firestore().collection('posts').doc(id).update({
            likes: likes + 1
        })
            .then(() => {
                setLikepost(likes + 1)
            })
    }
    return (
        <Container>
            <Header onPress={() => navigation.navigate('PostsUser', { title: data.autor, userId: data.userId })}>
                {data.urlAvatar ? (
                    <Avatar
                        source={{ uri: data.urlAvatar }}
                    />
                ) : <Avatar
                    source={require('../../assets/avatar.png')}
                />}
                <Name numberOfLines={1}>
                    {data?.autor}
                </Name>
            </Header>
            <ContentView>
                <Content>{data.content}</Content>
            </ContentView>
            <Actions>
                <LikeButton onPress={() => handleLikePost(data.id, likepost)}>
                    <Like>{likepost === 0 ? '' : likepost}</Like>
                    <MaterialCommunityIcons
                        name={likepost > 0 ? "heart-plus" : "heart-plus-outline"}
                        size={20}
                        color="#E52246"
                    />
                </LikeButton>
                <TimePost>{formatTimePost()}</TimePost>
            </Actions>
        </Container>
    )
}