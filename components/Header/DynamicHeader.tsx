import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NviService } from 'services/nvi-service';

import Group1Icon from '../../assets/svg/group-1-icon.svg';
import Group2Icon from '../../assets/svg/group-2-icon.svg';
import Group3Icon from '../../assets/svg/group-3-icon.svg';
import Group4Icon from '../../assets/svg/group-4-icon.svg';
import Group5Icon from '../../assets/svg/group-5-icon.svg';
import Group6Icon from '../../assets/svg/group-6-icon.svg';

export default function DynamicHeader(props: { bookIndex: number; bookName: string; chapter: number }) {
  const nviService = new NviService();

  const bookgroup = nviService.findBookgroupDivisionByIndex(props.bookIndex);

  const groupImages: Record<string, any> = {
    group1: require('../../assets/img/group-1-cover.png'),
    group2: require('../../assets/img/group-2-cover.png'),
    group3: require('../../assets/img/group-3-cover.png'),
    group4: require('../../assets/img/group-4-cover.png'),
    group5: require('../../assets/img/group-5-cover.png'),
    group6: require('../../assets/img/group-6-cover.png'),
  };

  const groupIcons: Record<string, React.FC<any>> = {
    group1: Group1Icon,
    group2: Group2Icon,
    group3: Group3Icon,
    group4: Group4Icon,
    group5: Group5Icon,
    group6: Group6Icon,
  };

  const defaultImage = require('../../assets/img/group-1-cover.png');
  const defaultIcon = Group1Icon;

  const backgroundImage = bookgroup ? groupImages[`group${bookgroup}`] : defaultImage;
  const IconComponent = bookgroup ? groupIcons[`group${bookgroup}`] : defaultIcon;

  return (
    <View className="w-full h-[15vh] flex flex-col justify-end rounded-b-[40px] overflow-hidden">
      <View style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'absolute', bottom: 0 }}>
        <Image
          source={backgroundImage}
          style={{
            width: '100%',
            height: '300%',
            position: 'absolute',
            bottom: 0,
            top: '-200%'
          }}
          resizeMode="cover"
        />
      </View>
      <View className="w-full h-[10vh] items-center justify-between rounded-b-[40px] flex flex-row px-6 relative">
        <Ionicons name="chevron-back" size={40} color="white" />
        <TouchableOpacity
          className="w-[160px] border border-white rounded-lg flex-row py-1 px-3 items-center justify-between"
          onPress={() => {}}
        >
          <Text className="text-white text-lg">{props.bookName} {props.chapter}</Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>

        {/* Ícone SVG importado como componente */}
        <IconComponent width={40} height={40} />
      </View>
    </View>
  );
}
