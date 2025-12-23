import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

const Divider = ({ text }) => {

    return (
        <View style={styles.container}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.text, { color: colors.textMuted }]}>{text}</Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    line: {
        flex: 1,
        height: 1,
    },
    text: {
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Divider;
