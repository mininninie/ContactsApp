import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, ScrollView, Alert, Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';

import FiveDigitNumberRandomGenerator from '../functions/FiveDigitRandomNumberGenerator';
import ValidateEmail from '../functions/ValidateEmail';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import * as contactListAction from '../stores/actions/contactListAction';

function ContactDetailScreen ({ navigation, route }) {

    const { selectedContact, screenStatus } = route.params;
    const dispatch = useDispatch();

    // states to edit textinput
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');

    // reference to identify subsequent input fields with keyboard next is pressed
    const ref_lastName = useRef();
    const ref_email = useRef();
    const ref_phone = useRef();

    // error message to be shown if contact information is not met when save is pressed
    const [ errorMessage, setErrorMessage ] = useState('');

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    style={{paddingHorizontal:5}}
                    onPress={ToggleScreenStatusHandler}
                >
                    {screenStatus=='preview' && <Text style={Styles.defaultHeaderBarTextStyle}>Edit</Text>}
                    {(screenStatus=='edit'||screenStatus=='add') && <Text style={Styles.defaultHeaderBarTextStyle}>Save</Text>}
                    {/* <Image
                        source={require('../../assets/deviceintegrationrefreshicon.png')}
                        style={{height:'100%', width:'100%'}}
                        resizeMode='contain'
                    /> */}
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity 
                    style={{paddingHorizontal:5}}
                    onPress={()=>{
                        let _updatedContactInformation = UpdatedContactInformation();
                        if (screenStatus=='preview') {
                            navigation.goBack();
                        }
                        else if (screenStatus=='edit' && (JSON.stringify(_updatedContactInformation)==JSON.stringify(selectedContact))) {
                            navigation.setParams({screenStatus: 'preview'})
                        }
                        else if (screenStatus=='add' && firstName.trim()=='' && lastName.trim()=='' && email.trim()=='' && phone.trim()=='') {
                            navigation.goBack();
                        }
                        else {
                            Alert.alert(
                                'Are you sure?',
                                'Any changes made will not be saved.',
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => {
                                            // Just dismiss alert if cancel is pressed
                                        },
                                        style: "cancel"
                                    },
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            exitContactFormUpdateOnOkHandler();
                                        }
                                    } 
                                ]
                            )
                        }
                    }}
                >
                    {screenStatus=='preview' && <Text style={Styles.defaultHeaderBarTextStyle}>Back</Text>}
                    {(screenStatus=='edit'||screenStatus=='add') && <Text style={Styles.defaultHeaderBarTextStyle}>Cancel</Text>}
                </TouchableOpacity>
            ),
        });
    }, [navigation, route, firstName, lastName, email, phone]);

    // if screen status is set to preview, form fills to be set to selected contact (selectcontact will be updated with the new info if form requirements are met)
    useEffect(() => {
        if (screenStatus=='preview') {
            setFirstName(selectedContact.firstName?selectedContact.firstName:'');
            setLastName(selectedContact.lastName?selectedContact.lastName:'');
            setEmail(selectedContact.email?selectedContact.email:'');
            setPhone(selectedContact.phone?selectedContact.phone:'');
        };
    },[screenStatus]);

    function UpdatedContactInformation () {
        let _randomNumber = FiveDigitNumberRandomGenerator();
        const _updatedContactInformation = {
            id:(selectedContact?.id?selectedContact.id:(_randomNumber+firstName+lastName)),
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone
        }
        return _updatedContactInformation
    };

    function exitContactFormUpdateOnOkHandler () {
        if (screenStatus=='add') {
            navigation.goBack();
        }
        else {
            setErrorMessage('');
            navigation.setParams({screenStatus: 'preview'});
        }
    };

    async function ToggleScreenStatusHandler () {
        if (screenStatus=='preview') {
            navigation.setParams({screenStatus: 'edit'})
        }
        else {
            Keyboard.dismiss();
            let _updatedContactInformation = UpdatedContactInformation();
            await onSaveHandler(_updatedContactInformation);
        }
    }

    function RenderContactImageContainer () {
        return (
            <View style={{width: '100%', alignItems: 'center', paddingVertical: 20}}>
                <View style={{height: 120, width: 120, borderRadius: 60, backgroundColor: Colors.primaryColor}}></View>
            </View>
        );
    };

    function RenderContactInformation ({ type }) {
        if (type=='Main') {
            return(
                <View>
                    {RenderInformationTitle({ title: 'Main Information'})}
                    {RenderInformationItem({ type:'First Name'})}
                    {RenderInformationItem({ type:'Last Name'})}
                </View>
            );
        }
        else if (type=='Sub') {
            return(
                <View>
                    {RenderInformationTitle({ title: 'Sub Information'})}
                    {RenderInformationItem({ type:'Email'})}
                    {RenderInformationItem({ type:'Phone'})}
                </View>
            );
        }
    };

    function RenderInformationTitle ({ title }) {
        return (
            <View style={{width: '100%', backgroundColor: Colors.veryLightGrey, paddingVertical:5, paddingHorizontal:'5%'}}>
                <Text style={{fontSize: 15, fontWeight:'bold'}}>{title}</Text>
            </View>
        );
    };

    function RenderInformationItem ({ type }) {

        return (
            <View>
                {/* {(type!='First Name' || type!='Last Name') && 
                    <View style={{width: '100%', borderTopWidth: 1, borderColor: Colors.veryLightGrey}}></View>
                } */}
                <View style={{width: '100%', flexDirection: 'row', paddingHorizontal: '5%', paddingVertical: 5}}>
                    <View style={{width: 100, justifyContent: 'center'}}>
                        <Text>{type}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <TextInput
                            style={{borderColor: Colors.veryLightGrey, borderWidth: 1, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 10}}
                            value={(
                                type=='First Name' ? firstName :
                                type=='Last Name' ? lastName :
                                type=='Email' ? email :
                                phone 
                            )}
                            onChangeText={text => onChangeTextInputHandler(text,type)}
                            returnKeyType={(
                                type!='Phone' ? 'next':'done'
                            )}
                            autoFocus={(
                                type=='First Name' && true
                            )}
                            onSubmitEditing={() => {
                                if (type=='First Name') {
                                    ref_lastName.current.focus();
                                }
                                else if (type=='Last Name') {
                                    ref_email.current.focus();
                                }else if (type=='Email') {
                                    ref_phone.current.focus();
                                }
                            }}
                            ref={(
                                type=='Last Name' ? ref_lastName :
                                type=='Email' ? ref_email :
                                type=='Phone' ? ref_phone :
                                undefined
                            )}
                            keyboardType={(
                                type=='Email' ? 'email-address' :
                                'default'
                            )}
                            editable={(
                                (screenStatus=='add' || screenStatus=='edit') ? true :
                                false
                            )}
                        />
                    </View>
                </View>
                <View style={{width: '100%', borderTopWidth: 1, borderColor: Colors.veryLightGrey, marginLeft: '5%'}}></View>
            </View>
        );
    };

    function RenderErrorMessage () {
        return(
            <View style={{paddingVertical:10, paddingHorizontal:'5%', alignItems:'center'}}>
                <Text style={{color:'red'}}>{errorMessage}</Text>
            </View>
        );
    };

    function onChangeTextInputHandler (text,type) {
        if (type=='First Name') {
            setFirstName(text);
        }
        else if (type=='Last Name') {
            setLastName(text);
        }
        else if (type=='Email') {
            setEmail(text);
        }
        else if (type=='Phone') {
            setPhone(text);
        }
    }

    async function onSaveHandler (_updatedContactInformation) {
        // When save button is pressed, check if contact list conditions are met
        if (firstName.trim()=='') {
            setErrorMessage('Please enter your first name');
        }
        else if (lastName.trim()=='') {
            setErrorMessage('Please enter your last name');
        }
        else if (email.trim()!='' && !ValidateEmail(email)) {
            setErrorMessage('Please enter a valid email');
        }
        // If conditions are met, clear error message
        else {
            setErrorMessage('');
            if(screenStatus=='add') {
                await dispatch(contactListAction.addContactList(_updatedContactInformation));
                navigation.setParams({selectedContact: _updatedContactInformation});
            }
            else {
                await dispatch(contactListAction.updateContactList(_updatedContactInformation));
                navigation.setParams({selectedContact: _updatedContactInformation});
            }
            navigation.setParams({screenStatus: 'preview'});
        }
    }

    return(
        <ScrollView style={Styles.screenContainer}>
            {RenderContactImageContainer()}
            {RenderContactInformation({ type: 'Main' })}
            {RenderContactInformation({ type: 'Sub' })}
            {RenderErrorMessage()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default ContactDetailScreen;