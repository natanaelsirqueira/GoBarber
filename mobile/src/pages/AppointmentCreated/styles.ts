import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  color: #f4ede8;
  font-size: 32px;
  font-family: 'RobotoSlab-Medium';
  text-align: center;
  margin-top: 48px;
`;

export const Description = styled.Text`
  color: #999591;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-top: 16px;
  text-align: center;
`;

export const OkButton = styled(RectButton)`
  background: #ff9000;
  padding: 12px 24px;
  border-radius: 10px;
  margin-top: 24px;
  align-items: center;
  justify-content: center;
`;

export const OkButtonText = styled.Text`
  color: #312e38;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
`;
