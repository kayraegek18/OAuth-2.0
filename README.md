# OAuth-2.0

## API Routes

### `/oauth2/authorize`
User to authorize
* Content-Type: 'application/json'
  
### Body:
```json
{
  "user_id": "523584844853149696",
  "client_id": "523584844853149697",
  "redirect_uri": "http://localhost:5173/auth/callback",
  "scope": "identify,email,applications"	
}
```

### Example Response

* Status: 200

```json
{
  "grant_code": "667cf3667c52ba4ddf07d41a5cd9c006a01b4becbcfcebdcc0a6e49b5c883edb"
}
```
 
### `/oauth2/token`
Get access token from grant code
* Content-Type: 'application/json'

### Body:
```json
{
  "client_id": "523584844853149697",
  "client_secret": "EMSRekTPeUIu",
  "redirect_uri": "http://localhost:5173/auth/callback",
  "code": "667cf3667c52ba4ddf07d41a5cd9c006a01b4becbcfcebdcc0a6e49b5c883edb"	
}
```

### Example Response

* Status: 200

```json
{
  "access_token": "0297b7df7b2c613b67c7d6c9255992a7274573d7c7664789294f8854c611eaef"
}
```

### `/oauth2/revoke`
Revoke access token
* Content-Type: 'application/json'

### Body:
```json
{
  "access_token": "0297b7df7b2c613b67c7d6c9255992a7274573d7c7664789294f8854c611eaef"
}
```

### Example Response

* Status: 200

```json
{
  "status": "true"
}
```
