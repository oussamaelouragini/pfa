{
  "name": "expensetracker", // app name
  "main": "expo-router/entry", // entry point
  "version": "1.0.0", // app version
  "scripts": { // npm scripts
    "start": "expo start", // start project
    "reset-project": "node ./scripts/reset-project.js", // reset script
    "android": "expo start --android", // run android
    "ios": "expo start --ios", // run ios
    "web": "expo start --web", // run web
    "lint": "expo lint" // code lint
  },
  "dependencies": { // runtime deps
    "@expo/vector-icons": "^15.0.3", // icon library
    "@hookform/resolvers": "^5.2.2", // form validation
    "@react-native-async-storage/async-storage": "2.2.0", // local storage
    "@react-navigation/bottom-tabs": "^7.4.0", // tab navigation
    "@react-navigation/elements": "^2.6.3", // nav elements
    "@react-navigation/native": "^7.1.8", // navigation core
    "@tanstack/react-query": "^5.90.21", // data fetching
    "axios": "^1.13.6", // http client
    "expo": "~54.0.33", // expo framework
    "expo-constants": "~18.0.13", // device constants
    "expo-font": "~14.0.11", // font loader
    "expo-haptics": "~15.0.8", // vibration feedback
    "expo-image": "~3.0.11", // image component
    "expo-linear-gradient": "~15.0.8", // gradient ui
    "expo-linking": "~8.0.11", // deep linking
    "expo-router": "~6.0.23", // routing system
    "expo-splash-screen": "~31.0.13", // splash screen
    "expo-status-bar": "~3.0.9", // status bar
    "expo-symbols": "~1.0.8", // symbols api
    "expo-system-ui": "~6.0.9", // system ui
    "expo-web-browser": "~15.0.10", // web browser
    "react": "19.1.0", // react core
    "react-dom": "19.1.0", // dom renderer
    "react-hook-form": "^7.71.2", // form handler
    "react-native": "0.81.5", // native framework
    "react-native-gesture-handler": "~2.28.0", // gestures api
    "react-native-reanimated": "~4.1.1", // animations lib
    "react-native-safe-area-context": "~5.6.0", // safe area
    "react-native-screens": "~4.16.0", // screen management
    "react-native-svg": "15.12.1", // svg support
    "react-native-web": "~0.21.0", // web support
    "react-native-worklets": "0.5.1", // worklets engine
    "zod": "^4.3.6", // schema validation
    "zustand": "^5.0.11" // state management
  },
  "devDependencies": { // dev tools
    "@types/react": "~19.1.0", // react types
    "eslint": "^9.25.0", // linter tool
    "eslint-config-expo": "~10.0.0", // expo config
    "typescript": "~5.9.2" // ts compiler
  },
  "private": true // private project
}