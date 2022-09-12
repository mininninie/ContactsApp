import ContactListData from '../../constants/ContactListData';
export const SET_CONTACTLIST = 'SET_CONTACTLIST';
export const ADD_CONTACTLIST = 'ADD_CONTACTLIST';
export const UPDATE_CONTACTLIST = 'UPDATE_CONTACTLIST';

export const retrieveDefaultContactList = () => {
    return async dispatch => {
        try {
            const defaultContactListData= ContactListData;
            dispatch({ type: SET_CONTACTLIST, contactList: defaultContactListData});
        }
        catch (error) {
            throw error;
        }
    };
};

export const addContactList = (newContactList) => {
    return async dispatch => {
        try {
            dispatch({ type: ADD_CONTACTLIST,
                newItem: newContactList
            });
        }
        catch (error) {
            throw error;
        }
    };
};

export const updateContactList = (updatedContactList) => {
    return async dispatch => {
        try {
            dispatch({ type: UPDATE_CONTACTLIST, updateItem: updatedContactList});
        }
        catch (error) {
            throw error;
        }
    };
};