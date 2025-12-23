import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

const SocialButton = ({ iconSource, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image
                source={iconSource}
                style={styles.icon}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 56,
        height: 56,
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
});

export default SocialButton;
