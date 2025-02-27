import React, { useContext, createContext, useState } from 'react';
import { useSignUpMutation, useLoginMutation } from '../queries/user-queries';
import { useNavigate } from 'react-router-dom';
import { SetAuthToken } from '../utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const loginMutation = useLoginMutation();
  const signUpMutation = useSignUpMutation();
  const [authData, setAuthData] = useState(() =>
    localStorage.getItem('authData')
      ? JSON.parse(localStorage.getItem('authData'))
      : null
  );

  const signup = ({ email, password, phone, role }) => {
    signUpMutation.mutate({
      email,
      password,
      phone,
      role,
    });
    if (signUpMutation.status === 'success') {
      setAuthData(signUpMutation.data);
      return true
    }
  };

  const login = ({ email, password }) => {
    loginMutation.mutate({
      email,
      password,
    });
    if (loginMutation.status === 'success') {
      setAuthData(loginMutation.data);
      console.log(loginMutation.data);
      return true
    }
  };

  const logout = () => {
    setAuthData(null);
    localStorage.clear();
  };

  const authContextData = {
    setAuthData,
    authData,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
