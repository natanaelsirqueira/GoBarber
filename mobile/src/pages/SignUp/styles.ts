import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 40px 0 24px;
`;

export const BackToSignInButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #312e38;
  border-top-width: 1px;
  border-top-color: #232129;
  padding: 16px 0 ${16 + getBottomSpace()}px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const BackToSignInButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`;
