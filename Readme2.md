// COLABREY 


TECH STACK:

IDE → VS Code (in GitHub Codespaces)

Frontend → Next.js (which is a framework built on React.js)

Backend → Supabase (for auth, database, and storage) and Next.js (for API routes and server-side logic)

Database → PostgreSQL (provided by Supabase for storage)

Version Control → Git + GitHub

Deployment → Vercel (for the Next.js app) + Supabase (as the managed backend service)




//COLABREY STRUCTURE

my-connection-engine/
├── .next/                  # Build output, automatically generated
├── node_modules/           # Project dependencies, automatically managed
├── public/                 # Static assets (images, fonts)
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Main layout for the entire app
│   │   ├── page.tsx        # Your landing page
│   │   ├── (auth)/         # Route group for auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   └── (main)/         # Route group for protected app pages
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── profile/
│   │       │   └── page.tsx
│   │       ├── search/
│   │       │   └── page.tsx
│   │       └── messages/
│   │           └── page.tsx
│   ├── components/         # Reusable UI components
│   │   ├── getstarted.tsx           # For shadcn/ui components
│   │   ├── howcolabreyworks.tsx
│   │   ├── stackingcards.tsx
│   │   └── themeprovider.tsx
|   |    
│   ├── lib/                # Core logic and helpers
│   │   ├── supabaseClient.ts # Supabase connection setup
│   │   ├── auth.ts         # Authentication helper functions
│   │   └── utils.ts        # Utility functions (e.g., for shadcn)
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       ├── user.ts
│       └── message.ts
├── .env.local              # For Supabase secret keys
├── .gitignore
├── components.json         # shadcn/ui configuration file
├── next.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json



//  source code structure:(We created)

src/
├── app/
│   ├── layout.tsx          # Common layout (Navbar + children)
│   ├── page.tsx            # Landing page (login/signup CTA)
│   ├── auth/
│   │   ├── login/page.tsx  # Login with Supabase
│   │   └── signup/page.tsx # Signup with .edu emails
│   ├── dashboard/
│   │   ├── page.tsx        # Home after login
│   │   ├── profile/page.tsx# User profile (bio, tags, showcase)
│   │   ├── search/page.tsx # Search by tags/skills
│   │   └── messages/page.tsx # 1-on-1 messaging
│
├── components/             # Reusable UI
│   ├── Navbar.tsx
│   ├── ProfileCard.tsx
│   ├── SearchBar.tsx
│   └── ChatBox.tsx
│
├── lib/
│   ├── supabaseClient.ts   # Supabase connection
│   ├── auth.ts             # Auth helpers
│   └── utils.ts
│
├── styles/
│   └── globals.css
│
└── types/
    ├── user.ts             # User type
    └── message.ts          # Message type



    File/Folder	Purpose:
    
node_modules            - Project dependencies
.next                   - Build output
package.json            - Project manifest
package-lock.json       - Dependency lock file
src/	                - Your source code
public/	                - Static assets (icons/images)
Configuration Files   	- .gitignore, tsconfig.json, next.config.ts, components.json (used for mapping) etc.
Styling files           - tailwind.config.js ,postcss.config.js
.env.local              - Stores Supabase api & secret keys
Dependencies Installed  - npm install
Development Server      - npm run dev



Updating files and retrieving in github repo and local pc:

git status             -> (to check what and all files were updated)
git add .              -> (adding into repo)
git commit -m          -> (what changed have been made)
git push origin main   -> (Uploads locally committed changes to GitHub)
git pull origin main   -> (to get the updated files & folder)







    
