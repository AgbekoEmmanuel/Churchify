import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function SermonDetailsScreen({ route, navigation }) {
  const { video } = route.params || {
    video: {
      title: 'Walking in Divine Purpose',
      speaker: 'Pastor John Smith',
      description: 'Learn how to align your daily walk with God\'s detailed plan for your life.',
      views: '12.5K',
      date: '2 Days ago'
    }
  };

  const [activeTab, setActiveTab] = useState('About');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Video Player Container */}
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: video.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' }}
          style={styles.videoThumbnail}
        />
        <View style={styles.videoOverlay}>
          <TouchableOpacity style={styles.backButtonAbsolute} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButtonLarge}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={40} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar Simulation */}
        <View style={styles.progressBarContainer}>
          <View style={{ width: '35%', height: '100%', backgroundColor: colors.primary }} />
        </View>

        <View style={styles.videoControls}>
          <Text style={styles.timeText}>12:30 / 45:30</Text>
          <View style={styles.rightControls}>
            <Ionicons name="volume-high-outline" size={20} color="#fff" style={{ marginRight: 16 }} />
            <Ionicons name="expand-outline" size={20} color="#fff" />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Title Block */}
        <View style={styles.titleBlock}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.channelName}>{video.speaker}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>{video.views} views • {video.date || 'Recently'}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="thumbs-up-outline" size={20} color={colors.text} />
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="share-social-outline" size={20} color={colors.text} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="download-outline" size={20} color={colors.text} />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['About', 'Notes', 'Related'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }}>
          {activeTab === 'About' && (
            <View>
              <Text style={styles.descriptionHeader}>Description</Text>
              <Text style={styles.descriptionText}>
                {video.description || "Join us for a powerful message on discovering your true identity in Christ. This sermon explores biblical principles for living a life of purpose and impact."}
              </Text>

              <TouchableOpacity style={styles.subscribeRow}>
                <View style={styles.channelIcon}>
                  <Text style={styles.channelInitial}>{video.speaker?.[0] || 'C'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subscribeChannelName}>{video.speaker}</Text>
                  <Text style={styles.subscribeSubText}>High City Church</Text>
                </View>
                <Text style={styles.subscribeText}>SUBSCRIBED</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'Notes' && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesPlaceholder}>Take personal notes during the sermon...</Text>
              <TouchableOpacity style={styles.addNoteBtn}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addNoteText}>Add New Note</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'Related' && (
            <View>
              {[1, 2, 3].map(i => (
                <View key={i} style={styles.relatedCard}>
                  <Image
                    source={{ uri: `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=200&auto=format&fit=crop` }}
                    style={styles.relatedImg}
                  />
                  <View style={styles.relatedInfo}>
                    <Text style={styles.relatedTitle}>Faith that Moves Mountains</Text>
                    <Text style={styles.relatedSub}>Pastor John Smith</Text>
                    <Text style={styles.relatedMeta}>4.2K views • 1 week ago</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 20,
    zIndex: 10,
  },
  playButtonLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  rightControls: {
    flexDirection: 'row',
  },

  contentContainer: {
    flex: 1,
  },
  titleBlock: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  channelName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statsRow: {

  },
  statsText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
  },

  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  activeTabText: {
    color: colors.text,
  },
  tabContent: {
    padding: 16,
  },
  descriptionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 24,
  },
  subscribeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  channelInitial: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  subscribeChannelName: {
    fontWeight: '700',
    color: colors.text,
  },
  subscribeSubText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  subscribeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },

  notesContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  notesPlaceholder: {
    color: colors.textMuted,
    marginBottom: 16,
  },
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  addNoteText: {
    color: '#fff',
    fontWeight: '600',
  },

  relatedCard: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  relatedImg: {
    width: 120,
    height: 68,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  relatedInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  relatedSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  relatedMeta: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
