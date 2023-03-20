import React, { FC, useRef } from 'react';
import {
    Button,
    Image,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    Platform,
} from 'react-native';
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

const CameraCustom: FC<{}> = () => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const insets = useSafeAreaInsets();
    const [pictures, setPictures] = useState<CameraCapturedPicture[]>([]);
    const { width, height: heightWindow } = useWindowDimensions();
    const cameraRef = useRef<Camera | null>();
    const isiOS = Platform.OS === 'ios';
    const height = isiOS ? heightWindow * 0.8 : Math.round((width * 16) / 9);

    const picturesHeight = heightWindow - height;

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.messagePermission}>
                <Text style={{ textAlign: 'center' }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraType() {
        setType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back,
        );
    }

    const takePicture = () => {
        cameraRef.current &&
        cameraRef.current
            .takePictureAsync({ base64: true, quality: 0.5 })
            .then((picture) => {
                setPictures([picture, ...pictures]);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Camera
                ratio="16:9"
                ref={(camera) => {
                    cameraRef.current = camera;
                }}
                style={[
                    styles.camera,
                    {
                        height: height,
                    },
                ]}
                type={type}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                        <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton} onPress={takePicture} />
                </View>
            </Camera>
            <FlatList
                horizontal
                data={pictures}
                style={{ height: picturesHeight, flex: 1, backgroundColor: 'black' }}
                keyExtractor={(item) => item.uri}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item.uri }}
                        style={{
                            width: picturesHeight,
                            height: picturesHeight,
                        }}
                    />
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    messagePermission: {
        marginTop: 40,
    },
    camera: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        position: 'absolute',
        width: '100%',
        alignSelf: 'flex-end',
        alignItems: 'center',
        bottom: 0,
    },
    button: {
        position: 'absolute',
        left: 30,
        bottom: 32,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    roundButton: {
        width: 64,
        height: 64,
        backgroundColor: 'white',
        borderRadius: 32,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'white',
        marginBottom: 20,
    },
});

export default CameraCustom;
