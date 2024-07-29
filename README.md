# OAuth-2.0

## API Routes

```/oauth2/authorize```
	Body (* required):
```user_id* : User to authorize```
```client_id* : Application id```
```redirect_uri* : Redirect Url```
```scope* : Authorization scopes```
	Response:
```grant_code : Random token for getting access token```
 
```/oauth2/token```
	Body (* required):
```client_id* : Application id```
```client_secret* : Application secret```
```grant_type* : Grant Type (code)```
```code* : Grant Code```
```redirect_uri* : Redirect Url```
	Response:
```access_token : You can get the information with this token using the /user/@me route```

```/oauth2/revoke```
	Body (* required):
```access_token* : Access Token```
	Response:
```success : true/false```
