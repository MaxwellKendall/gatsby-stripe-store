/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

import React from 'react';
// You can delete this file if you're not using it
import "./src/styles/index.scss";

/* eslint-disable no-undef */
import GlobalState, { useStore } from './src/store';

const Wrapper = ({ children }) => {
    const [store, dispatch] = useStore();
    return (
        <>
            <GlobalState.Provider value={{store, dispatch }}>
                {children}
            </GlobalState.Provider>
        </>
    );
};

export const wrapRootElement = ({ element }) => {
    return <Wrapper children={element} />;
};
