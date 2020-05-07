# React.js Cognito Auth Custom UI
For people realized that you cannot customize the hosted UI...

## Instalation
```
git clone https://github.com/thejungwon/cognito-auth-react.git
cd cognito-auth-react
npm install
npm start
```

## Setting
In **src/FormComponent.js**, there are several variables you need to change.

```
const USER_POOL_ID='<YOUR_USER_POOLID>';
const USER_POOL_WEB_CLIENT_ID = '<YOUR_WEB_CLIENT_ID>';
const REGION = '<YOUR_COGNITO_REGION>';
const OAUTH_DOMAIN = '<YOUR_OAUTH_DOMAIN>';
const COOKIE_DOMAIN ='<YOUR_COOKIE_DOMAIN>';
```

For example
```
const USER_POOL_ID='ap-northeast-2_abcd1234';
const USER_POOL_WEB_CLIENT_ID = 'a1b2c3d4e5f6g7h8i9j0k1l2m3';
const REGION = 'ap-northeast-2';
const OAUTH_DOMAIN = 'auth.example.com';
const COOKIE_DOMAIN ='localhost'
```


## References
- https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js
- https://docs.amplify.aws/lib/auth/social/q/platform/js



