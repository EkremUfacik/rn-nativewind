export default ({ config }) => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";
  // Reversed client ID for iOS URL scheme
  const reversedIosClientId = iosClientId.split('.').reverse().join('.');

  return {
    ...config,
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [reversedIosClientId],
          },
        ],
      },
    },
  };
};
