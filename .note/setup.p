1. Copy all code from App Generator without
    - .git
    - .next
    - .env.local [edit later]
    - node_module
    - bun.lock
    - package-lock.json


2. editing base info
    - 6 image [/public/icons/...]
    - favicon [/src/app/favicon.ico]
    - clear sw.js [/public/sw.js]
    - name [package.json]
    - name, descriptions [/src/layout.tsx]
    - name [/public/manifest.json]
    - if it is not run then check node version [18.18.2]

3. bun i [install all dependencies, and run build]



4. # mongodb
    - create project
    - create cluster
    - create user [id and password]
    - copy uri and update .env.local
    - go to database and user settings
        - IP Access List add [0.0.0.0]

5. # redis
    - create database
    - go to subscriptions
    - Database, Endpoint [click on connect]
    - Select your client [Javascript(node-redis)]
    - then update 
        - username
        - password
        - host
        - port

6. # Gmail and password
    - go to [myaccount.google.com] and search [App passwords]
    - get email and generate app password 

7. # uploadthings
    - create app 
    - from api get 
        - UPLOADTHING_TOKEN, UPLOADTHING_SECRET, UPLOADTHING_ID

8. # google client id and secret
    - Go to [https://console.cloud.google.com/]
    - Create a new project or select existing one
    - Go to "APIs & Services" > "Credentials"
    - Click "Create Credentials" > "OAuth client ID" [if need project config, do it]
    - Choose "Web application"
    - Add authorized redirect URI: http://localhost:3000/api/auth/v1/callback/google
    - Add authorized redirect URI: http://[domain.com]/api/auth/v1/callback/google
    - Save your Client ID and Client Secret
    - Create environment variables file and update GoogleAuthButton component:

9. update .env.local

10. bun run build [check all ok]    


