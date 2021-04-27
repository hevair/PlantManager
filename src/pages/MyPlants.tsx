import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList, Alert } from 'react-native'
import colors from '../../styles/colors';
import { Header } from '../components/Header';
import waterdrop from '../assets/waterdrop.png'
import { loadPlant, PlantProps, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns/esm';
import { ptBR } from 'date-fns/locale';
import fonts from '../../styles/fonts';
import { PlantCardSecondery } from '../components/PlantCardSecondery';
import { Load } from '../components/Load';

export function MyPlants() {
    const [myplants, setMyPlants] = useState<PlantProps[]>([])
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<String>()

    function handleRemove(plant: PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: async () =>{
                    try{
                       
                        await removePlant(plant.id);
                        
                        setMyPlants( oldvalue => (
                             oldvalue.filter(item => item.id != plant.id)
                        ))

                    }catch(error){
                        Alert.alert('Não foi possivel Remover !!')
                    }
                }
            }
        ])
    }

    useEffect(() => {
        async function loadingStorageData() {
            const plantsStoraged = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: ptBR }
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStoraged[0].name} à aproximadamente ${nextTime}`
            )

            setMyPlants(plantsStoraged);
            setLoading(false)

        }

        loadingStorageData()
    }, [])

    if (loading) {
        return <Load />
    }
    return (

        <View style={styles.container}>
            <Header />

            <View style={styles.spotligth}>
                <Image
                    source={waterdrop}
                    style={styles.spotligthImage}
                />
                <Text style={styles.spotligthText}>
                    {nextWatered}
                </Text>
            </View>
            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Proxima regadas
                </Text>
                <FlatList
                    data={myplants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (

                        <PlantCardSecondery
                            data={item}
                            handleRemove={() => { handleRemove(item) }}
                        />

                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background,
    },
    spotligth: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    spotligthImage: {
        width: 60,
        height: 60,

    },
    spotligthText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 10
    },
    plants: {
        flex: 1,
        width: '100%',
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }


})