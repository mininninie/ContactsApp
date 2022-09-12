import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; //https://reactnavigation.org/docs/hello-react-navigation

// import BackHeaderBarOption from "../../components/ui/Header/BackHeaderBarOption";
import ContactListScreen from '../screens/ContactListScreen';
import ContactDetailScreen from '../screens/ContactDetailScreen';

import DefaultHeaderBarOption from '../components/Header/DefaultHeaderBarOption';


const Stack = createNativeStackNavigator();

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ContactList' component={ContactListScreen} options={({ route }) => DefaultHeaderBarOption({ route, title:'Contacts' })} />
      <Stack.Screen name='ContactDetail' component={ContactDetailScreen} options={({ route }) => DefaultHeaderBarOption({ route })} />
    </Stack.Navigator>
  );
};

export default ContactStackNavigator;