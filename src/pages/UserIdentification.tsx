import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { Button } from '../components/Button';


export function UserIdentification() {
    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const [name, setName] = useState<any>()
    
    const navigation = useNavigation()
    
    const handleInputBlur = () =>{
        setIsFocused(false)
        setIsFilled(!!name)
    }
   const handleInputFocus = () =>{
        setIsFocused(true)
    }

    const handleInputChanged = (value: any) =>{
        setIsFilled(!!value)
        setName(value)
    }

    

   async function handleSubmit(){

        if(!name){
            return Alert.alert('Me diz como chamar você 😀 ?')
        }

        try{
            await  AsyncStorage.setItem('@plantmanager:user', name)
            navigation.navigate('Confirmation',{
                title: 'Prontinho',
                subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
                buttonTitle: 'Começar',
                icon: 'smile',
                nextScreen: 'PlantSelect'
            })
        }catch{
            Alert.alert('Não foi possivel salvar o seu Nome')
        }

    }
    

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>
                    <View style={styles.form}>
                        <View style={styles.header}>
                            <Text style={styles.emoji}>
                                {isFilled ? '😄' : '😀'}
                        </Text>
                            <Text style={styles.title}>
                                Como podemos {'\n'} chamar você?
                        </Text>
                        </View>
                        <TextInput
                            style={[styles.input,
                                    (isFocused || isFilled) && {borderColor: colors.green}    
                            ]}
                            placeholder="Digite um nome"
                            onBlur={handleInputBlur}
                            onFocus={handleInputFocus}
                            onChangeText={handleInputChanged}
                        />
                        <View style={styles.footer}>
                            <Button 
                                title="Confirmar" 
                                onPress={handleSubmit}/>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {
        flex: 1,
        width: '100%',
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
    },
    emoji: {
        fontSize: 44,

    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'

    },
    footer: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20
    }
})