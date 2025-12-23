import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const BookCard = ({ book, onPress }) => {
    return (
        <TouchableOpacity style={styles.bookCard} onPress={onPress} activeOpacity={0.9}>
            {book.isNew && (
                <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                </View>
            )}

            <Image source={{ uri: book.image }} style={styles.bookCover} />

            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>

                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFB800" />
                    <Text style={styles.ratingText}>{book.rating}</Text>
                </View>

                <Text style={styles.bookPrice}>{book.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bookCard: {
        width: 160,
        marginRight: 16, // Increased spacing
        backgroundColor: colors.card,
        borderRadius: 16, // Smoother corners
        overflow: 'hidden',
        elevation: 3,
        shadowColor: colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    newBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 1,
    },
    newBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    bookCover: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    bookInfo: {
        padding: 12,
    },
    bookTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
        lineHeight: 20,
    },
    bookAuthor: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 12,
        color: colors.text,
        marginLeft: 4,
        fontWeight: '600',
    },
    bookPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.primary,
    },
});

export default BookCard;
