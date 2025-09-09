import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./(tabs)/index";
import Signup from "./(tabs)/signup";
import ProfilePage from "./(tabs)/account";
import EditProfilePage from "./(tabs)/updateaccountinfo";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="signup" component={Signup} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="EditProfile" component={EditProfilePage} />
    </Stack.Navigator>
  );
}
