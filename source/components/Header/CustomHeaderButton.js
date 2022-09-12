import React from 'react';
import Colors from '../../constants/Colors';

import { HeaderButton } from 'react-navigation-header-buttons'; //https://github.com/vonovak/react-navigation-header-buttons

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //https://aboutreact.com/react-native-vector-icons/

function CustomHeaderButton (props) {
    return (
        <HeaderButton
        {...props}
        IconComponent={MaterialIcons}
        iconize={30}
        color={Colors.primaryColor}
        />
    );
};

export default CustomHeaderButton;