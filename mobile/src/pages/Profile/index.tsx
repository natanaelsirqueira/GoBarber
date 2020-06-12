import React, { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Title, UserAvatarButton, UserAvatar } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required(),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required(),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, { abortEarly: false });

        const { name, email, old_password } = data;

        const response = await api.put(
          '/profile',
          old_password ? data : { name, email },
        );

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao atualizar seu avatar');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api.patch('users/avatar', data).then(resp => updateUser(resp.data));
      },
    );
  }, [user.id, updateUser]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form
              initialData={user}
              ref={formRef}
              onSubmit={handleUpdateProfile}
            >
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />

              <Input
                ref={oldPasswordInputRef}
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
                returnKeyType="next"
                containerStyle={{ marginTop: 10 }}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Nova senha"
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordConfirmationInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordConfirmationInputRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar alterações
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
