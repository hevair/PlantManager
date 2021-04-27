import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

import userImg from '../assets/hevair-avatar.png'

export function Header() {
    const [userName, setUserName] = useState<string>('')

    useEffect(() =>{
        async function loadStorageUserName(){
            const user = await AsyncStorage.getItem('@plantmanager:user')
            setUserName(user || '' )
        }
        loadStorageUserName();
    },[])
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá</Text>
                <Text style={styles.user}>{userName}</Text>
            </View>
            <Image source={userImg} style={styles.avatar} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    greeting:{
        fontSize:32,
        color:colors.heading,
        fontFamily: fonts.text
    },
    user:{
        fontSize: 32,
        color:colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 40
    },
    avatar:{
        width: 70,
        height: 70,
        borderRadius: 40
    }

})
