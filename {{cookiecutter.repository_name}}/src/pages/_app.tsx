import React from 'react';
import App from 'next/app';
// import { Provider } from 'react-redux';
// import withRedux from 'next-redux-wrapper';
// import withReduxSaga from 'next-redux-saga';
// import { persistStore, Persistor } from 'redux-persist';
// import { PersistGate } from 'redux-persist/integration/react';

// import configureStore from '../redux/configureStore';

import 'styles/index.scss';

class MyApp extends App<any> {
  public render() {
    const { Component, pageProps } = this.props;

    return (
      // <Provider store={store}>
      //   <PersistGate
      //     loading={<Component {...pageProps} />}
      //     persistor={this.persistor}
      //   >
      <Component {...pageProps} />
      //   </PersistGate>
      // </Provider>
    );
  }
}

export default MyApp;
