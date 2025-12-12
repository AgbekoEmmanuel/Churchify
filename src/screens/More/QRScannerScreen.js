import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Vibration,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');
const scanAreaSize = width * 0.7;

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  // Simulate QR code scanning (since real scanning doesn't work in Expo Snack)
  const simulateQRScan = () => {
    if (scanned) return;
    
    setScanned(true);
    Vibration.vibrate();
    
    // Simulate successful scan
    setTimeout(() => {
      Alert.alert(
        'Check-in Successful!',
        'You have been successfully checked in to service.',
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Done',
            onPress: () => navigation.navigate('MoreHome'),
          },
        ]
      );
    }, 1000);
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="camera" size={60} color={colors.textMuted} />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Scanner</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
        
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="camera-off" size={60} color={colors.textMuted} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={requestPermission}
          >
            <Text style={styles.demoButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera View - Updated to use CameraView */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        enableTorch={flashOn}
        facing="back"
      />
      
      {/* Header Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.headerOverlay}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <TouchableOpacity style={styles.headerButton} onPress={toggleFlash}>
              <Ionicons 
                name={flashOn ? "flash" : "flash-off"} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Scanning Overlay */}
      <View style={styles.scanningOverlay}>
        {/* Top overlay */}
        <View style={styles.overlay} />
        
        <View style={styles.scanRow}>
          <View style={styles.overlay} />
          
          {/* Scanning Area */}
          <TouchableOpacity 
            style={styles.scanArea}
            onPress={simulateQRScan}
            activeOpacity={0.8}
          >
            {/* Corner brackets */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Scanning line */}
            <View style={[styles.scanLine, scanned && styles.scanLineSuccess]} />
            
            {/* Center target */}
            <View style={styles.centerTarget}>
              <MaterialCommunityIcons 
                name="qrcode-scan" 
                size={40} 
                color={scanned ? "#4CAF50" : "#fff"} 
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.overlay} />
        </View>
        
        {/* Bottom overlay */}
        <View style={[styles.overlay, styles.bottomOverlay]}>
          <View style={styles.instructionContainer}>
            <MaterialCommunityIcons 
              name={scanned ? "check-circle" : "qrcode-scan"} 
              size={24} 
              color={scanned ? "#4CAF50" : "#fff"} 
            />
            <Text style={styles.instructionText}>
              {scanned 
                ? "QR Code detected! Processing..." 
                : "Tap the scanning area to check in"}
            </Text>
            
            {scanned && (
              <TouchableOpacity 
                style={styles.scanAgainButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
              </TouchableOpacity>
            )}
            
            {!scanned && (
              <View style={styles.demoNotice}>
                <Text style={styles.demoNoticeText}>
                  📱 Tap scan area to simulate check-in
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 40,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingBottom: 20,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  
  scanningOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  
  scanRow: {
    flexDirection: 'row',
    height: scanAreaSize,
  },
  
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
    borderWidth: 4,
  },
  
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.8,
  },
  
  scanLineSuccess: {
    backgroundColor: '#4CAF50',
  },
  
  centerTarget: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  
  bottomOverlay: {
    alignItems: 'center',
    paddingTop: 40,
  },
  
  instructionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  
  scanAgainButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  
  scanAgainText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  demoNotice: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  
  demoNoticeText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  
  permissionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  
  demoButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  
  demoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
