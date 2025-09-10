import React from "react";
import { Tabs } from "expo-router";
import '../globals.css'

export default function TabLayout() {
	return <Tabs>
		<Tabs.Screen
		name="index"
		options={{
          title: "Login",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="account"
		options={{
          title: "Account",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="communitypage"
		options={{
          title: "Community",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="form"
		options={{
          title: "Form",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="home"
		options={{
          title: "Home",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="post"
		options={{
          title: "Post",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="profile"
		options={{
          title: "Profile",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="session"
		options={{
          title: "Session",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="settings"
		options={{
          title: "Settings",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="signup"
		options={{
          title: "Signup",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="updateaccountinfo"
		options={{
          title: "Update Account",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
		<Tabs.Screen
		name="chat"
		options={{
          title: "chatbot",
          headerShown: false,
		  tabBarStyle: { display: 'none' }
        }}
		/>
	</Tabs>
}
