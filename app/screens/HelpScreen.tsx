import FixedContainer from '../components/container/FixedContainer';
import WebView from 'react-native-webview';

const HelpScreen = () => {
  return (
    <FixedContainer style={{ paddingHorizontal: 5 }}>
      <WebView
        source={{
          uri: 'https://gistcdn.githack.com/Santa0727/ad27e72873127f07b191c9a435d52122/raw/7ab49815978a7d40b5816b36e2278d1c782ff09e/zendesk.html',
        }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
      />
    </FixedContainer>
  );
};

export default HelpScreen;
