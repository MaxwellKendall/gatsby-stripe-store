import React, { useReducer } from 'react';

const parseDataFromRemoteCart = (d) => d

const initialState = {
    cart: {
        id: null,
        totalPrice: null,
        totalTax: null,
        webUrl: null,
        lineItems: [],
        imagesByVariantId: {},
    },
    user: {
        name: '',
        previousOrders: []
    },
    loading: null,
    error: null
};


export const errorFetchingCart = {
    ...initialState,
    loading: ''
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER': {
            console.log('action', action);
            return {
                ...state,
                user: {
                    email: action.email
                }
            }
        }
        case 'LOGOUT_USER': {
            return {
                ...state,
                user: initialState.user
            }
        }
        default: {
            return state;
        }
    }
};

export const useStore = () => useReducer(reducer, initialState);

const GlobalState = React.createContext({ store: initialState, dispatch: () => {}});

export default GlobalState;
