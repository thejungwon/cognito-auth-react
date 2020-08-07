# React.js Cognito Auth Custom UI
- For the people who just realized that you cannot customize the hosted UI...
- AWS Cognito 인증 예제 (react)
![Screen Shopt](image.png?raw=true "Screen Shot")
## Installation
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
const OAUTH_DOMAIN = 'somethingsomething.auth.ap-northeast-2.amazoncognito.com';
const COOKIE_DOMAIN ='localhost'
```
## Built With

* [React.js](https://reactjs.org/) 
* [Amplify](https://docs.amplify.aws/lib/q/platform/js)
* [SemanticUI](https://semantic-ui.com/) - CSS

## References
- https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js
- https://docs.amplify.aws/lib/auth/social/q/platform/js


## Authors
* **Jungwon Seo** - *Initial work* - [thejungwon](https://github.com/thejungwon)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

