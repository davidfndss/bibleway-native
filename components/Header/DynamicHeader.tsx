import { Animated, View, Text, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NviService } from 'services/nvi-service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Group1Icon from '../../assets/svg/group-1-icon.svg';
import Group2Icon from '../../assets/svg/group-2-icon.svg';
import Group3Icon from '../../assets/svg/group-3-icon.svg';
import Group4Icon from '../../assets/svg/group-4-icon.svg';
import Group5Icon from '../../assets/svg/group-5-icon.svg';
import Group6Icon from '../../assets/svg/group-6-icon.svg';
import Group7Icon from '../../assets/svg/group-7-icon.svg';
import Group8Icon from '../../assets/svg/group-8-icon.svg';
import Group9Icon from '../../assets/svg/group-9-icon.svg';
import truncateString from 'utils/truncateStringWithElipsis';
import { useRouter } from 'expo-router';

export default function DynamicHeader({
  bookIndex,
  bookName,
  chapter,
  scrollY,
}: {
  bookIndex: number;
  bookName: string;
  chapter: number;
  scrollY: Animated.Value;
}) {
  const nviService = new NviService();
  const bookgroup = nviService.findBookgroupDivisionByIndex(bookIndex);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const groupImages: Record<string, any> = {
    group1: require('../../assets/img/group-1-cover.png'),
    group2: require('../../assets/img/group-2-cover.png'),
    group3: require('../../assets/img/group-3-cover.png'),
    group4: require('../../assets/img/group-4-cover.png'),
    group5: require('../../assets/img/group-5-cover.png'),
    group6: require('../../assets/img/group-6-cover.png'),
    group7: require('../../assets/img/group-7-cover.png'),
    group8: require('../../assets/img/group-8-cover.png'),
    group9: require('../../assets/img/group-9-cover.png'),
  };

  const groupIcons: Record<string, React.FC<any>> = {
    group1: Group1Icon,
    group2: Group2Icon,
    group3: Group3Icon,
    group4: Group4Icon,
    group5: Group5Icon,
    group6: Group6Icon,
    group7: Group7Icon,
    group8: Group8Icon,
    group9: Group9Icon,
  };

  const defaultImage = require('../../assets/img/group-1-cover.png');
  const defaultIcon = Group1Icon;

  const backgroundImage = bookgroup ? groupImages[`group${bookgroup}`] : defaultImage;
  const IconComponent = bookgroup ? groupIcons[`group${bookgroup}`] : defaultIcon;

  const headerHeight = chapter === 1
    ? scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [300, 100],
        extrapolate: 'clamp',
      })
    : new Animated.Value(100);

  return (
    <Animated.View
      style={{
        height: headerHeight,
        width: '100%',
        position: 'absolute',
        zIndex: 10,
        overflow: 'hidden',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderWidth: 2,
        borderColor: '#52525b',
      }}
    >
      <View className='w-full h-full absolute border bg-zinc-900'>
        <Image
          source={backgroundImage}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            bottom: 0,
          }}
          className='opacity-50'
          resizeMode="cover"
        />
      </View>
      <View className="w-full h-[10vh] items-center justify-between flex flex-row px-6 relative" style={{ paddingTop: insets.top }}>
        <TouchableOpacity onPress={() => {router.back()}}>
          <Ionicons name="chevron-back" size={40} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity className="w-[190px] border border-white rounded-lg flex-row py-1 px-3 items-center justify-between" onPress={() => {router.back()}}>
          <Text className="text-white text-lg">
            {truncateString(bookName, 15)} {chapter}
          </Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>
        {chapter === 1 ? (
          <View>
            <IconComponent width={40} height={40} />
          </View>
        ) : (
          <IconComponent width={40} height={40} />
        )}
      </View>
    </Animated.View>
  );
}