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

import {
  DdRumReactNavigationTracking,
  ViewNamePredicate,
} from '@datadog/mobile-react-navigation';
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

import {NavigationContainer, Route} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {DD_RUM_CLIENT_TOKEN, DD_RUM_APPLICATION_ID} from "@env";

console.log(DD_RUM_CLIENT_TOKEN);
console.log(DD_RUM_APPLICATION_ID);


//DD RUM Start

const config = new DatadogProviderConfiguration(
  DD_RUM_CLIENT_TOKEN,
  'staging',
  DD_RUM_APPLICATION_ID,
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

const Stack = createNativeStackNavigator();

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

  const createLoggerErrorLog = () => {
    DdLogs.error("Unknown error - DdLogs");
  }

  const createConsoleErrorLog = () => {
    console.error("Unknown error - console");
  }

  const HomeScreen = ({navigation}: {navigation: any}) => {
    return (
      <View>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
            <View>
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
                    : require('./images/dd_logo_v_rgb.png')
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
                  onPress={() => DdRum.addTiming('customTimingBtn_load_timing')}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  color="#642ba6"
                  title={'Crash App'}
                  onPress={forceCrash}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  color="#642ba6"
                  title={'Create Logger Error Log'}
                  onPress={createLoggerErrorLog}
                />
              </View>
                 <View style={styles.buttonContainer}>
                <Button
                  color="#642ba6"
                  title={'Create Console Error Log'}
                  onPress={createConsoleErrorLog}
                />
              </View>
              {
                <View style={styles.buttonContainer}>
                  <Button
                    color="#642ba6"
                    title={'New Page/View'}
                    onPress={() => navigation.navigate(AlternateView, {})}
                  />
                </View>
              }
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  };

  const AlternateView = () => {
    return (
      <View>
        <Image
          style={styles.alternateLogo}
          source={require('./images/dd_logo_v_rgb.png')}
        />
      </View>
    );
  };

  let interactive = true;

  useEffect(() => {
    changeUser();
    if (!interactive) return;
void DdRum.addTiming('interactive');
  }, [interactive]);

  const navigationRef = React.useRef(null);
  return (
    <DatadogProvider configuration={config}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          DdRumReactNavigationTracking.startTrackingViews(
            navigationRef.current,
          );
        }}>
        <Stack.Navigator initialRouteName="Datadog React Native CLI Sandbox">
          <Stack.Screen
            name="Datadog React Native CLI Sandbox"
            component={HomeScreen}
            options={{
              headerStyle: {
                backgroundColor: '#642ba6',
              },
              headerTitleStyle: {
                color: 'white',
              },
            }}
          />
          <Stack.Screen
            name="AlternateView"
            component={AlternateView}
            options={{
              headerTitle: 'Alternative View',
              headerStyle: {
                backgroundColor: '#642ba6',
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                color: 'white',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DatadogProvider>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
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
  },
  alternateLogo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 28,
    marginBottom: 18,
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
    marginTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
});

export default App;
