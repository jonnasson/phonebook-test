import { gql } from "@apollo/client";

export const GET_ENTRIES = gql`
  query GetEntries {
    entries {
      id
      name
      phone
    }
  }
`;

export const SEARCH = gql`
  query Search($term: String!) {
    search(term: $term) {
      id
      name
      phone
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      token
    }
  }
`;

export const GUEST_LOGIN = gql`
  mutation GuestLogin {
    guestLogin {
      token
    }
  }
`;

export const ADD_ENTRY = gql`
  mutation AddEntry($input: EntryInput!) {
    addEntry(input: $input) {
      id
      name
      phone
    }
  }
`;

export const CHECK_USERNAME_AVAILABLE = gql`
  query CheckUsernameAvailable($username: String!) {
    checkUsernameAvailable(username: $username)
  }
`;

export const CHECK_DUPLICATE = gql`
  query CheckDuplicate($name: String!, $phone: String!) {
    checkDuplicate(name: $name, phone: $phone)
  }
`;
