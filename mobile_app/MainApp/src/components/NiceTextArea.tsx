import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { GlobalStyles } from '../common/GlobalStyles';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const NiceTextArea = ({ children, title: titleToDisplay }: SectionProps) => {

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={styles.sectionTitle}>
        {titleToDisplay}
      </Text>
      <Text
        style={styles.sectionDescription}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: GlobalStyles.blackText,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: GlobalStyles.darkText,
  },
});

export default NiceTextArea;
