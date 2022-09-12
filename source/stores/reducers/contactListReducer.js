import { SET_CONTACTLIST } from '../actions/contactListAction';
import { ADD_CONTACTLIST } from '../actions/contactListAction';
import { UPDATE_CONTACTLIST } from '../actions/contactListAction';

const initialState = {
    contactList:[]
};

const contactListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CONTACTLIST:
            return {
                contactList: action.contactList
            }
        case ADD_CONTACTLIST:
            return { 
                ...state,
                contactList: [...state.contactList, action.newItem]
            }
        case UPDATE_CONTACTLIST:
            let _fullContactList = [...state.contactList];
            _filtered = _fullContactList.filter(contactList=> {
                return contactList.id != action.updateItem.id
            })
            let _modifiedArray = _filtered;
            _modifiedArray.push(action.updateItem)
            console.log('_modifiedArray')
            console.log(_modifiedArray)
            return {
                contactList: _modifiedArray
            }
    }
    return state;
}


export default contactListReducer;
