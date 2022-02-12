# shakepay_assignment

Starter repo borrowed from my template [create_treact_app](https://github.com/PatrickMcLennan/create_treact_app)

## ASSUMPTIONS:

- No SEO is needed for this assignment / project.  If it was, I'd use something like [Next.js](https://nextjs.org/).  
- Will use Material UI for quick & easy good looking components.  Would ask many more questions + spend time with designs in a production setting before determining styling + UX strategy and tools.  A lot of styling code will be re-written in the absence of a proper design system, I'd usually extrapolate this shared styling code to something like a global [Theme](https://mui.com/customization/theming/) based on that design system.

## NOTES:

- I was having CORS issues with `https://api.shakepay.co/rates` while developing on `localhost` with Chrome, Brave and FireFox.  I solved it via [this](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc/related?hl=en-US) plugin, you might also require a similar fix to run this locally.

## HOW TO RUN:

This repo can be used 2 ways -- natively with your systems Node.js installation, or via a Docker container.

### 1. With [Docker-Compose](https://docs.docker.com/compose/) (preferred):

- Run `docker-compose up -d` in the project root.
- Enter the container with 
  
  `docker exec -it shakepay_assignment-node-1 /bin/bash`
- Once inside the container, you're free to execute any of the commands in the `package.json`.  Run

  `npm install && npm run webpack:prod` 

  to install dependencies & compile for production (as compiled assets are `gitignore`'d)

- Once compiled, open the `index.html` file within the `dist/` directory in the root in Chrome, Brave or Firefox and you should see my work :).

### 2. With [Node.js 16.13.0](https://nodejs.org/download/release/v16.13.0/)

- Download the correct version of Node.js from the link above.  If you have [nvm](https://github.com/nvm-sh/nvm), you can simply run 

  `nvm use`

  in the root of the directory instead to lock into this version.  After that, you're free to run any of the commands in the `package.json`.

- Run

  `npm install && npm run webpack:prod`

  to to install dependencies & compile for production (as compiled assets are `gitignore`'d)

- Once compiled, open the `index.html` file within the `dist/` directory in the root in Chrome, Brave or Firefox and you should see my work :).