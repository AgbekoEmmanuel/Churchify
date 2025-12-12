import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: TextStyle;
};

export function ExternalLink({ href, children, style, ...rest }: Props) {
  const handlePress = async () => {
    if (process.env.EXPO_OS !== 'web') {
      // Open the link in an in-app browser.
      await openBrowserAsync(href, {
        presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      });
    } else {
      // On web, open in new tab
      window.open(href, '_blank');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} {...rest}>
      <Text style={[styles.link, style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
});
