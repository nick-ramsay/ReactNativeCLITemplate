/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  DdSdkReactNative,
  DatadogProviderConfiguration,
  DatadogProvider,
  DdLogs,
  ErrorSource,
  RumActionType,
  DdRum,
} from '@datadog/mobile-react-native';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const datadogLogo = require('./images/dd_logo_v_white.png');

const Stack = createNativeStackNavigator();

//DD RUM Start

const config = new DatadogProviderConfiguration(
  'pubb070fc8793aa735278123518c9631aa1',
  'staging',
  'd30031bf-5df2-4fd1-a9bc-cf5202ccd7be',
  true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  true, // track XHR Resources
  true, // track Errors
);
// Optional: Select your Datadog website (one of "US", "EU" or "GOV")
config.site = 'US1';
// Optional: enable or disable native crash reports
config.nativeCrashReportEnabled = true;
// Optional: sample RUM sessions (here, 80% of session will be sent to Datadog. Default = 100%)
config.sessionSamplingRate = 80;

//DD RUM End

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View>
      <Text
        style={[
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  var [userFirstName, setUserFirstname] = useState('');
  var [userLastName, setUserLastName] = useState('');
  var [pictureURL, setPictureURL] = useState('');
  var [userEmail, setUserEmail] = useState('');
  var [userId, setUserId] = useState('');

  const changeUser = () => {
    axios({
      method: 'get',
      url: 'https://randomuser.me/api/',
    }).then(response => {
      let userDataResults = response.data.results[0];
      setUserFirstname(userFirstName => userDataResults.name.first);
      setUserLastName(userLastname => userDataResults.name.last);
      setPictureURL(pictureURL => userDataResults.picture.large);
      setUserEmail(userEmail => userDataResults.email);
      setUserId(userId => userDataResults.login.uuid);

      DdSdkReactNative.setUser({
        id: userDataResults.login.uuid,
        name: userDataResults.name.first + ' ' + userDataResults.name.last,
        email: userDataResults.email,
        type: 'premium',
      });
    });
  };

  const changeUserImage = () => {
    axios({
      method: 'get',
      url: 'https://randomuser.me/api/',
    }).then(response => {
      let userDataResults = response.data.results[0];
      setPictureURL(pictureURL => userDataResults.picture.large);
    });
  };

  const forceCrash = () => {
    const test: any = {};
    console.log(test.should.crash);
  };

  useEffect(() => {
    changeUser();
  }, []);

  return (
    <DatadogProvider configuration={config}>
      <NavigationContainer>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
            <View
              style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
              }}>
              <View style={{backgroundColor: '#642ba6'}}>
                <Text style={styles.titleText}>
                  {userId !== ''
                    ? 'Welcome, ' + userFirstName + ' ' + userLastName + '!'
                    : ''}
                </Text>
                <Image
                  style={styles.logo}
                  source={
                    pictureURL !== ''
                      ? {uri: pictureURL}
                      : require('./images/dd_logo_v_white.png')
                  }
                />
              </View>

              <View style={styles.container}>
                <View style={styles.buttonContainer}>
                  <Button
                    color="#642ba6"
                    title="Change User Image"
                    onPress={changeUserImage}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    color="#642ba6"
                    title={'Apply Custom Timing'}
                    onPress={() =>
                      DdRum.addTiming('customTimingBtn_load_timing')
                    }
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    color="#642ba6"
                    title={'Crash App'}
                    onPress={forceCrash}
                  />
                </View>
                {/*
                <View style={styles.buttonContainer}>
                <Button
                    color="#642ba6"
                    title={'New Page/View'}
                    //onPress={forceCrash}
                  />
                </View>
                */}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </NavigationContainer>
    </DatadogProvider>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginTop: 28,
    marginBottom: 18,
    paddingHorizontal: 24,
  },
  highlight: {
    fontWeight: '700',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 18,
    borderRadius: 5,
  },
  button: {
    marginBottom: 100,
    color: '#642ba6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    paddingRight: 15,
    paddingLeft: 15,
  },
});

export default App;
