import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, Touchable, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../components/Header/CustomHeaderButton';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import * as contactListAction from '../stores/actions/contactListAction';

function ContactListScreen ({ navigation }) {

    const dispatch = useDispatch();
    const contactList = useSelector(state => state.contactList.contactList);
    const [ refreshing, setRefreshing ] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity>
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                        <Item 
                            title='Search'
                            iconName='search' 
                            iconSize={30}
                            onPress={()=>{
                            }}
                        />
                    </HeaderButtons>
                </TouchableOpacity>
                
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={()=>{
                        navigation.navigate('ContactDetail',{screenStatus:'add'});
                    }}
                >
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                        <Item 
                            title='Add'
                            iconName='add' 
                            iconSize={30}
                            onPress={()=>{
                                navigation.navigate('ContactDetail',{screenStatus:'add'});
                            }}
                        />
                    </HeaderButtons>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(()=>{
        retrieveDefaultContactList();
    },[])
    
    async function retrieveDefaultContactList () {
        await dispatch(contactListAction.retrieveDefaultContactList());
    }

    async function onRefresh () {
        setRefreshing(true);
        retrieveDefaultContactList();
        setRefreshing(false);
    }

    function renderContactListDisplay ({ index, item }) {
        let _firstName = (item.firstName ? item.firstName : '');
        let _lastName = (item.lastName ? item.lastName : '');
        let _displayName = _firstName.concat(' ',_lastName).trim();
        return (
            <TouchableOpacity
                onPress={()=>{
                    navigation.navigate('ContactDetail',{selectedContact:item, screenStatus:'preview'});
                }}
            >
                {index!=0 && 
                    <View style={{width: '100%', borderTopWidth: 1, borderColor: Colors.veryLightGrey, marginLeft:'5%'}}></View>
                }
                <View style={{width: '100%', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: '5%'}}>
                    <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: Colors.primaryColor}}>
                    </View>
                    <View style={{flex:1, justifyContent:'center', marginLeft:10}}>
                        <Text>{_displayName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    function renderFooter () {
        if (contactList.length>0) {
            return (
                <View style={{flex: 1}}>
                    <View style={{paddingHorizontal: '7%'}}>
                        <View style={{width: '100%', borderTopWidth: 1, borderColor: Colors.veryLightGrey}}></View>
                        <View style={{paddingVertical: '5%'}}>
                            <Text style={{fontSize: 12, textAlign: 'center'}}>{contactList.length + (contactList.length==1? ' Contact': ' Contacts')}</Text>
                        </View>
                    </View>
                </View>
            );
        };
    };

    function renderEmptyDisplay () {
        return(
            <View style={{flex:1, alignItems:'center', justifyContent:'center', width:'100%', aspectRatio:1/1}}>
                <View style={{height:'20%'}}></View>
                <Text style={{fontSize: 15, textAlign: 'center'}}>Oh no you have no contact at the moment. Start by adding new contacts!</Text>
            </View>
        );
    };

    return(
        <View style={Styles.screenContainer}>
            
            <FlatList
                data={contactList.sort((a, b) => (a.firstName.trim()+' '+a.lastName.trim()).localeCompare(b.firstName.trim()+' '+b.lastName.trim()))}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={renderContactListDisplay}
                ListFooterComponent={renderFooter()}
                ListEmptyComponent={renderEmptyDisplay()}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default ContactListScreen;