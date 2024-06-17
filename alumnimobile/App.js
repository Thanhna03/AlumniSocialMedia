import React, { useContext, useReducer } from 'react';
import Post from './components/Alumni/Post';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostDetailScreen from './components/Alumni/PostDetailScreen';
import { MyDispatcherContext, MyUserContext } from './configs/Contexts';
import { MyUserReducer } from './configs/Reducers';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './components/User/Login';
import Register from './components/User/Register';
import { Icon } from 'react-native-paper';
import Profile from './components/User/Profile';


const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Post" component={Post} />
      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen name="Profile" component={Profile} />

    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();


const MyTab = () => {
  const user = useContext(MyUserContext);
  // console.info(Math.random())
  // console.info("test:" + user)



   return (
    <Tab.Navigator>
      <Tab.Screen 
        name='Home' 
        component={MyStack} 
        options={{ 
          title: "Ứng dụng", 
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} /> 
        }} 
      />
      {user === null ? (
        <>
          <Tab.Screen 
            name='Register' 
            component={Register} 
            options={{ 
              title: "Đăng ký", 
              tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} /> 
            }} 
          />
          <Tab.Screen 
            name='Login' 
            component={Login} 
            options={{ 
              title: "Đăng nhập", 
              tabBarIcon: ({ color, size }) => <Icon name="login" color={color} size={size} /> 
            }} 
          />
        </>
      ) : (
        <Tab.Screen 
          name='Profile' 
          component={UserProfile} 
          options={{ 
            title: user.username || "Profile", 
            tabBarIcon: ({ color, size }) => <Icon name="account-circle" color={color} size={size} /> 
          }} 
        />
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatcherContext.Provider value={dispatch}>
          <MyTab />
        </MyDispatcherContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}
