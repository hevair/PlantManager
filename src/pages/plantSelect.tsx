import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { EnviromentButton } from '../components/EnviromentButton';
import { Load } from '../components/Load'
import { PlantProps } from '../libs/storage';
import { Header } from '../components/Header'
import { PlantCardPrimary } from '../components/PlantCardPrimary';

import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';

interface EnviromentProps {
    key: string;
    title: string;
}



export function PlantSelect() {
    const [enviroment, setEnviroment] = useState<EnviromentProps[]>()
    const [plants, setPlants] = useState<PlantProps[]>()
    const [filteredPlants, setfilteredPlants] = useState<PlantProps[]>()
    const [enviromentSelected, setEnviromentSelected] = useState('all')
    const [loading, setLoading] = useState(true)
    let [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false)
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchEnviroment() {
            const { data } = await api
                .get('plants_environments?_sort=title&_order=asc')
            setEnviroment([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data
            ])
        }

        fetchEnviroment()
        
        // hendleEnviromentSelected(enviroment.key:string){
    }, [])

    useEffect(() => {

        fetchPlants()
    }, [])

    function hendleEnviromentSelected(enviroment: string) {
        setEnviromentSelected(enviroment);
        //   console.warn(plants)
        if (enviroment == 'all')
            return setfilteredPlants(plants)


        const filtered = plants.filter(plant =>
            plant.environments.includes(enviroment)
        );
        console.log(enviroment)
        setfilteredPlants(filtered)
    }

    function handleFetchMore(distance: number){
        if(distance < 1){
            return
        }

        setLoadingMore(true);
        setPage( page + 1)
        fetchPlants()
    }

   const handlePlantSave = (plant: PlantProps) =>{
        navigation.navigate('PlantSave', {plant})
    }

    
    async function fetchPlants() {
        const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`)
        if (!data) {
            return setLoading(true)
        }
        if (page > 1) {
            setPlants(oldvalue => [...oldvalue, ...data])
            setfilteredPlants(oldvalue => [...oldvalue, ...data])
        } else {
            setPlants(data)
            setfilteredPlants(data)
        }
        setLoading(false)
        setLoadingMore(false)
    }


    if (loading) {
        return <Load />
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>
                    Em Qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua Planta ?
                </Text>
            </View>
            <View>
                <FlatList
                    data={enviroment}
                    keyExtractor={item => String(item.key)}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => hendleEnviromentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />

            </View>
            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardPrimary 
                            data={item} 
                            onPress={() => handlePlantSave(item)}
                        />

                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({distanceFromEnd}) => handleFetchMore(distanceFromEnd)}
                    ListFooterComponent={
                         loadingMore 
                        ? <ActivityIndicator color={colors.green} />
                        : <></>

                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15,
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginRight: 32,
        paddingRight: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    }
})