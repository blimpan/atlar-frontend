# Fintech demo
Basic demo covering the following day-to-day tasks of a customer working in a finance team:

- *"I log in to each bank every morning to verify that we do not have any account with zero or negative balance"*

- *"I note the account balance for each account into my own excel sheet, then look at the trend of account balances over time to see that we're not trending aggressively downwards"*

- *"I go through our transactions and check that there are no big, potentially fraudulent, pay-outs from our accounts during the past days (above ~10k EUR would be considered suspicious)"*

## Prerequisites & instructions

1. Clone repo.
2. Run 'npm install' in root folder to install all required dependencies.
4. Set local environment variables `VITE_ATLAR_API_URL` and `VITE_ATLAR_AUTH` in root folder so that they can be referenced by `import.meta.env.[VARIABLE NAME]`.

    **Example (in .env.local)**

    `VITE_ATLAR_API_URL='https://api.atlar.com/financial-data/v2/'`

    `VITE_ATLAR_AUTH='Basic VVNFk5BTU6k9U00VQQNTV09SRDEyMzQ1='`

      ^ These examples won't work for obvious reasons 
    
6. Navigate to root folder of project.
7. Run 'npm run dev' to start development server. Make sure port used is 3000 to avoid CORS issues.

## TODO
- Responsiveness for smaller (e.g. mobile) screens. I limited the project to desktops assuming that most users will access the app at work on their computer.

- Pushing of data to server. Right now the app is read-only, meaning the user can't make any changes to the stored data, only fetch and display it.

- The user should be able to click on e.g. an account listed in the Home view and be taken to a page showing more details. I have done a very simple implementation of this for the payments page.

- Tables showing data should be limited to for example 20 rows and then require some sort of interaction from the user in order to load more.

- Use styling (mostly colors) more consistently in order to make the most relevant information stand out and make interactive elements better communicate that they are interactive to the user.

- Some columns in tables aren't populated with actual data (ex: 'Sample bank' on Home page) because I couldn't find the desired data. Went through the Key Concepts doc to get clarification but couldn't find what I was looking for.
