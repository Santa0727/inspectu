import FixedContainer from '../components/container/FixedContainer';
import WebView from 'react-native-webview';

const HelpScreen = () => {
  return (
    <FixedContainer style={{ paddingHorizontal: 5 }}>
      <WebView
        source={{
          uri: 'https://gistcdn.githack.com/Santa0727/ad27e72873127f07b191c9a435d52122/raw/ffb8189315a92c08aae6fe061f6308144ef38276/zendesk.html',
        }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
      />
    </FixedContainer>
  );
};

export default HelpScreen;
