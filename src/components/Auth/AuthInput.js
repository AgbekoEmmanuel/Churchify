import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const AuthInput = ({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    isPassword,
    keyboardType = 'default',
    autoCapitalize = 'none',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry);
    const focusAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(focusAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const isDark = props.theme === 'dark';

    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [isDark ? 'rgba(255,255,255,0.2)' : colors.border, colors.primary],
    });

    const backgroundColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [isDark ? 'rgba(0,0,0,0.4)' : colors.card, isDark ? 'rgba(0,0,0,0.6)' : '#F0F7FF'],
    });

    return (
        <Animated.View style={[
            styles.container,
            { borderColor, backgroundColor, shadowColor: colors.shadow }
        ]}>
            {icon && (
                <Ionicons
                    name={icon}
                    size={20}
                    color={isFocused ? colors.primary : colors.textMuted}
                    style={styles.icon}
                />
            )}
            <TextInput
                style={[styles.input, isDark && { color: '#fff' }, { color: isDark ? '#fff' : colors.text }]}
                placeholder={placeholder}
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : colors.textMuted}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={isPassword ? isSecure : false}
                onFocus={handleFocus}
                onBlur={handleBlur}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                selectionColor={colors.primary}
                {...props}
            />
            {isPassword && (
                <TouchableOpacity
                    onPress={() => setIsSecure(!isSecure)}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={isSecure ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={colors.textMuted}
                    />
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1.5,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56, // Fixed height for consistency
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
});

export default AuthInput;
