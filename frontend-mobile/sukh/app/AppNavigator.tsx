import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./(tabs)/index";
import Signup from "./(tabs)/signup";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="signup" component={Signup} />
    </Stack.Navigator>
  );
}
