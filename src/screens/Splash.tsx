import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

// const SplashScreen = ({ onFinish }:)

const Splash = ({ onFinish}: {onFinish: () => void }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onFinish();
      }, 5000);

      return () => clearTimeout(timer);

    }, [onFinish]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/icons/images/main_logo.png')}
                style={styles.logo}
                resizeMode='contain'
            />
        </View>
    );
};
    

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});