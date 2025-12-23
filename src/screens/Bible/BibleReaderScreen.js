import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Platform,
    Animated,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

// Mock Scripture Data
const MOCK_SCRIPTURE = `1 In the beginning God created the heavens and the earth. 
2 Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
3 And God said, "Let there be light," and there was light. 
4 God saw that the light was good, and he separated the light from the darkness. 
5 God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.

6 And God said, "Let there be a vault between the waters to separate water from water." 
7 So God made the vault and separated the water under the vault from the water above it. And it was so. 
8 God called the vault "sky." And there was evening, and there was morning—the second day.

9 And God said, "Let the water under the sky be gathered to one place, and let dry ground appear." And it was so. 
10 God called the dry ground "land," and the gathered waters he called "seas." And God saw that it was good.`;

export default function BibleReaderScreen({ route, navigation }) {
    const { book } = route.params || { book: 'Genesis' };
    const [fontSize, setFontSize] = useState(18);
    const [showSettings, setShowSettings] = useState(false);
    const [chapter, setChapter] = useState(1);
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const handleFontSize = (increment) => {
        setFontSize(prev => Math.min(Math.max(prev + (increment ? 2 : -2), 14), 32));
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Floating Header (Visible on Scroll) */}
            <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{book} {chapter}</Text>
                    <View style={styles.placeholderIcon} />
                </View>
            </Animated.View>

            {/* Main Header */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.chapterSelector}>
                    <Text style={styles.chapterSelectorText}>{book} {chapter}</Text>
                    <Ionicons name="chevron-down" size={16} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => setShowSettings(!showSettings)}
                >
                    <Ionicons name="text" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Settings Panel */}
            {showSettings && (
                <View style={styles.settingsPanel}>
                    <Text style={styles.settingsLabel}>Font Size</Text>
                    <View style={styles.fontSizeControls}>
                        <TouchableOpacity onPress={() => handleFontSize(false)} style={styles.fontBtn}>
                            <Text style={styles.fontBtnText}>A-</Text>
                        </TouchableOpacity>
                        <Text style={styles.currentFontText}>{fontSize}</Text>
                        <TouchableOpacity onPress={() => handleFontSize(true)} style={styles.fontBtn}>
                            <Text style={styles.fontBtnText}>A+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <Text style={styles.chapterTitle}>Chapter {chapter}</Text>
                <Text style={[styles.scriptureText, { fontSize, lineHeight: fontSize * 1.6 }]}>
                    {MOCK_SCRIPTURE}
                </Text>

                <View style={styles.navigationRow}>
                    <TouchableOpacity
                        style={[styles.navBtn, { opacity: chapter === 1 ? 0.3 : 1 }]}
                        disabled={chapter === 1}
                        onPress={() => setChapter(c => c - 1)}
                    >
                        <Ionicons name="chevron-back" size={20} color={colors.primary} />
                        <Text style={styles.navBtnText}>Prev</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navBtn}
                        onPress={() => setChapter(c => c + 1)}
                    >
                        <Text style={styles.navBtnText}>Next</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    backButton: {
        padding: 8,
    },
    chapterSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    chapterSelectorText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginRight: 4,
    },
    settingsButton: {
        padding: 8,
    },
    settingsPanel: {
        position: 'absolute',
        top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60,
        right: 16,
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        zIndex: 20,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    settingsLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 12,
        fontWeight: '600',
    },
    fontSizeControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 4,
    },
    fontBtn: {
        width: 40,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    fontBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    currentFontText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    chapterTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 24,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    scriptureText: {
        color: '#2C3E50',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    navigationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    navBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginHorizontal: 4,
    },

    // Floating Header
    floatingHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        zIndex: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
        paddingBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    placeholderIcon: {
        width: 24,
    }
});
