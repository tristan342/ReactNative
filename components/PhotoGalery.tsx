import React, { FC, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Photo {
    uri: string;
    base64?: string;
}

const PhotoGallery: FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const photosJson = await AsyncStorage.getItem('photos');
            const photos = photosJson ? JSON.parse(photosJson) : [];
            setPhotos(photos);
        } catch (e) {
            console.log('Error loading photos', e);
        }
    };

    const savePhotos = async (newPhotos: Photo[]) => {
        try {
            const photosJson = JSON.stringify(newPhotos);
            await AsyncStorage.setItem('photos', photosJson);
        } catch (e) {
            console.log('Error saving photos', e);
        }
    };

    const addPhoto = async (photo: Photo) => {
        const newPhotos = [photo, ...photos];
        setPhotos(newPhotos);
        await savePhotos(newPhotos);
    };

    return (
        <FlatList
            horizontal
            data={photos}
            style={styles.container}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.uri }} style={styles.image} />
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    imageContainer: {
        padding: 2,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
});

export default PhotoGallery;